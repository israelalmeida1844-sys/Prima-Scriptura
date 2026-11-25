import { chromium } from "playwright";
import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const root="public/interlinear-search";
const meta=read(root+"/manifest.json");
const h=s=>crypto.createHash("sha256").update(s).digest("hex").slice(0,2);
function postings(mode,kind,q){const f=root+"/index/"+mode+"/"+kind+"/"+h(q)+".json";return fs.existsSync(f)?read(f)[q]||[]:[];}
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on("pageerror",e=>errors.push(String(e)));
const checks=[];
try{
  await page.goto("http://127.0.0.1:4321/interlinear-experimental/");
  await page.locator("#words article").first().waitFor();
  await page.locator("#search-features select").first().waitFor();
  const choose=async(id,value)=>page.locator("#"+id).selectOption(value);
  async function query(mode,q,opts={}){
    await choose("search-mode",mode);await page.locator("#query").fill(q);
    await page.locator("#search-loose").setChecked(!!opts.loose);
    await choose("search-testament",opts.testament||"");await choose("search-book",opts.book||"");await choose("search-language",opts.lang||"");await page.locator("#search-chapter").fill(opts.chapter||"");
    for(const s of await page.locator("#search-features select").all())await s.selectOption("");
    for(const [k,v] of Object.entries(opts.features||{}))await page.locator('[data-feature="'+k+'"]').selectOption(v);
    await page.locator("#lex-search button[type=submit]").click();
    await page.waitForFunction(()=>/^\d+ ocorrências em \d+ versículos$/.test(document.querySelector("#search-status").textContent));
    return Number((await page.locator("#search-status").innerText()).split(" ")[0]);
  }
  const tests=[["strong","G03056","g3056"],["original","λόγος","λόγος"],["lema","λόγος","λόγος"],["transliteracao","logos","logos"],["glosa","palavra","palavra"],["morfologia","HVqp3ms","HVqp3ms"]];
  for(const [mode,term,key] of tests){const expected=postings(mode,"exato",key).length;assert.ok(expected>0,mode);assert.equal(await query(mode,term),expected,mode);checks.push(mode);}
  const p=postings("strong","exato","h216");
  const expected=p.filter(([b,v])=>meta.books[b]==="Gen"&&read(root+"/books/Gen.json").refs[v].startsWith("1:")).length;
  assert.ok(expected>0);assert.equal(await query("strong","H216",{book:"Gen",chapter:"1",lang:"hbo"}),expected);
  await page.locator("#hits .search-hit").first().click();
  await page.locator("#words .search-selected").waitFor();assert.equal(await page.locator("#book").inputValue(),"Gen");assert.equal(await page.locator("#chapter").inputValue(),"1");checks.push("filters_navigation");
  const many=await query("strong","G3056");assert.ok(many>25);
  await page.locator("#search-pagination button").last().click();await page.waitForFunction(()=>document.querySelector("#search-pagination").textContent.includes("Página 2 de"));assert.equal(await page.locator("#hits .search-hit").count(),25);checks.push("pagination");
  assert.equal(await query("lema","λογος",{loose:true}),postings("lema","flexivel","λογος").length);checks.push("diacritics");
  const cat=read("public/interlinear-morphology/catalogo.json");const gen=read(root+"/books/Gen.json");
  const feat={classe:"Verbo",tronco:"Qal",pessoa:"Terceira"};
  const n=gen.rows[0].filter(r=>cat[r[2]].partes.some(p=>Object.entries(feat).every(([k,v])=>p.campos[k]===v))).length;
  assert.equal(await query("morfologia","",{book:"Gen",chapter:"1",features:feat}),gen.rows.filter((_,i)=>gen.refs[i].startsWith("1:")).flat().filter(r=>cat[r[2]].partes.some(p=>Object.entries(feat).every(([k,v])=>p.campos[k]===v))).length);checks.push("same_component_morphology");
  assert.equal(await query("strong","G999999"),0);checks.push("zero_results");
  await page.locator("#words article").filter({hasText:"H216"}).first().locator("button").click();
  await page.locator("#lex-dialog").waitFor();await page.locator("#lex-content h3").filter({hasText:"H216"}).waitFor();checks.push("lexical_dialog");
  assert.deepEqual(errors,[]);
  fs.writeFileSync("docs/testes-navegador-interlinear.json",JSON.stringify({status:"passed",viewport:[390,844],checks,page_errors:errors},null,2)+"\n");
  console.log("Browser checks:",checks.join(", "));
}finally{await browser.close();}
