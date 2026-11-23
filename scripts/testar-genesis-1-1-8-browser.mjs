import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch({headless:true});
const errors = [];
try {
  for (const size of [{width:1440,height:900},{width:390,height:844},{width:320,height:740}]) {
    const context = await browser.newContext({viewport:size});
    const page = await context.newPage();
    page.on('pageerror', e=>errors.push(String(e)));
    for (const [verse,count,strong] of [[1,7,'H7225'],[2,14,'H776'],[3,6,'H559'],[4,12,'H7200'],[5,13,'H7121'],[6,11,'H559'],[7,17,'H6213'],[8,10,'H7121']]) {
      await page.goto('http://127.0.0.1:4321/rascunhos/genesis-1-'+verse+'/', {waitUntil:'networkidle'});
      const root = page.locator('[data-original-genesis-1-'+verse+']');
      await assert.equal(await root.locator('[data-word-index]').count(),count);
      await assert.equal(await root.locator('.word-hebrew').count(),count);
      const style = await root.locator('.lexicon-fields dt').first().evaluate(el=>getComputedStyle(el).fontFamily);
      assert.ok(style.includes('Times New Roman'), 'Fonte incorreta: '+style);
      for (const key of ['hebrew','transliteration','gloss','translation']) {
        const toggle = root.locator('[data-toggle="'+key+'"]');
        await toggle.uncheck();
        const selector = key === 'translation' ? '[data-panel-translation]' : '.word-'+key;
        await assert.equal(await root.locator(selector).first().isVisible(),false,key+' deveria estar oculto');
        await toggle.check();
        await assert.equal(await root.locator(selector).first().isVisible(),true,key+' deveria estar visível');
      }
      if (verse===2) {
        const alternative=root.locator('input[value="alternativa"][name="genesis-1-2-traducao"]');
        await alternative.check();
        assert.ok((await root.locator('[data-translation-text]').innerText()).includes('vento de Deus'), 'Tradução alternativa de Gn 1:2 indisponível');
        await root.locator('input[value="principal"][name="genesis-1-2-traducao"]').check();
      }
      for (let i=0;i<count;i++) {
        await root.locator('[data-word-index="'+i+'"]').click();
        await assert.equal(await root.locator('[data-word-index="'+i+'"]').getAttribute('aria-pressed'),'true');
      }
      await root.locator('[data-word-index="0"]').click();
      await root.locator('[data-occurrences-toggle]').click();
      await root.locator('[data-occurrences-total]').waitFor({state:'visible',timeout:15000});
      assert.ok((await root.locator('[data-occurrences-total]').innerText()).includes(strong));
      await root.locator('[data-occurrences-toggle]').click();
      await assert.equal(await root.locator('[data-occurrences-panel]').isVisible(),false);
      const fields = await root.locator('.lexicon-fields div').all();
      for (const row of fields) {
        const dt=await row.locator('dt').boundingBox(), dd=await row.locator('dd').boundingBox();
        assert.ok(dt && dd,'Sem geometria de dt/dd');
        const collision = dt.x < dd.x+dd.width && dd.x < dt.x+dt.width && dt.y < dd.y+dd.height && dd.y < dt.y+dt.height;
        assert.ok(!collision,'Sobreposição de rótulo e valor '+verse+' / '+size.width);
      }
      const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth+2);
      assert.equal(overflow,false,'Overflow na página em '+size.width);
      console.log('PASS: Gn 1:'+verse+' viewport '+size.width);
    }
    if (size.width === 390) {
      for (const [kind,status,body,expected] of [
        ['ausente',404,'','Não foi possível carregar'],
        ['incompleto',200,JSON.stringify({strong:'H7200',tokenCount:1,verseCount:2,references:['Gn 1:4'],complete:false}),'Índice incompleto']
      ]) {
        await page.route('**/data/concordancia-hebraica/H7200.json', route=>route.fulfill({status,contentType:'application/json',body}));
        await page.goto('http://127.0.0.1:4321/rascunhos/genesis-1-4/', {waitUntil:'networkidle'});
        const root = page.locator('[data-original-genesis-1-4]');
        await root.locator('[data-occurrences-toggle]').click();
        const msg=root.locator('[data-occurrences-status]');
        await msg.waitFor({state:'visible'});
        await page.waitForFunction(() => document.querySelector('[data-original-genesis-1-4] [data-occurrences-status]')?.textContent?.trim() !== 'Carregando concordância interna…', {timeout:8000});
        assert.ok((await msg.innerText()).includes(expected),'Erro não tratado: '+kind);
        await page.unroute('**/data/concordancia-hebraica/H7200.json');
      }
      console.log('PASS: 404 e índice incompleto');
    }
    await context.close();
  }
  assert.deepEqual(errors,[],'Erros de JavaScript no navegador');
} finally { await browser.close(); }
