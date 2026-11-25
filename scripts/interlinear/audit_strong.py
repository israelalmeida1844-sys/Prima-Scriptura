#!/usr/bin/env python3
"""Stage 3: evidence-based Strong indices and concordance, separate from original text/glosses."""
import argparse, collections, hashlib, json, pathlib, re, unicodedata
from enrich_open import CODES, BOOKS, chapter_data, read, write, searchkey, shard
from audit_glosses import checks
P=pathlib.Path
STEP_REV="5de0a47f35f0fc13dfe1430d104e5db8a4285f9c"
ALIGNED_REV="2f53eafc80a98f1f3dab0e7d838f93ad451c5ff0"
OSHB_REV="db6c5c9b46b8f39346f10915ddb1a70dcd429901"
LIMIT={"H":8674,"G":5624}
def parse_id(raw,prefix=None):
    if not isinstance(raw,str):return None
    m=re.fullmatch(r"([GH])(\d+)([A-Za-z]?)",raw.strip(),re.I)
    if not m:return None
    p=m[1].upper()
    if prefix and p!=prefix:return None
    n=int(m[2])
    if not n:return None
    return p+str(n),m[3]
def classical(s):
    return 1<=int(s[1:])<=LIMIT[s[0]]
def lemma_key(s):
    # Only canonical Unicode/case equivalence; do not remove accents, breathings or punctuation.
    return unicodedata.normalize("NFC",unicodedata.normalize("NFC",s.strip()).casefold())
def load_lexicon(path,prefix):
    bylemma=collections.defaultdict(set); byid=collections.defaultdict(set)
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        cols=line.split("\t")
        if len(cols)<8:continue
        parsed=parse_id(cols[0],prefix)
        if not parsed:continue
        ident,suffix=parsed; lemma=cols[3].strip()
        if not lemma:continue
        bylemma[lemma_key(lemma)].add(ident)
        byid[ident].add(lemma)
    assert len(byid)>4000,(path,len(byid))
    return bylemma,byid
def hebrew_ids(raw):
    ids=[];components=[]
    for part in (raw or "").split("/"):
        part=part.strip()
        if not part:continue
        m=re.fullmatch(r"(\d+)(?:\s*([a-zA-Z]))?(\+)?",part)
        if m and int(m[1])>0:
            ident="H"+str(int(m[1]))
            entry={"raw":part,"id":ident}
            if m[2]:entry["sense_suffix"]=m[2]
            if m[3]:entry["continuation_marker"]=True
            components.append(entry)
            if ident not in ids:ids.append(ident)
        else:
            # OSHB's alphabetic affix codes are not classical Strong numbers.
            components.append({"raw":part,"kind":"affix_or_other"})
    return ids,components
def greek_result(w,row,lex,byid):
    candidates=sorted(lex.get(lemma_key(w.get("lemma") or ""),set()))
    direct=None
    if row and checks(w,row,False) is None:
        parsed=parse_id(row[1],"G")
        if parsed:direct=parsed[0]
    classic=[x for x in candidates if classical(x)]
    result={"ids":[],"status":"pendente"}
    if direct and direct in classic:
        result.update(ids=[direct],status="dupla_fonte",source="alinhamento+TBESG")
    elif direct and not candidates and direct in byid and classical(direct):
        # The direct source aligns form, lemma and morphology, but headword may differ in TBESG.
        result.update(ids=[direct],status="fonte_direta",source="alinhamento")
    elif direct and candidates and direct not in candidates:
        result.update(status="conflito_lexical",direct_candidate=direct,candidates=candidates)
    elif direct and not classical(direct):
        result.update(status="identificador_ampliado",extended_ids=[direct] if direct in candidates else [],direct_candidate=direct)
    elif len(candidates)==1 and len(classic)==1:
        result.update(ids=classic,status="lema_univoco",source="TBESG")
    elif len(candidates)==1 and not classic:
        result.update(status="identificador_ampliado",extended_ids=candidates,source="TBESG")
    elif candidates:
        result.update(status="lema_ambiguo",candidates=candidates)
    elif direct:
        result.update(status="codigo_sem_registro_lexical",direct_candidate=direct)
    else:result["status"]="sem_correspondencia"
    return result
def selftest():
    assert hebrew_ids("c/m/6529 a+")[0]==["H6529"]
    assert hebrew_ids("l")[0]==[]
    assert hebrew_ids("123/456 b")[0]==["H123","H456"]
    assert hebrew_ids("x123")[0]==[]
    assert parse_id("G03056") == ("G3056","")
    assert parse_id("H559","G") is None
    w={"text":"λόγος","lemma":"λόγος","pos":"N-","morph":"----NSM-"}
    row=["λόγος","G3056","palavra","","N-----NSM-","λόγος"]
    assert greek_result(w,row,{lemma_key("λόγος"):{"G3056"}},{"G3056":{}})["ids"]==["G3056"]
    assert greek_result(w,None,{lemma_key("λόγος"):{"G3056","G999"}},{})["status"]=="lema_ambiguo"
    assert greek_result(w,row,{lemma_key("λόγος"):{"G999"}},{"G3056":{}})["status"]=="conflito_lexical"
    assert greek_result(w,None,{lemma_key("λόγος"):{"G6001"}},{})["ids"]==[]
