/**
 * Prima Scriptura — concordâncias exaustivas para cinco lemas inéditos em Ap 1:2.
 * Base completa: os 27 livros de MorphGNT/SBLGNT 6.12, commit imutável
 * aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d.
 * Não altera os 20 índices de Ap 1:1.
 */
import {mkdir,writeFile} from 'node:fs/promises';
const version='aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d';
const root='https://raw.githubusercontent.com/morphgnt/sblgnt/'+version+'/';
const books=[
 ['61-Mt','Mt'],['62-Mk','Mc'],['63-Lk','Lc'],['64-Jn','Jo'],
 ['65-Ac','At'],['66-Ro','Rm'],['67-1Co','1Co'],['68-2Co','2Co'],
 ['69-Ga','Gl'],['70-Eph','Ef'],['71-Php','Fp'],['72-Col','Cl'],
 ['73-1Th','1Ts'],['74-2Th','2Ts'],['75-1Ti','1Tm'],['76-2Ti','2Tm'],
 ['77-Tit','Tt'],['78-Phm','Fm'],['79-Heb','Hb'],['80-Jas','Tg'],
 ['81-1Pe','1Pe'],['82-2Pe','2Pe'],['83-1Jn','1Jo'],['84-2Jn','2Jo'],
 ['85-3Jn','3Jo'],['86-Jud','Jd'],['87-Re','Ap']
];
const newStrong={
 'G3140':{lemma:'μαρτυρέω',lemmaTranslit:'martyreō'},
 'G3056':{lemma:'λόγος',lemmaTranslit:'logos'},
 'G3141':{lemma:'μαρτυρία',lemmaTranslit:'martyria'},
 'G3745':{lemma:'ὅσος',lemmaTranslit:'hosos'},
 'G3708':{lemma:'ὁράω',lemmaTranslit:'horaō'}
};
const lemmaToStrong=new Map(Object.entries(newStrong).map(([id,x])=>[x.lemma,id]));
const results=Object.fromEntries(Object.entries(newStrong).map(([id,lex])=>[id,{
 strong:id,lemma:lex.lemma,lemmaTranslit:lex.lemmaTranslit,
 tokenCount:0,verseCount:0,bookDistribution:{},references:[],
 complete:true,source:'SBL Greek New Testament / MorphGNT',
 sourceVersion:'6.12',sourceCommit:version,
 license:'CC BY-SA 3.0 / SBLGNT EULA',
 attribution:'MorphGNT (James K. Tauber); SBL Greek New Testament (Michael W. Holmes, 2010)'
}]));
const seen=Object.fromEntries(Object.keys(newStrong).map(id=>[id,new Set()]));
let ntWords=0,verifiedBooks=0,sourceVerseChecked=false;
const sleep=t=>new Promise(resolve=>setTimeout(resolve,t));
async function fetchBook(path){
 let last;
 for(let attempt=1;attempt<=3;attempt++){
  try{
   const r=await fetch(root+path,{signal:AbortSignal.timeout(40000)});
   if(!r.ok)throw Error('HTTP '+r.status+' em '+path);
   const body=await r.text();
   if(body.length<1000||!body.includes(' '))throw Error('Corpus incompleto '+path);
   return body;
  }catch(e){last=e;if(attempt<3)await sleep(attempt*1200)}
 }
 throw last;
}
for(const [filename,abbr] of books){
 const corpus=await fetchBook(filename+'-morphgnt.txt');
 const lines=corpus.split(/\r?\n/).filter(Boolean);
 if(lines.length<100)throw Error('Livro com corpus suspeitamente pequeno: '+filename);
 for(const line of lines){
  const cols=line.trim().split(/\s+/);
  if(cols.length!==7||!/^\d{6}$/.test(cols[0]))throw Error('Linha do MorphGNT inválida: '+line);
  ntWords++;
  const [ref,pos,morph,surface,clean,normalized,lemma]=cols;
  if(filename==='87-Re'&&ref==='270102'&&clean==='ἐμαρτύρησεν'&&lemma==='μαρτυρέω'&&morph==='3AAI-S--')sourceVerseChecked=true;
  const id=lemmaToStrong.get(lemma);
  if(!id)continue;
  const bIndex=Number(ref.slice(0,2))-1;
  const expected=Number(filename.slice(0,2))-60-1;
  if(bIndex!==expected)throw Error('Numeração canônica incompatível em '+filename+' '+ref);
  const chapter=Number(ref.slice(2,4)),verse=Number(ref.slice(4,6));
  if(chapter<1||verse<1)throw Error('Referência inválida '+ref);
  const reference=abbr+' '+chapter+':'+verse,entry=results[id];
  entry.tokenCount++;
  entry.bookDistribution[abbr]=(entry.bookDistribution[abbr]||0)+1;
  if(!seen[id].has(reference)){seen[id].add(reference);entry.references.push(reference)}
 }
 verifiedBooks++;
 console.log('MORPHGNT',verifiedBooks+'/27',abbr,lines.length,'tokens');
}
if(verifiedBooks!==27||!sourceVerseChecked||ntWords<130000)throw Error('Corpus MorphGNT incompleto; não publicar concordâncias');
const directory='public/data/concordancia-grega/';
await mkdir(directory,{recursive:true});
for(const [id,data] of Object.entries(results)){
 data.verseCount=data.references.length;
 if(data.tokenCount<data.verseCount||data.verseCount<2)throw Error('Contagem incorreta '+id);
 const distribution=Object.values(data.bookDistribution).reduce((sum,n)=>sum+n,0);
 if(distribution!==data.tokenCount||new Set(data.references).size!==data.verseCount)
  throw Error('Concordância não íntegra '+id);
 if(!seen[id].has('Ap 1:2'))throw Error('Ap 1:2 ausente '+id);
 await writeFile(directory+id+'.json',JSON.stringify(data,null,2)+'\n','utf8');
 console.log('GERADO',id,data.tokenCount,'tokens,',data.verseCount,'versículos distintos');
}
console.log('CONCLUÍDO: 27 livros completos; 5 concordâncias por lema, nenhum índice de Ap 1:1 alterado.');
