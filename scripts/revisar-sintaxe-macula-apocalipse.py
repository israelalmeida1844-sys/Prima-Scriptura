#!/usr/bin/env python3
"""Apoio sintático de MACULA Greek SBLGNT (Clear Bible, CC BY 4.0).
As funções vêm de árvores sintáticas publicadas, não de inferências exclusivamente morfológicas.
Só substitui fichas genéricas com alinhamento inequívoco de palavra e verso.
"""
import sys,re,json,unicodedata as U,hashlib
from pathlib import Path
from collections import defaultdict,Counter
import xml.etree.ElementTree as ET
from difflib import SequenceMatcher
src=Path(sys.argv[1]); b=src.read_bytes(); assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()=='c9b3ea5c08ff2eabd137ef008310c11239b48d25'
tree=ET.fromstring(b); parents={child:parent for parent in tree.iter() for child in parent}
def key(s):return ''.join(c for c in U.normalize('NFD',(s or '').casefold()) if U.category(c).startswith('L')).replace('ς','σ')
def ref(x):
 m=re.search(r'(\d+):(\d+)!(\d+)$',x.attrib.get('ref',''))
 return tuple(map(int,m.groups())) if m else None
def form(x):return x.attrib.get('unicode') or x.text or x.attrib.get('normalized') or ''
def nodes(x):return sorted([n for n in x.iter('w') if ref(n)],key=ref)
byverse=defaultdict(list)
for x in tree.iter('w'):
 r=ref(x)
 if r and 1<=r[0]<=8:byverse[r[:2]].append(x)
for x in byverse.values():x.sort(key=ref)
role_names={'s':'sujeito','v':'predicado verbal','vc':'verbo de ligação','o':'objeto direto','io':'objeto indireto','o2':'segundo objeto','oc':'complemento do objeto','p':'predicativo','adv':'adjunto adverbial'}
pos_names={'N-':'Substantivo','A-':'Adjetivo','V-':'Verbo','RA':'Artigo definido','RP':'Pronome pessoal','RR':'Pronome relativo','RD':'Pronome demonstrativo','RI':'Pronome interrogativo','RX':'Pronome indefinido','P-':'Preposição','C-':'Conjunção','D-':'Advérbio','I-':'Interjeição','X-':'Partícula'}
cls_names={'noun':'Substantivo','verb':'Verbo','det':'Artigo ou determinante','conj':'Conjunção','pron':'Pronome','prep':'Preposição','adj':'Adjetivo','adv':'Advérbio','ptcl':'Partícula','num':'Numeral','int':'Interjeição'}
generic=re.compile(r'não indicada|coordenativo ou subordinativo|elemento lexical no período|forma verbal da oração|função a revisar|conforme MorphGNT|glosa neste contexto|descrição lexical e a função sintática devem|função da forma deve ser lida|relação sintática a examinar|elemento discursivo|predicado verbal ou forma dependente|núcleo nominal ou complemento|modificador nominal ou predicativo|determinante nominal; verificar|elemento pronominal, função segundo|introduz complemento preposicional$|^núcleo nominal$|^núcleo verbal$|^forma verbal$|^determinante nominal$|^elemento do período$|^modificador nominal$|^particípio$',re.I)
def phrase(g,token,max_words=8):
 ns=nodes(g); idx=ns.index(token) if token in ns else 0
 if len(ns)>max_words:
  start=max(0,min(idx-3,len(ns)-max_words)); end=start+max_words
  return ('… ' if start else '')+' '.join(form(x) for x in ns[start:end])+(' …' if end<len(ns) else '')
 return ' '.join(form(x) for x in ns)
def nearest_group(x):
 p=parents.get(x)
 while p is not None and p.tag!='wg':p=parents.get(p)
 return p
def getrole(x):
 p=x
 while p is not None:
  role=p.attrib.get('role')
  if role in role_names:return role,p
  p=parents.get(p)
 return None,None
