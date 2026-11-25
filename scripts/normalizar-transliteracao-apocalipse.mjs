/** Ap 1–8: normaliza apenas campos de transliteração; preserva texto, códigos e esquema. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {transliterateGreek} from '../src/scripts/transliteracao-grega.mjs';
const dir='src/data/texto-original/apocalipse';
const lexDir='src/data/lexico-grego';
const counts=[20,29,22,11,14,17,17,13];
const check=process.argv.includes('--check');
const strongs=new Set();
let files=0,tokens=0,changes=0,examples=0,lexFiles=0;
const perChapter=[];
const save=(p,before,after)=>{if(before===after)return;if(check)throw Error('Divergência de transliteração: '+p);fs.writeFileSync(p,after);};
function set(o,key,source){
 if(typeof o[key]!=='string'||typeof source!=='string'||!source.trim())return;
 const value=transliterateGreek(source);if(!value)throw Error('Forma grega não transliterável: '+source);
 if(value!==o[key]){o[key]=value;changes++;}
}
function walk(o){
 if(!o||typeof o!=='object')return;
 if(!Array.isArray(o)){
  set(o,'lemmaTransliteration',o.lemma);
  if(typeof o.greek==='string'){
   set(o,'transliteration',o.greek);
   if('wordForm' in o||'reference' in o)examples++;
  }
 }
 for(const v of Object.values(o))walk(v);
}
for(let c=1;c<=8;c++){
 let n=0;
 for(let v=1;v<=counts[c-1];v++){
  const p=path.join(dir,'apocalipse-'+c+'-'+v+'.ts');
  const before=fs.readFileSync(p,'utf8');
  const m=before.match(/=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$/);
  assert(m,'Objeto inválido: '+p);
  const o=JSON.parse(m[1]);assert.equal(o.words.length>0,true,p);
  assert.equal(o.chapter,c,p);assert.equal(o.verse,v,p);
  const original=o.words.map(w=>[w.id,w.greek,w.lemma,w.strong,w.morphologyCode,w.morphgntPos,w.trailingPunctuation]);
  for(const w of o.words){assert.equal(typeof w.transliteration,'string',w.id);assert.equal(typeof w.lemmaTransliteration,'string',w.id);strongs.add(w.strong);tokens++;n++;}
  const old=changes;walk(o);
  assert.deepEqual(o.words.map(w=>[w.id,w.greek,w.lemma,w.strong,w.morphologyCode,w.morphgntPos,w.trailingPunctuation]),original,p);
  if(changes!==old)save(p,before,before.replace(m[1],()=>JSON.stringify(o,null,2)));
  files++;
 }
 perChapter.push({chapter:c,verses:counts[c-1],tokens:n});
}
for(const name of fs.readdirSync(lexDir).filter(n=>/^apocalipse-.*\.json$/.test(n))){
 const p=path.join(lexDir,name),before=fs.readFileSync(p,'utf8'),o=JSON.parse(before);
 if(!o.entries||typeof o.entries!=='object'||Array.isArray(o.entries))continue;
 const old=changes;
 for(const [id,entry] of Object.entries(o.entries))if(strongs.has(id))walk(entry);
 if(changes!==old)save(p,before,JSON.stringify(o,null,2)+'\n');
 lexFiles++;
}
assert.equal(files,143);
console.log(JSON.stringify({mode:check?'check':'normalize',files,tokens,lexFiles,examples,changes,perChapter},null,2));
