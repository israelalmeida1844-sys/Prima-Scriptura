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
console.log('Hebreus: 13 capítulos, 303 versículos e 4.935 palavras verificadas. '+pending+' glosas lexicais aguardam revisão.');
