import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const names=['Gn','Êx','Lv','Nm','Dt','Js','Jz','Rt','1Sm','2Sm','1Rs','2Rs','1Cr','2Cr','Ed','Ne','Et','Jó','Sl','Pv','Ec','Ct','Is','Jr','Lm','Ez','Dn','Os','Jl','Am','Ob','Jn','Mq','Na','Hc','Sf','Ag','Zc','Ml'];
const bookOrder=new Map(names.map((x,i)=>[x,i]));
const corpusPath='public/data/concordancia-hebraica/';
const manifest=JSON.parse(await readFile(corpusPath+'genesis-1-1-2-manifest.json','utf8'));
assert.equal(manifest.complete,true,'Manifesto incompleto');
assert.equal(manifest.books,39,'Total de livros incorreto');
assert.equal(manifest.sourceVersion,'v.2.2','Versão errada do corpus');

const counts=[7,14,6,12,13,11,17,10];
const uniqueIds=new Set();
for(let n=1;n<=8;n++){
  const file=await readFile('src/data/texto-original/genesis-1-'+n+'.ts','utf8');
  const strongs=[...file.matchAll(/\bstrong["']?\s*:\s*['"](H\d+)['"]/g)].map(m=>m[1]);
  assert.equal(strongs.length,counts[n-1],'Segmentação errada Gn 1:'+n);
  for(const id of strongs)uniqueIds.add(id);
  assert.ok(file.includes('Gênesis 1:'+n),'Referência ausente');
}
for(const id of uniqueIds){
  const j=JSON.parse(await readFile(corpusPath+id+'.json','utf8'));
  for(const key of ['strong','tokenCount','verseCount','references','complete','source','sourceVersion','license','attribution'])assert.ok(Object.hasOwn(j,key),id+': falta '+key);
  assert.equal(j.strong,id);
  assert.equal(j.complete,true,id);
  assert.equal(j.source,'Open Scriptures Hebrew Bible');
  assert.equal(j.sourceVersion,'v.2.2');
  assert.equal(j.license,'CC BY 4.0');
  assert.ok(j.attribution.includes('Open Scriptures Hebrew Bible'));
  assert.ok(Array.isArray(j.references));
  assert.equal(j.references.length,j.verseCount,id+': quantidade de versículos');
  assert.ok(j.tokenCount>=j.verseCount,id+': tokens menores que versos');
  assert.equal(new Set(j.references).size,j.verseCount,id+': referências duplicadas');
  assert.ok(manifest.strongs.includes(id),id+': ausente no manifesto');
  let previous=-1;
  for(const ref of j.references){
    const m=ref.match(/^(.+?) (\d+):(\d+)$/);
    assert.ok(m,id+': referência inválida '+ref);
    const index=bookOrder.get(m[1]);
    assert.notEqual(index,undefined,id+': livro não identificado em '+ref);
    const key=index*1000000+Number(m[2])*1000+Number(m[3]);
    assert.ok(key>previous,id+': referências fora da ordem canônica em '+ref);
    previous=key;
  }
  console.log(id,j.tokenCount+' tokens',j.verseCount+' versículos');
}
console.log('PASS: índices de Gênesis 1:1–8, 39 livros, '+uniqueIds.size+' lemas diferentes, completude e ordem canônica.');
