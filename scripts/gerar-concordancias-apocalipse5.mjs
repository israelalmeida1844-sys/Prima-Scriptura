#!/usr/bin/env node
/**
 * Prima Scriptura: concordâncias EXAUSTIVAS para os novos Strong de Apocalipse 5.
 * Requer os 27 arquivos do MorphGNT 6.12 (commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d).
 * Uso: node scripts/gerar-concordancias-apocalipse5.mjs --corpus /caminho/sblgnt [--write]
 * O modo padrão apenas valida e informa; --write grava arquivos que ainda não existem.
 */
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const args=process.argv.slice(2);
const flag=(x)=>args.includes(x);
const corpusArg=args.indexOf('--corpus');
const corpusDir=resolve(corpusArg>=0?args[corpusArg+1]||'':'./morphgnt');
const output=join(root,'public/data/concordancia-grega');
const sourceCommit='aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d';
const books=[
  ['61-Mt','Mt'],['62-Mk','Mc'],['63-Lk','Lc'],['64-Jn','Jo'],['65-Ac','At'],
  ['66-Ro','Rm'],['67-1Co','1Co'],['68-2Co','2Co'],['69-Ga','Gl'],['70-Eph','Ef'],
  ['71-Php','Fp'],['72-Col','Cl'],['73-1Th','1Ts'],['74-2Th','2Ts'],['75-1Ti','1Tm'],
  ['76-2Ti','2Tm'],['77-Tit','Tt'],['78-Phm','Fm'],['79-Heb','Hb'],['80-Jas','Tg'],
  ['81-1Pe','1Pe'],['82-2Pe','2Pe'],['83-1Jn','1Jo'],['84-2Jn','2Jo'],
  ['85-3Jn','3Jo'],['86-Jud','Jd'],['87-Re','Ap']
];
const added={
  'κατασφραγίζω':'G2696','σφραγίς':'G4973','ἰσχυρός':'G2478','κηρύσσω':'G2784',
  'οὐδέ':'G3761','ὑποκάτω':'G5270','κλαίω':'G2799','Ἰούδας':'G2455',
  'ῥίζα':'G4491','ἀρνίον':'G721','σφάζω':'G4969','κέρας':'G2768',
  'κιθάρα':'G2788','φιάλη':'G5357','θυμίαμα':'G2368','προσευχή':'G4335',
  'ᾄδω':'G103','ᾠδή':'G5603','γλῶσσα':'G1100','λαός':'G2992',
  'βασιλεύω':'G936','ἀριθμός':'G706','μυριάς':'G3461','χιλιάς':'G5505',
  'πλοῦτος':'G4149','σοφία':'G4678','ἰσχύς':'G2479','εὐλογία':'G2129',
  'κτίσμα':'G2938'
};
const lex=JSON.parse(await readFile(join(root,'src/data/lexico-grego/apocalipse-5-1-14.json'),'utf8'));
const targets=new Map(Object.entries(added).map(([lemma,strong])=>{
  if(lex.entries[strong]?.lemma!==lemma)throw Error('Lema/Strong não coincide no léxico: '+lemma+' / '+strong);
  return [lemma,{strong,lemma,lemmaTranslit:lex.entries[strong].lemmaTransliteration,tokenCount:0,verseCount:0,
    bookDistribution:{},references:[],complete:false,source:'SBLGNT / MorphGNT 6.12',
    sourceVersion:sourceCommit,license:'CC BY-SA 3.0 / CC BY 4.0 (ver fontes originais)',
    attribution:'SBL Greek New Testament; MorphGNT',corpusBooks:27}];
}));
let countFiles=0;
for(const [base,book] of books){
  const path=join(corpusDir,base+'-morphgnt.txt');
  let content;
  try{content=await readFile(path,'utf8')}catch{throw Error('Falta arquivo do corpus: '+path+'; não é possível alegar concordância completa.')}
  if(!content.trim())throw Error('Arquivo de corpus vazio: '+path);
  countFiles++;
  const seen=new Map();
  for(const line of content.split(/\r?\n/)){
    if(!line.trim())continue;
    const cols=line.trim().split(/\s+/);
    if(cols.length!==7 || !/^\d{6}$/.test(cols[0]))throw Error('Linha MorphGNT inválida em '+path+': '+line.slice(0,100));
    const target=targets.get(cols[6]);if(!target)continue;
    const ref=book+' '+Number(cols[0].slice(2,4))+':'+Number(cols[0].slice(4,6));
    target.tokenCount++;
    target.bookDistribution[book]=(target.bookDistribution[book]||0)+1;
    if(!seen.has(target.strong))seen.set(target.strong,new Set());
    seen.get(target.strong).add(ref);
  }
  for(const target of targets.values()){
    const refs=seen.get(target.strong);
    if(refs)target.references.push(...refs);
  }
}
if(countFiles!==27)throw Error('Corpus incompleto; lidos apenas '+countFiles+' livros.');
await mkdir(output,{recursive:true});
let created=0,existing=0;
for(const value of targets.values()){
  value.verseCount=value.references.length;
  if(value.tokenCount!==Object.values(value.bookDistribution).reduce((a,b)=>a+b,0))throw Error('Distribuição inconsistente '+value.strong);
  if(value.verseCount>value.tokenCount)throw Error('Contagens inconsistentes '+value.strong);
  if(!value.tokenCount)throw Error('Lema sem ocorrências no corpus '+value.lemma);
  value.complete=true;
  const dest=join(output,value.strong+'.json');
  try{await access(dest);existing++;continue}catch{}
  if(flag('--write')){await writeFile(dest,JSON.stringify(value,null,2)+'\n');created++}
  console.log((flag('--write')?'GRAVAR':'SIMULAR')+' '+value.strong+' '+value.lemma+' tokens='+value.tokenCount+' versos='+value.verseCount);
}
console.log(JSON.stringify({sourceCommit,books:countFiles,targets:targets.size,newFiles:created,alreadyPresent:existing,write:flag('--write')}));
