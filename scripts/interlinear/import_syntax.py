#!/usr/bin/env python3
"""Stage 8: source-backed constituency syntax, no inferred grammatical relations."""
import argparse, collections, difflib, hashlib, json, pathlib, re, unicodedata
import xml.etree.ElementTree as ET
from enrich_open import BOOKS,CODES,read,write
P=pathlib.Path
G_REV="8423afe47b9e8f24b7772e808af45c7159a6fe7e"
H_REV="47db250bd55d0d8577f2a94fba114ef16c35b23c"
XML_ID="{http://www.w3.org/XML/1998/namespace}id"
# Whitelist syntax attributes only; no semantic domains, source glosses or licensed third-party senses.
ATTRS={"class","role","rule","Rule","type","clauseType","junction","predication","head","articular"}
ROLES={"s":"Sujeito","v":"Verbo","o":"Objeto","io":"Objeto indireto","adv":"Adverbial","pp":"Grupo preposicional","p":"Predicado","aux":"Auxiliar"}
CLASSES={"cl":"Oração","np":"Sintagma nominal","vp":"Sintagma verbal","pp":"Sintagma preposicional","adjp":"Sintagma adjetival","advp":"Sintagma adverbial"}
def local(tag):return tag.rsplit("}",1)[-1]
def form(s):
    # Remove only cantillation, punctuation and source morpheme delimiters. Preserve vowels,
    # consonants, breathings and accents; canonical Unicode only.
    return unicodedata.normalize("NFC","".join(c for c in unicodedata.normalize("NFD",s).lower() if unicodedata.category(c)[0] in "LM" and not "\u0591"<=c<="\u05af" and c!="\u05bd"))
def segs(s):return [form(x) for x in s.split("/")]
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def attrs(node):return {k:v for k,v in node.attrib.items() if k in ATTRS}
def load_book(files,code,ot):
    nodes=[];versegroups=collections.defaultdict(lambda:collections.defaultdict(list));sentences={};seen=set();issues=collections.Counter()
    for file in files:
        root=ET.parse(file).getroot()
        for sn,sentence in enumerate(root.iter("sentence"),1):
            sid=file.name+":"+str(sn);sentences[sid]=set()
            def walk(e,parent=None):
                tag=local(e.tag)
                if tag not in ("wg","w"):
                    if tag not in ("p","milestone"):
                        for ch in e:walk(ch,parent)
                    return
                n=len(nodes);a=attrs(e)
                item={"parent":parent,"sentence":sid,"kind":tag,"attrs":a}
                nodes.append(item)
                if tag=="wg":
                    for ch in e:walk(ch,n)
                else:
                    ref=e.get("ref") or "";ident=e.get(XML_ID) or ""
                    m=re.fullmatch(r"(\S+) (\d+):(\d+)!(\d+)",ref)
                    if not m or m[1]!=code or not ident or ident in seen:
                        issues["invalid_or_duplicate_source_leaf"]+=1;return
                    seen.add(ident);key=str(int(m[2]))+":"+str(int(m[3]));ordn=int(m[4])
                    item.update(source_id=ident,source_ref=ref,language=e.get("lang") if ot else "G",form=form(e.text or ""),lemma=form(e.get("lemma") or ""))
                    if not item["form"]:issues["empty_source_leaf"]+=1;return
                    versegroups[key][ordn].append(n);sentences[sid].add(key)
            walk(sentence)
    return nodes,versegroups,sentences,issues
def match_pairs(a,b):
    if a==b:return list(enumerate(range(len(b)))),"versiculo_integral"
    ca=collections.Counter(a);cb=collections.Counter(b);pairs=[]
    # Only unique forms within monotonic blocks of at least two words. No single-word guesses.
    for block in difflib.SequenceMatcher(None,a,b,autojunk=False).get_matching_blocks():
        if block.size>=2:
            for d in range(block.size):
                i,j=block.a+d,block.b+d
                if a[i] and ca[a[i]]==cb[b[j]]==1:pairs.append((i,j))
    return pairs,"alinhamento_parcial_conservador"
def process_verse(ref,words,groups,nodes,sentences,ot):
    groups=[sorted(g,key=lambda n:nodes[n]["source_id"]) for _,g in sorted(groups.items())]
    actual=[form(w.get("word") or w["text"]) for w in words]
    source=["".join(nodes[n]["form"] for n in g) for g in groups]
    pairs,method=match_pairs(actual,source)
    out={"method":method,"source_word_count":len(groups),"words":[{"status":"pendente","nodes":[]} for _ in words],"nodes":[]}
    mapping={};used=set()
    def project(n):
        if n in mapping:return mapping[n]
        e=nodes[n];parent=project(e["parent"]) if e["parent"] is not None else None
        index=len(out["nodes"]);mapping[n]=index
        row={k:e[k] for k in ("kind","attrs","sentence")};row["parent"]=parent
        if e["kind"]=="w":row.update(source_id=e["source_id"],source_ref=e["source_ref"])
        else:row["source_group"]=n
        out["nodes"].append(row)
        return index
    for i,j in pairs:
        w=words[i];g=groups[j];language=("A" if w["morph"].startswith("A") else "H") if ot else "G"
        if not actual[i] or actual[i]!=source[j] or any(nodes[n]["language"]!=language for n in g):continue
        # For Greek, also require lemma agreement when aligning a partial verse.
        if not ot and method!="versiculo_integral" and any(nodes[n]["lemma"]!=form(w["lemma"]) for n in g):continue
        ids=[project(n) for n in g];assert not used.intersection(ids);used.update(ids)
        parts=segs(w["text"]) if ot else [actual[i]]
        component_match=parts==[nodes[n]["form"] for n in g]
        rec={"status":"alinhado_integral" if method=="versiculo_integral" else "alinhado_parcial","nodes":ids,"component_match":component_match,"form_sha256":digest(source[j])}
        for k,n in enumerate(ids):
            out["nodes"][n]["token"]=i
            if component_match:out["nodes"][n]["component"]=k
        out["words"][i]=rec
    out["sentences"]={sid:sorted(sentences[sid],key=lambda r:tuple(map(int,r.split(":")))) for sid in sorted({e["sentence"] for e in out["nodes"]})}
    out["matched"]=sum(bool(x["nodes"]) for x in out["words"])
    return out