def main():
    selftest()
    p=argparse.ArgumentParser()
    for k in ("base","gloss","aligned","greeklex","hebrewlex","out","report","details"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args()
    glex,gids=load_lexicon(a.greeklex,"G");_,hids=load_lexicon(a.hebrewlex,"H")
    assert "G3056" in glex[lemma_key("λόγος")] and "H559" in hids and "H216" in hids
    index=collections.defaultdict(lambda:collections.defaultdict(list));summary={};totals=collections.Counter();examples=[]
    for bi,(code,book) in enumerate(zip(CODES,BOOKS)):
        ot=bi<39;base=read(a.base/(book+".json"));gloss=read(a.gloss/(book+".json"));ext={}
        assert set(base)==set(gloss)
        if not ot:
            for path in (a.aligned/code).glob("*.js"):
                d=chapter_data(path)
                for v in d["v"]:ext[f"{d['chapter']}:{v['n']}"]=v["w"]
        counts=collections.Counter();out={};pending={}
        for key,words in base.items():
            entries=[];details=[];gs=gloss[key]["words"]
            assert len(gs)==len(words),(book,key)
            for i,(w,g) in enumerate(zip(words,gs)):
                prior=parse_id(g.get("strong"),"H" if ot else "G")
                old=prior[0] if prior else None
                counts["tokens"]+=1
                if old:counts["previous_with_id"]+=1
                if ot:
                    allids,components=hebrew_ids(w.get("lemma"))
                    ids=[s for s in allids if classical(s)]
                    extended=[s for s in allids if not classical(s)]
                    res={"ids":ids,"status":"oshb_direto" if ids else ("identificador_ampliado" if extended else "sem_numero_oshb"),"source":"OSHB","components":components}
                    if extended:res["extended_ids"]=extended
                    if any(s not in hids for s in ids):
                        res["lexicon_missing"]=[s for s in ids if s not in hids]
                        counts["oshb_ids_not_in_tbesh"]+=1
                    if not ids and not extended:
                        if components and all(re.fullmatch(r"[a-zA-Z]+",c["raw"]) for c in components):
                            res["status"]="afixo_sem_numero"
                        else:res["status"]="identificador_oshb_nao_resolvido"
                else:
                    source=g.get("gloss_source") or {}; row=None
                    r=source.get("ref");j=source.get("token")
                    if r in ext and isinstance(j,int) and 0<=j<len(ext[r]):row=ext[r][j]
                    res=greek_result(w,row,glex,gids)
                    if res["status"] in {"dupla_fonte","fonte_direta"}:
                        res["source_ref"]=r;res["source_token"]=j
                ids=res["ids"]
                assert len(ids)==len(set(ids))
                counts[res["status"]]+=1
                if ids:
                    counts["with_id"]+=1;counts["assignments"]+=len(ids)
                    if len(ids)>1:counts["multiple_ids"]+=1
                if old:
                    if old not in ids:
                        counts["previous_removed_or_replaced"]+=1
                        res["previous_id"]=old
                        if ids:counts["previous_replaced"]+=1
                        else:counts["previous_removed"]+=1
                        if len(examples)<150:examples.append({"book":book,"ref":key,"token":i,"old":old,"new":ids,"status":res["status"]})
                    else:counts["previous_retained"]+=1
                elif ids:counts["newly_covered"]+=1
                if not ids:
                    details.append({"token":i,"status":res["status"]})
                keys={searchkey(w.get("word") or w["text"])}
                if not ot:keys.add(searchkey(w.get("lemma") or ""))
                for s in ids:keys.add(s.lower())
                for k in sorted(keys-{""}):index[shard(k)][k].append([book,key,i])
                entries.append(res)
            out[key]=entries
            if details:pending[key]=details
        counts["verses"]=len(base);counts["without_id"]=counts["tokens"]-counts["with_id"]
        assert counts["previous_with_id"]==counts["previous_retained"]+counts["previous_removed_or_replaced"]
        assert counts["with_id"]==counts["previous_retained"]+counts["previous_replaced"]+counts["newly_covered"]
        summary[book]=dict(counts);totals.update(counts)
        write(a.out/"tokens"/(book+".json"),out);write(a.details/(book+".json"),pending)
    for h,entries in index.items():write(a.out/"concordancia"/(h+".json"),entries)
    report={"stage":3,"status":"source_audit_complete","totals":dict(totals),"books":summary,"examples_previous_changes":examples,"sources":{"OSHB":{"revision":OSHB_REV,"license":"CC BY 4.0"},"STEP Bible TBESG/TBESH":{"revision":STEP_REV,"license":"CC BY 4.0","greek_lexicon_sha256":hashlib.sha256(a.greeklex.read_bytes()).hexdigest(),"hebrew_lexicon_sha256":hashlib.sha256(a.hebrewlex.read_bytes()).hexdigest(),"greek_headword_ids":len(gids),"hebrew_headword_ids":len(hids)},"Bíblia Interlinear":{"revision":ALIGNED_REV,"license":"CC BY-SA 4.0"}},"scope":"Classical Strong numbers only within the traditional H/G ranges. OSHB augmented identifiers, suffixes and affixes preserved separately. Greek mapping from aligned source corroborated by TBESG when possible; unique lexical mapping labeled, conflicting or ambiguous entries withheld. No semantic homologation or new glosses."}
    write(a.report,report)
    print(json.dumps(dict(totals),ensure_ascii=False))
if __name__=="__main__":main()
