#!/usr/bin/env python3
"""Stage 2: source-traceable gloss audit. Original corpus and Strong index remain unchanged."""
import argparse, collections, difflib, json, pathlib, re, bisect
from enrich_open import CODES, BOOKS, form, chapter_data, read, write
P=pathlib.Path
REV="2f53eafc80a98f1f3dab0e7d838f93ad451c5ff0"
def refkey(k): return tuple(map(int,k.split(":")))
def morph_base(w,ot): return w.get("morph") or "" if ot else (w.get("pos") or "")+(w.get("morph") or "")
def sig_base(w,ot): return (form(w["text"]),morph_base(w,ot))
def external_morph(row):
    raw=row[4] if len(row)>4 else ""
    # The external dataset inserts a delimiter after two-letter pronoun/article POS.
    if len(raw)==11 and raw[:2] in {"RA","RD","RI","RP","RR"} and raw[2]=="-":
        return raw[:2]+raw[3:]
    return raw
def sig_ext(row): return (form(row[0]),external_morph(row))
def checks(w,row,ot):
    if not row or form(w["text"])!=form(row[0]): return "forma_divergente"
    if len(row)<5 or not row[4] or external_morph(row)!=morph_base(w,ot): return "morfologia_divergente"
    if not ot:
        if len(row)<6 or not row[5] or form(w.get("lemma") or "")!=form(row[5]):return "lema_divergente"
    else:
        ids={int(n) for n in re.findall(r"\d+",w.get("lemma") or "")}
        m=re.fullmatch(r"H(\d+)[a-z]?",row[1] or "",re.I) if len(row)>1 else None
        if ids and m and int(m[1]) not in ids:return "identificador_lexical_divergente"
    return None
def partial_pairs(words,rows,ot):
    a=[sig_base(w,ot) for w in words];b=[sig_ext(r) for r in rows]
    ca=collections.Counter(a);cb=collections.Counter(b)
    # For a non-identical verse use only unique, monotone word+parse matches.
    pairs=[]
    for i,j,n in difflib.SequenceMatcher(None,a,b,autojunk=False).get_matching_blocks():
        for d in range(n):
            if ca[a[i+d]]==cb[b[j+d]]==1 and not checks(words[i+d],rows[j+d],ot):
                pairs.append((i+d,j+d))
    similarity=difflib.SequenceMatcher(None,a,b,autojunk=False).ratio()
    return similarity,pairs
def correction(book,key,w,row,v):
    # Explicitly attested lexical identity and contextual Portuguese wording.
    # Filemom 1:2 and Colossenses 4:17: Archippus is not Apphia.
    if not (book in ("Phlm","Col") and key in ("1:2","4:17")):return None
    if form(w.get("lemma") or "")==form("Ἄρχιππος") and row[2].strip().casefold()=="ápia" and re.search(r"\bArquipo\b",v.get("b",""),re.I):
        return "Arquipo"
    return None
def selftest():
    w={"text":"Ἀρχίππῳ","pos":"N-","morph":"----DSM-","lemma":"Ἄρχιππος"}
    row=["Ἀρχίππῳ","G751","Ápia","","N-----DSM-","Ἄρχιππος"]
    assert checks(w,row,False) is None
    assert checks({"text":"ὁ","pos":"RA","morph":"----NSM-","lemma":"ὁ"},["ὁ","G3588","o","","RA-----NSM-","ὁ"],False) is None
    assert checks({"text":"ὁ","pos":"RA","morph":"----NSM-","lemma":"ὁ"},["ὁ","G3588","o","","RA-----DSM-","ὁ"],False)=="morfologia_divergente"
    assert correction("Phlm","1:2",w,row,{"b":"e a Arquipo"})=="Arquipo"
    assert checks(w,[*row[:4],"N-----DSF-",row[5]],False)=="morfologia_divergente"
    assert checks(w,[*row[:5],"Ἀπφία"],False)=="lema_divergente"
    assert checks({"text":"א֑וֹר","morph":"HNcbsa","lemma":"216"},["א֑וֹר","H559","luz","","HNcbsa"],True)=="identificador_lexical_divergente"
    w2={"text":"λόγος","pos":"N-","morph":"----NSM-","lemma":"λόγος"}
    r2=["λόγος","G3056","palavra","","N-----NSM-","λόγος"]
    assert not partial_pairs([w2,w2],[r2,r2],False)[1]
