#!/usr/bin/env python3
"""Independent, attribution-preserving Portuguese enrichment; never change base tokens."""
import argparse, collections, hashlib, json, pathlib, re, unicodedata, zipfile
P=pathlib.Path
CODES="GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split()
BOOKS="Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev".split()
def read(p): return json.loads(p.read_text(encoding="utf-8"))
def write(p,x): 
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(x,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
def form(s):
    # Preserve vocalization and breathing, remove only source separators, punctuation and cantillation.
    return unicodedata.normalize("NFC","".join(c for c in unicodedata.normalize("NFD",s).lower() if (unicodedata.category(c)[0] in "LM" and not "\u0591"<=c<="\u05af")))
def searchkey(s):
    return "".join(c for c in unicodedata.normalize("NFD",s).lower() if unicodedata.category(c)[0] in "LN")
def shard(k):
    # UTF-8 SHA256 prefix; browser computes the same hash.
    return hashlib.sha256(k.encode()).hexdigest()[:2]
def chapter_data(p):
    s=p.read_text(encoding="utf-8-sig").strip()
    m=re.fullmatch(r'__cap\("([^"]+)",\s*(\{.*\})\s*\);?',s,re.S)
    if not m: raise ValueError("Invalid chapter wrapper: "+str(p))
    return json.loads(m[2])
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--base",type=P,required=True);p.add_argument("--aligned",type=P,required=True);p.add_argument("--out",type=P,required=True)
    a=p.parse_args()
    summary={}; index=collections.defaultdict(lambda: collections.defaultdict(list))
    for code,book in zip(CODES,BOOKS):
        base=read(a.base/(book+".json")); external={}
        for path in sorted((a.aligned/code).glob("*.js")):
            d=chapter_data(path)
            if d["book"]!=code: raise ValueError(path)
            for v in d["v"]:
                key=f"{d['chapter']}:{v['n']}"
                if key in external: raise ValueError(f"Duplicate source verse {code} {key}")
                external[key]=v
        if not external: raise ValueError("Missing external book "+code)
        # Exact complete token-sequence matching. Do not match by position alone.
        seqs=collections.defaultdict(list)
        for k,v in external.items():
            words=v.get("w",[])
            if words: seqs[tuple(form(w[0]) for w in words)].append(k)
        base_counts=collections.Counter(tuple(form(w["text"]) for w in words) for words in base.values())
        matched={};glosses=0;strongs=0
        for key,words in base.items():
            seq=tuple(form(w["text"]) for w in words)
            candidates=seqs.get(seq,[])
            hit=key if key in candidates else (candidates[0] if len(candidates)==1 and base_counts[seq]==1 else None)
            ext=external[hit] if hit else None
            additions=[]
            for i,word in enumerate(words):
                x={}
                if ext:
                    row=ext["w"][i]
                    if len(row)>2 and isinstance(row[2],str) and row[2].strip():
                        x["gloss_pt"]=row[2];glosses+=1
                    if len(row)>1 and isinstance(row[1],str) and re.fullmatch(r"[HG]\d+[a-z]?",row[1],re.I):
                        x["strong"]=row[1];strongs+=1
                    if len(row)>3: x["source_flag"]=row[3]
                additions.append(x)
                values=[word.get("word") or word["text"],word.get("lemma") or "",x.get("strong","")]
                if book in BOOKS[:39]:
                    values.extend("H"+str(int(n)) for n in re.findall(r"\d+",word.get("lemma") or ""))
                for k in set(filter(None,map(searchkey,values))):
                    index[shard(k)][k].append([book,key,i])
            if ext: matched[key]={"source_ref":hit,"words":additions}
        write(a.out/"glossas"/(book+".json"),matched)
        # Preserve the source's independent Portuguese verse numbering.
        pt={k:v["b"] for k,v in external.items() if isinstance(v.get("b"),str) and v["b"].strip()}
        if not pt: raise ValueError("Missing Portuguese text "+code)
        write(a.out/"portugues"/(book+".json"),pt)
        summary[book]={"original_verses":len(base),"matched_verses":len(matched),"glossed_tokens":glosses,"strong_tokens":strongs,"portuguese_verses":len(pt)}
    for h,entries in index.items(): write(a.out/"concordancia"/(h+".json"),entries)
    write(a.out/"manifest.json",summary)
    print("Enrichment:",len(summary),"books;",sum(x["matched_verses"] for x in summary.values()),"matched verses;",sum(x["glossed_tokens"] for x in summary.values()),"glossed tokens;",sum(x["portuguese_verses"] for x in summary.values()),"Portuguese verses")
if __name__=="__main__": main()
