#!/usr/bin/env python3
"""Index Poole's CC0 EEBO-TCP historical transcription only by explicit headings."""
import collections, hashlib, json, pathlib, re, unicodedata, urllib.request
import xml.etree.ElementTree as ET
P=pathlib.Path
root=P("public/commentaries")
def read(p):return json.loads(P(p).read_text())
def write(p,x):
    p=P(p);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,separators=(",",":"))+"\n")
volumes=[("A55363","41a5d66565a933814dd6a5486595f6a2ae45e29f",1683),("A55368","eadd8a9fdb03365d0d54aa36287b7defb034cc8c",1685)]
heads=[
("Gen","GENESIS"),("Exod","ANNOTATIONS ON EXODUS"),("Lev","ANNOTATIONS ON LEVITICUS"),("Num","ANNOTATIONS ON NUMBERS"),("Deut","ANNOTATIONS ON DEUTERONOMIE"),("Josh","JOSHUA"),("Judg","JUDGES"),("Ruth","RUTH"),("1Sam","I SAMUEL"),("2Sam","II SAMUEL"),("1Kgs","I KINGS"),("2Kgs","II KINGS"),("1Chr","I CHRONICLES"),("2Chr","II CHRONICLES"),("Ezra","EZRA"),("Neh","NEHEMIAH"),("Esth","ESTHER"),("Job","JOB"),("Ps","PSALMS"),("Prov","PROVERBS"),("Eccl","ECCLESIASTES"),("Song","CANTICLES"),("Isa","ISAIAH"),
("Jer","ANNOTATIONS ON JEREMIAH"),("Lam","THE LAMENTATIONS OF JEREMIAH"),("Ezek","ANNOTATIONS ON EZEKIEL"),("Dan","ANNOTATIONS ON DANIEL"),("Hos","ANNOTATIONS ON HOSEA"),("Joel","JOEL"),("Amos","AMOS"),("Obad","OBADIAH"),("Jonah","JONAH"),("Mic","MICAH"),("Nah","NAHUM"),("Hab","HABAKKUK"),("Zeph","ZEPHANIAH"),("Hag","HAGGAI"),("Zech","ZECHARIAH"),("Mal","MALACHI"),("Matt","ANNOTATIONS ON THE GOSPEL ACCORDING TO ST MATTHEW"),("Mark","ST MARK"),("Luke","ST LUKE"),("John","ST JOHN"),("Acts","THE ACTS OF THE APOSTLES"),("Rom","ROMANS"),("1Cor","ANNOTATIONS ON THE FIRST EPISTLE TO THE CORINTHIANS"),("2Cor","ANNOTATIONS ON THE SECOND EPISTLE TO THE CORINTHIANS"),("Gal","GALATIANS"),("Eph","EPHESIANS"),("Phil","PHILIPPIANS"),("Col","COLOSSIANS"),("1Thess","I THESSALONIANS"),("2Thess","II THESSALONIANS"),("1Tim","I TIMOTHY"),("2Tim","II TIMOTHY"),("Titus","TITUS"),("Phlm","PHILEMON"),("Heb","HEBREWS"),("Jas","THE GENERAL EPISTLE OF JAMES"),("1Pet","THE FIRST EPISTLE GENERAL OF PETER"),("2Pet","THE SECOND EPISTLE GENERAL OF PETER"),("1John","THE FIRST EPISTLE OF ST JOHN"),("2John","THE SECOND EPISTLE OF S JOHN"),("3John","THE THIRD EPISTLE OF ST JOHN"),("Jude","THE GENERAL EPISTLE OF JUDE"),("Rev","THE REVELATION OF ST JOHN THE DIVINE")]
def tag(e):return e.tag.rsplit("}",1)[-1].lower()
def norm(s):return " ".join(re.sub(r"[^A-Z0-9]+"," ",s.upper()).split())
def heading(e):return " ".join("".join(n.itertext()) for n in e if tag(n)=="head")
def roman(x):
    if x.isdigit():return int(x)
    d=dict(I=1,V=5,X=10,L=50,C=100,D=500,M=1000)
    if not x or any(c not in d for c in x):return None
    return sum(-d[c] if i+1<len(x) and d[c]<d[x[i+1]] else d[c] for i,c in enumerate(x))
