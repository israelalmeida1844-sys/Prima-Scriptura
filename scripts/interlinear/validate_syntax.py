#!/usr/bin/env python3
"""Validate every displayed source path against the original XML independently of the importer."""
import argparse, collections, hashlib, pathlib, re
import xml.etree.ElementTree as ET
from enrich_open import BOOKS,CODES,read,write
from import_syntax import ATTRS,XML_ID,form,legacy_pairs
P=pathlib.Path
def optimal_length(a,b,excluded=None):
    row=[0]*(len(b)+1)
    for i,x in enumerate(a):
        new=[0]
        for j,y in enumerate(b):
            new.append(max(row[j+1],new[-1],row[j]+1 if x and x==y and (i,j)!=excluded else 0))
        row=new
    return row[-1]
def verify():
    p=argparse.ArgumentParser()
    for k in ("base","greek","hebrew","out","report"):p.add_argument("--"+k,type=P,required=True)
    p.add_argument("--previous",type=P,required=True)
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
        base=read(a.base/(b+".json"));data={};prior={}
        for f in (a.previous/b).glob("*.json"):prior.update(read(f))
        for f in (a.out/b).glob("*.json"):
            chapter=read(f);assert not set(data).intersection(chapter);data.update(chapter)
        assert set(base)==set(data)==set(prior)
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
            anchors=legacy_pairs(baseforms,srcforms)
            intervals=list(zip([(-1,-1)]+anchors,anchors+[(len(baseforms),len(srcforms))]))
            last=-1
            for i,(w,r) in enumerate(zip(words,x["words"])):
                tot["tokens"]+=1
                old=prior[ref]["words"][i]
                if old["nodes"]:
                    tot["previously_linked"]+=1
                    assert r["nodes"],(b,ref,i,"regression")
                    assert [nodes[j]["source_id"] for j in r["nodes"]]==[prior[ref]["nodes"][j]["source_id"] for j in old["nodes"]],(b,ref,i,"mapping changed")
                if not r["nodes"]:
                    assert r["status"]=="pendente" and r["reason"];tot["pending"]+=1;continue
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
                if x["method"]!="versiculo_integral":
                    if r["alignment_evidence"]=="ancora_legada":assert (i,group_index) in anchors and baseforms.count(joined)==srcforms.count(joined)==1
                    else:
                        assert r["alignment_evidence"]=="par_obrigatorio_no_intervalo"
                        interval=next(((u,v),(k,l)) for (u,v),(k,l) in intervals if u<i<k and v<group_index<l)
                        (u,v),(k,l)=interval;aa=baseforms[u+1:k];bb=srcforms[v+1:l]
                        assert optimal_length(aa,bb,(i-u-1,group_index-v-1))<optimal_length(aa,bb),(b,ref,i)
                        tot["new_forced_pairs_verified"]+=1
                if not old["nodes"]:tot["recovered"]+=1
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
    assert tot["recovered"]==tot["linked"]-tot["previously_linked"]
    report["independent_validation"]=dict(tot);report["status"]="source_paths_verified"
    write(a.report,report);print(dict(tot))
if __name__=="__main__":verify()
