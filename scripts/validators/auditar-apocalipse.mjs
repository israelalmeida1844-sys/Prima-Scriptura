import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

// Validador inicial independente; não prova qualidade acadêmica.
const counts = [20,29,22,11,14,17,17,13,21,11,19,17,18,20,8,21,18,24,21,15,27,21];
function auditVerse(d, rows, chapter, verse) {
  const errors=[], warnings=[];
  const label=`Ap ${chapter}:${verse}`;
  const err=m=>errors.push(`${label}: ${m}`), warn=m=>warnings.push(`${label}: ${m}`);
  if(d.chapter!==chapter||d.verse!==verse||d.reference!==`Apocalipse ${chapter}:${verse}`)err("referência divergente");
  for(const field of ["translation","textualNotes","syntacticNotes","exegeticalNotes"]){const val=d[field];if(typeof val==="string"?!val.trim():!Array.isArray(val)||!val.length||val.some(t=>typeof t!=="string"||!t.trim()))err(`campo ${field} ausente`);}
  if(!Array.isArray(d.words)){err("words ausente");return {errors,warnings,tokens:0};}
  if(d.words.length!==rows.length)err(`unidades: ${d.words.length}, fonte: ${rows.length}`);
  const ids=new Set();
  for(let i=0;i<d.words.length;i++){
    const w=d.words[i], r=rows[i], id=`unidade ${i+1}`;
    if(!w.id||ids.has(w.id))err(`${id}: ID ausente ou repetido`);ids.add(w.id);
    if(!r||w.greek!==r[4]||w.lemma!==r[6]||w.morphologyCode!==r[2]||w.morphgntPos!==r[1])err(`${id}: divergência do MorphGNT`);
    for(const f of ["greek","lemma","transliteration","gloss","morphology","meanings","explanation"])if(typeof w[f]!=="string"||!w[f].trim())err(`${id}: ${f} vazio`);
    if(!w.syntax?.role||/em revisão|consultar análise|a preencher|TODO|FIXME/i.test(w.syntax.role))warn(`${id}: função sintática não individualizada`);
    if(/^Glosa contextual:/i.test(w.explanation??""))warn(`${id}: explicação apenas repete glosa`);
  }
  const distinct=[d.translation,d.textualNotes,...(Array.isArray(d.syntacticNotes)?d.syntacticNotes:[]),...(Array.isArray(d.exegeticalNotes)?d.exegeticalNotes:[])].filter(x=>typeof x==="string").map(x=>x.trim());
  if(new Set(distinct).size!==distinct.length)warn("texto duplicado entre notas");
  return {errors,warnings,tokens:d.words.length};
}

const [source, startArg='9', endArg=startArg, ...flags] = process.argv.slice(2);
const start=Number(startArg), end=Number(endArg);
if(!source||!Number.isInteger(start)||!Number.isInteger(end)||start<1||end>22||end<start)throw Error('Uso: node scripts/validators/auditar-apocalipse.mjs <87-Re-morphgnt.txt> [inicio] [fim] [--strict]');
if(start<=13&&end>=12)throw Error('Ap 12–13 requer mapeamento editorial confirmado de 12:18 antes de validar.');
const bytes=fs.readFileSync(source);
const sha=createHash('sha1').update('blob '+bytes.length+'\\0').update(bytes).digest('hex');
if(sha!=='bf6fde5561b55eef837ae05067d270cdbc858c25')throw Error('Blob MorphGNT diferente da versão fixada: '+sha);
const rows=bytes.toString('utf8').trim().split(/\\r?\\n/).map(l=>l.trim().split(/\\s+/));
const report={verses:0,tokens:0,errors:[],warnings:[]};
for(let c=start;c<=end;c++)for(let v=1;v<=counts[c-1];v++){
  const file=path.join('src','data','texto-original','apocalipse','apocalipse-'+c+'-'+v+'.ts');
  try{
    const s=fs.readFileSync(file,'utf8');
    const d=JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1));
    const key='27'+String(c).padStart(2,'0')+String(v).padStart(2,'0');
    const result=auditVerse(d,rows.filter(r=>r[0]===key),c,v);
    report.verses++;report.tokens+=result.tokens;report.errors.push(...result.errors);report.warnings.push(...result.warnings);
  }catch(error){report.errors.push('Ap '+c+':'+v+': '+error.message);}
}
console.log(JSON.stringify(report,null,2));
if(report.errors.length||(flags.includes('--strict')&&report.warnings.length))process.exitCode=1;
