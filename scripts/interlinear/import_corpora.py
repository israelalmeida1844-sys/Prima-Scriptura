#!/usr/bin/env python3
"""Import source corpora locally; never invent missing linguistic fields."""
import argparse, json, pathlib, re, hashlib, xml.etree.ElementTree as ET
P=pathlib.Path
OT="Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal".split()
NT="Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev".split()
def greek(path,book):
    verses={}
    for n,line in enumerate(path.read_text(encoding="utf-8").splitlines(),1):
        if not line.strip(): continue
        fields=line.split()
        if len(fields)!=7: raise ValueError(f"{path}:{n}: invalid fields")
        ref,pos,morph,text,word,normalized,lemma=fields
        if not re.fullmatch(r"\d{6}",ref): raise ValueError(ref)
        key=f"{int(ref[2:4])}:{int(ref[4:6])}"
        verses.setdefault(key,[]).append(dict(text=text,word=word,normalized=normalized,lemma=lemma,pos=pos,morph=morph,gloss_pt=None))
    return verses
def hebrew(path,book):
    verses={}
    for v in ET.parse(path).getroot().findall(".//{*}verse"):
        ref=v.attrib["osisID"]
        parts=ref.split(".")
        if len(parts)!=3 or parts[0]!=book: raise ValueError(ref)
        key=f"{parts[1]}:{parts[2]}"
        if key in verses: raise ValueError(ref)
        # The OSIS note tree contains alternate readings (qere), not extra running words.
        # Keep the primary written text, and retain variants/empty markers separately.
        def token(w):
            return dict(text="".join(w.itertext()).strip(),lemma=w.get("lemma"),morph=w.get("morph"),source_id=w.get("id"),gloss_pt=None)
        def base_words(node):
            for child in node:
                tag=child.tag.rsplit("}",1)[-1]
                if tag in ("note","rdg","catchWord"): continue
                if tag=="w": yield child
                else: yield from base_words(child)
        raw=[token(w) for w in base_words(v)]
        words=[w for w in raw if w["text"]]
        annotations=[{"kind":"empty-source-marker","token":w} for w in raw if not w["text"]]
        for note in v.findall(".//{*}note"):
            readings=[{"type":rdg.get("type"),"tokens":[token(w) for w in rdg.findall(".//{*}w")]} for rdg in note.findall(".//{*}rdg")]
            if readings:
                annotations.append({"kind":"variant","catchword":note.findtext("{*}catchWord"),"readings":readings})
        if not words: raise ValueError(f"No primary text in {ref}: {ET.tostring(v,encoding='unicode')[:600]}")
        if annotations: words[-1]["verse_annotations"]=annotations
        verses[key]=words
    return verses
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--greek",type=P,required=True)
    p.add_argument("--hebrew",type=P,required=True)
    p.add_argument("--out",type=P,required=True)
    a=p.parse_args()
    data={}; manifest={}
    for i,book in enumerate(NT,61):
        paths=list(a.greek.glob(f"{i}-*-morphgnt.txt"))
        if len(paths)!=1: raise ValueError(f"Missing or duplicate {book}")
        path=paths[0]; data[book]=greek(path,book)
        manifest[book]={"source":"MorphGNT/SBLGNT","sha256":hashlib.sha256(path.read_bytes()).hexdigest()}
    for book in OT:
        path=a.hebrew/"wlc"/f"{book}.xml"
        data[book]=hebrew(path,book)
        manifest[book]={"source":"OSHB/WLC","sha256":hashlib.sha256(path.read_bytes()).hexdigest()}
    for book,verses in data.items():
        if not verses: raise ValueError(f"No verses parsed in {book}")
        for key, words in verses.items():
            if not words or any(not w["text"] for w in words): raise ValueError(f"Invalid tokens in {book} {key}")
        manifest[book].update(verses=len(verses),tokens=sum(map(len,verses.values())))
    a.out.mkdir(parents=True,exist_ok=True)
    for book,verses in data.items():
        (a.out/f"{book}.json").write_text(json.dumps(verses,ensure_ascii=False,separators=(",",":")),encoding="utf-8")
    (a.out/"manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
    print(f"{len(data)} books; {sum(x['tokens'] for x in manifest.values())} tokens")
if __name__=="__main__": main()
