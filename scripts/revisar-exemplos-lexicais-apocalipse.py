#!/usr/bin/env python3
"""Cotejo de exemplos lexicais e correções de definições em Ap 1–8.
Não atribui sentidos inéditos a exemplos sem comprovação. As notas de contexto
dos exemplos automáticos são retiradas da ocorrência auditada, não inventadas."""
import re,json,sys,unicodedata as U
from pathlib import Path
from collections import defaultdict,Counter
corpus=Path(sys.argv[1]);files=sorted(corpus.glob('*-morphgnt.txt'));assert len(files)==27
books='Mt Mc Lc Jo At Rm 1Co 2Co Gl Ef Fp Cl 1Ts 2Ts 1Tm 2Tm Tt Fm Hb Tg 1Pe 2Pe 1Jo 2Jo 3Jo Jd Ap'.split()
full=['Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo','2 Timóteo','Tito','Filemom','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João','3 João','Judas','Apocalipse']
other='Mt Mk Lk Jn Ac Ro 1Co 2Co Ga Eph Php Col 1Th 2Th 1Ti 2Ti Tit Phm Heb Jas 1Pe 2Pe 1Jn 2Jn 3Jn Jud Re'.split()
aliases={k.casefold():v for names in (books,full,other) for k,v in zip(names,books)}
def nfc(x):return U.normalize('NFC',x)
def key(s):return ''.join(c for c in U.normalize('NFD',(s or '').casefold()) if U.category(c).startswith('L')).replace('ς','σ')
def parse_ref(s):
 m=re.fullmatch(r'(.+?)\s+(\d+):(\d+)',s.strip())
 if not m:return None
 b,c,v=m.groups();b=aliases.get(b.casefold())
 return (b,int(c),int(v)) if b else None
def fmt(r):return f'{r[0]} {r[1]}:{r[2]}'
def words(s):return re.findall(r"[\u0370-\u03ff\u1f00-\u1fff]+(?:[’᾽ʼ'])?",s or '')
def readverse(c,v):
 p=Path(f'src/data/texto-original/apocalipse/apocalipse-{c}-{v}.ts');s=p.read_text();m=re.search(r'=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$',s)
 return p,s,m,json.loads(m[1])
byref=defaultdict(list)
for b,p in zip(books,files):
 for line in p.read_text().splitlines():
  if not line.strip():continue
  t=line.split();assert len(t)==7
  byref[(b,int(t[0][2:4]),int(t[0][4:6]))].append(t)
assert sum(map(len,byref.values()))==137554
counts=[20,29,22,11,14,17,17,13];used=defaultdict(list);verse_data={}
for c,n in enumerate(counts,1):
 for v in range(1,n+1):
  p,s,m,j=readverse(c,v);rr=byref['Ap',c,v];assert len(j['words'])==len(rr)
  verse_data['Ap',c,v]=j
  for i,(w,t) in enumerate(zip(j['words'],rr)):
   assert key(w['greek'])==key(t[4]),w['id'];used[w['strong']].append((('Ap',c,v),i,w,t))
definitions=json.loads(Path('docs/definicoes-lexicais-apocalipse-1-8.json').read_text())
alias={'G1163':{'δέω','δεῖ'},'G1228':{'διάβολος','Διάβολος'},'G2206':{'ζηλόω','ζηλεύω'},'G5552':{'χρυσοῦς','χρύσεος'},'G894':{'ἄψινθος','Ἄψινθος'}}
necessity={'δει','εδει','δεον','δεοντα','δεοντοσ','δεοντι','δεη','δεησει','δεησειεν','δεοι','δειν','δεηση','δεησηται'}
def matches(id,row,entry):
 lemmas={t[6] for _,_,_,t in used.get(id,[])}|set(entry.get('lemmaAliases',[]))|alias.get(id,set())|{entry.get('lemma','')}
 if id=='G1163':return row[6] in lemmas and key(row[4]) in necessity
 if id=='G1210':return row[6] in lemmas and key(row[4]) not in necessity
 return nfc(row[6]) in {nfc(x) for x in lemmas}
generic=re.compile(r'glosa editorial|a cotejar|a revisar|não indicada|pendente|consulte o versículo|a glosa é contextual e não substitui|a função da forma deve ser lida|glosa neste contexto|exemplo contextual da ocorrência|exemplo da ocorrência|preliminar|exemplo no contexto',re.I)
def make_example(ref,index,w,row,old=None):
 x=dict(old or {})
 # Exemplo de forma, não tradução de um fragmento de oração.
 x.update(reference=fmt(ref),greek=row[4],translation=w['gloss'])
 if 'wordForm' in x:x['wordForm']=row[4]
 if 'transliteration' in x:x['transliteration']=w['transliteration']
 if 'source' in x:x['source']='SBLGNT / MorphGNT 6.12'
 role=(w.get('syntax') or {}).get('role')
 x['explanation']=f'Forma em {fmt(ref)}: {w["morphology"]}.'+(f' Função: {role}.' if role else '')
 return x