manifest=read(root/"manifest.json")
report={"sources":[],"books":{},"unmatched_headings":[],"duplicate_chapter_headings":[],"scope":"CC0 keyed historical transcription. Explicit book and chapter headings only; malformed or duplicate headings withheld. Not a verse-level index or a corrected print edition. Original TEI volumes retained."}
seen={}
for ix,(ident,rev,year) in enumerate(volumes):
    base=f"https://raw.githubusercontent.com/textcreationpartnership/{ident}/{rev}/"
    with urllib.request.urlopen(base+"README.md",timeout=120) as r:md=r.read().decode()
    assert "Creative" in md and "Commons 0 1.0 Universal" in md
    with urllib.request.urlopen(base+ident+".xml",timeout=180) as r:raw=r.read(40*1024*1024+1)
    assert len(raw)<40*1024*1024
    tree=ET.fromstring(raw)
    src=root/"poole-source"/(ident+".xml");src.parent.mkdir(parents=True,exist_ok=True);src.write_bytes(raw)
    sha=hashlib.sha256(raw).hexdigest();report["sources"].append({"id":ident,"year":year,"revision":rev,"sha256":sha,"bytes":len(raw),"license":"CC0 1.0","url":f"https://github.com/textcreationpartnership/{ident}"})
    expected=heads[:23] if ix==0 else heads[23:]
    candidates=collections.defaultdict(list)
    for e in tree.iter():
        if not tag(e).startswith("div"):continue
        h=norm(heading(e))
        for book,title in expected:
            if h==title or (book=="2Thess" and h.endswith(" II THESSALONIANS")):
                candidates[book].append(e)
    for book,title in expected:
        if len(candidates[book])!=1:
            report["unmatched_headings"].append({"book":book,"title":title,"matches":len(candidates[book])});continue
        e=candidates[book][0];by_ch=collections.defaultdict(list)
        for d in e.iter():
            if d is e or not tag(d).startswith("div"):continue
            hd=heading(d);m=re.match(r"^\s*(?:CHAP(?:TER)?|PSAL(?:M)?)\s*[.,:▪]?\s*([IVXLCDM]+|\d+)\b",hd,re.I)
            if not m:continue
            c=roman(m[1].upper())
            if c and c in manifest["books"].get(book,[]):by_ch[c].append(d)
        if len(manifest["books"].get(book,[]))==1 and not by_ch:by_ch[1]=[e]
        report["books"][book]={"chapter_count":0,"source":ident}
        for c,ds in sorted(by_ch.items()):
            if len(ds)!=1:report["duplicate_chapter_headings"].append({"book":book,"chapter":c,"headings":[heading(d) for d in ds]});continue
            d=ds[0];markup=ET.tostring(d,encoding="unicode")
            if not markup.strip():continue
            # Keep the raw XML of the chapter as well as the complete volume. No manufactured verse mapping.
            digest=hashlib.sha256(markup.encode()).hexdigest()
            file=root/book/(str(c)+".json");data=read(file)
            data["Poole"]={"entries":{digest:markup},"keys":{"0":digest},"granularity":"chapter","heading":heading(d),"volume":ident,"year":year,"source_url":f"https://github.com/textcreationpartnership/{ident}","license":"CC0 1.0"}
            write(file,data)
            assert read(file)["Poole"]["entries"][digest]==markup
            report["books"][book]["chapter_count"]+=1
        seen[book]=len(by_ch)
manifest["authors"].append({"id":"Poole","author":"Matthew Poole e continuadores","title":"Annotations upon the Holy Bible — EEBO-TCP 1683–1685","version":"EEBO-TCP","license":"CC0 1.0","license_url":"https://github.com/textcreationpartnership/A55363","source_type":"TEI XML","granularity":"chapter"})
write(root/"manifest.json",manifest)
report["indexed_chapters"]=sum(x["chapter_count"] for x in report["books"].values());report["indexed_books"]=sum(x["chapter_count"]>0 for x in report["books"].values())
assert report["indexed_chapters"]>0
write("docs/auditoria-poole-9.json",report)
print("Poole",report["indexed_books"],report["indexed_chapters"],"unmatched",report["unmatched_headings"],"duplicates",report["duplicate_chapter_headings"],flush=True)
