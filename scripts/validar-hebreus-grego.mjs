// Verificação estrutural do texto grego de Hebreus (SBLGNT/MorphGNT 6.12).
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const lengths=[14,18,19,16,14,20,28,13,28,39,40,29,25];
const expectedWords=[257,312,282,290,231,300,454,274,507,550,631,472,375];
let sum=0, versesTotal=0, pending=0;
for(let ch=1;ch<=13;ch++){
  const data=JSON.parse(readFileSync(new URL('../src/data/hebreus-grego/capitulo-'+ch+'.json',import.meta.url),'utf8'));
  assert.equal(Object.keys(data).length,lengths[ch-1], 'Número de versículos de Hb '+ch);
  let count=0;
  for(let v=1;v<=lengths[ch-1];v++){
    const tokens=data[String(v)];
    assert.ok(Array.isArray(tokens)&&tokens.length>0,'Hebreus '+ch+':'+v+' ausente');
    for(const [i,w] of tokens.entries()){
      assert.equal(w.length,6,'Campos incompletos em Hb '+ch+':'+v+':'+i);
      assert.ok(w.every(s=>typeof s==='string'&&s.trim().length>0),'Campo vazio em Hb '+ch+':'+v+':'+i);
      assert.match(w[0],/\p{Script=Greek}/u);
      assert.match(w[1],/\p{Script=Greek}/u);
      assert.equal(w[3].length,8,'Morfologia inválida em Hb '+ch+':'+v+':'+i);
      if(w[4]==='—')pending++;
      count++;
    }
    versesTotal++;
  }
  assert.equal(count,expectedWords[ch-1],'Tokenização diferente no capítulo '+ch);
  sum+=count;
}
assert.equal(sum,4935);
assert.equal(versesTotal,303);
assert.equal(pending,0,'Ainda existem glosas vazias em Hebreus');
const ch=(n)=>JSON.parse(readFileSync(new URL('../src/data/hebreus-grego/capitulo-'+n+'.json',import.meta.url),'utf8'));
const find=(n,v,lemma)=>ch(n)[String(v)].filter(w=>w[1]===lemma).map(w=>w[4]);
assert.ok(find(7,25,'ἐντυγχάνω').some(g=>g.includes('interceder')),'Hb 7:25: intercessão');
assert.ok(find(4,9,'σαββατισμός').some(g=>g.includes('sabático')),'Hb 4:9: descanso sabático');
assert.ok(find(10,10,'θέλημα').every(g=>g==='vontade'),'Hb 10:10: vontade');
assert.ok(find(9,16,'διαθήκη').some(g=>g.includes('testamento')),'Hb 9:16: nuance de testamento');
assert.ok(find(11,1,'ὑπόστασις').some(g=>g.includes('certeza')),'Hb 11:1: certeza');
for(let n=1;n<=13;n++)for(const ws of Object.values(ch(n)))for(const w of ws)if(w[1]==='ὑπέρ')assert.notEqual(w[4],'pois','Hb '+n+': ὑπέρ não é pois');
console.log('Hebreus: 13 capítulos, 303 versículos, 4.935 tokens gregos e nenhuma glosa vazia. Testes lexicais críticos aprovados.');
