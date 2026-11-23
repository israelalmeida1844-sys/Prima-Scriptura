import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const index=JSON.parse(await readFile('src/data/lexico-hebraico/genesis-1-1-8.json','utf8'));
const entries=index.entries;
assert.equal(Object.keys(entries).length,36,'Esperados 36 lemas');
const allExamples=Object.values(entries).flatMap(item=>item.senses.flatMap(s=>s.examples));
assert.equal(allExamples.length,80,'Esperados 80 exemplos curados');
for(const [id,entry] of Object.entries(entries)){
  assert.equal(id,entry.strong);
  assert.ok(entry.lemmaTransliteration.length>0);
  for(const sense of entry.senses){
    assert.ok(sense.label&&sense.definition&&sense.examples.length);
    for(const ex of sense.examples){
      assert.ok(ex.reference&&ex.hebrew&&!ex.hebrew.includes('/')&&ex.wordForm&&!ex.wordForm.includes('/')&&ex.translation&&ex.explanation);
      const concordance=JSON.parse(await readFile('public/data/concordancia-hebraica/'+id+'.json','utf8'));
      assert.ok(concordance.references.includes(ex.reference),id+' não consta em '+ex.reference);
    }
  }
}
const browser=await chromium.launch({headless:true});
const errors=[];
try{
for(const width of [1440,768,390,320]){
 const context=await browser.newContext({viewport:{width,height:900}});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(String(e)));
 for(const [verse,count] of [[1,7],[2,14],[3,6],[4,12],[5,13],[6,11],[7,17],[8,10]]){
  const url='http://127.0.0.1:4321/comentarios/genesis/capitulo-1/versiculo-'+verse+'/';
  const res=await page.goto(url,{waitUntil:'networkidle'});
  assert.equal(res?.status(),200,url);
  const root=page.locator('[data-original-genesis-1-'+verse+']');
  assert.equal(await root.locator('[data-word-index]').count(),count,'Unidades: '+verse);
  for(let i=0;i<count;i++){
    const button=root.locator('[data-word-index="'+i+'"]');
    const strong=(await button.locator('.strong-number').innerText()).trim();
    assert.ok(entries[strong],'Ausente no léxico: '+strong);
    await button.click();
    const lemma=root.locator('[data-lexicon-lemma]');
    const roman=root.locator('[data-lexicon-lemma-transliteration]');
    assert.equal((await lemma.innerText()).trim(),entries[strong].lemma,'Lema errado '+verse+'/'+i);
    assert.equal((await roman.innerText()).trim(),entries[strong].lemmaTransliteration,'Transliteração errada '+verse+'/'+i);
    assert.equal(await lemma.getAttribute('lang'),'he');
    assert.equal(await lemma.getAttribute('dir'),'rtl');
    assert.equal(await roman.getAttribute('dir'),'ltr');
    const font=await lemma.evaluate(el=>getComputedStyle(el));
    const computed=await lemma.evaluate(el=>({fontFamily:getComputedStyle(el).fontFamily,fontSize:parseFloat(getComputedStyle(el).fontSize),lineHeight:parseFloat(getComputedStyle(el).lineHeight)}));
    assert.ok(computed.fontFamily.includes('Times New Roman'),'Fonte errada '+verse+'/'+i);
    assert.ok(computed.fontSize>=26,'Lema pequeno '+verse+'/'+i);
    assert.ok(computed.lineHeight>=computed.fontSize,'Linha de hebraico insuficiente');
    const senses=root.locator('[data-lexicon-meanings] .lexical-sense');
    assert.equal(await senses.count(),entries[strong].senses.length,'Sentidos errados '+verse+'/'+i);
    const examples=root.locator('[data-lexicon-meanings] .lexical-example');
    assert.equal(await examples.count(),entries[strong].senses.reduce((sum,s)=>sum+s.examples.length,0),'Exemplos errados '+verse+'/'+i);
    for(const ex of await root.locator('.lexical-example-hebrew').all()){
      assert.equal(await ex.getAttribute('lang'),'he');
      assert.equal(await ex.getAttribute('dir'),'rtl');
      assert.ok((await ex.innerText()).length>0);
    }
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
    assert.equal(overflow,false,'Overflow em '+verse+'/'+i+' @'+width);
  }
  // Retornar à primeira palavra e garantir que não haja dados de seleção anterior.
  await root.locator('[data-word-index="0"]').click();
  const firstStrong=(await root.locator('[data-word-index="0"] .strong-number').innerText()).trim();
  assert.equal((await root.locator('[data-lexicon-lemma-transliteration]').innerText()).trim(),entries[firstStrong].lemmaTransliteration);
  await root.locator('[data-occurrences-toggle]').click();
  await root.locator('[data-occurrences-total]').waitFor({state:'visible',timeout:15000});
  assert.ok((await root.locator('[data-occurrences-total]').innerText()).includes(firstStrong));
  await root.locator('[data-occurrences-toggle]').click();
  if(width===390&&verse===2){
    await root.locator('[data-word-index="0"]').click();
    assert.equal(await root.locator('.lexical-sense').count(),3);
    assert.equal(await root.locator('.lexical-example').count(),3);
    assert.ok((await root.locator('[data-lexicon-lemma-transliteration]').innerText()).includes('ʾereṣ'));
    await page.screenshot({path:'lexico-genesis-1-2-mobile.png',fullPage:true});
  }
  console.log('PASS: Gn 1:'+verse+' @ '+width+'px, '+count+' palavras');
 }
 await context.close();
}
assert.deepEqual(errors,[],'Erros JS em navegador');
console.log('VALIDAÇÃO COMPLETA: 36 lemas, 80 exemplos, 90 palavras por resolução, 4 resoluções, navegação e concordâncias preservadas.');
}finally{await browser.close()}
