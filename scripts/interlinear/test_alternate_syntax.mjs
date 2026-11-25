import {chromium} from "playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
const report=JSON.parse(fs.readFileSync("docs/auditoria-sintaxe-8-2-3.json","utf8"));
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on("pageerror",e=>errors.push(String(e)));
const checks=[];
try{
 await page.goto("http://127.0.0.1:4321/interlinear-experimental/");
 await page.locator("#words article").first().waitFor();
  await page.locator("#syntax-panel > summary").click();
 for(const reading of ["qere","greek_accent_only"]){
   const ex=report.examples[reading]?.[0];if(!ex)continue;
   await page.locator("#book").selectOption(ex.book);
   const [c,v]=ex.ref.split(":");
   await page.waitForFunction(c=>!!document.querySelector('#chapter option[value="'+c+'"]'),c);
   await page.locator("#chapter").selectOption(c);await page.locator("#verse").selectOption(v);
   await page.locator("#syntax-open").click();
   await page.locator("#alternate-syntax article").first().waitFor();
   assert.ok(await page.locator("#alternate-syntax").getByText(reading==="qere"?"Sintaxe da leitura Qere no MACULA — não atribuída ao Ketiv.":"Correspondência grega com diferença apenas de acentuação, lema e morfologia confirmados.",{exact:true}).count()>0);
   assert.ok(await page.locator("#alternate-syntax").getByText(ex.source[0].source_id,{exact:false}).count()>0);
   checks.push(reading);
 }
 assert.ok(checks.includes("qere"));assert.deepEqual(errors,[]);
 fs.writeFileSync("docs/testes-sintaxe-complementar.json",JSON.stringify({status:"passed",checks,page_errors:errors},null,2)+"\n");
}finally{await browser.close();}