def main():
    selftest()
    p=argparse.ArgumentParser()
    for k in ("base","old","aligned","out","report","details"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();summary={};totals=collections.Counter();outliers=[]; corrections=[]
    for bi,(code,book) in enumerate(zip(CODES,BOOKS)):
        ot=bi<39;base=read(a.base/(book+".json"));old=read(a.old/(book+".json"));ext={}
        for path in (a.aligned/code).glob("*.js"):
            d=chapter_data(path)
            for v in d["v"]:ext[f"{d['chapter']}:{v['n']}"]=v
        bkeys=sorted(base,key=refkey);ekeys=sorted(ext,key=refkey);epos={k:i for i,k in enumerate(ekeys)}
        anchors={i:epos[old[k]["source_ref"]] for i,k in enumerate(bkeys) if k in old and old[k].get("source_ref") in epos}
        anchor_keys=sorted(anchors);used={old[k]["source_ref"] for k in old if old[k].get("source_ref") in epos}
        counts=collections.Counter();new={};detail={}; frequencies=collections.defaultdict(collections.Counter)
        for ix,key in enumerate(bkeys):
            words=base[key];prev=old.get(key);counts["tokens"]+=len(words)
            if prev:
                ref=prev["source_ref"]; v=ext[ref];rows=v["w"]
                assert len(rows)==len(words)==len(prev["words"]), (book,key)
                assert all(form(w["text"])==form(r[0]) for w,r in zip(words,rows)),(book,key,"old sequence mismatch")
                pairs=list(enumerate(range(len(words))));method="sequencia_integral"
            else:
                # Restrict verse candidates to a neighborhood of already anchored verses.
                at=bisect.bisect_left(anchor_keys,ix);possible=set()
                for anchor in anchor_keys[max(0,at-1):at+1]:
                    estimate=anchors[anchor]+ix-anchor
                    possible.update(range(max(0,estimate-1),min(len(ekeys),estimate+2)))
                if key in epos:possible.add(epos[key])
                choices=[]
                for ei in possible:
                    rk=ekeys[ei]
                    if rk in used:continue
                    candidate=ext[rk].get("w",[])
                    score,ps=partial_pairs(words,candidate,ot)
                    if score>=.75 and len(ps)>=4 and len(ps)>=.40*min(len(words),len(candidate)):
                        choices.append((score,len(ps),rk,ps))
                choices.sort(reverse=True)
                if choices and (len(choices)==1 or choices[0][0]-choices[1][0]>=.08):
                    _,_,ref,pairs=choices[0];v=ext[ref];rows=v["w"];method="parcial_unico";used.add(ref);counts["partial_verses"]+=1
                else:ref=None;v=None;rows=[];pairs=[];method="pendente"
            mapping=dict(pairs);items=[];verse_pending=[]
            for i,w in enumerate(words):
                prior=dict(prev["words"][i]) if prev else {}
                previous=prior.get("gloss_pt");counts["old_glosses"]+=bool(previous)
                # Preserve existing Strong metadata; newly discovered Strong values are not imported in stage 2.
                item={k:value for k,value in prior.items() if k!="gloss_pt"}
                j=mapping.get(i);reason=None
                if j is None:reason="alinhamento_nao_demonstrado"
                else:
                    row=rows[j]
                    item["gloss_source"]={"ref":ref,"token":j,"method":method}
                    raw=row[2] if len(row)>2 and isinstance(row[2],str) else ""
                    assert not previous or previous==raw,(book,key,i,"old gloss not equal to source")
                    reason=checks(w,row,ot) or (None if raw.strip() else "glosa_ausente_na_fonte")
                    if not reason:
                        fixed=correction(book,key,w,row,v)
                        item["gloss_pt"]=fixed or raw
                        item["gloss_status"]="corrigida_pontualmente" if fixed else ("importada_verificada" if prev else "alinhada_automaticamente")
                        if fixed:
                            item["gloss_source"]["original_gloss"]=raw
                            item["gloss_source"]["evidence"]="Lema Ἄρχιππος e nome Arquipo na tradução portuguesa da fonte"
                            corrections.append({"book":book,"ref":key,"token":i,"from":raw,"to":fixed})
                            counts["corrected"]+=1
                        counts["glosses"]+=1
                        counts["retained" if previous else "added"]+=1
                        frequencies[(sig_base(w,ot),w.get("lemma"))][item["gloss_pt"]]+=1
                    elif raw.strip():item["gloss_candidate"]=raw
                if reason:
                    item["gloss_status"]="pendente";item["gloss_reason"]=reason;counts[reason]+=1
                    if previous:counts["quarantined"]+=1
                    verse_pending.append({"token":i,"reason":reason})
                items.append(item)
            new[key]={"source_ref":ref,"alignment_method":method,"words":items}
            if verse_pending:detail[key]=verse_pending
        # Contextual translations can legitimately differ; frequency anomalies are review candidates, not errors.
        for (sig,lemma),freq in frequencies.items():
            total=sum(freq.values())
            if total>=12 and freq.most_common(1)[0][1]>=.9*total:
                for gloss,n in freq.items():
                    if n==1 and len(outliers)<250:
                        outliers.append({"book":book,"form":sig[0],"morph":sig[1],"lemma":lemma,"gloss":gloss,"dominant":freq.most_common(1)[0],"count":total})
        counts["verses"]=len(base);counts["pending"]=counts["tokens"]-counts["glosses"]
        assert counts["old_glosses"]==counts["retained"]+counts["quarantined"]
        assert counts["glosses"]==counts["retained"]+counts["added"]
        summary[book]=dict(counts);totals.update(counts);write(a.out/(book+".json"),new);write(a.details/(book+".json"),detail)
    report={"stage":2,"status":"automated_review_complete","source_revision":REV,"source":"https://github.com/josafams/biblia-interlinear","license":"CC BY-SA 4.0","totals":dict(totals),"books":summary,"specific_corrections":corrections,"frequency_review_candidates_sample":outliers,"scope":"Source record verification, exact form and grammatical/lexical compatibility, conservative partial alignment. Not a semantic review of every gloss. No invented glosses or new Strong mappings."}
    write(a.report,report)
    print(json.dumps(dict(totals),ensure_ascii=False))
if __name__=="__main__":main()
