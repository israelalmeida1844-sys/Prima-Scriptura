#!/usr/bin/env python3
import collections, hashlib, io, json, pathlib, re, subprocess, tempfile, urllib.request, zipfile
import xml.etree.ElementTree as ET
P=pathlib.Path
def read(p):return json.loads(P(p).read_text())
def write(p,x):
    p=P(p);p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(x,ensure_ascii=False,separators=(",",":"))+"\n")
def get(url):
    with urllib.request.urlopen(url,timeout=120) as r:return r.read(100*1024*1024+1)
root=P("public/commentaries");catalog=read("docs/catalogo-comentarios-9-1.json")
manifest={"authors":[],"reference_system":"KJV","translations":"not_imported","notes":"Only original licensed modules; same payload at multiple keys is not a newly authored verse commentary."}
chapters=collections.defaultdict(dict);reports={};intro={}
for s in catalog["sources"]:
    if s["status"]!="archive_and_license_verified":continue
    mid=s["id"];archive=get(s["download"]);assert hashlib.sha256(archive).hexdigest()==s["sha256"],mid
    with tempfile.TemporaryDirectory() as tmp:
        z=zipfile.ZipFile(io.BytesIO(archive));assert z.testzip() is None
        assert all(not P(n).is_absolute() and ".." not in P(n).parts for n in z.namelist());z.extractall(tmp)
        proc=subprocess.run(["/tmp/export-sword",tmp,mid],stdout=subprocess.PIPE,check=True)
        rows=proc.stdout.decode("ascii").splitlines()
        stats=collections.Counter();seen=set();allhash=set();coverage=set()
        for line in rows:
            t,b,c,v,h=line.split("\t");c=int(c);v=int(v);raw=bytes.fromhex(h).decode("utf-8",errors="strict")
            assert raw and "\x00" not in raw
            key=(t,b,c,v);assert key not in seen;seen.add(key)
            digest=hashlib.sha256(raw.encode()).hexdigest();allhash.add(digest)
            if b=="_" or c==0:
                intro.setdefault(mid,{})[f"{t}/{b}/{c}/{v}"]=raw;stats["intro_entries"]+=1;continue
            chapter=chapters[(b,c)].setdefault(mid,{"entries":{},"keys":{}})
            chapter["entries"].setdefault(digest,raw);chapter["keys"][str(v)]=digest
            stats["indexed_keys"]+=1
            if v>0:stats["verse_keys"]+=1;coverage.add(b)
            else:stats["chapter_intro_keys"]+=1
        assert stats["verse_keys"]>0,(mid,stats)
        stats["distinct_raw_entries"]=len(allhash);stats["books"]=len(coverage)
        reports[mid]=dict(stats)
        manifest["authors"].append({k:s[k] for k in ("id","author","title","version","license","license_url","sha256","source_type")})
        print(mid,dict(stats),flush=True)
assert len(manifest["authors"])==6
for (b,c),data in chapters.items():write(root/b/(str(c)+".json"),data)
write(root/"introductions.json",intro)
manifest["books"]={b:sorted(c for bb,c in chapters if bb==b) for b in sorted({b for b,c in chapters})}
write(root/"manifest.json",manifest)
# Verify serialization against the imported raw entry digests and all source keys.
counts=collections.Counter()
for (b,c),data in chapters.items():
    out=read(root/b/(str(c)+".json"));assert out==data
    for mid,entry in out.items():
        for h,raw in entry["entries"].items():assert hashlib.sha256(raw.encode()).hexdigest()==h
        for k,h in entry["keys"].items():assert h in entry["entries"];counts[mid]+=1
for mid,n in counts.items():assert n==reports[mid]["indexed_keys"]
write("docs/auditoria-comentarios-9.json",{"sources":reports,"chapters":len(chapters),"verified_indexed_keys":dict(counts),"scope":"All nonempty KJV verse/chapter keys returned by libSWORD plus book/testament introductions. Raw payload preserved with SHA256; not proof of complete historical print edition. No Portuguese translation or editorial note fabricated."})
