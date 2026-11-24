import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4321';
const chapter='/comentarios/apocalipse/capitulo-7/';
const server=spawn('npm',['run','preview','--','--host','127.0.0.1','--port','4321'],{stdio:'inherit'});
let browser;
try{
  let ready=false;
  for(let i=0;i<60;i++){try{if((await fetch(base+chapter)).ok){ready=true;break;}}catch{} await new Promise(r=>setTimeout(r,500));}
  assert.ok(ready,'Servidor não iniciou');
  browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+chapter);assert.equal(await page.locator('.verse-list a').count(),17);
  let tokens=0, tested=new Set();
  for(let v=1;v<=17;v++){
    const f='dist'+chapter+'versiculo-'+v+'/index.html';assert.ok(fs.statSync(f).size>0);
    const response=await page.goto(base+chapter+'versiculo-'+v+'/');assert.equal(response.status(),200);
    const root=page.locator('[data-original-apocalipse-7-'+v+']');
    await root.waitFor();
    assert.equal(await root.getAttribute('data-ready'),'true');
    const words=root.locator('[data-word-index]');const n=await words.count();tokens+=n;
    for(let i=0;i<n;i++){
      const word=words.nth(i), strong=(await word.locator('.strong-number').innerText()).trim(),greek=(await word.locator('.greek-form').innerText()).trim();
      await word.click();
      assert.equal(await word.getAttribute('aria-pressed'),'true');
      assert.equal((await root.locator('[data-lexicon-strong]').innerText()).trim(),strong);
      assert.equal((await root.locator('[data-lexicon-greek]').innerText()).trim(),greek);
      if(!tested.has(strong)){
        await root.locator('[data-occurrences-toggle]').click();
        await root.locator('[data-occurrences-total]').waitFor({state:'visible'});
        const c=JSON.parse(fs.readFileSync('public/data/concordancia-grega/'+strong+'.json','utf8'));
        await page.waitForFunction(({s,n})=>document.querySelector(s)?.querySelectorAll('.concordance-reference').length===n,{s:'[data-original-apocalipse-7-'+v+']',n:c.references.length});
        assert.ok((await root.locator('[data-occurrences-total]').innerText()).includes(strong));
        if(c.references.length){await root.locator('.concordance-reference').first().click();await root.locator('[data-occurrences-selection]').waitFor({state:'visible'});}
        await root.locator('[data-occurrences-toggle]').click();
        tested.add(strong);
      }
    }
    for(const [name,selector] of [['greek','.word-greek'],['transliteration','.word-transliteration'],['gloss','.word-gloss'],['morph','.word-morph'],['translation','[data-panel-translation]']]){
      const toggle=root.locator('[data-toggle="'+name+'"]');await toggle.uncheck();await root.locator(selector).first().waitFor({state:'hidden'});await toggle.check();await root.locator(selector).first().waitFor({state:'visible'});
    }
    if(v>1)assert.equal(await page.locator('[data-apocalipse-prev]').getAttribute('href'),chapter+'versiculo-'+(v-1)+'/');
    if(v<17)assert.equal(await page.locator('[data-apocalipse-next]').getAttribute('href'),chapter+'versiculo-'+(v+1)+'/');
  }
  assert.equal(tokens,398);assert.equal(tested.size,136);assert.deepEqual(errors,[]);
  console.log('OK: 18 rotas, 398 seleções, 136 concordâncias, controles e navegação.');
}finally{await browser?.close();server.kill();}
