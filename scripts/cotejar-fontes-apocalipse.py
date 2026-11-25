#!/usr/bin/env python3
"""Auditoria de Ap 1–8 contra fontes fixadas. Não confunde cotejo de edições com colação de manuscritos."""
import json, re, sys, unicodedata as U
from pathlib import Path
from collections import defaultdict, Counter
from difflib import SequenceMatcher
import hashlib
root=Path('.')
corpus=Path(sys.argv[1]); apparatus=Path(sys.argv[2]); tr_path=Path(sys.argv[3])
apply='--apply' in sys.argv
counts=[20,29,22,11,14,17,17,13]
books='Mt Mc Lc Jo At Rm 1Co 2Co Gl Ef Fp Cl 1Ts 2Ts 1Tm 2Tm Tt Fm Hb Tg 1Pe 2Pe 1Jo 2Jo 3Jo Jd Ap'.split()
aliases=dict(zip('Mt Mk Lk Jn Ac Ro 1Co 2Co Ga Eph Php Col 1Th 2Th 1Ti 2Ti Tit Phm Heb Jas 1Pe 2Pe 1Jn 2Jn 3Jn Jud Re'.split(),books))
aliases.update(dict(zip('Mateus Marcos Lucas João Atos Romanos|1 Coríntios|2 Coríntios|Gálatas|Efésios|Filipenses|Colossenses|1 Tessalonicenses|2 Tessalonicenses|1 Timóteo|2 Timóteo|Tito|Filemom|Hebreus|Tiago|1 Pedro|2 Pedro|1 João|2 João|3 João|Judas|Apocalipse'.split('|'),books)) if False else {})
aliases.update({'Apocalipse':'Ap','Revelation':'Ap'})
def nfc(s):return U.normalize('NFC',s)
def wordkey(s):
 return ''.join(c for c in U.normalize('NFD',s.lower()) if U.category(c).startswith('L')).replace('ς','σ')
def greek_words(s):
 return re.findall(r"[\u0370-\u03ff\u1f00-\u1fff]+(?:[’᾽ʼ'])?",s)
def readverse(p):
 s=p.read_text();m=re.search(r'=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$',s)
 assert m,p
 return s,m,json.loads(m[1])
def putverse(p,s,m,j):
 new=s[:m.start(1)]+json.dumps(j,ensure_ascii=False,indent=2)+s[m.end(1):]
 if new!=s and apply:p.write_text(new)
def obj(p):return json.loads(p.read_text())
def put(p,j):
 if apply:p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
def blob(p):
 b=p.read_bytes();return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
assert blob(apparatus)=='231bdbe78cef3a64adbfa45be5837ee20838669f','Aparato não corresponde ao blob aprovado'
assert blob(tr_path)=='156a97f178205f9b450f2d11583de59559ab62a6','TR não corresponde ao blob aprovado'
app={};cur=None
for line in apparatus.read_text(encoding='utf-8-sig').splitlines():
 m=re.fullmatch(r'Revelation (\d+):(\d+)',line.strip())
 if m:cur=tuple(map(int,m.groups()));app[cur]=[]
 elif cur and line.strip():
  s=re.sub(r'^(?:\d+(?::\d+)?\s+|•\s*)','',line.strip())
  app[cur].append(' '.join(s.split()))
raw=obj(tr_path)
# A edição flat contém registros por versículo. Aceitar contêiner identificado, nunca inferir versículos por posição.
def records(x):
 if isinstance(x,list):
  for y in x:yield from records(y)
 elif isinstance(x,dict):
  if 'chapter' in x and 'verse' in x and 'greek_text' in x:yield x
  else:
   for y in x.values():
    if isinstance(y,(list,dict)):yield from records(y)
tr={}
for x in records(raw):
 if x.get('book_name_osis')=='Rev' or x.get('book_name') in ('Revelation','Revelation of John') or x.get('book_name_short') in ('REV','RE'):
  k=(int(x['chapter']),int(x['verse']));assert k not in tr,k;tr[k]=x['greek_text']
assert all((c,v) in tr for c,n in enumerate(counts,1) for v in range(1,n+1)),('TR incompleto',len(tr))
rows_by_verse=defaultdict(list); allrows=[]; files=sorted(corpus.glob('*-morphgnt.txt'))
assert len(files)==27
for b,p in zip(books,files):
 for line in p.read_text().splitlines():
  if not line.strip():continue
  r=line.split();assert len(r)==7,(p,line)
  c,v=int(r[0][2:4]),int(r[0][4:6]);allrows.append((b,c,v,r))
  if b=='Ap':rows_by_verse[c,v].append(r)
