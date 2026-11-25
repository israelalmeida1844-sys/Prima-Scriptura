import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const corpus=process.argv[2];
assert.ok(corpus,'Diretório MorphGNT obrigatório');
const manifest=read('src/data/auditoria/apocalipse-7/concordancias-consolidado.json');
const lex=read('src/data/lexico-grego/apocalipse-7-1-17.json').entries;
const fileNames=fs.readdirSync(corpus).filter(x=>/^\d\d-.*-morphgnt\.txt$/.test(x)).sort();
assert.equal(fileNames.length,27);
const counts=new Map(manifest.entries.map(e=>[e.lemma,{tokens:0,refs:new Set(),dist:{}}]));
let corpusTotal=0, chapterRows=[];
for(let i=0;i<fileNames.length;i++){
  const bytes=fs.readFileSync(path.join(corpus,fileNames[i]));
  const sha=createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
  const source=manifest.sources[i];
  assert.equal(sha,source.blob,'Versão do corpus divergente: '+source.book);
  const rows=bytes.toString('utf8').trim().split(/\r?\n/).map(l=>l.trim().split(/\s+/));
  assert.equal(rows.length,source.rows);
  corpusTotal+=rows.length;
  for(const r of rows){
    assert.equal(r.length,7);
    const ch=Number(r[0].slice(2,4)),v=Number(r[0].slice(4,6));
    if(source.book==='Ap'&&ch===7) chapterRows.push(r);
    const e=counts.get(r[6]); if(!e)continue;
    e.tokens++;e.refs.add(source.book+' '+ch+':'+v);
    e.dist[source.book]=(e.dist[source.book]??0)+1;
  }
}
assert.equal(corpusTotal,137554);assert.equal(chapterRows.length,398);
let tokens=0;const ids=new Set(),strongs=new Set();
for(let v=1;v<=17;v++){
  const file=fs.readFileSync('src/data/texto-original/apocalipse/apocalipse-7-'+v+'.ts','utf8');
  const d=JSON.parse(file.slice(file.indexOf('= {')+2).trim().replace(/;\s*$/,''));
  assert.equal(d.verse,v);assert.equal(d.chapter,7);
  const rows=chapterRows.filter(r=>Number(r[0].slice(4))===v);
  assert.equal(d.words.length,rows.length);assert.ok(d.translation&&d.syntacticNotes.length&&d.exegeticalNotes.length&&d.textualNotes);
  for(let i=0;i<rows.length;i++){
    const w=d.words[i],r=rows[i]; tokens++;
    assert.deepEqual([w.greek,w.lemma,w.morphologyCode,w.morphgntPos],[r[4],r[6],r[2],r[1]]);
    assert.ok(w.gloss&&w.transliteration&&w.morphology&&w.strong);
    assert.ok(!ids.has(w.id));ids.add(w.id);strongs.add(w.strong);
    assert.equal(lex[w.strong]?.lemma,w.lemma);
    const c=read('public/data/concordancia-grega/'+w.strong+'.json');
    assert.equal(c.complete,true);assert.ok(c.references.some(r=>typeof r==='string'? /^(Ap|Re|Apocalipse)\s+/.test(r)&&r.split(' ').at(-1)==='7:'+v : (r.book==='Apocalipse'||r.book==='Ap'||r.book==='Re')&&Number(r.chapter)===7&&Number(r.verse)===v),'Referência ausente: '+w.strong+' Ap 7:'+v);
    assert.equal(c.verseCount,c.references.length);
    assert.equal(c.references.length,new Set(c.references.map(r=>typeof r==='string'?r:r.reference)).size);
    assert.equal(c.tokenCount,Object.values(c.bookDistribution).reduce((a,b)=>a+b,0));
  }
}
assert.equal(tokens,398);assert.equal(strongs.size,136);assert.equal(counts.size,36);
let total=0;
for(const e of manifest.entries){
  const c=read('public/data/concordancia-grega/'+e.strong+'.json'), expected=counts.get(e.lemma);
  assert.equal(c.lemma,e.lemma);assert.equal(c.tokenCount,expected.tokens);
  assert.deepEqual(c.references,[...expected.refs]);assert.deepEqual(c.bookDistribution,expected.dist);
  assert.equal(c.verseCount,expected.refs.size);assert.equal(c.corpusBooks,27);total+=c.tokenCount;
}
assert.equal(total,845);
console.log('OK: 17 versículos, 398 unidades, 136 Strong, 36 concordâncias recontadas em 27 livros, 845 ocorrências.');
