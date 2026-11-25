#!/usr/bin/env python3
"""Refine Poole indexing using verified XML structure; retain original chapter and volume."""
import ast,collections,hashlib,json,pathlib,re,xml.etree.ElementTree as ET
P=pathlib.Path;root=P("public/commentaries")
def read(p):return json.loads(P(p).read_text())
def write(p,x):P(p).write_text(json.dumps(x,ensure_ascii=False,separators=(",",":"))+"\n")
def tag(e):return e.tag.rsplit("}",1)[-1].lower()
def heading(e):return " ".join("".join(n.itertext()) for n in e if tag(n)=="head")
def norm(s):return " ".join(re.sub(r"[^A-Z0-9]+"," ",s.upper()).split())
def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def markup(e):return ET.tostring(e,encoding="unicode")
heads=next(ast.literal_eval(n.value) for n in ast.parse(P("scripts/commentaries/import_poole.py").read_text()).body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=="heads" for t in n.targets))
manifest=read(root/"manifest.json");original=read("docs/auditoria-poole-9.json")
report={"chapter_recoveries":[],"chapter_unresolved":[],"verse_keys":0,"chapter_count":0,"books":{},"method":"Chapter recovery only with unique explicit TEI number, complete ordered chapter inventory and all previous chapter anchors agreeing. Verse index only direct numbered paragraphs with matching printed number, unique number and bottom annotations; full chapter retained as fallback."}
for ix,s in enumerate(original["sources"]):
    raw=(root/"poole-source"/(s["id"]+".xml")).read_bytes()
    assert hashlib.sha256(raw).hexdigest()==s["sha256"]
    tree=ET.fromstring(raw)
    for book,title in heads[:23] if ix==0 else heads[23:]:
        candidates=[e for e in tree.iter() if tag(e).startswith("div") and (norm(heading(e))==title or (book=="2Thess" and norm(heading(e)).endswith(" II THESSALONIANS")))]
        assert len(candidates)==1,(book,len(candidates))
        e=candidates[0];chs=manifest["books"][book]
        ds=[d for d in e.iter() if d is not e and tag(d).startswith("div") and d.get("type","").lower() in ("chapter","psalm")]
        old={c:read(root/book/(str(c)+".json")).get("Poole") for c in chs}
        structural=len(ds)==len(chs) and all(not old[c] or digest(markup(d))==old[c]["keys"]["0"] for c,d in zip(chs,ds))
        bookstat={"chapters":0,"verse_keys":0}
        for c in chs:
            path=root/book/(str(c)+".json");data=read(path);rec=data.get("Poole")
            if not rec:
                d=ds[chs.index(c)] if structural else None
                if d is not None and d.get("n")==str(c):
                    m=markup(d);h=digest(m)
                    rec={"entries":{h:m},"keys":{"0":h},"granularity":"chapter","heading":heading(d),"volume":s["id"],"year":s["year"],"source_url":s["url"],"license":"CC0 1.0","chapter_evidence":"TEI n attribute and complete anchored book sequence"}
                    report["chapter_recoveries"].append({"book":book,"chapter":c,"heading":heading(d),"n":d.get("n")})
                else:
                    report["chapter_unresolved"].append({"book":book,"chapter":c,"structural_sequence_agrees":structural,"div_count":len(ds),"expected_count":len(chs),"candidate_n":d.get("n") if d is not None else None,"candidate_heading":heading(d) if d is not None else None});continue
            h=rec["keys"]["0"];m=rec["entries"][h];assert digest(m)==h
            chapter=ET.fromstring(m);rec["entries"]={h:m};rec["verse_keys"]={}
            paragraphs=collections.defaultdict(list)
            for p in chapter:
                if tag(p)!="p" or not re.fullmatch(r"[1-9][0-9]*",p.get("n","")):continue
                paragraphs[p.get("n")].append(p)
            valid=set().union(*(set(v.get("keys",{})) for k,v in data.items() if k!="Poole"))
            for v,ps in paragraphs.items():
                if len(ps)!=1 or v not in valid:continue
                p=ps[0]
                if not re.match(r"^\s*"+v+r"[.\s]", "".join(p.itertext())):continue
                if not any(tag(n)=="note" and n.get("place")=="bottom" for n in p.iter()):continue
                pm=markup(p);ph=digest(pm);rec["entries"][ph]=pm;rec["verse_keys"][v]=ph
            data["Poole"]=rec;write(path,data)
            bookstat["chapters"]+=1;bookstat["verse_keys"]+=len(rec["verse_keys"])
            report["chapter_count"]+=1;report["verse_keys"]+=len(rec["verse_keys"])
        report["books"][book]=bookstat
assert report["chapter_count"]+len(report["chapter_unresolved"])==1189
assert report["verse_keys"]>10000
write("docs/auditoria-poole-refinamento-9.json",report)
print(json.dumps({k:v for k,v in report.items() if k!="books"},ensure_ascii=False))