def describe(x,w):
 group=nearest_group(x); role,rg=getrole(x); cls=x.attrib.get('class',''); label=cls_names.get(cls) or pos_names.get(w.get('morphgntPos'))
 if not label:return None
 direct=x.attrib.get('role')
 local=phrase(group,x) if group is not None else form(x)
 if direct in role_names:
  return role_names[direct].capitalize()+' da oração'
 if cls=='det' or w.get('morphgntPos')=='RA':
  start='Determinante do sintagma «'+local+'»'
 elif cls=='prep' or w.get('morphgntPos')=='P-':
  start='Preposição que introduz «'+local+'»'
 elif cls=='conj' or w.get('morphgntPos')=='C-':
  if group is None or len(nodes(group))<2:return None
  start='Conjunção que articula os constituintes de «'+local+'»'
 elif role and rg is group and x.attrib.get('head')=='true':
  return 'Núcleo de '+role_names[role]+' no sintagma «'+local+'»'
 elif group is not None and len(nodes(group))>=2:
  start=label+' no constituinte «'+local+'»'
 elif role:
  start=label+' integrante do '+role_names[role]
 else:return None
 if role and rg is not None:
  if rg is group:start+=' — '+role_names[role]+' da oração'
  else:start+=' — integrado ao constituinte com função de '+role_names[role]+' «'+phrase(rg,x)+'»'
 return start
# Revisão de glosas apenas em formas inequívocas, não por substituição global do lema.
glosses={
 'ἐκκλησία':{'ἐκκλησίαις':'igrejas','ἐκκλησιῶν':'igrejas','ἐκκλησίαι':'igrejas','ἐκκλησίας':'igreja'},
 'ἁμαρτία':{'ἁμαρτιῶν':'pecados','ἁμαρτίας':'pecados'},
 'πνεῦμα':{'πνεύματα':'espíritos','πνευμάτων':'espíritos'},
 'σφραγίς':{'σφραγῖδας':'selos','σφραγίδων':'selos','σφραγῖδες':'selos'},
 'βασιλεύς':{'βασιλεῖς':'reis','βασιλέων':'reis'},
 'νεκρός':{'νεκρῶν':'mortos','νεκροί':'mortos'},
 'βιβλίον':{'βιβλίον':'rolo','βιβλία':'rolos','βιβλίου':'rolo'},
 'γράφω':{'γράψον':'escreve','γράφω':'escrevo'},
 'λέγω':{'λέγει':'diz','λέγουσιν':'dizem','λέγων':'dizendo','λέγοντες':'dizendo'},
 'ἔχω':{'ἔχεις':'tens','ἔχω':'tenho','ἔχετε':'tendes','ἔχουσιν':'têm'},
 'ζάω':{'ζῇς':'vives','ζῶ':'vivo'},
 'θεός':{'θεός':'Deus','θεοῦ':'Deus','θεῷ':'Deus','θεόν':'Deus'},
 'ἄγγελος':{'ἀγγέλους':'anjos','ἀγγέλων':'anjos','ἄγγελοι':'anjos'},
 'ἱερεύς':{'ἱερεῖς':'sacerdotes'},
 'λόγος':{'λόγους':'palavras'},
 'θρόνος':{'θρόνοι':'tronos','θρόνους':'tronos','θρόνων':'tronos'},
}
# Ambiguous genitive singular / accusative plural are constrained by morphology before application.
normgl={l:{key(k):v for k,v in fs.items()} for l,fs in glosses.items()}
def correctgloss(w,previous):
 l=w['lemma'];g=w['gloss'];code=w.get('morphologyCode','')
 if l=='θεός':
  if g in ('o deus supremo','deus supremo','deus','Deus'):
   # If article already carries genitive/dative, no additional preposition.
   return 'Deus'
  return g
 if l=='ἐκκλησία' and key(w['greek'])==key('ἐκκλησίας'):
  if len(code)>5 and code[5]=='P':return 'igrejas'
  return 'igreja'
 if l=='ἁμαρτία' and key(w['greek'])==key('ἁμαρτίας'):
  return 'pecados' if len(code)>5 and code[5]=='P' else g
 if l=='μέγας' and previous and previous['lemma']=='φωνή':
  return 'altas' if len(code)>5 and code[5]=='P' else 'alta'
 if l in normgl and key(w['greek']) in normgl[l]:
  # Preserve contextual modifiers or idiomatic complements rather than overwrite a correct differentiated gloss.
  proposed=normgl[l][key(w['greek'])]
  bad=(g.lower() in ['escrever','dizer','tinha','viver','espírito','pecado','igreja','assembleia','rei','morto','selo','livro','palavra','sacerdote','anjo','trono','dourado','livros','o deus supremo'])
  if bad:return proposed
 return g
