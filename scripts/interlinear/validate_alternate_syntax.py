#!/usr/bin/env python3
"""Check serialized alternate links against pinned XML paths, note and anchor provenance."""
import argparse,collections,pathlib,re
import xml.etree.ElementTree as ET
from enrich_open import BOOKS,CODES,read,write
from import_syntax import form,ATTRS,XML_ID
from review_alternate_syntax import acute,greek_features
from audit_syntax_residual import descendants
P=pathlib.Path
def main():
    p=argparse.ArgumentParser()
    for k in ("public","greek","hebrew","report"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();tot=collections.Counter()
    for bi,(b,code) in enumerate(zip(BOOKS,CODES)):
        pending=read(P("docs/sintaxe-pendente")/(b+".json"))
        if not pending:continue
        ot=bi<39;src={}
        for file in sorted((a.hebrew if ot else a.greek).glob(f"{bi+1 if ot else bi-38:02d}-*.xml")):
            root=ET.parse(file).getroot();parents={child:parent for parent in root.iter() for child in parent}
            for sn,sentence in enumerate(root.iter("sentence"),1):
                sid=file.name+":"+str(sn)
                for e in sentence.iter("w"):
                    ident=e.get(XML_ID)
                    if not ident or not form(e.text or ""):continue
                    path=[];n=e
                    while n is not sentence:
                        if n.tag in ("wg","w"):path.append({"kind":n.tag,"attrs":{k:v for k,v in n.attrib.items() if k in ATTRS},"sentence":sid})
                        n=parents[n]
                    src[ident]=(e,path[::-1])
        base=read(a.public/"interlinear-corpus"/(b+".json"))
        structure=read(a.public/"interlinear-source-structure"/(b+".json")) if ot else {}
        for ref,items in pending.items():
            ch=ref.split(":")[0];prior=read(a.public/"interlinear-syntax"/b/(ch+".json"))[ref]
            data=read(a.public/"interlinear-syntax-alternates"/b/(ch+".json"))[ref]
            assert set(data)=={str(z["token"]) for z in items}
            prev_ids={n["source_id"] for n in prior["nodes"] if n["kind"]=="w"}
            def ordinal(s):return int(s.rsplit("!",1)[1])
            used=set();last=0;seen=set()
            for i,r in sorted(data.items(),key=lambda x:int(x[0])):
                i=int(i);tot["audited"]+=1;tot[r["reading"]+"_units"]+=1
                assert not prior["words"][i]["nodes"]
                if r["reading"]=="unresolved":assert r["reason"];continue
                start,end=r["span"];assert start<=i<end and all(data[str(k)]==r for k in range(start,end))
                if start in seen:continue
                seen.add(start)
                ids=[x["source_id"] for x in r["source"]]
                assert not set(ids)&(prev_ids|used);used.update(ids)
                os=[]
                for leaf in r["source"]:
                    e,path=src[leaf["source_id"]];assert leaf["path"]==path and leaf["form"]==form(e.text or "") and leaf["source_ref"]==e.get("ref")
                    assert e.get("ref").split(" ")[1].split("!")[0]==ref
                    os.append(ordinal(leaf["source_ref"]))
                assert min(os)>last;last=max(os)
                for k,z in enumerate(prior["words"]):
                    if z["nodes"]:
                        o=ordinal(prior["nodes"][z["nodes"][0]]["source_ref"])
                        assert k<start and o<min(os) or k>=end and o>max(os)
                if r["reading"]=="qere":
                    assert ot
                    assert "".join(form(z["text"]) for z in r["qere"])=="".join(z["form"] for z in r["source"])
                    expected=[z["id"] for z in r["qere"]]
                    assert any(ev["before_token"]==end and any(form(x.get("text") or "")=="".join(form(w["text"]) for w in base[ref][start:end]) for x in descendants(ev["element"],"catchWord")) and any(rdg["attributes"].get("type")=="x-qere" and [w["attributes"].get("id") for w in descendants(rdg,"w")]==expected for rdg in descendants(ev["element"],"rdg")) for ev in structure[ref]["events"])
                else:
                    assert not ot and end==start+1 and len(ids)==1
                    w=base[ref][start];e,_=src[ids[0]]
                    assert acute(w.get("word") or w["text"])==acute(e.text or "") and form(w["lemma"])==form(e.get("lemma") or "") and greek_features(e.attrib,w)
                tot["groups_verified"]+=1
    report=read(a.report);assert tot["audited"]==1286
    for k in ("qere_units","greek_accent_only_units"):assert tot[k]==report["totals"].get(k,0)
    assert tot["unresolved_units"]==report["totals"].get("unresolved",0)
    report["independent_validation"]=dict(tot);write(a.report,report);print(dict(tot))
if __name__=="__main__":main()
