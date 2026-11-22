// Validação editorial e estrutural da edição interlinear completa de 1 João.
// Executado em toda compilação pelo GitHub Actions.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const expected=[0,10,29,24,21,21];
const expectedWords=[0,207,585,467,449,429];
const lemmas=new Set();
let totalVerses=0,totalWords=0;
for(let chapter=1;chapter<=5;chapter++){
 const file=new URL('../src/data/1-joao-grego/capitulo-'+chapter+'.json',import.meta.url);
 const verses=JSON.parse(readFileSync(file,'utf8'));
 assert.equal(Object.keys(verses).length,expected[chapter], 'Capítulo '+chapter+' não tem todos os versículos');
 let count=0;
 for(let verse=1;verse<=expected[chapter];verse++){
  const tokens=verses[String(verse)];
  assert.ok(Array.isArray(tokens)&&tokens.length>0, 'Ausência de 1 João '+chapter+':'+verse);
  for(const [i,word] of tokens.entries()){
   assert.equal(word.length,6,'Dados incompletos em '+chapter+':'+verse+' palavra '+i);
   const [greek,lemma,pos,morph,gloss,translit]=word;
   for(const [name,value] of Object.entries({greek,lemma,pos,morph,gloss,translit}))
    assert.ok(typeof value==='string'&&value.trim(),'Campo vazio '+name+' em '+chapter+':'+verse);
   assert.match(greek,/\p{Script=Greek}/u);
   assert.match(lemma,/\p{Script=Greek}/u);
   assert.equal(morph.length,8,'Código morfológico fora do padrão em '+chapter+':'+verse);
   assert.match(translit,/[A-Za-z]/);
   lemmas.add(lemma);
   count++;
  }
  totalVerses++;
 }
 assert.equal(count,expectedWords[chapter],'Contagem de tokens não confere no capítulo '+chapter);
 totalWords+=count;
}
assert.equal(totalVerses,105);
assert.equal(totalWords,2137);
assert.equal(lemmas.size,233);
const fifth=JSON.parse(readFileSync(new URL('../src/data/1-joao-grego/capitulo-5.json',import.meta.url),'utf8'));
const text7=fifth['7'].map(word=>word[0]).join(' ');
assert.ok(text7.includes('τρεῖς')&&text7.includes('μαρτυροῦντες'),'Conferir 5:7 na SBLGNT');
assert.ok(!text7.includes('οὐραν')&&!text7.includes('πατέρα'),'Não importar Comma Joanino para a edição crítica');
const verse8=fifth['8'];
assert.equal(verse8.length,15);
assert.deepEqual([verse8[0][4],verse8[1][4],verse8[3][4],verse8[4][4],verse8[6][4],verse8[7][4]],['o','Espírito','a','água','o','sangue']);
assert.equal(verse8[10][1],'τρεῖς');
assert.equal(verse8[14][1],'εἰμί');
const component=readFileSync(new URL('../src/components/OriginalTextInterlinear.astro',import.meta.url),'utf8');
for(const mode of ['original','transliteracao','literal','gramatica'])assert.ok(component.includes('data-original-tab="'+mode+'"'));
assert.ok(component.includes("Times New Roman"));
console.log('VALIDAÇÃO APROVADA: 5 capítulos, 105 versículos, 2.137 formas gregas, 233 lemas, 4 modos e 1 João 5:7–8 conferidos.');
