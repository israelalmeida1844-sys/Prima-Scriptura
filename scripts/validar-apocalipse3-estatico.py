#!/usr/bin/env python3
"""Valida os dados preservados de Ap 3, sem reexecutar geradores editoriais obsoletos."""
import json,re,sys
from pathlib import Path
root=Path(sys.argv[1]);limit=int(sys.argv[2]);rows={}
for line in (root/'87-Re-morphgnt.txt').read_text().splitlines():
 t=line.split()
 if t and t[0].startswith('2703'):rows.setdefault(int(t[0][4:]),[]).append(t)
count=0; strongs=set()
for v in range(1,limit+1):
 p=Path(f'src/data/texto-original/apocalipse/apocalipse-3-{v}.ts')
 d=json.loads(re.search(r'=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$',p.read_text())[1])
 assert len(d['words'])==len(rows[v]),p
 for w,t in zip(d['words'],rows[v]):
  assert w['greek'] in (t[4],re.sub(r'[⸀⸂⸃⸄⸅]','',t[3])),w['id']
  assert (w['lemma'],w['morphologyCode'],w['morphgntPos'])==(t[6],t[2],t[1]),w['id']
  assert re.fullmatch(r'G\d+',w['strong']),w['id']
  idx=json.loads(Path(f"public/data/concordancia-grega/{w['strong']}.json").read_text())
  assert idx['complete'] is True and idx['corpusBooks']==27,w['strong']
  assert idx['verseCount']==len(idx['references']),w['strong']
  assert idx['tokenCount']==sum(idx['bookDistribution'].values()),w['strong']
  def is_here(x):
   if isinstance(x,str):return x in (f'Ap 3:{v}',f'Re 3:{v}',f'Apocalipse 3:{v}')
   return x.get('book') in ('Ap','Re','Apocalipse') and int(x.get('chapter',0))==3 and int(x.get('verse',0))==v
  assert any(is_here(x) for x in idx['references']),(w['id'],w['strong'])
  count+=1;strongs.add(w['strong'])
if limit==22:assert count==525
print(f'AP 3:1–{limit}: {count} unidades; {len(strongs)} índices verificados; nenhum dado regenerado.')
