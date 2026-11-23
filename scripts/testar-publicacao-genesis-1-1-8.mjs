import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const summary=JSON.parse(await readFile('src/data/estrutura-hebraica/genesis-1-1-8-resumo.json','utf8'));
assert.equal(summary.metrics.tokens,90);
assert.equal(summary.metrics.distinctStrong,36);
const browser=await chromium.launch({headless:true});
const scriptErrors=[];
const rootUrl='http://127.0.0.1:4321';
try{
 for(const width of [1440,390,320]){
  const ctx=await browser.newContext({viewport:{width,height:900}});
  const page=await ctx.newPage();
  page.on('pageerror',e=>scriptErrors.push({width,message:e.message}));
  for(let n=1;n<=8;n++){
   const path='/comentarios/genesis/capitulo-1/versiculo-'+n+'/';
   const response=await page.goto(rootUrl+path,{waitUntil:'networkidle'});
   assert.equal(response?.status(),200,path);
   const root=page.locator('[data-genesis-structured="'+n+'"]');
   assert.equal(await root.count(),1,'Painel estruturado ausente Gn 1:'+n);
   const text=summary.verses[n];
   assert.ok(await root.locator('text=Análise morfológica e sintática').count());
   assert.equal(await root.locator('[data-analysis-details]').count(),1);
   await root.locator('[data-analysis-details] summary').click();
   assert.equal(await root.locator('[data-structured-token]').count(),text.wordCount,'Palavras incompletas Gn 1:'+n);
   assert.equal(await root.locator('[data-corpus-strong] option').count(),text.lexemeCount);
   const first=root.locator('[data-structured-token="1"]');
   assert.ok((await first.innerText()).includes(text.tokens[0].morphology.rawCode));
   const hasOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
   assert.equal(hasOverflow,false,'Overflow horizontal Gn 1:'+n+' '+width+'px');
   const url=root.locator('.ps-files a');
   assert.equal(await url.count(),3);
   const audit=await url.nth(2).getAttribute('href');
   assert.ok(audit?.includes('GEN.1.'+n+'-auditoria-de-fonte.json'));
   console.log('OK Gn 1:'+n+' @ '+width+'px, '+text.wordCount+' palavras, '+text.lexemeCount+' lemas');
  }
  await ctx.close();
 }
 const ctx=await browser.newContext({viewport:{width:390,height:900}});
 const page=await ctx.newPage();
 page.on('pageerror',e=>scriptErrors.push({width:390,message:e.message}));
 await page.goto(rootUrl+'/comentarios/genesis/capitulo-1/versiculo-2/',{waitUntil:'networkidle'});
 const root=page.locator('[data-genesis-structured="2"]');
 await root.locator('[data-concordance-details] summary').click();
 const selected=root.locator('[data-corpus-strong]');
 await selected.selectOption('H922');
 await root.locator('[data-corpus-load]').click();
 const cards=root.locator('.ps-context');
 await cards.first().waitFor({state:'visible',timeout:30000});
 assert.equal(await cards.count(),3,'H922 tem três versículos distintos');
 assert.ok((await cards.first().innerText()).includes('Gn 1:2'));
 const section=root.locator('[data-corpus-section]');
 await section.selectOption('profetas');
 assert.equal(await cards.count(),2,'H922: dois versículos em Profetas');
 await section.selectOption('pentateuco');
 assert.equal(await cards.count(),1,'H922: um versículo no Pentateuco');
 await section.selectOption('escritos');
 assert.equal(await cards.count(),0,'H922: zero versículos em Escritos');
 await section.selectOption('todas');
 await selected.selectOption('H1961');
 assert.equal(await cards.count(),12,'Paginação de H1961 mostra 12 itens');
 assert.ok((await root.locator('[data-corpus-status]').innerText()).includes('3.131'));
 assert.equal(await root.locator('[data-corpus-pages]').isVisible(),true);
 await root.locator('[data-corpus-next]').click();
 assert.ok((await root.locator('[data-corpus-pageinfo]').innerText()).includes('Página 2'));
 await page.screenshot({path:'genesis-publicacao-1-2-mobile.png',fullPage:true});
 await ctx.close();
 assert.equal(scriptErrors.length,0,JSON.stringify(scriptErrors));
 console.log('HOMOLOGAÇÃO PUBLICÁVEL APROVADA: 8 versículos × 3 resoluções, 90 unidades, filtro canônico, paginação e download.');
}finally{await browser.close()}