assert len(allrows)==137554
lex=obj(Path('src/data/lexico-grego/apocalipse-8-1-13.json'))['entries']
used=defaultdict(set); issues=[]; details=[]; all_ids=set()
generic=re.compile(r'não indicada|coordenativo ou subordinativo|elemento lexical no período|forma verbal da oração|função a revisar|conforme MorphGNT|glosa neste contexto|descrição lexical e a função sintática devem|função da forma deve ser lida|relação sintática a examinar|elemento discursivo|predicado verbal ou forma dependente',re.I)
def tr_diff(a,b):
 ka,kb=list(map(wordkey,a)),list(map(wordkey,b)); out=[]
 for op,i,j,k,l in SequenceMatcher(None,ka,kb,autojunk=False).get_opcodes():
  if op=='equal':continue
  left=' '.join(a[i:j]);right=' '.join(b[k:l])
  if op=='insert':out.append('acrescenta «'+right+'»'+(' após «'+a[i-1]+'»' if i else ' no início'))
  elif op=='delete':out.append('omite «'+left+'»')
  else:out.append('«'+left+'» → «'+right+'»')
 return out
# Corrigir somente dados verificáveis. A comparação lexical desconsidera acentos, espíritos, pontuação e caixa.
for c,n in enumerate(counts,1):
 for v in range(1,n+1):
  p=Path(f'src/data/texto-original/apocalipse/apocalipse-{c}-{v}.ts');s,m,j=readverse(p);rr=rows_by_verse[c,v]
  assert len(j['words'])==len(rr),(c,v,len(j['words']),len(rr))
  row={'reference':f'Ap {c}:{v}','tokens':len(rr),'corpusDiscrepancies':0,'glossPunctuation':0,'genericFiches':0}
  for w,r in zip(j['words'],rr):
   ident=w['id'];assert ident not in all_ids,ident;all_ids.add(ident)
   for field,expected in [('greek',r[4]),('lemma',r[6]),('morphologyCode',r[2]),('morphgntPos',r[1])]:
    if field=='morphgntPos' and field not in w:continue
    actual=w.get(field)
    if field=='greek':
     # Alguns dados legados ainda carregam a pontuação do campo surface, preservada pelo contrato.
     equal=nfc(actual or '') in (nfc(r[4]),nfc(re.sub(r'[⸀⸂⸃⸄⸅]','',r[3])))
    else:equal=nfc(actual or '')==nfc(expected)
    if not equal and ident=='ap5-10-11' and field=='morphologyCode' and actual=='3PAI-P--' and expected=='3FAI-P--' and r[4]=='βασιλεύουσιν':
     # O texto é presente, não futuro; a correção editorial preexistente é filologicamente necessária.
     row['documentedMorphGntException']='3FAI-P-- no corpus; 3PAI-P-- na forma βασιλεύουσιν.'
     equal=True
    if not equal:
     row['corpusDiscrepancies']+=1;issues.append({'id':ident,'field':field,'actual':actual,'expected':expected})
   used[w['strong']].add(r[6])
   if re.search(r'[?.!,;·:]',w['gloss']):row['glossPunctuation']+=1
   if generic.search(' '.join(str(x or '') for x in [w.get('partOfSpeech'),w.get('explanation'),(w.get('syntax') or {}).get('role')])):row['genericFiches']+=1
  dif=tr_diff([r[4] for r in rr],greek_words(tr[c,v]))
  ap=app.get((c,v),[])
  parts=[]
  if ap:parts.append('Aparato do SBLGNT (leituras das edições; antes de ] = leitura adotada): '+'; '.join(ap)+'.')
  else:parts.append('O aparato do SBLGNT não registra divergência entre as edições comparadas neste versículo (não equivale à ausência de variantes manuscritas).')
  if dif:parts.append('Cotejo lexical com o Textus Receptus de Scrivener (1894): '+'; '.join(dif)+'.')
  else:parts.append('O cotejo lexical com Scrivener (1894) não identificou diferença, desconsiderando acentuação, espíritos, caixa e pontuação.')
  # A comparação é reproduzível; não atribui testemunhos nem impacto semântico sem exame editorial.
  if (c,v)==(5,2):parts.append('A cópula explicitada e o dativo sem preposição mantêm o sentido da pergunta e da proclamação.')
  if (c,v)==(5,10):parts.append('O presente βασιλεύουσιν do SBLGNT contrasta com o futuro βασιλεύσουσιν do NA28/RP; Scrivener ainda muda a pessoa para a primeira do plural e o objeto αὐτούς para ἡμᾶς. As diferenças afetam o tempo e os participantes da ação de reinar.')
  j['textualNotes']=' '.join(parts)
  putverse(p,s,m,j)
  row['apparatusEntries']=len(ap);row['trDifferences']=len(dif);details.append(row)
assert len(details)==143 and len(all_ids)==3381
# Recontagem de índices pelos lemas efetivos no corpus; homógrafo δέω é distinguido pela forma.
# G1163 é a necessidade impessoal; G1210 é o verbo ligar. Não colapsar os dois.
necessity={'δει','εδει','δεον','δεοντα','δεοντοσ','δεοντι','δεη','δεησει','δεησειεν','δεοι','δειν','δεηση','δεησηται'}
def impersonal(r):return wordkey(r[4]) in necessity
def refkey(x):
 s=x if isinstance(x,str) else x.get('reference','')
 m=re.fullmatch(r'(.+?)\s+(\d+):(\d+)',s.strip())
 if not m:return s
 b,c,v=m.groups();return f'{aliases.get(b,b)} {int(c)}:{int(v)}'
