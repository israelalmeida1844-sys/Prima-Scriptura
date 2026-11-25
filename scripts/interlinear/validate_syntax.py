#!/usr/bin/env python3
"""Validate every displayed source path against the original XML independently of the importer."""
import argparse, collections, hashlib, pathlib, re
import xml.etree.ElementTree as ET
from enrich_open import BOOKS,CODES,read,write
from import_syntax import ATTRS,XML_ID,form
P=pathlib.Path
def verify():
    p=argparse.ArgumentParser()
    for k in ("base","greek","hebrew","out","report"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();tot=collections.Counter()
    for bi,(b,code) in enumerate(zip(BOOKS,CODES)):
        ot=bi<39
        files=sorted((a.hebrew if ot else a.greek).glob(f"{bi+1 if ot else bi-38:02d}-*.xml"))
        lookup={};groups=collections.defaultdict(lambda:collections.defaultdict(list));sentence_refs=collections.defaultdict(set)
        for file in files:
            root=ET.parse(file).getroot()
            parent={child:node for node in root.iter() for child in node}
            for sn,sentence in enumerate(root.iter("sentence"),1):
                sid=file.name+":"+str(sn)
                for leaf in sentence.iter("w"):
                    ident=leaf.get(XML_ID);ref=leaf.get("ref") or ""
                    m=re.fullmatch(r"(\S+) (\d+):(\d+)!(\d+)",ref)
                    if not ident or ident in lookup or not m or m[1]!=code or not form(leaf.text or ""):continue
                    key=str(int(m[2]))+":"+str(int(m[3]));ordn=int(m[4])
                    path=[];n=leaf
                    while n is not sentence:
                        if n.tag in ("wg","w"):path.append((n.tag,{k:v for k,v in n.attrib.items() if k in ATTRS}))
                        n=parent[n]
                    lookup[ident]=(sid,ref,form(leaf.text or ""),leaf.get("lang") if ot else "G",path[::-1],form(leaf.get("lemma") or ""))
                    groups[key][ordn].append(ident);sentence_refs[sid].add(key)
        base=read(a.base/(b+".json"));data={}
        for f in (a.out/b).glob("*.json"):
            chapter=read(f);assert not set(data).intersection(chapter);data.update(chapter)
        assert set(base)==set(data)
        for ref,words in base.items():
            x=data[ref];nodes=x["nodes"];assert len(x["words"])==len(words)
            src=[sorted(g) for _,g in sorted(groups.get(ref,{}).items())]
            srcforms=["".join(lookup[ident][2] for ident in g) for g in src]
            baseforms=[form(w.get("word") or w["text"]) for w in words]
            if x["method"]=="versiculo_integral":assert srcforms==baseforms,(b,ref)
            assert x["source_word_count"]==len(src)
            assert x["sentences"]=={sid:sorted(sentence_refs[sid],key=lambda r:tuple(map(int,r.split(":")))) for sid in x["sentences"]}
            assert set(x["sentences"])=={n["sentence"] for n in nodes}
            leaves=set();used_groups=set()
            for j,n in enumerate(nodes):
                assert n["parent"] is None or 0<=n["parent"]<j
                if n["parent"] is not None:assert nodes[n["parent"]]["sentence"]==n["sentence"]
                if n["kind"]=="w":leaves.add(j)
                else:assert n["kind"]=="wg"
            matched=set()
            last=-1
            for i,(w,r) in enumerate(zip(words,x["words"])):
                tot["tokens"]+=1
                if not r["nodes"]:
                    assert r["status"]=="pendente";tot["pending"]+=1;continue
                lang="A" if ot and w["morph"].startswith("A") else "H" if ot else "G"
                identlist=[];forms=[]
                for j in r["nodes"]:
                    n=nodes[j];assert j in leaves and j not in matched and n["token"]==i;matched.add(j)
                    ident=n["source_id"];sid,sref,f,language,path,lemma=lookup[ident]
                    assert n["source_ref"]==sref and n["sentence"]==sid and language==lang
                    assert sref.split(" ",1)[1].split("!")[0]==ref
                    current=[];k=j
                    while k is not None:
                        q=nodes[k];current.append((q["kind"],q["attrs"]));k=q["parent"]
                    assert current[::-1]==path,(b,ref,ident)
                    identlist.append(ident);forms.append(f)
                    if not ot and x["method"]!="versiculo_integral":assert lemma==form(w["lemma"])
                group_index=src.index(identlist);assert group_index>last and group_index not in used_groups;last=group_index;used_groups.add(group_index)
                joined="".join(forms);assert joined==baseforms[i] and hashlib.sha256(joined.encode()).hexdigest()==r["form_sha256"]
                component=[form(z) for z in w["text"].split("/")] if ot else [baseforms[i]]
                assert r["component_match"]==(component==forms)
                for z,j in enumerate(r["nodes"]):assert nodes[j].get("component")== (z if r["component_match"] else None)
                if x["method"]!="versiculo_integral":assert baseforms.count(joined)==srcforms.count(joined)==1
                tot["linked"]+=1;tot["source_leaves"]+=len(r["nodes"])
            assert matched==leaves and len(used_groups)==x["matched"]
            tot["verses"]+=1
    assert tot["tokens"]==443061 and tot["verses"]==31140 and tot["linked"]+tot["pending"]==tot["tokens"]
    gen=read(a.out/"Gen/1.json")["1:1"];assert gen["matched"]==7
    assert any(n["attrs"].get("role")=="s" and n.get("token")==2 for n in gen["nodes"])
    assert any(n["attrs"].get("role")=="v" and n.get("token")==1 for n in gen["nodes"])
    dan=read(a.out/"Dan/7.json")["7:1"];assert dan["matched"]>0
    john=read(a.out/"3John/1.json")["1:1"];assert john["matched"]>0
    report=read(a.report);assert report["totals"]["linked"]==tot["linked"]
    report["independent_validation"]=dict(tot);report["status"]="source_paths_verified"
    write(a.report,report);print(dict(tot))
if __name__=="__main__":verify()
