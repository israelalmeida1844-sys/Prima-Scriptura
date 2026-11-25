/** Higiene determinística: Ap 1–8. Não substitui análise filológica contextual. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {transliterateGreek} from '../src/scripts/transliteracao-grega.mjs';
const counts=[20,29,22,11,14,17,17,13];
const check=process.argv.includes('--check');
const report=[];
const refs=s=>s.replace(/\b(?:AP|REV)\.(\d+)\.(\d+)\b/gi,'Ap $1:$2').replace(/\bApocalipse\s+(\d+):(\d+)\b/gi,'Ap $1:$2').replace(/\bAp\.\s*(\d+),(\d+)\b/gi,'Ap $1:$2');
const cleanGloss=s=>s.replace(/[?.!,;·:]/gu,' ').replace(/\s+/gu,' ').trim();
function write(p,old,newValue){if(old===newValue)return;if(check)throw Error('Divergência: '+p);fs.writeFileSync(p,newValue);}
for(let c=1;c<=8;c++){
 const row={chapter:c,verses:0,tokens:0,glossChanges:0,referenceChanges:0,templates:0,unresolved:[]};
 for(let v=1;v<=counts[c-1];v++){
  const p='src/data/texto-original/apocalipse/apocalipse-'+c+'-'+v+'.ts',old=fs.readFileSync(p,'utf8');
  const m=old.match(/=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$/);assert(m,p);
  const j=JSON.parse(m[1]),immutable=j.words.map(w=>[w.id,w.greek,w.lemma,w.strong,w.morphologyCode,w.morphgntPos,w.trailingPunctuation,w.syntax?.clauseId]);
  const before=JSON.stringify(j);
  for(let i=0;i<j.words.length;i++){
   const w=j.words[i];row.tokens++;
   let g=cleanGloss(w.gloss);
   if(w.lemma==='βιβλίον'&&['livro','livros','rolo','rolos'].includes(g.toLowerCase()))g=g.replace(/livro/gi,'rolo');
   if(w.lemma==='μέγας'&&i>0&&j.words[i-1].lemma==='φωνή'&&/^(grande|grandes|forte|fortes|alta|altas)$/i.test(g))g=/s$/i.test(g)?'altas':'alta';
   if(w.greek==='λῦσαι'&&c===5)g='romper';
   if(w.lemma==='σφραγίς'&&w.morphologyCode?.[5]==='P'&&g==='selo')g='selos';
   if(w.lemma==='ἀρνίον'&&/^(cordeiro|cordeiros)$/i.test(g))g='C'+g.slice(1);
   assert(g,'Glosa vazia: '+w.id);
   if(g!==w.gloss){w.gloss=g;row.glossChanges++;}
   if(Array.isArray(w.occurrencesExamples))w.occurrencesExamples=w.occurrencesExamples.map(x=>{if(typeof x!=='string')return x;const y=refs(x);if(y!==x)row.referenceChanges++;return y;});
   assert.equal(w.transliteration,transliterateGreek(w.greek),w.id);
   if(/não indicada|coordenativo ou subordinativo|elemento lexical no período|forma verbal da oração|função a revisar|conforme MorphGNT|glosa neste contexto|descrição lexical e a função sintática devem|função da forma deve ser lida/i.test([w.syntax?.role,w.partOfSpeech,w.explanation].join(' ')))row.unresolved.push(w.id+': ficha');
  }
  if(/não foi incorporada|consultar o aparato crítico|não apresenta variante manuscrita específica/i.test(j.textualNotes||''))row.unresolved.push('Ap '+c+':'+v+': crítica textual');
  if(j.words[0]?.lemma==='καί'&&['εἶδον','ἤκουσα'].includes(j.words[1]?.greek)&&!/^E\s/i.test(j.translation))row.unresolved.push('Ap '+c+':'+v+': tradução sem E inicial');
  assert.deepEqual(j.words.map(w=>[w.id,w.greek,w.lemma,w.strong,w.morphologyCode,w.morphgntPos,w.trailingPunctuation,w.syntax?.clauseId]),immutable,p);
  if(before!==JSON.stringify(j))write(p,old,old.replace(m[1],()=>JSON.stringify(j,null,2)));
  row.verses++;
  const t='src/components/TextoOriginalApocalipse'+c+'v'+v+'.astro',s=fs.readFileSync(t,'utf8');
  // Exibe referência pública e suprime dependência ausente; preserva IDs internos.
  const z=s.replace(/\{firstWord\.syntax\.role\} · \{firstWord\.syntax\.clauseId\} · dependência: \{firstWord\.syntax\.governedBy \?\? 'não indicada'\}/g,"{firstWord.syntax.role} · Ap "+c+":"+v+"{firstWord.syntax.governedBy ? ' · ' + firstWord.syntax.governedBy : ''}")
  .replace(/word\.syntax\.role \+ ' · ' \+ word\.syntax\.clauseId \+ ' · dependência: ' \+ \(word\.syntax\.governedBy \?\? 'não indicada'\)/g,"word.syntax.role + ' · Ap "+c+":"+v+"' + (word.syntax.governedBy ? ' · ' + word.syntax.governedBy : '')");
  if(z!==s){row.templates++;write(t,s,z);}
 }
 report.push(row);
}
const dir='src/data/lexico-grego';
let lexRefChanges=0;
const glossaryFix={
 G5101:{definition:"Pronome interrogativo que pergunta pela identidade de uma pessoa ou coisa; o gênero e o caso determinam sua função na oração.",label:"quem; que; o que"},
 G514:{definition:"Digno, adequado ou merecedor; indica qualificação em relação a uma condição ou ação.",label:"digno"},
 G455:{definition:"Abrir algo fechado, em sentido literal ou figurado.",label:"abrir"}
};
for(const name of fs.readdirSync(dir).filter(x=>/^apocalipse-.*\.json$/.test(x))){
 const p=dir+'/'+name,s=fs.readFileSync(p,'utf8'),j=JSON.parse(s);if(!j.entries||Array.isArray(j.entries))continue;
 for(const [id,e] of Object.entries(j.entries)){
  if(glossaryFix[id]&&e.senses?.length===1)Object.assign(e.senses[0],glossaryFix[id]);
  for(const sense of e.senses||[]){
   if(id==='G32')sense.examples=sense.examples.filter(x=>!(x.reference==='Hb 1:14'&&!/ἀγγέλ|ἄγγελ/.test(x.greek)));
   for(const x of sense.examples||[])if(typeof x.reference==='string'){const y=refs(x.reference);if(y!==x.reference){x.reference=y;lexRefChanges++;}}
  }
 }
 const z=JSON.stringify(j,null,2)+'\n';if(JSON.stringify(JSON.parse(s))!==JSON.stringify(j))write(p,s,z);
}
const summary={mode:check?'check':'apply',lexRefChanges,chapters:report.map(({unresolved,...r})=>({...r,unresolvedCount:unresolved.length})),unresolved:report.flatMap(r=>r.unresolved)};
assert.equal(report.reduce((a,r)=>a+r.verses,0),143);
console.log(JSON.stringify(summary,null,2));
if(!check)fs.writeFileSync('docs/auditoria-editorial-apocalipse-1-8.json',JSON.stringify(summary,null,2)+'\n');
