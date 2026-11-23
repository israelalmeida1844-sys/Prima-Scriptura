/**
 * Enriquecer a curadoria lexical com expressões hebraicas efetivas do WLC/OSHB.
 * NÃO inventar trechos: extrair as palavras de cada versículo no corpus v.2.2;
 * validar que o Strong analisado ocorre no versículo escolhido.
 * Os comentários semânticos são curadoria editorial, distinta da verificação
 * mecânica da ocorrência; exigem homologação humana final.
 */
import {lexicalEntries} from './dados-editoriais-lexico-genesis.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';

const BOOKS={'Gn':'Gen','Êx':'Exod','Lv':'Lev','Nm':'Num','Dt':'Deut','Js':'Josh','Jz':'Judg','Rt':'Ruth','1Sm':'1Sam','2Sm':'2Sam','1Rs':'1Kgs','2Rs':'2Kgs','1Cr':'1Chr','2Cr':'2Chr','Ed':'Ezra','Ne':'Neh','Et':'Esth','Jó':'Job','Sl':'Ps','Pv':'Prov','Ec':'Eccl','Ct':'Song','Is':'Isa','Jr':'Jer','Lm':'Lam','Ez':'Ezek','Dn':'Dan','Os':'Hos','Jl':'Joel','Am':'Amos','Ob':'Obad','Jn':'Jonah','Mq':'Mic','Na':'Nah','Hc':'Hab','Sf':'Zeph','Ag':'Hag','Zc':'Zech','Ml':'Mal'};
const out='src/data/lexico-hebraico/genesis-1-1-8.json';
const accent=/[\u0591-\u05AF\u05BD\u05BF\u05C0\u05C4\u05C5\u05C7]/g;
const htmlDecode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
function parseWord(attrs,body){
 const lemma=attrs.match(/\blemma="([^"]+)"/)?.[1]??'';
 const strongs=[...new Set(lemma.split(/[\/\s]+/).filter(n=>/^\d{1,5}$/.test(n)).map(n=>'H'+Number(n)))];
 const hebrew=htmlDecode(body.replace(/<[^>]*>/g,'')).replace(accent,'').trim();
 return {strongs,hebrew};
}
function extract(xml,ref,requestedStrong) {
 const [abb,chapter,verse]=ref.match(/^([^ ]+) (\d+):(\d+)$/)?.slice(1)??[];
 if(!BOOKS[abb])throw Error('Livro não identificado: '+ref);
 const osis=BOOKS[abb]+'.'+Number(chapter)+'.'+Number(verse);
 const m=[...xml.matchAll(/<verse\b([^>]*\bosisID="([^"]+)"[^>]*)>([\s\S]*?)<\/verse>/g)].find(x=>x[2]===osis);
 if(!m)throw Error('Versículo inexistente no OSHB: '+ref+' ('+osis+')');
 const words=[...m[3].matchAll(/<w\b([^>]*)>([\s\S]*?)<\/w>/g)].map(x=>parseWord(x[1],x[2])).filter(w=>w.hebrew);
 const at=words.findIndex(w=>w.strongs.includes(requestedStrong));
 if(at<0)throw Error('Strong '+requestedStrong+' não ocorre em '+ref+' no WLC/OSHB');
 // Amostra textual direta: no máximo 3 unidades, com a palavra-alvo ao centro.
 const start=Math.max(0,at-1),end=Math.min(words.length,at+2);
 const snippet=words.slice(start,end).map(x=>x.hebrew).join(' ');
 if(!snippet.includes(words[at].hebrew))throw Error('Falha de integridade textual em '+ref);
 return {hebrew:snippet,headword:words[at].hebrew};
}
async function fetchBook(osis){
 const url='https://raw.githubusercontent.com/openscriptures/morphhb/v.2.2/wlc/'+osis+'.xml';
 for(let n=1;n<=3;n++){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),60000);
  try{
   const r=await fetch(url,{signal:controller.signal});
   if(!r.ok)throw Error('HTTP '+r.status);
   const xml=await r.text();
   if(!xml.includes('<verse ')||!xml.includes('osisID='))throw Error('XML OSHB inválido');
   return xml;
  }catch(error){if(n===3)throw Error(osis+': '+String(error));await new Promise(ok=>setTimeout(ok,n*1000))}
  finally{clearTimeout(timer)}
 }
}
async function main(){
 const ids=Object.keys(lexicalEntries);
 if(ids.length!==36)throw Error('Esperados exatamente 36 lemas, obtidos '+ids.length);
 const cache=new Map();
 const targets=new Set();
 let exampleCount=0;
 for(const [id,entry] of Object.entries(lexicalEntries)){
  if(id!==entry.strong||!entry.lemma||!entry.lemmaTransliteration||entry.senses.length===0)throw Error('Lema incompleto '+id);
  const concordance=JSON.parse(await readFile('public/data/concordancia-hebraica/'+id+'.json','utf8'));
  if(concordance.complete!==true||!Array.isArray(concordance.references))throw Error('Índice Strong incompleto '+id);
  for(const sense of entry.senses){
   if(!sense.label||!sense.definition||!sense.examples.length)throw Error('Sentido sem exemplo: '+id);
   for(const ex of sense.examples){
    if(!concordance.references.includes(ex.reference))throw Error('Ref não consta da concordância '+id+' '+ex.reference);
    const abb=ex.reference.split(' ')[0];
    if(!BOOKS[abb])throw Error('Livro não reconhecido '+ex.reference);
    targets.add(BOOKS[abb]);exampleCount++;
    if(!ex.translation||!ex.explanation)throw Error('Falta explicação '+id+'/'+ex.reference);
   }
  }
 }
 // Download apenas dos livros que aparecem nos exemplos; jamais modificar índices de 39 livros.
 const books=[...targets];
 for(let p=0;p<books.length;p+=4){
  await Promise.all(books.slice(p,p+4).map(async book=>cache.set(book,await fetchBook(book))));
 }
 const enriched=structuredClone(lexicalEntries);
 for(const [id,entry] of Object.entries(enriched)){
  for(const sense of entry.senses){
   for(const ex of sense.examples){
    const book=BOOKS[ex.reference.split(' ')[0]];
    const verified=extract(cache.get(book),ex.reference,id);
    ex.hebrew=verified.hebrew;
    ex.wordForm=verified.headword;
    ex.source='Westminster Leningrad Codex / OSHB v.2.2';
   }
  }
 }
 await mkdir(resolve('src/data/lexico-hebraico'),{recursive:true});
 await writeFile(out,JSON.stringify({scope:'Gênesis 1:1–8',source:'WLC/OSHB v.2.2',attribution:'Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb',lexicalNote:'Acepções e comentários são sínteses editoriais. As formas hebraicas e a ocorrência do lema foram conferidas com o WLC/OSHB; classificações semânticas dependem de revisão exegética humana.',entries:enriched},null,2)+'\n');
 console.log('VALIDAÇÃO: '+ids.length+' lemas, '+exampleCount+' exemplos, '+books.length+' livros consultados no WLC/OSHB v.2.2. Arquivo: '+out);
}
main().catch(error=>{console.error(error);process.exitCode=1});
