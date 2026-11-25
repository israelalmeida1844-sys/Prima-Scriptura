#!/usr/bin/env python3
"""Stage 6: source-attributed lexical cards; no inferred definitions or sense assignments."""
import argparse, collections, hashlib, pathlib, re, json, unicodedata
from html.parser import HTMLParser
from enrich_open import BOOKS, read, write, shard
from audit_strong import parse_id, lemma_key, STEP_REV
P=pathlib.Path
class Plain(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.parts=[]
    def handle_data(self,s):self.parts.append(s)
    def handle_starttag(self,tag,attrs):
        if tag in ("br","p","div","li"):self.parts.append("\n")
    def handle_endtag(self,tag):
        if tag in ("p","div","li"):self.parts.append("\n")
def plain(s):
    p=Plain();p.feed(s);return re.sub(r"[ \t]+"," ","".join(p.parts)).strip()
def load(path,prefix):
    groups=collections.defaultdict(list)
    for n,line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(),1):
        cols=line.split("\t")
        if len(cols)<8:continue
        ident=parse_id(cols[0],prefix)
        if not ident:continue
        base,suffix=ident;head=cols[3].strip()
        if not head:continue
        entry={"source_id":cols[0].strip(),"disambiguated_id":cols[1].strip(),"unique_id":cols[2].strip(),"headword":head,"transliteration":cols[4].strip(),"lexical_morphology":cols[5].strip(),"gloss_en":plain(cols[6]),"definition_en":plain(cols[7]),"source_line":n}
        if entry["gloss_en"] or entry["definition_en"]:groups[base].append(entry)
    assert len(groups)>4000,(path,len(groups))
    return groups
def key_for(lang,lemma):
    return lang+":"+unicodedata.normalize("NFC",lemma.strip().lower())
def selftest():
    assert plain("<b>word</b><br>speech")=="word\nspeech"
    assert key_for("grc","λόγος")==key_for("grc","ΛΌΓΟΣ")
    assert key_for("grc","ὅρος")!=key_for("grc","ὄρος")
