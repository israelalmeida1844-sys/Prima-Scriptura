import fs from 'node:fs';
import assert from 'node:assert/strict';
const p=JSON.parse(fs.readFileSync('docs/revisao-contextual-apocalipse-2-8.json','utf8'));
const counts=[20,29,22,11,14,17,17,13];let verses=0,tokens=0;
for(let c=2;c<=8;c++)for(let v=1;v<=counts[c-1];v++){
 const k=c+':'+v,e=p.entries[k];assert(e,k);
 const file='src/data/texto-original/apocalipse/apocalipse-'+c+'-'+v+'.ts';
 const before=fs.readFileSync(file,'utf8'),m=before.match(/=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$/);assert(m,file);
 const j=JSON.parse(m[1]);assert.equal(j.chapter,c);assert.equal(j.verse,v);
 assert.equal(e.syntacticNotes.length,2);assert.equal(e.exegeticalNotes.length,2);assert(e.translation.trim());
 const prev=JSON.stringify(j.words),textual=j.textualNotes;
 j.translation=e.translation;j.syntacticNotes=e.syntacticNotes;j.exegeticalNotes=e.exegeticalNotes;
 if('translationNote' in j)j.translationNote='Tradução editorial em português a partir do texto grego SBLGNT, distinta das glosas interlineares.';
 assert.equal(JSON.stringify(j.words),prev);assert.equal(j.textualNotes,textual);
 fs.writeFileSync(file,before.replace(m[1],()=>JSON.stringify(j,null,2)));
 verses++;tokens+=j.words.length;
}
assert.equal(verses,123);assert.equal(tokens,2912);
console.log(JSON.stringify({verses,tokens,syntacticNotes:verses*2,exegeticalNotes:verses*2,translations:verses}));
