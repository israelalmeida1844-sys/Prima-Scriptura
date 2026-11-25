#!/usr/bin/env python3
"""Stage 7: typed concordance, exact references, compact per-key postings."""
import argparse, collections, hashlib, json, pathlib, re, unicodedata
from enrich_open import BOOKS, read, write, shard
P=pathlib.Path
MODES=("original","lema","strong","transliteracao","glosa","morfologia")
def exact(s):
    return unicodedata.normalize("NFC",s.strip().lower())
def loose(s):
    # Keep word boundaries, punctuation and Hebrew consonants; remove combining marks only.
    return " ".join("".join(c for c in unicodedata.normalize("NFD",s.lower()) if not unicodedata.category(c).startswith("M")).split())
def normalize(s,mode,strict):
    if mode=="strong":
        m=re.fullmatch(r"([gh])0*(\d+)",s.strip().lower())
        return m[1]+str(int(m[2])) if m else ""
    if mode=="morfologia":return " ".join(s.strip().split())
    if mode in ("original","lema"):s=s.replace("/","")
    return exact(s) if strict else loose(s)
def token_values(w,s,g,t,m,heads,lang):
    # Hebrew/Aramaic lemma search uses recorded dictionary headwords, not invented lemmas.
    lemma=[w["lemma"]] if lang=="grc" and w.get("lemma") else []
    if lang!="grc":
        for i in s["ids"]:lemma.extend(heads.get(i,[]))
    code=(w["pos"]+" "+w["morph"]) if w.get("pos") else w["morph"]
    return {"original":[w.get("word") or w["text"]],"lema":lemma,"strong":s["ids"],"transliteracao":[t["value"]] if t.get("value") else [],"glosa":[g["gloss_pt"]] if g.get("gloss_pt") else [],"morfologia":[code]}
def keys_for(values):
    for mode,vals in values.items():
        for strict in ([True] if mode in ("strong","morfologia") else [True,False]):
            for key in sorted({normalize(s,mode,strict) for s in vals}-{""}):
                yield mode+"/"+("exato" if strict else "flexivel")+"/"+key
def morph_filters(entry):
    # A filter group matches all chosen features in one component, never across two morphemes.
    return [p["campos"] for p in entry["partes"]]