def main():
    selftest()
    p=argparse.ArgumentParser()
    for k in ("base","strong","gloss","greeklex","hebrewlex","out","report","details"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();g=load(a.greeklex,"G");h=load(a.hebrewlex,"H");lex={**h,**g}
    assert any(lemma_key(x["headword"])==lemma_key("λόγος") for x in lex["G3056"])
    assert "H1254" in lex and "H216" in lex
    counts=collections.Counter();books={};used=set();occ=collections.defaultdict(list);lemmas=collections.defaultdict(list);glosses=collections.defaultdict(collections.Counter);missing=collections.Counter();examples={}
    for bi,b in enumerate(BOOKS):
        base=read(a.base/(b+".json"));strong=read(a.strong/(b+".json"));gloss=read(a.gloss/(b+".json"))
        assert set(base)==set(strong)==set(gloss)
        stats=collections.Counter();pending={}
        for ref,words in base.items():
            ids=strong[ref];gs=gloss[ref]["words"];assert len(words)==len(ids)==len(gs)
            stats["verses"]+=1
            for i,(w,s,t) in enumerate(zip(words,ids,gs)):
                lang="grc" if bi>=39 else "arc" if w["morph"].startswith("A") else "hbo"
                stats["tokens"]+=1;stats[lang]+=1
                loc=[b,ref,i];lemma=w.get("lemma") or ""
                if lang=="grc" and lemma:lemmas[key_for(lang,lemma)].append(loc)
                found=[]
                for ident in s["ids"]:
                    entries=lex.get(ident,[])
                    if entries:
                        found.append(ident);used.add(ident);occ[ident].append(loc)
                        if t.get("gloss_pt"):glosses[ident][t["gloss_pt"]]+=1
                    else:missing[ident]+=1
                if found:
                    stats["with_lexicon"]+=1;stats[lang+"_with_lexicon"]+=1
                    if lang=="grc":
                        if any(lemma_key(x["headword"])==lemma_key(lemma) for ident in found for x in lex[ident]):stats["greek_headword_match"]+=1
                        else:stats["greek_id_only"]+=1
                    if lang not in examples:examples[lang]={"book":b,"ref":ref,"token":i,"original":w["text"],"ids":found}
                elif s["status"]=="afixo_sem_numero":stats["affix_without_id"]+=1
                elif not s["ids"]:stats["unresolved_strong"]+=1
                else:stats["missing_lexicon"]+=1
                if not found and s["status"]!="afixo_sem_numero":
                    pending.setdefault(ref,[]).append({"token":i,"ids":s["ids"],"status":s["status"]})
        assert stats["tokens"]==stats["with_lexicon"]+stats["affix_without_id"]+stats["unresolved_strong"]+stats["missing_lexicon"]
        counts.update(stats);books[b]=dict(stats);write(a.details/(b+".json"),pending)
    byshard=collections.defaultdict(dict);lemmaindex=collections.defaultdict(dict)
    for ident in sorted(used):
        entries=lex[ident];records=occ[ident]
        card={"id":ident,"source":"TBESG" if ident.startswith("G") else "TBESH","entries":entries,"occurrence_count":len(records),"observed_portuguese_glosses":[{"gloss":x,"count":n} for x,n in glosses[ident].most_common(30)]}
        byshard[shard(ident.lower())][ident]=card
    for key,refs in lemmas.items():lemmaindex[shard(key)][key]=refs
    for s,cards in byshard.items():write(a.out/"cards"/(s+".json"),cards)
    for s,refs in lemmaindex.items():write(a.out/"lemas"/(s+".json"),refs)
    # Validate exact counts against already audited concordance; never imply total occurrences in other editions.
    for ident,refs in occ.items():
        concord=read_cached(a.strong.parent/"concordancia"/(shard(ident.lower())+".json"))
        assert concord[ident.lower()]==refs,ident
    assert counts["tokens"]==443061 and counts["verses"]==31140
    assert counts["with_lexicon"]+counts["affix_without_id"]+counts["unresolved_strong"]+counts["missing_lexicon"]==443061
    assert sum(map(len,lemmas.values()))==137554
    report={"stage":6,"status":"source_lexicon_linked","books":66,"totals":dict(counts),"cards":len(used),"greek_cards":sum(x.startswith("G") for x in used),"hebrew_aramaic_cards":sum(x.startswith("H") for x in used),"source_entries":sum(len(lex[x]) for x in used),"distinct_greek_lemmas":len(lemmas),"missing_ids":dict(missing),"books_detail":books,"examples":examples,"source":{"name":"STEP Bible TBESG/TBESH","url":"https://github.com/STEPBible/STEPBible-Data","revision":STEP_REV,"license":"CC BY 4.0","greek_sha256":hashlib.sha256(a.greeklex.read_bytes()).hexdigest(),"hebrew_sha256":hashlib.sha256(a.hebrewlex.read_bytes()).hexdigest()},"scope":"Lexical definitions remain in English as published (HTML converted to plain text). Portuguese contextual glosses are observed corpus renderings, not dictionary definitions. All available source senses for each audited ID are retained; OSHB homonym suffixes are not assumed equivalent to STEP disambiguation codes. Greek ID-only matches explicitly labeled in UI; unresolved IDs withheld. Exact Greek lemma index uses Unicode canonical/case equivalence. Hebrew/Aramaic counts are by Strong ID, not disambiguated sense. No academic review of each definition or assignment of contextual senses."}
    write(a.report,report);print(json.dumps({"totals":dict(counts),"cards":len(used),"source_entries":report["source_entries"],"lemmas":len(lemmas)},ensure_ascii=False))
_CACHE={}
def read_cached(p):
    if p not in _CACHE:_CACHE[p]=read(p)
    return _CACHE[p]
if __name__=="__main__":main()
