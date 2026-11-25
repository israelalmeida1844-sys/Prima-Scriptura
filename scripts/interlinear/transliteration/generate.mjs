import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {transliterate, SBL} from "hebrew-transliteration";

const BOOKS="Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev".split(" ");
const MAP={α:"a",β:"b",γ:"g",δ:"d",ε:"e",ζ:"z",η:"ē",θ:"th",ι:"i",κ:"k",λ:"l",μ:"m",ν:"n",ξ:"x",ο:"o",π:"p",ρ:"r",σ:"s",ς:"s",τ:"t",υ:"y",φ:"ph",χ:"ch",ψ:"ps",ω:"ō"};
const VOWEL=new Set("αεηιουω");
const DIP=new Set(["αι","ει","οι","υι","αυ","ευ","ηυ","ου"]);
function greek(s){
  const clusters=[];
  for(const c of s.normalize("NFD")){
    if(/\p{Script=Greek}/u.test(c)&&/\p{L}/u.test(c)){
      const lower=c.toLowerCase();if(!MAP[lower])throw Error("Greek letter not covered: "+c);
      clusters.push({base:lower,upper:c!==lower,marks:[]});
    }else if(/\p{M}/u.test(c)){
      if(!clusters.length)throw Error("Orphan Greek mark "+c);
      clusters.at(-1).marks.push(c);
    }else if(/\p{L}/u.test(c))throw Error("Non-Greek letter "+c);
  }
  if(!clusters.length)throw Error("No Greek letters");
  const parts=[];
  for(let i=0;i<clusters.length;i++){
    const c=clusters[i],next=clusters[i+1],prev=clusters[i-1];
    let out=MAP[c.base];
    if(c.base==="γ"&&next&&"γκχξ".includes(next.base))out="n";
    if(c.base==="υ"&&prev&&DIP.has(prev.base+c.base)&&!c.marks.includes("\u0308"))out="u";
    if(c.marks.includes("\u0345"))out+="i";
    if(c.base==="ρ"&&c.marks.includes("\u0314"))out="rh";
    if(VOWEL.has(c.base)&&c.marks.includes("\u0314")){
      if(i===1&&prev&&DIP.has(prev.base+c.base)&&!c.marks.includes("\u0308"))parts[0]="h"+parts[0];
      else out="h"+out;
    }
    parts.push(out);
  }
  let result=parts.join("");
  if(clusters[0].upper)result=result[0].toUpperCase()+result.slice(1);
  return result;
}
const strictSchema=new SBL({strict:true,allowNoNiqqud:false,DIVINE_NAME:"yhwh",DIVINE_NAME_ELOHIM:"yhwh"});
const relaxedSchema=new SBL({strict:false,allowNoNiqqud:true,DIVINE_NAME:"yhwh",DIVINE_NAME_ELOHIM:"yhwh"});
const CACHE=new Map();
function semitic(raw){
  // OSHB slash separates morphemes, not orthographic words; no mutation of original.
  const s=raw.replaceAll("/","");
  if(CACHE.has(s))return CACHE.get(s);
  const flags=[];
  if(!/[\u05b0-\u05bb\u05c7]/u.test(s))flags.push("sem_vocalizacao_explicita");
  if(s.includes("\u05b0"))flags.push("sheva_interpretado");
  if(s.includes("\u05b8"))flags.push("qamats_interpretado");
  const plain=s.replace(/[^א-ת]/gu,"");
  if(plain.includes("יהוה"))flags.push("tetragrama_convencional");
  let value=null,status="sbl_automatico";
  try{
    if(flags.includes("sem_vocalizacao_explicita"))throw Error("No niqqud");
    value=transliterate(s,strictSchema);
    if(!validLatin(value))throw Error("Invalid strict output");
  }catch{
    try{
      value=transliterate(s,relaxedSchema);
      if(!validLatin(value))throw Error("Invalid relaxed output");
      status="sbl_modo_permissivo";flags.push("revisao_silabificacao");
    }catch{
      value=null;status="pendente";flags.push("motor_nao_resolveu");
    }
  }
  const result={value,status,flags};CACHE.set(s,result);return result;
}
function validLatin(s){
  return typeof s==="string"&&/\p{Script=Latin}/u.test(s)&&!/[א-ת\u0591-\u05c7]/u.test(s)&&!/\p{Script=Greek}/u.test(s)&&!s.includes("\ufffd");
}
function selftest(){
  for(const [a,b] of [["λόγος","logos"],["ἀγάπη","agapē"],["Ἰησοῦς","Iēsous"],["αἵρεσις","hairesis"],["ὕμνος","hymnos"],["ἄγγελος","angelos"],["ῥῆμα","rhēma"],["ᾧ","hōi"],["Χριστός","Christos"],["Μωϋσῆς","Mōysēs"]])assert.equal(greek(a),b,a);
  for(const [a,b] of [["בָּרָא","bārāʾ"],["שָׁלוֹם","šālôm"]])assert.equal(semitic(a).value,b,a);
  assert.equal(semitic("בְּ/רֵאשִׁית").value,semitic("בְּרֵאשִׁית").value);
  assert.equal(semitic("יְהוָה").value,"yhwh");
  assert.ok(validLatin(semitic("מַלְכָּא").value));
  assert.ok(semitic("מַלְכָּא").flags.includes("sheva_interpretado"));
}
function read(p){return JSON.parse(fs.readFileSync(p,"utf8"))}
function write(p,obj){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(obj)+"\n","utf8")}
function hash(s){return crypto.createHash("sha256").update(s).digest("hex")}
function inc(o,k,n=1){o[k]=(o[k]||0)+n;}
selftest();
const [base,structure,out,report,details]=process.argv.slice(2);
if(!details)throw Error("Usage: generate.mjs base structure out report details");
const manifest=read(path.join(base,"manifest.json"));
assert.deepEqual(new Set(Object.keys(manifest)),new Set(BOOKS));
const totals={},books={},examples={grc:[],hbo:[],arc:[]};
for(const [bi,book] of BOOKS.entries()){
  const raw=fs.readFileSync(path.join(base,book+".json"),"utf8"),data=JSON.parse(raw);
  const source=bi<39?read(path.join(structure,book+".json")):null;
  const result={},pending={},stats={tokens:0,verses:0,transliterated:0};
  for(const [ref,words] of Object.entries(data)){
    const adjacent=new Set();
    for(const ev of source?.[ref]?.events||[]){
      if(ev.element?.attributes?.type==="x-maqqef"){adjacent.add(ev.before_token-1);adjacent.add(ev.before_token);}
    }
    const items=words.map((w,i)=>{
      let r;
      const language=bi>=39?"grc":w.morph?.startsWith("A")?"arc":w.morph?.startsWith("H")?"hbo":"und";
      if(language==="grc"){
        try{r={value:greek(w.word||w.text),status:"grego_ortografico",flags:[]};}
        catch(e){r={value:null,status:"pendente",flags:["grafema_nao_resolvido"],reason:String(e.message)};}
      }else if(language==="hbo"||language==="arc"){
        const v=semitic(w.text);r={...v,flags:[...v.flags]};
        if(adjacent.has(i))r.flags.push("contexto_maqqef");
        if(language==="arc")r.flags.push("aramaico_convencao_grafica_sbl");
      }else r={value:null,status:"pendente",flags:["idioma_nao_identificado"]};
      r.language=language;
      if(r.value!==null){assert.ok(validLatin(r.value),book+" "+ref);inc(stats,"transliterated");inc(stats,language+"_transliterated");}
      else {(pending[ref]??=[]).push({token:i,text:w.text,language,flags:r.flags,reason:r.reason||null});inc(stats,"pending");}
      inc(stats,"tokens");inc(stats,language);inc(stats,r.status);
      for(const flag of r.flags)inc(stats,"flag_"+flag);
      if(r.value&&examples[language]&&examples[language].length<4)examples[language].push({book,ref,original:w.text,transliteration:r.value});
      return r;
    });
    result[ref]=items;inc(stats,"verses");
  }
  assert.equal(stats.tokens,manifest[book].tokens);assert.equal(stats.verses,manifest[book].verses);
  for(const [k,v] of Object.entries(stats))inc(totals,k,v);
  books[book]={...stats,base_sha256:hash(raw)};
  write(path.join(out,book+".json"),result);write(path.join(details,book+".json"),pending);
}
assert.equal(totals.tokens,443061);assert.equal(totals.grc,137554);assert.equal(totals.hbo,300679);assert.equal(totals.arc,4828);
assert.equal(totals.transliterated+(totals.pending||0),totals.tokens);
write(report,{stage:4,status:"automated_transliteration_complete",books:66,totals,books_detail:books,examples,scheme:{greek:"Prima Scriptura academic orthographic adaptation: eta/omega macrons, rough breathing, iota subscript as i; accents not carried over",hebrew:"hebrew-transliteration 2.11.0 SBL academic schema; isolated orthographic token",aramaic:"same graphical SBL schema, not a distinct historical pronunciation model"},scope:"Primary corpus tokens only. Qere variants are not separately transliterated in this stage. Automatic output is not individual philological homologation; flags indicate interpretative or contextual limitations."});
console.log(JSON.stringify(totals));