def main():
    p=argparse.ArgumentParser()
    for k in ("public","out","report"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();root=a.public
    heads={}
    for f in (root/"interlinear-lexicon/cards").glob("*.json"):
        for ident,c in read(f).items():
            if ident.startswith("H"):heads[ident]=sorted({e["headword"] for e in c["entries"] if e["headword"]})
    morph=read(root/"interlinear-morphology/catalogo.json")
    index=collections.defaultdict(list);stats=collections.Counter();features=collections.defaultdict(set);books={};samples={}
    # Per-book dense reference table; postings encode [book ordinal, verse ordinal, token ordinal].
    for bi,b in enumerate(BOOKS):
        base=read(root/"interlinear-corpus"/(b+".json"));strong=read(root/"interlinear-strong-review/tokens"/(b+".json"));gloss=read(root/"interlinear-gloss-review"/(b+".json"));trans=read(root/"interlinear-transliteration"/(b+".json"))
        assert set(base)==set(strong)==set(gloss)==set(trans)
        refs=list(base);rows=[];cnt=collections.Counter()
        for vi,ref in enumerate(refs):
            words=base[ref];ss=strong[ref];gg=gloss[ref]["words"];tt=trans[ref]
            assert len(words)==len(ss)==len(gg)==len(tt)
            tokens=[]
            for i,(w,s,g,t) in enumerate(zip(words,ss,gg,tt)):
                lang="grc" if bi>=39 else "arc" if w["morph"].startswith("A") else "hbo"
                code=(w["pos"]+" "+w["morph"]) if w.get("pos") else w["morph"]
                values=token_values(w,s,g,t,morph,heads,lang)
                loc=[bi,vi,i]
                for k in keys_for(values):index[k].append(loc)
                for mode,vals in values.items():
                    if any(vals):cnt[mode]+=1
                for part in morph_filters(morph[code]):
                    for field,value in part.items():features[field].add(value)
                tokens.append([w["text"],lang,code,g.get("gloss_pt"),t.get("value"),s["ids"],w.get("lemma")])
                cnt["tokens"]+=1;cnt[lang]+=1
            rows.append(tokens)
        write(a.out/"books"/(b+".json"),{"refs":refs,"rows":rows})
        books[b]={"verses":len(refs),**cnt};stats.update(cnt)
    assert stats["tokens"]==443061
    # Each shard has disjoint keys. Cap transport by separate mode namespaces.
    shards=collections.defaultdict(dict);modecounts=collections.Counter()
    for k,v in index.items():
        mode,kind,q=k.split("/",2);assert v==sorted(v) and len(v)==len({tuple(x) for x in v})
        shards[(mode,kind,shard(q))][q]=v;modecounts[mode+"/"+kind]+=len(v)
    for (mode,kind,h),v in shards.items():write(a.out/"index"/mode/kind/(h+".json"),v)
    # Independently compare the Strong postings to the previously audited concordance.
    for f in (root/"interlinear-strong-review/concordancia").glob("*.json"):
        for k,v in read(f).items():
            if re.fullmatch(r"[hg]\d+",k):
                actual=index["strong/exato/"+k]
                converted=[[BOOKS[x[0]],read_book(a.out,BOOKS[x[0]])["refs"][x[1]],x[2]] for x in actual]
                assert converted==v,k
    # Independent full scan of emitted reference table and membership of every posting.
    checked=collections.Counter()
    for bi,b in enumerate(BOOKS):
        table=read_book(a.out,b);base=read(root/"interlinear-corpus"/(b+".json"));st=read(root/"interlinear-strong-review/tokens"/(b+".json"));gl=read(root/"interlinear-gloss-review"/(b+".json"));tr=read(root/"interlinear-transliteration"/(b+".json"))
        for vi,ref in enumerate(table["refs"]):
            for i,w in enumerate(base[ref]):
                row=table["rows"][vi][i];s=st[ref][i];g=gl[ref]["words"][i];t=tr[ref][i]
                assert row[0]==w["text"] and row[3]==g.get("gloss_pt") and row[4]==t.get("value") and row[5]==s["ids"]
                for k in keys_for(token_values(w,s,g,t,morph,heads,row[1])):
                    checked[k]+=1
    assert set(checked)==set(index) and all(len(v)==checked[k] for k,v in index.items())
    # Verify serialized shards, not merely in-memory values.
    for (mode,kind,h),v in shards.items():
        assert read(a.out/"index"/mode/kind/(h+".json"))==v
    meta={"books":BOOKS,"book_stats":books,"features":{k:sorted(v) for k,v in features.items()},"shards":["/".join(x) for x in sorted(shards)],"modes":MODES}
    write(a.out/"manifest.json",meta)
    report={"stage":7,"books":66,"verses":sum(x["verses"] for x in books.values()),"totals":dict(stats),"distinct_index_keys":len(index),"postings_by_mode":dict(modecounts),"index_shards":len(shards),"bytes":sum(f.stat().st_size for f in a.out.rglob("*.json")),"max_shard_bytes":max(f.stat().st_size for f in (a.out/"index").rglob("*.json")),"books_detail":books,"scope":"Primary corpus tokens only; exact matching or optional removal of diacritics. Hebrew/Aramaic lemma queries use possible STEP headwords associated with audited Strong IDs, not selected contextual senses. Gloss search is exact entire contextual gloss. Morphological filter applies to one component, not cross-morpheme conjunction. Counts are tokens, not distinct verses."}
    write(a.report,report);print(json.dumps({k:v for k,v in report.items() if k!="books_detail"},ensure_ascii=False))
_CACHE={}
def read_book(out,b):
    if b not in _CACHE:_CACHE[b]=read(out/"books"/(b+".json"))
    return _CACHE[b]
if __name__=="__main__":main()