stats=[];unresolved=[];unique=set();data_def_changes=0
for p in sorted(Path('src/data/lexico-grego').glob('apocalipse-*.json')):
 j=json.loads(p.read_text());entries=j.get('entries')
 if not isinstance(entries,dict):continue
 st={'file':p.name,'entriesChecked':0,'definitionsUpdated':0,'examplesChecked':0,'examplesRepaired':0,'examplesRemoved':0,'examplesAdded':0,'unresolved':0}
 for id,e in entries.items():
  if id not in used:continue
  st['entriesChecked']+=1;unique.add(id)
  senses=e.get('senses',[])
  if not senses:
   unresolved.append({'file':p.name,'strong':id,'reason':'no senses'});st['unresolved']+=1;continue
  # Keep curated multivalent senses intact; expand short or generic dictionary entries.
  if id in definitions and len(senses)==1:
   sense=senses[0];olddef=sense.get('definition','')
   if olddef!=definitions[id]['definition']:
    sense.update(definitions[id]);st['definitionsUpdated']+=1
  for se in senses:
   out=[]
   for x in se.get('examples',[]):
    st['examplesChecked']+=1;r=parse_ref(x.get('reference',''))
    if r is None or not byref.get(r):
     # A ranged or noncanonical reference is flagged, never silently declared verified.
     unresolved.append({'file':p.name,'strong':id,'reason':'reference not resolved','example':x.get('reference')});st['unresolved']+=1;out.append(x);continue
    rr=byref[r];snippet=[key(z) for z in words(x.get('greek',''))];rk=[key(z[4]) for z in rr]
    starts=[i for i in range(len(rk)-len(snippet)+1) if snippet and rk[i:i+len(snippet)]==snippet]
    target=[i for i,t in enumerate(rr) if matches(id,t,e)]
    if not target:
     st['examplesRemoved']+=1;continue
    verified=any(i<=t<i+len(snippet) for i in starts for t in target)
    # Where a wordForm is supplied it must itself include a verified target occurrence.
    if verified and x.get('wordForm'):
     wf=[key(z) for z in words(x['wordForm'])]
     verified=any(i<=t<i+len(snippet) and key(rr[t][4]) in wf for i in starts for t in target)
    local=verse_data.get(r)
    generic_example=generic.search(x.get('explanation',''))
    if (not verified or generic_example) and local:
     chosen=next((i for i in target if any(a<=i<a+len(snippet) for a in starts)),target[0])
     w=local['words'][chosen]
     if w['strong']==id:
      new=make_example(r,chosen,w,rr[chosen],x);st['examplesRepaired']+=1;out.append(new);continue
    if not verified:
     # The example as written is not a verified example of this lemma at this reference.
     # Do not preserve false Greek snippets; a single-sense fallback is added below.
     st['examplesRemoved']+=1;continue
    x['reference']=fmt(r);out.append(x)
   if not out and len(senses)==1:
    r,i,w,t=used[id][0];out=[make_example(r,i,w,t)];st['examplesAdded']+=1
   if not out:
    unresolved.append({'file':p.name,'strong':id,'reason':'sense has no verified example','sense':se.get('id')});st['unresolved']+=1
   se['examples']=out
 p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n');stats.append(st)
# Align the lexical definition displayed for the selected token where a short/generic
# inherited meaning is plainly inadequate. Do not overwrite specific contextual notes.
for c,n in enumerate(counts,1):
 for v in range(1,n+1):
  p,s,m,j=readverse(c,v);change=False
  for w in j['words']:
   d=definitions.get(w['strong'])
   if not d:continue
   meaning=w.get('meanings','')
   if not meaning or len(meaning)<25 or generic.search(meaning):
    if meaning!=d['definition']:w['meanings']=d['definition'];data_def_changes+=1;change=True
  if change:p.write_text(s[:m.start(1)]+json.dumps(j,ensure_ascii=False,indent=2)+s[m.end(1):])
report={'scope':'Ap 1:1–8:13; léxicos cumulativos e compartilhados','source':'MorphGNT 6.12, commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d','strongsChecked':len(unique),'tokenDefinitionsUpdated':data_def_changes,'files':stats,'unresolved':unresolved,'limitations':'A correspondência do exemplo ao lema e ao versículo é verificável; a seleção de uma acepção semântica específica não é comprovada apenas pela coincidência lexical.'}
Path('docs/auditoria-lexical-apocalipse-1-8.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('files','unresolved')},ensure_ascii=False))
print(json.dumps({k:sum(x[k] for x in stats) for k in ('entriesChecked','definitionsUpdated','examplesChecked','examplesRepaired','examplesRemoved','examplesAdded','unresolved')},ensure_ascii=False))
print(json.dumps(unresolved[:40],ensure_ascii=False))
