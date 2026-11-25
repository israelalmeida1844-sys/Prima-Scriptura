#!/usr/bin/env python3
"""Independent source audit; no change to token numbering used by the enrichment."""
import argparse, collections, hashlib, json, pathlib, re, xml.etree.ElementTree as ET
P=pathlib.Path
OT="Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal".split()
NT="Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev".split()
NS="{http://www.bibletechnologies.net/2003/OSIS/namespace}"
def read(p): return json.loads(p.read_text(encoding="utf-8"))
def write(p,d):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(d,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def require(ok, message):
    if not ok: raise ValueError(message)
def structure(e):
    return {"tag":e.tag.split("}")[-1],"attributes":e.attrib,"text":e.text,"tail":e.tail,"children":[structure(c) for c in e]}
def main():
    p=argparse.ArgumentParser()
    for k in ("greek","hebrew","base","out","report"): p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args(); manifest=read(a.base/"manifest.json")
    require(set(manifest)==set(OT+NT),"Book inventory differs")
    require({f.stem for f in a.base.glob("*.json")}==set(OT+NT+["manifest"]),"Unexpected or missing corpus file")
    stats={}; issues=[]; ids=set(); aggregate=collections.Counter()
    for book in OT+NT:
        old=read(a.base/(book+".json")); counts=collections.Counter(); expected={}; fidelity={}
        if book in NT:
            i=NT.index(book)+61
            paths=list(a.greek.glob(f"{i}-*-morphgnt.txt"));require(len(paths)==1,book+" source count")
            src=paths[0]
            for line in src.read_text(encoding="utf-8").splitlines():
                if not line.strip():continue
                ref,pos,morph,text,word,normalized,lemma=line.split()
                require(re.fullmatch(r"\d{6}",ref) and int(ref[:2])==i-60,book+" bad source reference "+ref)
                require(pos in "A- C- D- I- N- P- RA RD RI RP RR V- X-".split(),book+" unknown POS "+pos)
                require(re.fullmatch(r"[123-][PIFAXY-][AMP-][IDS ONP-][NGDAV-][SP-][MFN-][CS-]".replace(" ",""),morph),book+" unknown parsing "+morph)
                key=f"{int(ref[2:4])}:{int(ref[4:])}"
                expected.setdefault(key,[]).append((text,word,normalized,lemma,pos,morph))
            fields=("text","word","normalized","lemma","pos","morph")
        else:
            src=a.hebrew/"wlc"/(book+".xml"); root=ET.parse(src).getroot()
            parents={child:parent for parent in root.iter() for child in parent}
            for v in root.iter(NS+"verse"):
                b,c,n=v.attrib["osisID"].split(".");require(b==book,book+" source ref mismatch")
                key=c+":"+n;require(key not in expected,book+" duplicate verse "+key)
                rows=[]; events=[]; text_parts=[]; slot=0
                for el in v.iter():
                    if el is v:continue
                    ancestor=parents.get(el); in_note=False
                    while ancestor is not None and ancestor is not v:
                        if ancestor.tag in {NS+"note",NS+"rdg",NS+"catchWord"}: in_note=True;break
                        ancestor=parents.get(ancestor)
                    if in_note:continue
                    tag=el.tag.split("}")[-1]
                    if tag=="w":
                        t="".join(el.itertext()).strip()
                        if not t:
                            counts["empty_source_markers"]+=1
                            events.append({"before_token":slot,"element":structure(el)})
                            continue
                        lemma=el.get("lemma");morph=el.get("morph");sid=el.get("id")
                        rows.append((t,lemma,morph,sid))
                        if sid:
                            if sid in ids:counts["repeated_source_ids"]+=1
                            ids.add(sid)
                        else:counts["missing_source_ids"]+=1
                        if not morph:counts["missing_morphology"]+=1
                        elif morph.startswith("A"):counts["aramaic_tokens"]+=1
                        elif morph.startswith("H"):counts["hebrew_tokens"]+=1
                        else:counts["other_morphology_prefix"]+=1
                        if not lemma:counts["missing_lexical_ids"]+=1
                        text_parts.append(t.replace("/",""));slot+=1
                    elif tag=="seg":
                        t="".join(el.itertext())
                        counts["segments"]+=1
                        if el.get("type")=="x-maqqef":
                            counts["maqqef"]+=1
                        events.append({"before_token":slot,"element":structure(el)})
                        text_parts.append(t)
                    elif tag=="note":
                        counts["notes"]+=1
                        counts["qere_readings"]+=sum(r.get("type")=="x-qere" for r in el.iter(NS+"rdg"))
                        events.append({"before_token":slot,"element":structure(el)})
                expected[key]=rows
                # Preserve all original element attributes and order, including punctuation and variants.
                fidelity[key]={"events":events,"source_tree":structure(v)}
            fields=("text","lemma","morph","source_id")
            write(a.out/(book+".json"),fidelity)
        require(sha(src)==manifest[book]["sha256"],book+" source SHA mismatch")
        require(set(old)==set(expected),book+" verse inventory mismatch")
        for key,rows in expected.items():
            actual=[tuple(t.get(f) for f in fields) for t in old[key]]
            require(actual==rows,f"{book} {key}: source-token mismatch")
            counts["tokens"]+=len(rows)
        counts["verses"]=len(expected);counts["chapters"]=len({k.split(":")[0] for k in expected})
        require(counts["tokens"]==manifest[book]["tokens"] and counts["verses"]==manifest[book]["verses"],book+" manifest totals mismatch")
        stats[book]=dict(counts);aggregate.update(counts)
    report={"status":"source_fields_match","books":len(stats),"totals":dict(aggregate),"books_detail":stats,"scope":"Exact comparison of imported primary token fields to pinned source revisions; OSHB XML fidelity sidecars preserve source-tree order, notes and segments. This does not validate source scholarship or compare other critical editions.","issues":issues,"revisions":{"morphgnt":(a.base/"morphgnt-revision.txt").read_text().strip(),"oshb":(a.base/"oshb-revision.txt").read_text().strip()}}
    write(a.report,report)
    print(json.dumps({"books":len(stats),"totals":dict(aggregate)},ensure_ascii=False))
if __name__=="__main__": main()
