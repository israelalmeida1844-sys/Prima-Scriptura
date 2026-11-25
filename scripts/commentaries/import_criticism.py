#!/usr/bin/env python3
import collections,json,pathlib,re,xml.etree.ElementTree as ET
P=pathlib.Path
def write(p,x):
    p=P(p);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,ensure_ascii=False,separators=(",",":"))+"\n")
def read(p):return json.loads(P(p).read_text())
root=P("public/textual-criticism");stats=collections.Counter()
for f in sorted(P("/tmp/sblgnt/data/sblgntapp/xml").glob("*.xml")):
    b=f.stem;tree=ET.parse(f).getroot()
    if tree.tag!="book":continue
    rows=collections.defaultdict(list);ref=None
    for el in tree:
        if el.tag=="verse":
            m=re.search(r"(\d+):(\d+)(.*)$",el.text or "")
            assert m,(b,el.text);ref=m[1]+":"+m[2]
            label=el.text
        elif el.tag=="note":
            assert ref is not None
            rows[ref].append({"source_reference":label,"note":"".join(el.itertext()),"source_xml":ET.tostring(el,encoding="unicode").strip()});stats["greek_notes"]+=1
        elif el.tag!="book-name":raise ValueError((b,el.tag))
    for ref,notes in rows.items():
        stats["greek_refs"]+=1
    write(root/"greek"/(b+".json"),rows);stats["greek_books"]+=1
assert stats["greek_books"]==27
for f in sorted(P("public/interlinear-source-structure").glob("*.json")):
    b=f.stem;rows={}
    for ref,v in read(f).items():
        notes=[ev for ev in v["events"] if ev["element"]["tag"]=="note"]
        if notes:rows[ref]=notes;stats["hebrew_notes"]+=len(notes);stats["hebrew_refs"]+=1
    write(root/"hebrew"/(b+".json"),rows);stats["hebrew_books"]+=1
assert stats["hebrew_books"]==39
write("docs/auditoria-critica-textual-9.json",{"totals":dict(stats),"scope":"Official SBLGNT comparative edition apparatus transcribed verbatim and OSHB source notes preserved structurally. No manuscript witness claims or inference from absent notes. Greek apparatus uses source labels, including references spanning verses; absence of entry does not establish absence of variants.","sources":{"SBLGNT":{"url":"https://github.com/Faithlife/SBLGNT","revision":"d7f35adca9ec410e1d1499c63b4dd989d76c8d4d","license":"CC BY 4.0"},"OSHB":{"url":"https://github.com/openscriptures/morphhb","revision":"db6c5c9b46b8f39346f10915ddb1a70dcd429901","license":"CC BY 4.0"}}})
print(dict(stats))
