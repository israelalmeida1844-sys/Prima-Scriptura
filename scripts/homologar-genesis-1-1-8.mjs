import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const origin='http://127.0.0.1:4321';
const book='/comentarios/genesis/';
const chapter=book+'capitulo-1/';
const sizes=[{width:1440,height:900},{width:768,height:1024},{width:390,height:844},{width:320,height:740}];
const dataset=[[1,7,'H7225'],[2,14,'H776'],[3,6,'H559'],[4,12,'H7200'],[5,13,'H7121'],[6,11,'H559'],[7,17,'H6213'],[8,10,'H7121']];
const browser=await chromium.launch({headless:true});
const pageErrors=[];
const artifactDir='artifacts/genesis-visual';
await mkdir(artifactDir,{recursive:true});
try {
  for (const viewport of sizes) {
    const context=await browser.newContext({viewport});
    const page=await context.newPage();
    page.on('pageerror',error=>pageErrors.push(viewport.width+': '+String(error)));
    const visit=async(path)=>{
      const response=await page.goto(origin+path,{waitUntil:'networkidle'});
      assert.equal(response?.status(),200,'HTTP incorreto: '+path);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth+2);
      assert.equal(overflow,false,'Scroll lateral da página em '+path+' @ '+viewport.width);
    };
    await visit('/comentarios/');
    const genesisLink=page.locator('a[href="/comentarios/genesis/"]').first();
    assert.ok(await genesisLink.isVisible(),'Gênesis ausente da biblioteca');
    await visit('/');
    assert.ok(await page.locator('a[href="/comentarios/genesis/"]').first().isVisible(),'Gênesis ausente da página inicial');
    await visit(book);
    assert.ok((await page.locator('h1').first().innerText()).includes('Gênesis'));
    assert.equal(await page.locator('.genesis-crumbs a').first().evaluate(el=>getComputedStyle(el).color),'rgb(67, 91, 118)','Breadcrumb do livro ilegível');
    const bookLinks=await page.locator('a[href^="/comentarios/genesis/"]').evaluateAll(elements=>[...new Set(elements.map(a=>a.getAttribute('href')).filter(Boolean))]);
    for(const href of bookLinks){
      const resp=await context.request.get(origin+href);
      assert.equal(resp.status(),200,'Link quebrado na página do livro: '+href);
    }
    if(viewport.width===1440||viewport.width===390)await page.screenshot({path:artifactDir+'/livro-'+viewport.width+'.png',fullPage:true});
    await visit(chapter);
    assert.ok((await page.locator('.summary').innerText()).includes('8 de 31'),'Capítulo apresentado indevidamente como completo');
    assert.equal(await page.locator('.crumbs a').first().evaluate(el=>getComputedStyle(el).color),'rgb(67, 91, 118)','Breadcrumb do capítulo ilegível');
    const chapterLinks=await page.locator('a[href^="/comentarios/genesis/capitulo-1/versiculo-"]').evaluateAll(elements=>[...new Set(elements.map(a=>a.getAttribute('href')))]);
    assert.equal(chapterLinks.length,8,'Somente oito versos devem estar disponíveis');
    for(const href of chapterLinks)assert.equal((await context.request.get(origin+href)).status(),200,'Link quebrado '+href);
    if(viewport.width===1440||viewport.width===390)await page.screenshot({path:artifactDir+'/capitulo-1-'+viewport.width+'.png',fullPage:true});
    for(const [verse,count,strong] of dataset){
      const path=chapter+'versiculo-'+verse+'/';
      await visit(path);
      const root=page.locator('[data-original-genesis-1-'+verse+']');
      const headerColor=await root.locator('.interlinear-header').evaluate(el=>getComputedStyle(el).backgroundColor);
      assert.equal(headerColor,'rgba(0, 0, 0, 0)','Cabeçalho escuro indevido: Gn 1:'+verse);
      assert.ok(await root.locator('.interlinear-header h2').isVisible(),'Título interlinear não visível em '+verse);
      assert.equal(await page.locator('.breadcrumbs a').first().evaluate(el=>getComputedStyle(el).color),'rgb(67, 91, 118)','Breadcrumb do versículo ilegível');
      assert.equal(await root.locator('[data-word-index]').count(),count,'Número de unidades incorreto em '+verse);
      assert.equal(await root.locator('.word-hebrew').count(),count);
      assert.ok((await root.locator('.lexicon-fields dt').first().evaluate(el=>getComputedStyle(el).fontFamily)).includes('Times New Roman'));
      const active=page.locator('.verse-picker a[aria-current="page"]');
      assert.equal((await active.innerText()).trim(),String(verse),'Navegação ativa incorreta');
      assert.equal(await page.locator('[data-genesis-prev]').count(),verse===1?0:1);
      assert.equal(await page.locator('[data-genesis-next]').count(),verse===8?0:1);
      if(verse>1)assert.equal(await page.locator('[data-genesis-prev]').getAttribute('href'),chapter+'versiculo-'+(verse-1)+'/');
      if(verse<8)assert.equal(await page.locator('[data-genesis-next]').getAttribute('href'),chapter+'versiculo-'+(verse+1)+'/');
      for(const toggleName of ['hebrew','transliteration','gloss','translation']){
        const toggle=root.locator('[data-toggle="'+toggleName+'"]');
        const selector=toggleName==='translation'?'[data-panel-translation]':'.word-'+toggleName;
        await toggle.uncheck();
        assert.equal(await root.locator(selector).first().isVisible(),false,'Ocultação falhou: '+verse+'/'+toggleName);
        await toggle.check();
        assert.equal(await root.locator(selector).first().isVisible(),true,'Reexibição falhou: '+verse+'/'+toggleName);
      }
      if(verse===2){
        await root.locator('input[name="genesis-1-2-traducao"][value="alternativa"]').check();
        assert.ok((await root.locator('[data-translation-text]').innerText()).includes('vento de Deus'));
        await root.locator('input[name="genesis-1-2-traducao"][value="principal"]').check();
      }
      for(let i=0;i<count;i++){
        const button=root.locator('[data-word-index="'+i+'"]');
        await button.click();
        assert.equal(await button.getAttribute('aria-pressed'),'true','Seleção lexical falhou: '+verse+'/'+i);
      }
      await root.locator('[data-word-index="0"]').click();
      await root.locator('[data-occurrences-toggle]').click();
      await root.locator('[data-occurrences-total]').waitFor({state:'visible',timeout:15000});
      assert.ok((await root.locator('[data-occurrences-total]').innerText()).includes(strong),'Concordância errada: '+verse);
      await root.locator('[data-occurrences-toggle]').click();
      assert.equal(await root.locator('[data-occurrences-panel]').isVisible(),false);
      for(const row of await root.locator('.lexicon-fields div').all()){
        const a=await row.locator('dt').boundingBox(),b=await row.locator('dd').boundingBox();
        assert.ok(a&&b,'Campo lexical não possui geometria em '+verse);
        assert.ok(!(a.x<b.x+b.width && b.x<a.x+a.width && a.y<b.y+b.height && b.y<a.y+a.height),'Rótulo sobreposto ao valor: '+verse+' / '+viewport.width);
      }
      if((verse===1||verse===8)&&(viewport.width===1440||viewport.width===390)){
        await page.screenshot({path:artifactDir+'/versiculo-'+verse+'-'+viewport.width+'.png',fullPage:true});
      }
      console.log('PASS Gn 1:'+verse+' @ '+viewport.width);
    }
    // Verificar o tratamento de problemas do índice de uma palavra.
    if(viewport.width===390){
      for(const [kind,status,body,needle] of [
        ['arquivo-ausente',404,'','Não foi possível carregar'],
        ['indice-incompleto',200,JSON.stringify({strong:'H7200',tokenCount:1,verseCount:2,references:['Gn 1:4'],complete:false}),'Índice incompleto']
      ]){
        const pattern='**/data/concordancia-hebraica/H7200.json';
        await page.route(pattern,route=>route.fulfill({status,contentType:'application/json',body}));
        await visit(chapter+'versiculo-4/');
        const root=page.locator('[data-original-genesis-1-4]');
        await root.locator('[data-occurrences-toggle]').click();
        await page.waitForFunction(()=>document.querySelector('[data-original-genesis-1-4] [data-occurrences-status]')?.textContent?.trim() !== 'Carregando concordância interna…');
        assert.ok((await root.locator('[data-occurrences-status]').innerText()).includes(needle),'Erro sem mensagem adequada: '+kind);
        await page.unroute(pattern);
      }
    }
    await context.close();
  }
  const stablePaths=['/comentarios/1-joao/','/comentarios/hebreus/','/comentarios/daniel/','/admin/','/admin/glosas.html','/pesquisa/'];
  const context=await browser.newContext();
  for(const path of stablePaths){const response=await context.request.get(origin+path);assert.equal(response.status(),200,'Rota preexistente quebrada: '+path);}
  await context.close();
  assert.deepEqual(pageErrors,[],'Erros JavaScript no navegador');
  console.log('AUDITORIA COMPLETA: 8 versículos, 4 larguras, navegação, fichas, concordâncias, rotas legadas.');
}finally{await browser.close();}
