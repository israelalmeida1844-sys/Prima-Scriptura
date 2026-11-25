#!/usr/bin/env node
/** Concordâncias canônicas de Apocalipse 6 a partir dos 27 livros MorphGNT 6.12. */
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), source=process.env.MORPHGNT_DIR||'/tmp/prima-morphgnt';
const edition='aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d';
const books=['Mt','Mc','Lc','Jo','At','Rm','1Co','2Co','Gl','Ef','Fp','Cl','1Ts','2Ts','1Tm','2Tm','Tt','Fm','Hb','Tg','1Pe','2Pe','1Jo','2Jo','3Jo','Jd','Ap'];
const fileNames=['Mt','Mk','Lk','Jn','Ac','Ro','1Co','2Co','Ga','Eph','Php','Col','1Th','2Th','1Ti','2Ti','Tit','Phm','Heb','Jas','1Pe','2Pe','1Jn','2Jn','3Jn','Jud','Re'];
const lex=JSON.parse(fs.readFileSync('src/data/lexico-grego/apocalipse-6-1-17.json','utf8')).entries;
const used=new Map();
for(let v=1;v<=17;v++){
 const file=fs.readFileSync('src/data/texto-original/apocalipse/apocalipse-6-'+v+'.ts','utf8');
 const match=file.match(/export const apocalipse6v\d+\s*=\s*([\s\S]*);\s*$/);
 if(!match)throw Error('Dados ausentes em Ap 6:'+v);
 const data=JSON.parse(match[1]);
 for(const w of data.words){
  if(lex[w.strong]?.lemma!==w.lemma)throw Error('Lema/Strong inconsistente '+w.id);
  if(used.has(w.lemma)&&used.get(w.lemma)!==w.strong)throw Error('Strong divergente '+w.lemma);
  used.set(w.lemma,w.strong);
 }
}
const indices=new Map([...used.entries()].map(([lemma,strong])=>[lemma,{strong,lemma,lemmaTranslit:lex[strong].lemmaTransliteration,tokenCount:0,verseCount:0,bookDistribution:{},references:[],complete:true,corpusBooks:27,source:'SBL Greek New Testament via MorphGNT 6.12',sourceVersion:edition,license:'SBLGNT CC BY 4.0 / MorphGNT CC BY-SA 3.0; verificar termos originais',attribution:'SBL Greek New Testament; MorphGNT'}]));
for(let b=0;b<27;b++){
 const file=path.join(source,String(b+61)+'-'+fileNames[b]+'-morphgnt.txt');
 const content=fs.readFileSync(file,'utf8');if(!content.trim())throw Error('Livro vazio: '+file);
 const local=new Map();
 for(const line of content.split(/\r?\n/)){
  if(!line.trim())continue;
  const f=line.trim().split(/\s+/);
  if(f.length!==7||!/^\d{6}$/.test(f[0]))throw Error('Linha MorphGNT malformada: '+line);
  const item=indices.get(f[6]);if(!item)continue;
  const book=books[b],ref=book+' '+Number(f[0].slice(2,4))+':'+Number(f[0].slice(4,6));
  item.tokenCount++;
  item.bookDistribution[book]=(item.bookDistribution[book]||0)+1;
  if(!local.has(f[6]))local.set(f[6],new Set());
  local.get(f[6]).add(ref);
 }
 for(const [lemma,refs] of local)indices.get(lemma).references.push(...refs);
}
fs.mkdirSync('public/data/concordancia-grega',{recursive:true});
let created=0,retained=0,updated=0;
for(const item of indices.values()){
 item.verseCount=item.references.length;
 if(item.verseCount<1||item.verseCount>item.tokenCount)throw Error('Contagem inválida: '+item.strong);
 if(Object.values(item.bookDistribution).reduce((a,b)=>a+b,0)!==item.tokenCount)throw Error('Soma inconsistente: '+item.strong);
 const file=path.join('public/data/concordancia-grega',item.strong+'.json');
 let old=null;try{old=JSON.parse(fs.readFileSync(file,'utf8'))}catch{}
 if(old&&old.complete===true&&old.corpusBooks===27&&old.tokenCount===item.tokenCount&&old.verseCount===item.verseCount&&old.references?.length===item.verseCount){retained++;continue}
 fs.writeFileSync(file,JSON.stringify(item,null,2)+'\n');
 if(old)updated++;else created++;
}
console.log(JSON.stringify({bookCount:27,uniqueStrong:indices.size,created,updated,retained,sourceCommit:edition}));
