import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=process.argv[2]||process.env.PRIMA_MORPHGNT_DIR;
assert.ok(root&&fs.existsSync(path.join(root,'87-Re-morphgnt.txt')),'Indique o MorphGNT 6.12, commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d');
const text=fs.readFileSync(path.join(root,'87-Re-morphgnt.txt'),'utf8');
const rows=text.split(/\r?\n/).filter(x=>/^270[1-4]\d\d\s/.test(x)).map(x=>x.trim().split(/\s+/));
const grouped=new Map();
for(const row of rows){if(!grouped.has(row[0]))grouped.set(row[0],[]);grouped.get(row[0]).push(row);}
const clean=x=>String(x).replace(/[.,;··:!?]+$/u,'').normalize('NFC');
const failures=[],summary=[];
for(const [cs,max] of Object.entries({1:20,2:29,3:22,4:11})){
  const chapter=Number(cs);
  for(let verse=1;verse<=max;verse++){
    const source='src/data/texto-original/apocalipse/apocalipse-'+chapter+'-'+verse+'.ts';
    const file=fs.readFileSync(source,'utf8');
    const obj=file.slice(file.indexOf('{'),file.lastIndexOf('}')+1);
    let d;try{d=JSON.parse(obj)}catch{d=vm.runInNewContext('('+obj+')',{}, {timeout:1000})}
    const key='270'+chapter+String(verse).padStart(2,'0'),list=grouped.get(key)||[];
    if(d.words.length!==list.length)failures.push({reference:chapter+':'+verse,issue:'tokens',expected:list.length,actual:d.words.length});
    for(let i=0;i<Math.min(d.words.length,list.length);i++){
      const w=d.words[i],l=list[i];
      const checks=[['greek',clean(w.greek),clean(l[4])],['lemma',clean(w.lemma),clean(l[6])],['morphologyCode',w.morphologyCode,l[2]]];
      if(w.morphgntPos)checks.push(['morphgntPos',w.morphgntPos,l[1]]);
      for(const [field,actual,expected] of checks)if(actual!==expected)failures.push({reference:chapter+':'+verse,index:i+1,field,actual,expected});
    }
    summary.push({reference:chapter+':'+verse,tokens:d.words.length});
  }
}
console.log(JSON.stringify({checkedVerses:summary.length,tokens:summary.reduce((a,b)=>a+b.tokens,0),mismatchCount:failures.length,mismatches:failures.slice(0,120)},null,2));
assert.equal(failures.length,0,'O interlinear diverge do MorphGNT 6.12; conferir as diferenças indicadas.');
