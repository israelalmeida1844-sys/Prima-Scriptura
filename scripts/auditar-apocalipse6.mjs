#!/usr/bin/env node
import fs from 'node:fs';
const base='src/data/texto-original/apocalipse/apocalipse-6-';
const failures=[],tokens=new Set(),strong=new Set(),expected=[23,23,13,27,30,26,14,45,25,26,30,27,19,17,33,26,13];
let count=0;
const lex=JSON.parse(fs.readFileSync('src/data/lexico-grego/apocalipse-6-1-17.json','utf8')).entries;
for(let n=1;n<=17;n++){
 const file=fs.readFileSync(base+n+'.ts','utf8');
 const match=file.match(/export const apocalipse6v\d+\s*=\s*([\s\S]*);\s*$/);
 if(!match)throw Error('Export inválido: '+n);
 const d=JSON.parse(match[1]);
 if(d.chapter!==6||d.verse!==n||d.reference!=='Apocalipse 6:'+n)failures.push('Referência incorreta '+n);
 if(d.words.length!==expected[n-1])failures.push('Quantidade incorreta '+n+' '+d.words.length);
 if(!d.translation||!d.syntacticNotes?.length||!d.exegeticalNotes?.length||!d.textualNotes)failures.push('Notas ausentes '+n);
 if(!lex[d.words[0]?.strong])failures.push('firstLexicon ausente em 6:'+n);
 const component=fs.readFileSync('src/components/TextoOriginalApocalipse6v'+n+'.astro','utf8');
 if(!component.includes('data-original-apocalipse-6-'+n)||!component.includes('apocalipse-6-1-17.json'))failures.push('Componente desatualizado '+n);
 for(const cl of ['original-word','strong-number','word-transliteration','word-greek','word-gloss','word-morph','lexicon-card','concordance-panel']){
  if(!component.includes(cl))failures.push('Camada interlinear ausente '+n+': '+cl);
 }
 for(const w of d.words){
  count++;
  if(tokens.has(w.id))failures.push('ID duplicado '+w.id);tokens.add(w.id);
  if(lex[w.strong]?.lemma!==w.lemma)failures.push('Lema/Strong incorreto '+w.id);
  if(!w.greek||!w.transliteration||!w.gloss||!w.shortMorph||!w.morphologyCode)failures.push('Token incompleto '+w.id);
  if(/[⸀⸂⸃⸁]/u.test(w.greek))failures.push('Sinal de aparato exposto '+w.id);
  strong.add(w.strong);
 }
}
if(count!==417)failures.push('Tokens: '+count);
const chapter=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-6/index.astro','utf8');
const route=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-6/[versiculo].astro','utf8');
if((chapter.match(/"number":\s*\d+/g)||[]).length!==17)failures.push('Cards não totalizam 17');
if(!chapter.includes('APOCALIPSE 6:'))failures.push('Rótulo incorreto');
if(!route.includes('length: 17')||!route.includes('length:17')||!route.includes('number < 17'))failures.push('Seletor ou getStaticPaths inválido');
if(!route.includes('TextoOriginalApocalipse6v17'))failures.push('Import 17 ausente');
const css=fs.readFileSync('src/styles/apocalipse-lexicon.css','utf8');
const wrap=css.match(/\.interlinear-words\s*\{[^}]*\}/)?.[0]||'';
if(!wrap.includes('flex-wrap: wrap')||!wrap.includes('display: flex')||!wrap.includes('width: 100%'))failures.push('CSS interlinear sem wrap');
if(/overflow-x:\s*(auto|scroll)|min-width:\s*max-content/.test(wrap))failures.push('Rolagem horizontal indevida no interlinear');
for(const s of strong){
 const p='public/data/concordancia-grega/'+s+'.json';
 if(!fs.existsSync(p)){failures.push('Concordância ausente '+s);continue}
 const d=JSON.parse(fs.readFileSync(p,'utf8'));
 if(d.complete!==true||d.corpusBooks!==27||d.references?.length!==d.verseCount||Object.values(d.bookDistribution).reduce((a,b)=>a+b,0)!==d.tokenCount)failures.push('Concordância inválida '+s);
}
console.log(JSON.stringify({verses:17,tokens:count,uniqueStrong:strong.size,errors:failures},null,2));
if(failures.length)process.exitCode=1;
