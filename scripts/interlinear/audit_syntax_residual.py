#!/usr/bin/env python3
"""Stage 8.1 residual audit: distinguish Ketiv/Qere from unmatched forms; do not transfer syntax."""
import argparse, collections, pathlib, re, unicodedata
from enrich_open import BOOKS,CODES,read,write
from import_syntax import load_book,form,G_REV,H_REV
P=pathlib.Path
def descendants(e,tag):
    if e.get("tag")==tag:yield e
    for c in e.get("children",[]):yield from descendants(c,tag)
def bare(s):
    return "".join(c for c in unicodedata.normalize("NFD",s) if not unicodedata.category(c).startswith("M"))
def main():
    p=argparse.ArgumentParser()
    for k in ("public","pending","greek","hebrew","out"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();root=a.public;tot=collections.Counter();books={};examples={};diagnostics=[]
    for bi,(b,code) in enumerate(zip(BOOKS,CODES)):
        pending=read(a.pending/(b+".json"));base=read(root/"interlinear-corpus"/(b+".json"));ot=bi<39
        if not pending:books[b]={};continue
        files=sorted((a.hebrew if ot else a.greek).glob(f"{bi+1 if ot else bi-38:02d}-*.xml"))
        nodes,groups,sentences,issues=load_book(files,code,ot)
        structures=read(root/"interlinear-source-structure"/(b+".json")) if ot else {}
        counts=collections.Counter();details={}
        for ref,items in pending.items():
            ws=base[ref];src=[]
            for j,g in sorted(groups.get(ref,{}).items()):
                leaves=[nodes[n] for n in sorted(g,key=lambda n:nodes[n]["source_id"])]
                src.append({"ordinal":j,"form":"".join(x["form"] for x in leaves),"source_ids":[x["source_id"] for x in leaves],"lemmas":[x["lemma"] for x in leaves]})
            qeres=collections.defaultdict(list)
            if ot:
                for ev in structures[ref]["events"]:
                    note=ev["element"]
                    if note["tag"]!="note":continue
                    catch=[form(x.get("text") or "") for x in descendants(note,"catchWord")]
                    for rdg in descendants(note,"rdg"):
                        if rdg["attributes"].get("type")!="x-qere":continue
                        parts=[{"text":x.get("text") or "","id":x["attributes"].get("id"),"morph":x["attributes"].get("morph")} for x in descendants(rdg,"w")]
                        i=ev["before_token"]-1
                        if 0<=i<len(ws) and form(ws[i]["text"]) in catch:qeres[i].append(parts)
            for item in items:
                i=item["token"];w=ws[i];f=form(w.get("word") or w["text"]);alt=qeres.get(i,[])
                # Confirm alternate reading in source as a single grouped word; do not align to Ketiv.
                matches=[]
                for parts in alt:
                    v=form("".join(x["text"] for x in parts))
                    for s in src:
                        if s["form"]==v:matches.append({"qere":parts,"source":s})
                same=[s for s in src if bare(s["form"])==bare(f)]
                if matches:reason="qere_documentado_presente_no_versiculo_macula"
                elif alt:reason="qere_documentado_sem_correspondencia_integral"
                elif same:reason="diacriticos_ou_lema_requerem_revisao"
                else:reason="forma_sem_equivalente_demonstrado"
                rec={**item,"classification":reason,"qere_notes":alt,"qere_candidates":matches,"same_consonants_candidates":same,"source_verse_word_count":len(src)}
                details.setdefault(ref,[]).append(rec);counts[reason]+=1;counts["pending"]+=1
                examples.setdefault(reason,[])
                if len(examples[reason])<5:examples[reason].append({"book":b,"ref":ref,**rec})
        write(a.out/"by-book"/(b+".json"),details);books[b]=dict(counts);tot.update(counts)
    # Preserve every diagnostic's exact location and raw label; not a corrected linguistic judgment.
    for b in BOOKS:
        for path in sorted((root/"interlinear-syntax"/b).glob("*.json")):
            for ref,x in read(path).items():
                for i,n in enumerate(x["nodes"]):
                    role=n["attrs"].get("role","")
                    if role.startswith("err_"):diagnostics.append({"book":b,"ref":ref,"node":i,"source_group":n.get("source_group"),"sentence":n["sentence"],"raw_role":role,"status":"diagnostico_da_fonte_nao_resolvido"})
    assert tot["pending"]==1286
    assert sum(v for k,v in tot.items() if k!="pending")==tot["pending"]
    assert len(diagnostics)==7
    write(a.out/"report.json",{"stage":"8.1-residual","totals":dict(tot),"books":books,"examples":examples,"diagnostics":diagnostics,"scope":"Investigation of remaining 1286 gaps, not new syntactic links. Qere is documented in OSHB catchWord/rdg and checked against forms in the same MACULA verse; a candidate is not a proof of the same syntactic function or unique position. No transfer of syntax from Qere to Ketiv, no guessed corrections to source diagnostics.","sources":{"OSHB":"db6c5c9b46b8f39346f10915ddb1a70dcd429901","MACULA Greek":G_REV,"MACULA Hebrew":H_REV}})
    print(dict(tot))
if __name__=="__main__":main()