counts=[20,29,22,11,14,17,17,13];results=[];unmatched=[];unclear=[]
for c,n in enumerate(counts,1):
 row={'chapter':c,'verses':n,'tokens':0,'aligned':0,'rolesUpdated':0,'classUpdated':0,'explanationsUpdated':0,'glossesUpdated':0,'translationsUpdated':0,'unmatched':0}
 for v in range(1,n+1):
  p=Path(f'src/data/texto-original/apocalipse/apocalipse-{c}-{v}.ts');s=p.read_text();m=re.search(r'=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$',s);assert m,p
  d=json.loads(m[1]);words=d['words'];row['tokens']+=len(words)
  ns=byverse.get((c,v),[]);a=[key(w['greek']) for w in words];b=[key(form(x)) for x in ns]
  # Only exact verse alignment; otherwise report and do not transfer uncertain syntactic roles.
  alignment=dict(enumerate(ns)) if a==b and len(ns)==len(words) else {}
  if not alignment:unmatched.append({'verse':f'Ap {c}:{v}','site':a,'source':b});row['unmatched']+=len(words)
  row['aligned']+=len(alignment)
  invariants=[(w['id'],w['greek'],w['lemma'],w['strong'],w.get('morphologyCode'),w.get('morphgntPos'),w.get('trailingPunctuation'),(w.get('syntax') or {}).get('clauseId')) for w in words]
  for i,w in enumerate(words):
   x=alignment.get(i);syn=w.get('syntax')
   pos=w.get('morphgntPos')
   if pos in pos_names and (generic.search(w.get('partOfSpeech','')) or w.get('partOfSpeech') in ('Em revisão','Classificação em revisão',pos)):
    w['partOfSpeech']=pos_names[pos];row['classUpdated']+=1
   if x is not None and syn:
    oldrole=syn.get('role','');oldexp=w.get('explanation','')
    isgeneric=generic.search(oldrole) or generic.search(oldexp)
    if isgeneric:
     new=describe(x,w)
     if new:
      if generic.search(oldrole) and new!=oldrole:syn['role']=new;row['rolesUpdated']+=1
      if generic.search(oldexp):
       w['explanation']=syn['role']+'. Análise contextual baseada nas árvores sintáticas MACULA Greek (SBLGNT); a morfologia da forma é apresentada no campo próprio.'
       row['explanationsUpdated']+=1
     else:unclear.append({'id':w['id'],'role':oldrole,'treeRole':x.attrib.get('role'),'treeClass':x.attrib.get('class')})
   new=correctgloss(w,words[i-1] if i else None)
   if new!=w['gloss']:w['gloss']=new;row['glossesUpdated']+=1
  old=d['translation'];t=old
  if len(words)>1 and words[0]['lemma']=='καί' and key(words[1]['greek']) in [key('εἶδον'),key('ἤκουσα')] and re.match(r'^(Vi|Ouvi)\b',t):t='E '+t[0].lower()+t[1:]
  if any(w['lemma']=='βιβλίον' for w in words) and c in (1,5,6):
   t=re.sub(r'\blivro(s)?\b',lambda x:'rolo'+(x[1] or ''),t,flags=re.I)
  if not any(q in t for q in ['"','«','»','“','”']):
   match=re.search(r'\b(?:dizendo|disse|dizia|dizem|proclamava|clamou|clamavam|gritou|gritavam|diz):\s+(.+)$',t,re.I)
   if match:t=t[:match.start(1)]+'"'+match[1]+'"'
  if t!=old:d['translation']=t;row['translationsUpdated']+=1
  assert invariants==[(w['id'],w['greek'],w['lemma'],w['strong'],w.get('morphologyCode'),w.get('morphgntPos'),w.get('trailingPunctuation'),(w.get('syntax') or {}).get('clauseId')) for w in words],p
  p.write_text(s[:m.start(1)]+json.dumps(d,ensure_ascii=False,indent=2)+s[m.end(1):])
 results.append(row)
report={'source':'MACULA Greek SBLGNT, Clear Bible, CC BY 4.0','sourceURL':'https://github.com/Clear-Bible/macula-greek/tree/8423afe47b9e8f24b7772e808af45c7159a6fe7e','sourceBlob':'c9b3ea5c08ff2eabd137ef008310c11239b48d25','chapters':results,'unmatchedVerses':unmatched,'unresolvedSyntax':unclear,'limitations':'Alinhamento lexical por verso; funções do treebank não equivalem à revisão humana de todas as nuances semânticas, exegéticas ou gramaticais. Glosas corrigidas somente onde regras conservadoras se aplicam.'}
Path('docs/auditoria-sintatica-macula-apocalipse-1-8.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ('unmatchedVerses','unresolvedSyntax')},ensure_ascii=False,indent=2))
print('Versículos sem alinhamento: '+str(len(unmatched))+'; funções sem resolução automática: '+str(len(unclear)))