concordance=[]; target=Path('public/data/concordancia-grega')
for strong,lemmas in sorted(used.items(),key=lambda x:int(x[0][1:])):
 p=target/(strong+'.json'); old=obj(p) if p.exists() else {}
 # Preserve accepted aliases and lemma breakdown documented by prior audits; no automatic new Strong assignments.
 entry=lex.get(strong,{})
 lemmas=set(lemmas)|set(entry.get('lemmaAliases',[]))
 lemmas|={x['lemma'] for x in old.get('lemmaBreakdown',[]) if 'lemma' in x}
 if strong=='G1163':lemmas={'δέω','δεῖ'}
 if strong=='G1210':lemmas={'δέω'}
 # Aliases verificados diretamente na edição fixada: Ap 12:9; 20:2, Ap 3:19 e 2Tm 2:20.
 if strong=='G1228':lemmas|={'Διάβολος','διάβολος'}
 if strong=='G2206':lemmas|={'ζηλόω','ζηλεύω'}
 if strong=='G5552':lemmas|={'χρύσεος','χρυσοῦς'}
 matched=[]
 for b,c,v,r in allrows:
  if nfc(r[6]) not in {nfc(x) for x in lemmas}:continue
  if strong=='G1163' and not impersonal(r):continue
  if strong=='G1210' and impersonal(r):continue
  matched.append((b,c,v,r))
 refs=list(dict.fromkeys(f'{b} {c}:{v}' for b,c,v,r in matched))
 dist=dict(Counter(b for b,c,v,r in matched))
 if not refs:
  issues.append({'strong':strong,'field':'concordance','reason':'no corpus occurrence','lemmas':sorted(lemmas)});continue
 previous_refs=[refkey(x) for x in old.get('references',[])]
 same=old.get('tokenCount')==len(matched) and old.get('verseCount')==len(refs) and set(previous_refs)==set(refs) and len(previous_refs)==len(refs)
 if strong in ('G1163','G266','G3745','G1228','G2206','G5552'):
  # Fix the three known failures only after direct corpus re-count. Preserve existing shape and reference excerpts when equivalent.
  # G1163 classification must be independently consistent with the prior verified 101 tokens; do not silently change a disputed homograph.
  if strong=='G1163' and len(matched)!=101:
   issues.append({'strong':strong,'field':'impersonal homograph','expectedPrior':101,'actual':len(matched),'forms':dict(Counter(r[4] for b,c,v,r in allrows if r[6]=='δέω'))})
  else:
   updated=dict(old);updated.update({'strong':strong,'tokenCount':len(matched),'verseCount':len(refs),'complete':True,'corpusBooks':27})
   if not same:
    if strong in ('G1228','G2206','G5552'):
     issues.append({'strong':strong,'field':'alias count still divergent','expected':old.get('tokenCount'),'actual':len(matched),'onlyOld':sorted(set(previous_refs)-set(refs)),'onlyCorpus':sorted(set(refs)-set(previous_refs))})
     continue
    updated.update({'references':refs,'bookDistribution':dist})
   if old!=updated:put(p,updated)
   same=True
 if not same:issues.append({'strong':strong,'field':'concordance','oldTokens':old.get('tokenCount'),'actualTokens':len(matched),'oldVerses':old.get('verseCount'),'actualVerses':len(refs),'lemmas':sorted(lemmas)})
 elif old.get('corpusBooks')!=27 and strong not in ('G1163','G266','G3745','G1228','G2206','G5552'):
  # Verified existing index: add missing corpus metadata only if content matches.
  if old.get('complete') is True:
   updated=dict(old);updated['corpusBooks']=27;put(p,updated)
  else:issues.append({'strong':strong,'field':'complete','actual':old.get('complete')})
 concordance.append({'strong':strong,'tokens':len(matched),'verses':len(refs),'matches':same,'lemmas':sorted(lemmas)})
report={'scope':'Ap 1:1–8:13','sourceCommit':'aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d','apparatusBlob':blob(apparatus),'trBlob':blob(tr_path),'verses':len(details),'tokens':len(all_ids),'corpusTokens':len(allrows),'concordancesChecked':len(concordance),'chapterDetails':[{'chapter':c,'verses':n,'tokens':sum(x['tokens'] for x in details if x['reference'].startswith(f'Ap {c}:')),'genericFiches':sum(x['genericFiches'] for x in details if x['reference'].startswith(f'Ap {c}:'))} for c,n in enumerate(counts,1)],'verseDetails':details,'concordanceDetails':concordance,'unresolved':issues,'limitations':['Diferenças entre edições, não colação direta de manuscritos. Impacto semântico, glosas, sintaxe e exegese requerem análise contextual.','Comparação TR lexical não substitui verificação ortográfica; as leituras do aparato são conservadas literalmente.']}
put(Path('docs/auditoria-fontes-apocalipse-1-8.json'),report)
print(json.dumps({k:v for k,v in report.items() if k not in ('verseDetails','concordanceDetails','unresolved')},ensure_ascii=False,indent=2))
print('Pendências de corpus e concordância: '+str(len(issues)))
print(json.dumps(issues[:40],ensure_ascii=False))
