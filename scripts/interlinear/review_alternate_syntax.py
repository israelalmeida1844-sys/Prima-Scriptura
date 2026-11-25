#!/usr/bin/env python3
"""Separate Qere syntax and conservative orthographic recovery, retaining primary corpus unchanged."""
import argparse, collections, pathlib, re, unicodedata
import xml.etree.ElementTree as ET
from enrich_open import BOOKS,CODES,read,write
from import_syntax import load_book,form,XML_ID,ATTRS
from audit_syntax_residual import descendants
P=pathlib.Path
def acute(s):
    return unicodedata.normalize("NFC","".join(c for c in unicodedata.normalize("NFD",form(s)) if c not in "\u0300\u0301\u0342"))
def greek_features(e,w):
    # Require all explicitly encoded MorphGNT grammatical values to agree; no inference of omitted tags.
    slots=[("person",{"1":"first","2":"second","3":"third"}),("tense",{"P":"present","I":"imperfect","F":"future","A":"aorist","X":"perfect","Y":"pluperfect"}),("voice",{"A":"active","M":"middle","P":"passive"}),("mood",{"I":"indicative","D":"imperative","S":"subjunctive","O":"optative","N":"infinitive","P":"participle"}),("case",{"N":"nominative","G":"genitive","D":"dative","A":"accusative","V":"vocative"}),("number",{"S":"singular","P":"plural"}),("gender",{"M":"masculine","F":"feminine","N":"neuter"}),("degree",{"C":"comparative","S":"superlative"})]
    classes={"N-":{"noun"},"V-":{"verb"},"A-":{"adj"},"D-":{"adv"},"C-":{"conj"},"P-":{"prep"},"RA":{"det"},"RP":{"pron"},"RR":{"pron"},"RD":{"pron"},"RI":{"pron"},"I-":{"intj"},"X-":{"ptcl"}}
    return e.get("class") in classes.get(w["pos"],set()) and all(c=="-" or e.get(k)==d.get(c) for c,(k,d) in zip(w["morph"],slots))
