/**
 * Prima Scriptura — Gênesis 1:2–8, pacote editorial estruturado exaustivo.
 * Derivado do gerador aprovado de Gênesis 1:1. Reutiliza concordâncias completas
 * já verificadas de 1:1, sem alterar índices Strong ou o versículo aprovado.
 * WLC/OSHB v.2.2, ALM1911 (domínio público), TVTMS (CC BY 4.0).
 * Executar SOMENTE no branch rascunho/genesis.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {syntaxByVerse} from './dados-sintaticos-genesis-1-2-8.mjs';
const ALL=[
['Gn','Gen','GEN','Gênesis','pentateuco'],
['Êx','Exod','EXO','Êxodo','pentateuco'],
['Lv','Lev','LEV','Levítico','pentateuco'],
['Nm','Num','NUM','Números','pentateuco'],
['Dt','Deut','DEU','Deuteronômio','pentateuco'],
['Js','Josh','JOS','Josué','profetas'],
['Jz','Judg','JDG','Juízes','profetas'],
['Rt','Ruth','RUT','Rute','escritos'],
['1Sm','1Sam','1SA','1 Samuel','profetas'],
['2Sm','2Sam','2SA','2 Samuel','profetas'],
['1Rs','1Kgs','1KI','1 Reis','profetas'],
['2Rs','2Kgs','2KI','2 Reis','profetas'],
['1Cr','1Chr','1CH','1 Crônicas','escritos'],
['2Cr','2Chr','2CH','2 Crônicas','escritos'],
['Ed','Ezra','EZR','Esdras','escritos'],
['Ne','Neh','NEH','Neemias','escritos'],
['Et','Esth','EST','Ester','escritos'],
['Jó','Job','JOB','Jó','escritos'],
['Sl','Ps','PSA','Salmos','escritos'],
['Pv','Prov','PRO','Provérbios','escritos'],
['Ec','Eccl','ECC','Eclesiastes','escritos'],
['Ct','Song','SNG','Cântico dos Cânticos','escritos'],
['Is','Isa','ISA','Isaías','profetas'],
['Jr','Jer','JER','Jeremias','profetas'],
['Lm','Lam','LAM','Lamentações','escritos'],
['Ez','Ezek','EZK','Ezequiel','profetas'],
['Dn','Dan','DAN','Daniel','escritos'],
['Os','Hos','HOS','Oseias','profetas'],
['Jl','Joel','JOL','Joel','profetas'],
['Am','Amos','AMO','Amós','profetas'],
['Ob','Obad','OBA','Obadias','profetas'],
['Jn','Jonah','JON','Jonas','profetas'],
['Mq','Mic','MIC','Miqueias','profetas'],
['Na','Nah','NAM','Naum','profetas'],
['Hc','Hab','HAB','Habacuque','profetas'],
['Sf','Zeph','ZEP','Sofonias','profetas'],
['Ag','Hag','HAG','Ageu','profetas'],
['Zc','Zech','ZEC','Zacarias','profetas'],
['Ml','Mal','MAL','Malaquias','profetas']
];
const sectionPt={pentateuco:'Pentateuco',profetas:'Profetas',escritos:'Escritos'};
const byAbbr=new Map(ALL.map(x=>[x[0],x]));
const versesToMake=[2,3,4,5,6,7,8];
const sourceBase='https://raw.githubusercontent.com/openscriptures/morphhb/v.2.2/wlc/';
const ptBase='https://raw.githubusercontent.com/damarals/biblias/bae7ba00cb44729a72b3c1ee20db62da274ff765/data/canonical/ALM1911/';
const versificationUrl='https://raw.githubusercontent.com/metaxiamultimedia/scriptures-js-source-stepbible-versification/f426b7253623731ce788c8ce7abcd1d8f95c1f70/data/stepbible-versification/mapping.json';
const ENGLISH_NAMES={
 Gn:'Genesis','Êx':'Exodus',Lv:'Leviticus',Nm:'Numbers',Dt:'Deuteronomy',Js:'Joshua',Jz:'Judges',Rt:'Ruth',
 '1Sm':'1 Samuel','2Sm':'2 Samuel','1Rs':'1 Kings','2Rs':'2 Kings','1Cr':'1 Chronicles','2Cr':'2 Chronicles',
 Ed:'Ezra',Ne:'Nehemiah',Et:'Esther','Jó':'Job',Sl:'Psalms',Pv:'Proverbs',Ec:'Ecclesiastes',Ct:'Song of Solomon',
 Is:'Isaiah',Jr:'Jeremiah',Lm:'Lamentations',Ez:'Ezekiel',Dn:'Daniel',Os:'Hosea',Jl:'Joel',Am:'Amos',Ob:'Obadiah',
 Jn:'Jonah',Mq:'Micah',Na:'Nahum',Hc:'Habakkuk',Sf:'Zephaniah',Ag:'Haggai',Zc:'Zechariah',Ml:'Malachi'
};
const TITULOS_PSALMOS_PT={
 'Psalms 18:1':'Ao mestre de música. De Davi, servo do Senhor, que dirigiu ao Senhor as palavras deste cântico quando o Senhor o livrou da mão de todos os seus inimigos e da mão de Saul.',
 'Psalms 34:1':'De Davi, quando mudou sua conduta diante de Abimeleque, que o expulsou, e ele partiu.',
 'Psalms 56:1':'Ao mestre de música, conforme “Yonat elem reḥoqim” (designação musical de significado incerto). De Davi, mictão, quando os filisteus o capturaram em Gate.',
 'Psalms 59:1':'Ao mestre de música, conforme “Não destruas”. De Davi, mictão, quando Saul enviou homens para vigiar a casa a fim de matá-lo.',
 'Psalms 60:2':'Quando ele entrou em conflito com Arã-Naharaim e Arã-Zobá, e Joabe voltou e derrotou Edom no vale do Sal: doze mil.'
,
 "Psalms 63:1": "Salmo de Davi, quando ele estava no deserto de Judá.",
 "Psalms 142:1": "Masquil de Davi, quando estava na caverna. Oração.",
 "Psalms 6:1": "Ao regente musical, com instrumentos de cordas, segundo a oitava. Salmo de Davi.",
 "Psalms 7:1": "Sigaiom de Davi, que ele cantou ao Senhor acerca das palavras de Cuxe, benjamita.",
 "Psalms 8:1": "Ao regente musical, segundo a designação 'Gitite'. Salmo de Davi.",
 "Psalms 12:1": "Ao regente musical, segundo a oitava. Salmo de Davi.",
 "Psalms 22:1": "Ao regente musical, segundo 'Corça da alvorada'. Salmo de Davi.",
 "Psalms 45:1": "Ao regente musical, segundo 'Lírios'. Dos filhos de Corá. Masquil. Cântico de amores.",
 "Psalms 46:1": "Ao regente musical. Dos filhos de Corá. Segundo 'Alamote'. Cântico.",
 "Psalms 53:1": "Ao regente musical, segundo 'Maalate'. Masquil de Davi.",
 "Psalms 60:1": "Ao regente musical, segundo 'Lírio do testemunho'. Mictão de Davi, para ensinar.",
 "Psalms 61:1": "Ao regente musical, com instrumento de cordas. De Davi.",
 "Psalms 62:1": "Ao regente musical, segundo Jedutum. Salmo de Davi.",
 "Psalms 69:1": "Ao regente musical, segundo 'Lírios'. De Davi.",
 "Psalms 77:1": "Ao regente musical, segundo Jedutum. De Asafe. Salmo.",
 "Psalms 52:2": "Quando Doegue, o edomita, veio e contou a Saul, dizendo-lhe: Davi entrou na casa de Aimeleque.",
 "Psalms 54:2": "Quando os zifeus vieram e disseram a Saul: Não está Davi escondido entre nós?",
 "Psalms 102:1": "Oração de um aflito, quando desfalece e derrama sua queixa diante do Senhor.",
 "Psalms 92:1": "Salmo. Cântico para o dia de sábado.",
 "Psalms 51:2": "Quando o profeta Natã veio até ele, depois que Davi havia se relacionado com Bate-Seba."
};
// Estes vinte e cinco títulos foram traduzidos editorialmente do hebraico; os cinco iniciais foram mantidos do modelo Gn 1:1.
// Estas cinco traduções são editoriais próprias, conferidas com os títulos
// massoréticos (Sl 18:1, 34:1, 56:1, 59:1 e 60:2), não com Almeida 1911.
let mtEnglishMap={};
const hebAccent=/[\u0591-\u05AF\u05BD\u05BF\u05C0\u05C4\u05C5\u05C7]/g;
function die(message){throw new Error(message)}
function decode(s){return s.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&apos;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>')}
function parseBook(xml,osis){
 const verses=new Map(),chapterVerseCounts=new Map();
 const matches=xml.matchAll(/<verse\b[^>]*\bosisID="([^"]+)"[^>]*>([\s\S]*?)<\/verse>/g);
 for(const [,key,inside] of matches){
  if(!key.startsWith(osis+'.'))continue;
  const words=[];
  for(const [,attributes,contents] of inside.matchAll(/<w\b([^>]*)>([\s\S]*?)<\/w>/g)){
   const lemma=attributes.match(/\blemma="([^"]+)"/)?.[1]||'';
   const morphology=attributes.match(/\bmorph="([^"]+)"/)?.[1]||'';
   const matches=[...lemma.matchAll(/(?:^|[\/\s])(\d{1,5})(?:\s|$|\/)/g)].map(x=>'H'+Number(x[1]));
   const he=decode(contents.replace(/<[^>]+>/g,'')).replaceAll('/','').replace(hebAccent,'').trim();
   if(he)words.push({he,ids:new Set(matches),morphology});
  }
  verses.set(key,words);
  const p=key.match(/^.+\.(\d+)\.(\d+)$/);
  if(p)chapterVerseCounts.set(Number(p[1]),Math.max(Number(p[2]),chapterVerseCounts.get(Number(p[1]))||0));
 }
 if(verses.size===0)die('Livro OSHB sem versículos: '+osis);
 return {verses,chapterVerseCounts};
}
async function fetchText(url,attempts=4){
 for(let i=0;i<attempts;i++){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),90000);
  try{
   const resp=await fetch(url,{signal:controller.signal});
   if(!resp.ok)throw Error('HTTP '+resp.status+' '+url);
   return await resp.text();
  }catch(err){
   if(i===attempts-1)throw err;
   await new Promise(resolve=>setTimeout(resolve,750*(i+1)));
  }finally{clearTimeout(timer)}
 }
}
function checkAndGetPortuguese({row,chapter,verse,hebrewBook,portugueseBook,audit}){
 const mtKey=ENGLISH_NAMES[row[0]]+' '+chapter+':'+verse;
 if(!ENGLISH_NAMES[row[0]])die('Sem nome inglês para o livro '+row[0]);
 const mapping=Object.prototype.hasOwnProperty.call(mtEnglishMap,mtKey)?mtEnglishMap[mtKey]:undefined;
 if(mapping===null){
   if(TITULOS_PSALMOS_PT[mtKey]){
     audit.editorialSuperscriptions.push({ref:row[0]+' '+chapter+':'+verse,source:'Tradução editorial própria do título hebraico (não Almeida 1911)'});
     return TITULOS_PSALMOS_PT[mtKey];
   }
   audit.alignmentUnavailable.push({ref:row[0]+' '+chapter+':'+verse,reason:'Título massorético sem versículo inglês/português correspondente (TVTMS).'});
   return '[Sem tradução portuguesa validada para título de salmo neste corpus.]';
 }
 const ptChapterNumber=mapping?.chapter??chapter;
 const ptVerseNumber=mapping?.verse??verse;
 if(mapping){
  audit.mappingsApplied.push({mt:row[0]+' '+chapter+':'+verse,almeida1911:row[0]+' '+ptChapterNumber+':'+ptVerseNumber,part:mapping.part??null});
 }
 const ptChapter=portugueseBook.chapters.find(x=>x.number===ptChapterNumber);
 const found=ptChapter?.verses?.find(x=>x.number===ptVerseNumber)?.text?.trim();
 if(!found){
  audit.alignmentUnavailable.push({ref:row[0]+' '+chapter+':'+verse,reason:'Nenhum versículo português em '+ptChapterNumber+':'+ptVerseNumber+' (TVTMS).'});
  return '[Não foi possível alinhar este versículo ao texto português histórico.]';
 }
 return found;
}

const rootInfo={
  "H776": [
    "",
    "",
    "terra; território; solo",
    "substantivo predominantemente feminino"
  ],
  "H1961": [
    "היה",
    "hyh",
    "ser; estar; acontecer; tornar-se",
    "verbo"
  ],
  "H8414": [
    "",
    "",
    "desolação; sem forma; inutilidade",
    "substantivo masculino"
  ],
  "H922": [
    "",
    "",
    "vazio; desolação",
    "substantivo masculino"
  ],
  "H2822": [
    "חשך",
    "ḥšk",
    "escuridão; trevas",
    "substantivo masculino"
  ],
  "H5921": [
    "",
    "",
    "sobre; acima; em relação a",
    "preposição"
  ],
  "H6440": [
    "",
    "",
    "face; superfície; presença",
    "substantivo de forma plural"
  ],
  "H8415": [
    "",
    "",
    "abismo; águas profundas",
    "substantivo"
  ],
  "H7307": [
    "",
    "",
    "vento; sopro; espírito",
    "substantivo"
  ],
  "H430": [
    "",
    "",
    "Deus; deuses",
    "substantivo de forma plural"
  ],
  "H7363": [
    "רחף",
    "rḥp",
    "pairar; adejar",
    "verbo"
  ],
  "H4325": [
    "",
    "",
    "água; águas",
    "substantivo de forma plural"
  ],
  "H559": [
    "אמר",
    "ʾmr",
    "dizer; declarar; responder",
    "verbo"
  ],
  "H216": [
    "אור",
    "ʾwr",
    "luz",
    "substantivo masculino"
  ],
  "H7200": [
    "ראה",
    "rʾh",
    "ver; perceber; avaliar",
    "verbo"
  ],
  "H853": [
    "",
    "",
    "marcador do objeto direto definido",
    "partícula"
  ],
  "H3588": [
    "",
    "",
    "que; porque; quando (conforme a construção)",
    "conjunção/partícula"
  ],
  "H2896": [
    "טוב",
    "ṭwb",
    "bom; agradável; apropriado",
    "adjetivo"
  ],
  "H914": [
    "בדל",
    "bdl",
    "separar; distinguir",
    "verbo"
  ],
  "H996": [
    "",
    "",
    "entre",
    "preposição relacional"
  ],
  "H7121": [
    "קרא",
    "qrʾ",
    "chamar; nomear; invocar",
    "verbo"
  ],
  "H3117": [
    "",
    "",
    "dia; período de luz; tempo",
    "substantivo masculino"
  ],
  "H3915": [
    "",
    "",
    "noite",
    "substantivo masculino"
  ],
  "H6153": [
    "",
    "",
    "tarde; entardecer",
    "substantivo masculino"
  ],
  "H1242": [
    "",
    "",
    "manhã; alvorada",
    "substantivo masculino"
  ],
  "H259": [
    "",
    "",
    "um; unidade",
    "numeral cardinal"
  ],
  "H7549": [
    "רקע",
    "rqʿ",
    "expansão; firmamento",
    "substantivo masculino"
  ],
  "H8432": [
    "",
    "",
    "interior; meio; centro",
    "substantivo"
  ],
  "H6213": [
    "עשה",
    "ʿśh",
    "fazer; realizar; produzir",
    "verbo"
  ],
  "H834": [
    "",
    "",
    "que; o qual",
    "partícula relativa"
  ],
  "H8478": [
    "",
    "",
    "debaixo; em lugar de",
    "termo relacional/preposição"
  ],
  "H3651": [
    "",
    "",
    "assim; desse modo; portanto",
    "advérbio"
  ],
  "H8064": [
    "",
    "",
    "céu; céus",
    "substantivo de forma plural"
  ],
  "H8145": [
    "",
    "",
    "segundo; ordinal segundo",
    "numeral ordinal"
  ]
};
const approvedSource='src/editorial/genesis/GEN.1.1-estruturado-completo.json';
const auditSource='src/editorial/genesis/GEN.1.1-auditoria-de-fonte.json';
const targetDir='src/editorial/genesis/';
const countsExpected={2:14,3:6,4:12,5:13,6:11,7:17,8:10};
const outputStatus={
 generatedFrom:'OSHB morphhb v.2.2 / WLC, ALM1911, STEPBible TVTMS',
 version:'1.0',
 generatedAt:'verificação automatizada, sem publicação'
};
const stripAllMarks = str=>String(str).replace(/[\u0591-\u05C7]/g,'').replace(/[^\u05D0-\u05EA]/g,'');
const lexical=JSON.parse(await readFile('src/data/lexico-hebraico/genesis-1-1-8.json','utf8'));
const approved=JSON.parse(await readFile(approvedSource,'utf8'));
const approvedAudit=JSON.parse(await readFile(auditSource,'utf8'));
if(approved.verseRef!=='GEN.1.1'||approved.tokens.length!==7)die('Modelo 1:1 não confere');
const ref1Original=JSON.stringify(approved);
const editorial=new Map(),strongSet=new Set();
for(const n of versesToMake){
 const s=await readFile('src/data/texto-original/genesis-1-'+n+'.ts','utf8');
 const m=s.match(new RegExp('export const genesis1v'+n+'\\s*=\\s*([\\s\\S]*?)\\s+as const;\\s*$'));
 if(!m)die('Arquivo editorial não pôde ser lido: Gn 1:'+n);
 const obj=Function('"use strict"; return ('+m[1]+');')();
 if(obj.words?.length!==countsExpected[n])die('Segmentação editorial divergente: Gn 1:'+n);
 if(syntaxByVerse[n]?.length!==obj.words.length)die('Anotações sintáticas incompletas: Gn 1:'+n);
 if(!obj.translation||!obj.translationNote)die('Falta tradução editorial Gn 1:'+n);
 editorial.set(n,obj);
 for(const word of obj.words)strongSet.add(word.strong);
}
const ids=[...strongSet];
if(ids.length<25||ids.length>36)die('Número de lemas inesperado: '+ids.length);
const occurrences=new Map();
for(const id of ids){
 const x=JSON.parse(await readFile('public/data/concordancia-hebraica/'+id+'.json','utf8'));
 if(x.strong!==id||!x.complete||x.sourceVersion!=='v.2.2'||x.references.length!==x.verseCount||
   new Set(x.references).size!==x.verseCount||x.tokenCount<x.verseCount)die('Índice Strong inválido: '+id);
 if(!lexical.entries[id]||!rootInfo[id])die('Lema sem curadoria: '+id);
 occurrences.set(id,x);
}
const neededBooks=new Set(['Gn']);
const reusable=new Set(Object.keys(approved.concordanceByStrong).filter(id=>ids.includes(id)));
for(const id of ids)if(!reusable.has(id))for(const ref of occurrences.get(id).references){
 const abbr=ref.match(/^(.+?) \d+:\d+$/)?.[1];
 if(!byAbbr.has(abbr))die('Livro não reconhecido em '+id+': '+ref);
 neededBooks.add(abbr);
}
const mappingSource=JSON.parse(await fetchText(versificationUrl));
mtEnglishMap=mappingSource['MT->English'];
if(!mtEnglishMap||Object.keys(mtEnglishMap).length<1000)die('Tabela de versificação incompleta');
const src=new Map();
const books=[...neededBooks];
for(let offset=0;offset<books.length;offset+=5){
 await Promise.all(books.slice(offset,offset+5).map(async abbr=>{
  const row=byAbbr.get(abbr);
  const [xml,ptJson]=await Promise.all([
   fetchText(sourceBase+row[1]+'.xml'),fetchText(ptBase+row[2]+'.json')
  ]);
  const hebrew=parseBook(xml,row[1]);
  const portuguese=JSON.parse(ptJson);
  if(portuguese.code!==row[2])die('Texto português divergente: '+abbr);
  src.set(abbr,{row,hebrew,portuguese});
  console.log('Corpus:',abbr,hebrew.verses.size,'versículos WLC');
 }));
}
const distinct=Object.fromEntries(ids.map(id=>[id,{
 strong:id,originalIndex:occurrences.get(id).verseCount,
 tokenCount:occurrences.get(id).tokenCount,origin:reusable.has(id)?'aprovado em Gn 1:1':'novo índice expandido',
 mappingsApplied:0,editorialSuperscriptions:[],alignmentUnavailable:[],alignmentWarnings:[]
}]));
const fullConcordance=new Map();
for(const id of ids){
 const index=occurrences.get(id);
 if(reusable.has(id)){
  const entry=approved.concordanceByStrong[id];
  if(entry.items.length!==index.verseCount||entry.totalCount!==index.verseCount ||
    entry.items.some((x,i)=>x.refPt!==index.references[i]))die('Concordância aprovada de 1:1 inconsistente: '+id);
  fullConcordance.set(id,entry);
  continue;
 }
 const countsBySection={pentateuco:0,profetas:0,escritos:0};
 const items=[];
 for(const ref of index.references){
  const matches=ref.match(/^(.+?) (\d+):(\d+)$/);
  if(!matches)die('Referência OSHB inválida '+ref);
  const [,abbr,c,v]=matches;
  const book=src.get(abbr);
  if(!book)die('Corpus não carregado '+abbr);
  const chapter=Number(c),verse=Number(v),key=book.row[1]+'.'+chapter+'.'+verse;
  const words=book.hebrew.verses.get(key);
  if(!words)die('Versículo ausente no XML WLC: '+ref);
  const pos=words.findIndex(w=>w.ids.has(id));
  if(pos<0)die('Strong '+id+' não está no XML OSHB em '+ref);
  const excerptHe=words.slice(Math.max(0,pos-2),Math.min(words.length,pos+3)).map(w=>w.he).join(' ');
  const warnings={alignmentUnavailable:[],alignmentWarnings:[],mappingsApplied:[],editorialSuperscriptions:[]};
  const excerptPt=checkAndGetPortuguese({row:book.row,chapter,verse,
      hebrewBook:book.hebrew,portugueseBook:book.portuguese,audit:warnings});
  if(!excerptHe||!excerptPt)die('Trecho vazio para '+id+' '+ref);
  const srcAudit=distinct[id];
  srcAudit.mappingsApplied+=warnings.mappingsApplied.length;
  srcAudit.editorialSuperscriptions.push(...warnings.editorialSuperscriptions);
  srcAudit.alignmentUnavailable.push(...warnings.alignmentUnavailable);
  srcAudit.alignmentWarnings.push(...warnings.alignmentWarnings);
  const section=book.row[4];
  countsBySection[section]++;
  items.push({ref:book.row[2]+'.'+chapter+'.'+verse,refPt:ref,
   bookId:book.row[2],bookPt:book.row[3],section,sectionPt:sectionPt[section],excerptHe,excerptPt});
 }
 if(items.length!==index.verseCount||Object.values(countsBySection).reduce((a,b)=>a+b,0)!==index.verseCount)
  die('Concordância incompleta: '+id);
 fullConcordance.set(id,{totalCount:index.verseCount,countsBySection,items});
 console.log('Concordância expandida:',id,index.verseCount,'referências',index.tokenCount,'tokens');
}
function morphInfo(raw,word){
 if(!raw||!raw.startsWith('H'))die('Código morfológico OSHB inválido para '+word.hebrew+': '+raw);
 const parts=raw.slice(1).split('/');
 const verb=parts.find(x=>x.startsWith('V'));
 const nominal=parts.find(x=>x.startsWith('N')||x.startsWith('A'));
 const gm={m:'masculino',f:'feminino',c:'comum',b:'comum'};
 const ns={s:'singular',p:'plural',d:'dual'};
 if(verb){
  const stemMap={q:'Qal',N:'Nifal',p:'Piel',P:'Pual',h:'Hifil',H:'Hofal',t:'Hitpael',o:'Polel',O:'Polal',r:'Hitpolel',m:'Poel',M:'Poal'};
  const conjugationMap={p:'perfeito (qatal)',q:'imperfeito (yiqtol)',i:'imperfeito (yiqtol)',w:'wayyiqtol',j:'jussivo',c:'coortativo',v:'imperativo',a:'infinitivo absoluto',c:'coortativo',d:'infinitivo construto',r:'particípio ativo',s:'particípio passivo'};
  const stem=stemMap[verb[1]]||'';
  let conjugation=conjugationMap[verb[2]]||'';
  if(word.morphology.toLowerCase().includes('jussiv')){
   if(conjugation!=='jussivo')conjugation=(conjugation?conjugation+' (valor jussivo contextual)':'jussivo (valor contextual)');
  }
  if(word.morphology.toLowerCase().includes('particípio'))conjugation='particípio'+(verb[2]==='r'?' ativo':'');
  const m=verb.match(/(\d)([mfc])([spd])/);
  const participle=!m?verb.slice(3).match(/^([mfcb])([spd])([ac])?$/):null;
  return {stem,conjugation,person:m?({1:'primeira',2:'segunda',3:'terceira'}[m[1]]):'',
   gender:m?(gm[m[2]]||''):(participle?gm[participle[1]]||'':''),
   number:m?(ns[m[3]]||''):(participle?ns[participle[2]]||'':''),rawCode:raw};
 }
 if(nominal){
  const m=nominal.match(/^[NA].([mfcb])([spd])/);
  return {stem:'',conjugation:'',person:'',gender:m?(gm[m[1]]||''):'',
   number:m?(ns[m[2]]||''):'',rawCode:raw};
 }
 return {stem:'',conjugation:'',person:'',gender:'',number:'',rawCode:raw};
}
const syntaxErrors=[];
const generated=[];
for(const n of versesToMake){
 const ed=editorial.get(n);
 const words=src.get('Gn').hebrew.verses.get('Gen.1.'+n);
 if(!words)die('Versículo Gn 1:'+n+' ausente do corpus OSHB');
 if(words.length!==ed.words.length)
  die('Diferença de segmentação Gn 1:'+n+': OSHB '+words.length+' / editorial '+ed.words.length+
   '; OSHB='+words.map(w=>w.he).join(' '));
 const tokens=ed.words.map((word,i)=>{
  const xml=words[i];
  if(stripAllMarks(word.hebrew)!==stripAllMarks(xml.he))
   die('Forma hebraica diverge em Gn 1:'+n+' token '+(i+1)+'; editorial='+word.hebrew+'; OSHB='+xml.he);
  if(!xml.ids.has(word.strong))
   die('Strong diverge em Gn 1:'+n+' token '+(i+1)+'; editorial='+word.strong+' / OSHB='+[...xml.ids]);
  const note=syntaxByVerse[n][i];
  const [role,roleLabel,clause,governedIndex,notesPt]=note;
  if(!/^C\d+$/.test(clause))die('Oração inválida Gn 1:'+n+' '+clause);
  if(governedIndex!==null&&(governedIndex<1||governedIndex>words.length||governedIndex===i+1))
   die('Referência de governo inválida Gn 1:'+n+':'+(i+1));
  const id='GEN.1.'+n+'.'+(i+1),lexeme=lexical.entries[word.strong];
  const sensesPt=lexeme.senses.map(x=>x.label+' ('+x.examples.map(e=>e.reference).join(', ')+')').join('; ');
  return {id,index:i+1,
   surfaceHe:word.hebrew,consonantalHe:stripAllMarks(word.hebrew),
   translit:word.transliteration,glossInContext:word.gloss,strong:word.strong,
   morphology:morphInfo(xml.morphology,word),
   syntax:{role,roleLabel,clauseId:'GEN.1.'+n+'.'+clause,
    governedBy:governedIndex===null?null:'GEN.1.'+n+'.'+governedIndex,
    notesPt},
   sensesPt};
 });
 const idsVerse=[...new Set(tokens.map(t=>t.strong))];
 const lexemes=Object.fromEntries(idsVerse.map(id=>{
  const entry=lexical.entries[id];
  const [rootConsonants,rootTranslit,glossPt,partOfSpeech]=rootInfo[id];
  return [id,{strong:id,lemmaHe:entry.lemma,lemmaTranslit:entry.lemmaTransliteration,
   rootConsonants,rootTranslit,glossPt,partOfSpeech}];
 }));
 const concordanceByStrong=Object.fromEntries(idsVerse.map(id=>[id,fullConcordance.get(id)]));
 const output={
  verseRef:'GEN.1.'+n,versePt:'Gn 1:'+n,translationPt:ed.translation,
  translationNotePt:ed.translationNote+' As entradas excerptPt das concordâncias utilizam a Almeida 1911 (domínio público), exceto títulos massoréticos identificados como traduções editoriais. A numeração MT→português usa STEPBible TVTMS (CC BY 4.0).',
  lexemes,tokens,concordanceByStrong
 };
 const audit={
  ...outputStatus,verseRef:output.verseRef,translationSource:'tradução editorial própria',
  wordCount:tokens.length,distinctStrongCount:idsVerse.length,
  originalMassoreticVerse:words.map(w=>w.he).join(' '),
  rawCodesVerified:true,consonantalMatches:true,
  tokenStrongReferences:tokens.map(t=>({id:t.id,strong:t.strong,rawCode:t.morphology.rawCode,role:t.syntax.role,clauseId:t.syntax.clauseId})),
  counts:Object.fromEntries(idsVerse.map(id=>[id,{...distinct[id],totalCount:fullConcordance.get(id).totalCount,
    countsBySection:fullConcordance.get(id).countsBySection,items:fullConcordance.get(id).items.length}])),
  allPortugueseExcerptsPresent:idsVerse.every(id=>fullConcordance.get(id).items.every(x=>x.excerptPt&&!x.excerptPt.startsWith('['))),
  totalReferenceItems:idsVerse.reduce((z,id)=>z+fullConcordance.get(id).items.length,0),
  editorialSuperscriptions:idsVerse.flatMap(id=>distinct[id].editorialSuperscriptions),
  alignmentUnavailable:idsVerse.flatMap(id=>distinct[id].alignmentUnavailable),
  alignmentWarnings:idsVerse.flatMap(id=>distinct[id].alignmentWarnings),
  caveats:[
   'A presença de um Strong no versículo foi conferida no WLC/OSHB; a atribuição de sentidos contextuais exige revisão filológica humana.',
   'O excerto português ALM1911 é um versículo, não um alinhamento lexical palavra a palavra.',
   'Concordâncias incluem todos os versículos distintos por Strong, não reproduzem tokens duplicados como linhas independentes.'
  ]
 };
 if(!audit.allPortugueseExcerptsPresent||audit.alignmentUnavailable.length||audit.alignmentWarnings.length)
  syntaxErrors.push({verse:n,absent:audit.alignmentUnavailable.length,warn:audit.alignmentWarnings.length,
   missing:audit.alignmentUnavailable.slice(0,15),examples:audit.editorialSuperscriptions.slice(0,10)});
 await mkdir(targetDir,{recursive:true});
 await writeFile(targetDir+'GEN.1.'+n+'-estruturado-completo.json',JSON.stringify(output,null,2)+'\n');
 await writeFile(targetDir+'GEN.1.'+n+'-auditoria-de-fonte.json',JSON.stringify(audit,null,2)+'\n');
 generated.push({verse:n,tokens:tokens.length,strong:idsVerse.length,items:audit.totalReferenceItems,
  unmatched:audit.alignmentUnavailable.length,warnings:audit.alignmentWarnings.length});
 console.log('GERADO Gn 1:'+n,JSON.stringify(generated.at(-1)));
}
if(JSON.stringify(approved)!==ref1Original)die('Gn 1:1 foi modificado durante esta operação');
const summary={
 scope:'Gênesis 1:2–8',tokenCount:generated.reduce((a,x)=>a+x.tokens,0),
 totalReferenceRows:generated.reduce((a,x)=>a+x.items,0),
 distinctStrongCount:ids.length,verses:generated,processedBooks:books.length,
 reusedStrongCount:reusable.size,sourceVersion:'v.2.2',
 editorialPending:true,
 unresolved:syntaxErrors
};
await writeFile(targetDir+'GEN.1.2-8-relatorio-geracao.json',JSON.stringify(summary,null,2)+'\n');
console.log('RESUMO COMPLETO:',JSON.stringify(summary));
if(syntaxErrors.length){
 const refs=[...new Set(syntaxErrors.flatMap(e=>e.missing.map(m=>m.ref)))];
 const sourceRecords=refs.map(ref=>{
  const m=ref.match(/^(.+?) (\d+):(\d+)$/);
  const book=src.get(m[1]);
  return {ref,hebrew:book.hebrew.verses.get(book.row[1]+'.'+m[2]+'.'+m[3]).map(x=>x.he).join(' ')};
 });
 console.log('TITULOS_HEBRAICOS_EXATOS: '+JSON.stringify(sourceRecords));
 die('Alinhamento editorial pendente: '+JSON.stringify(syntaxErrors).slice(0,3000));
}
