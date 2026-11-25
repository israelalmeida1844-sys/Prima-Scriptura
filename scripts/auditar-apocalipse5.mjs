#!/usr/bin/env node
/** Validação local de Apocalipse 5 sem modificar arquivos */
import {readFile,access} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const read=async(path)=>readFile(join(root,path),'utf8');
const failures=[],warnings=[],ids=new Set(),strongs=new Set();
const lex=JSON.parse(await read('src/data/lexico-grego/apocalipse-5-1-14.json'));
const expectedCounts=[18,18,20,14,29,37,12,31,34,14,26,24,50,12];
let tokens=0;
for(let n=1;n<=14;n++){
  const source=await read('src/data/texto-original/apocalipse/apocalipse-5-'+n+'.ts');
  const match=source.match(/export const apocalipse5v\d+\s*=\s*([\s\S]*);\s*$/);
  if(!match){failures.push('Export inválido em 5:'+n);continue}
  const d=JSON.parse(match[1]);
  if(d.chapter!==5||d.verse!==n||d.reference!=='Apocalipse 5:'+n)failures.push('Identificação errada em 5:'+n);
  if(!d.words?.length)failures.push('Sem palavras em 5:'+n);
  if(d.words?.length!==expectedCounts[n-1])failures.push('Contagem de tokens incorreta em 5:'+n);
  if(!d.syntacticNotes?.length)failures.push('Sem sintaxe em 5:'+n);
  if(!d.translation||!d.exegeticalNotes?.length)failures.push('Conteúdo editorial incompleto em 5:'+n);
  if(n===10){
    const form=d.words.find(w=>w.greek==='βασιλεύουσιν');
    if(!form || form.morphologyCode!=='3PAI-P--' || form.morphgntOriginalMorphologyCode!=='3FAI-P--')failures.push('Ap 5:10: forma verbal não documentada corretamente');
  }
  for(const w of d.words||[]){
    tokens++;
    if(ids.has(w.id))failures.push('ID duplicado '+w.id);ids.add(w.id);
    if(!/^G\d+$/.test(w.strong)||!lex.entries[w.strong])failures.push('Strong sem léxico '+w.id);
    if(/[⸂⸃⸀⸁]/u.test(w.greek))failures.push('Marcador de aparato em token '+w.id);
    if(!w.shortMorph||!w.morphologyCode||!w.syntax?.role)failures.push('Token incompleto '+w.id);
    strongs.add(w.strong);
  }
}
if(tokens!==339)failures.push('Esperados 339 tokens, encontrados '+tokens);
const page=await read('src/pages/comentarios/apocalipse/capitulo-5/[versiculo].astro');
const hub=await read('src/pages/comentarios/apocalipse/capitulo-5/index.astro');
if(!page.includes('length: 14')||!page.includes('length:14')||!page.includes('number < 14'))failures.push('Seletor/limites das rotas incorretos');
if((hub.match(/"number":\s*\d+/g)||[]).length!==14)failures.push('Índice não contém 14 cards');
const partial=[];
for(const strong of strongs){
  try{
    const corpus=JSON.parse(await read('public/data/concordancia-grega/'+strong+'.json'));
    if(corpus.complete!==true||corpus.corpusBooks!==27||!Array.isArray(corpus.references))partial.push(strong);
  }catch{partial.push(strong)}
}
if(partial.length)warnings.push('Concordâncias não homologadas: '+partial.join(', '));
const result={verses:14,tokens,lexiconStrong:strongs.size,errors:failures,warnings};
console.log(JSON.stringify(result,null,2));
if(failures.length)process.exitCode=1;
if(partial.length)process.exitCode=2;