def main():
    p=argparse.ArgumentParser()
    for k in ("public","greek","hebrew","out","report"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();root=a.public;tot=collections.Counter();books={};examples={};diagnostics={}
    for bi,(b,code) in enumerate(zip(BOOKS,CODES)):
        ot=bi<39;pending=read(P("docs/sintaxe-pendente")/(b+".json"))
        if not pending:continue
        files=sorted((a.hebrew if ot else a.greek).glob(f"{bi+1 if ot else bi-38:02d}-*.xml"))
        nodes,groups,sentences,issues=load_book(files,code,ot)
        # Source metadata, used to validate leaf paths and Greek feature equivalence.
        xml={}
        for f in files:
            tree=ET.parse(f).getroot()
            for leaf in tree.iter("w"):
                if leaf.get(XML_ID):xml[leaf.get(XML_ID)]=leaf.attrib
        base=read(root/"interlinear-corpus"/(b+".json"))
        structure=read(root/"interlinear-source-structure"/(b+".json")) if ot else {}
        counts=collections.Counter();chapters=collections.defaultdict(dict)
        for ref,items in pending.items():
            ch=ref.split(":")[0];prev=read(root/"interlinear-syntax"/b/(ch+".json"))[ref];ws=base[ref]
            src=[sorted(g,key=lambda n:nodes[n]["source_id"]) for _,g in sorted(groups.get(ref,{}).items())]
            forms=["".join(nodes[n]["form"] for n in g) for g in src];idx={nodes[n]["source_id"]:j for j,g in enumerate(src) for n in g}
            anchors={}
            for i,r in enumerate(prev["words"]):
                if r["nodes"]:
                    js={idx[prev["nodes"][n]["source_id"]] for n in r["nodes"]};assert len(js)==1;anchors[i]=next(iter(js))
            missing={w["token"] for w in items};assert missing==set(range(len(ws)))-set(anchors)
            def bounds(start,end):
                lo=max((j for i,j in anchors.items() if i<start),default=-1)
                hi=min((j for i,j in anchors.items() if i>=end),default=len(src))
                return lo+1,hi
            def path(n):
                e=nodes[n];p=[]
                while True:
                    p.append({"kind":e["kind"],"attrs":e["attrs"],"sentence":e["sentence"]})
                    if e["parent"] is None:break
                    e=nodes[e["parent"]]
                return list(reversed(p))
            def links(js):
                return [{"source_id":nodes[n]["source_id"],"source_ref":nodes[n]["source_ref"],"form":nodes[n]["form"],"path":path(n)} for j in js for n in src[j]]
            proposals=[];notes=collections.defaultdict(list)
            if ot:
                for ev in structure[ref]["events"]:
                    note=ev["element"]
                    if note["tag"]!="note":continue
                    catches=[form(x.get("text") or "") for x in descendants(note,"catchWord")]
                    end=ev["before_token"]
                    # A catchword may represent several primary orthographic units.
                    spans=[(start,end) for start in range(max(0,end-8),end) if "".join(form(w["text"]) for w in ws[start:end]) in catches]
                    if len(spans)!=1:continue
                    start,end=spans[0]
                    if not set(range(start,end)).issubset(missing):continue
                    for rdg in descendants(note,"rdg"):
                        if rdg["attributes"].get("type")!="x-qere":continue
                        parts=[{"text":w.get("text") or "","id":w["attributes"].get("id"),"morph":w["attributes"].get("morph"),"lemma":w["attributes"].get("lemma")} for w in descendants(rdg,"w")]
                        if not parts:continue
                        for i in range(start,end):notes[i].append({"span":[start,end],"qere":parts})
                        target=[form(w["text"]) for w in parts];lo,hi=bounds(start,end)
                        candidates=[]
                        for j in range(lo,hi):
                            for k in range(j+1,min(hi,j+len(target)+2)+1):
                                if "".join(forms[j:k])!="".join(target):continue
                                # Respect exact grouping or exact concatenation when orthographic boundaries differ.
                                ns=[n for g in src[j:k] for n in g];lang={w["morph"][0] for w in parts if w.get("morph")}
                                if len(lang)!=1 or {nodes[n]["language"] for n in ns}!=lang:continue
                                if any(not x for x in target):continue
                                candidates.append(tuple(range(j,k)))
                        if len(candidates)==1:
                            proposals.append({"span":[start,end],"reading":"qere","qere":parts,"source_ordinals":list(candidates[0]),"source":links(candidates[0]),"evidence":"OSHB catchWord/rdg + exact contiguous source form + unique interval bounded by validated primary links"})
            else:
                for i in sorted(missing):
                    w=ws[i];lo,hi=bounds(i,i+1);candidates=[]
                    for j in range(lo,hi):
                        if len(src[j])!=1:continue
                        n=nodes[src[j][0]];e=xml[n["source_id"]]
                        if acute(w.get("word") or w["text"])==acute(n["form"]) and form(w["lemma"])==n["lemma"] and greek_features(e,w):
                            candidates.append(j)
                    if len(candidates)==1:proposals.append({"span":[i,i+1],"reading":"greek_accent_only","source_ordinals":candidates,"source":links(candidates),"evidence":"Only acute/grave/circumflex difference; exact lemma; source grammatical features agree; unique bounded position"})
            # Reject overlaps with any competing proposal; preserve order.
            accepted=[]
            for q in proposals:
                a1,a2=q["span"];js=set(q["source_ordinals"])
                conflict=any(r is not q and (set(range(a1,a2)).intersection(range(*r["span"])) or js.intersection(r["source_ordinals"]) or (a2<=r["span"][0] and max(js)>=min(r["source_ordinals"])) or (r["span"][1]<=a1 and max(r["source_ordinals"])>=min(js))) for r in proposals)
                if not conflict:accepted.append(q)
            records={}
            for q in accepted:
                start,end=q["span"]
                assert not set(q["source_ordinals"]).intersection(anchors.values())
                if q["reading"]=="qere":assert "".join(form(z["text"]) for z in q["qere"])=="".join(z["form"] for z in q["source"])
                for i in range(start,end):
                    assert i in missing and str(i) not in records
                    records[str(i)]=q
                    counts[q["reading"]+"_units"]+=1
                counts[q["reading"]+"_groups"]+=1
                examples.setdefault(q["reading"],[])
                if len(examples[q["reading"]])<3:examples[q["reading"]].append({"book":b,"ref":ref,**q})
            for i in sorted(missing):
                if str(i) in records:continue
                records[str(i)]={"reading":"unresolved","notes":notes[i],"reason":"qere_sem_alinhamento_univoco" if notes[i] else "sem_evidencia_suficiente"}
                counts["unresolved"]+=1
            counts["audited"]+=len(missing);chapters[ch][ref]=records
        for ch,data in chapters.items():write(a.out/b/(ch+".json"),data)
        books[b]=dict(counts);tot.update(counts);print(b,dict(counts),flush=True)
    assert tot["audited"]==1286 and tot["qere_units"]+tot["greek_accent_only_units"]+tot["unresolved"]==1286
    write(a.report,{"stage":"8.2-8.3","totals":dict(tot),"books":books,"examples":examples,"scope":"Separate alternative-reading paths; Qere links do not change primary Ketiv coverage. Greek accent-only paths separately marked; no source diagnostic is linguistically corrected. All 1286 gaps explicitly reviewed by source-backed constraints, not individually homologated by a human."})
    print(dict(tot))
if __name__=="__main__":main()