def selftest():
    assert form("בְּ/רֵאשִׁ֖ית")==form("בְּרֵאשִׁית")
    assert form("λόγος,")==form("λόγος") and form("ὅρος")!=form("ὄρος")
    assert match_pairs(["a","b"],["a","b"])[0]==[(0,0),(1,1)]
    assert not match_pairs(["a"],["a","b"])[0]
    assert match_pairs(["a","b","c"],["a","b","d"])[0]==[(0,0),(1,1)]
def main():
    selftest();p=argparse.ArgumentParser()
    for k in ("base","greek","hebrew","out","report","details"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();totals=collections.Counter();books={};roles=collections.Counter();classes=collections.Counter();examples={}
    for bi,(b,code) in enumerate(zip(BOOKS,CODES)):
        ot=bi<39
        files=sorted((a.hebrew if ot else a.greek).glob(f"{bi+1 if ot else bi-38:02d}-*.xml"))
        assert files and (ot or len(files)==1),(b,files)
        nodes,groups,sentences,issues=load_book(files,code,ot)
        base=read(a.base/(b+".json"));stats=collections.Counter();pending={};chapters=collections.defaultdict(dict)
        stats["source_files"]=len(files);stats["source_only_verses"]=len(set(groups)-set(base));stats.update(issues)
        for ref,words in base.items():
            x=process_verse(ref,words,groups.get(ref,{}),nodes,sentences,ot)
            chapters[ref.split(":")[0]][ref]=x;stats["verses"]+=1
            if x["matched"]==len(words):stats["fully_linked_verses"]+=1
            elif x["matched"]:stats["partially_linked_verses"]+=1
            else:stats["unlinked_verses"]+=1
            for i,(w,r) in enumerate(zip(words,x["words"])):
                lang="grc" if not ot else "arc" if w["morph"].startswith("A") else "hbo"
                stats["tokens"]+=1;stats[lang]+=1
                if r["nodes"]:
                    stats["linked"]+=1;stats[lang+"_linked"]+=1;stats[r["status"]]+=1
                    if not r["component_match"]:stats["different_segmentation"]+=1
                    if lang not in examples:examples[lang]={"book":b,"ref":ref,"token":i,"source_ids":[x["nodes"][n]["source_id"] for n in r["nodes"]]}
                else:
                    stats["pending"]+=1;stats[lang+"_pending"]+=1
                    pending.setdefault(ref,[]).append({"token":i,"reason":"sem alinhamento seguro"})
            for n in x["nodes"]:
                if n["attrs"].get("role"):roles[n["attrs"]["role"]]+=1
                if n["attrs"].get("class"):classes[n["attrs"]["class"]]+=1
            assert x["matched"]==sum(bool(z["nodes"]) for z in x["words"])
        for ch,v in chapters.items():write(a.out/b/(ch+".json"),v)
        write(a.details/(b+".json"),pending);books[b]=dict(stats);totals.update(stats)
        print(b,stats["linked"],stats["pending"],flush=True)
    assert totals["tokens"]==443061 and totals["verses"]==31140
    assert totals["grc"]==137554 and totals["hbo"]==300679 and totals["arc"]==4828
    assert totals["linked"]+totals["pending"]==totals["tokens"]
    assert all(totals[k+"_linked"]>0 for k in ("grc","hbo","arc"))
    write(a.out/"rotulos.json",{"roles":ROLES,"classes":CLASSES})
    write(a.report,{"stage":8,"status":"constituency_alignment","books":66,"totals":dict(totals),"books_detail":books,"roles_projected":dict(roles),"classes_projected":dict(classes),"examples":examples,"sources":{"MACULA Greek SBLGNT":{"revision":G_REV,"license":"CC BY 4.0","url":"https://github.com/Clear-Bible/macula-greek"},"MACULA Hebrew WLC":{"revision":H_REV,"license":"CC BY 4.0","url":"https://github.com/Clear-Bible/macula-hebrew"}},"scope":"Verse-local projection of source constituency trees, retaining source IDs, roles, rule and parent relationships. Cross-verse sentence membership is preserved, but displayed trees are projections, not full sentences. No fabricated dependency heads, semantic roles, textual variants or contextual syntax. Conservative word alignment; component alignment only when source segmentation agrees. No independent philological review."})
    print(json.dumps(dict(totals),ensure_ascii=False))
if __name__=="__main__":main()
