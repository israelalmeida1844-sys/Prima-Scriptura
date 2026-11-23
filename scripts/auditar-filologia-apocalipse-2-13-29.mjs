/**
 * Auditoria filológica automatizada: Ap 2:13–29.
 * Compara superfície SBLGNT, lema, classe, morfologia e Strong com
 * MorphGNT no commit aaed91e5 e jtauber/greek-lemma-mappings.
 * Não emite parecer sobre semântica, exegese, manuscritos ou tradução.
 */
import fs from 'node:fs';
import path from 'node:path';
const morphDir=process.env.MORPHGNT_DIR??'/tmp/prima-morphgnt';
const lemmaDir=process.env.LEMMAS_DIR??'/tmp/prima-lemma-mappings';
const src=fs.readFileSync(path.join(morphDir,'87-Re-morphgnt.txt'),'utf8');
const lines=src.split(/\r?\n/).filter(x=>/^2702(?:1[3-9]|2[0-9])\s/.test(x));
const mapping=new Map();let lemma='';
for(const line of fs.readFileSync(path.join(lemmaDir,'lexemes.yaml'),'utf8').split(/\r?\n/)){
 if(/^[^\s#].*:\s*$/.test(line))lemma=line.slice(0,-1);
 else{const m=line.match(/^    strongs:\s*(\d+)/);if(m&&lemma)mapping.set(lemma,'G'+m[1]);}
}
const strip=x=>x.replace(/[⸀⸂⸃⸄⸅]/g,'');
const errors=[];
let total=0;
for(let verse=13;verse<=29;verse++){
 const vlines=lines.map(l=>l.split(/\s+/)).filter(t=>Number(t[0].slice(4,6))===verse);
 const file='src/data/texto-original/apocalipse/apocalipse-2-'+verse+'.ts';
 const data=fs.readFileSync(file,'utf8');
 const match=data.match(/=\s*(\{[\s\S]*\})\s*as const;/);
 if(!match)throw Error('Objeto não encontrado em '+file);
 const obj=JSON.parse(match[1]);
 if(obj.words.length!==vlines.length)errors.push('1:'+verse+' quantidade '+obj.words.length+' != '+vlines.length);
 for(let i=0;i<vlines.length;i++){
  const w=obj.words[i],t=vlines[i];if(!w)continue;
  total++;
  const expect={greek:strip(t[3]),lemma:t[6],morphologyCode:t[2],morphgntPos:t[1],strong:mapping.get(t[6])};
  for(const [key,value] of Object.entries(expect))if(w[key]!==value)errors.push('1:'+verse+' token '+(i+1)+' '+key+' '+JSON.stringify(w[key])+' != '+JSON.stringify(value));
  if(w.strong&&!fs.existsSync('public/data/concordancia-grega/'+w.strong+'.json'))errors.push('índice ausente: '+w.strong);
  if(!w.transliteration||!w.gloss||!w.morphology||!w.syntax?.role)errors.push('campos vazios: '+w.id);
 }
}
const report={sourceCommit:'aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',scope:'Apocalipse 2:13–29',verses:17,checkedTokens:total,errors,passed:errors.length===0,limit:'A auditoria é mecânica; a revisão semântica e a crítica textual exigem leitura acadêmica independente.'};
fs.mkdirSync('.github/reports',{recursive:true});
fs.writeFileSync('.github/reports/apocalipse-2-13-29-filologia.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
