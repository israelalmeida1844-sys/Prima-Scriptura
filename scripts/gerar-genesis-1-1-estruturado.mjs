/**
 * Prima Scriptura — Gênesis 1:1, dado estrutural completo (somente rascunho).
 * Sources: OSHB morphhb v.2.2, six local complete Strong indexes, Almeida 1911 PD.
 * Script validates every concordance reference against the corresponding OSHB
 * verse, saves literal excerpts, and NEVER fabricates a Portuguese alignment.
 * Output is a research artifact, NOT a page or a replacement for deployed data.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';

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
const ids=['H7225','H1254','H430','H853','H8064','H776'];
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
};
// Estas cinco traduções são editoriais próprias, conferidas com os títulos
// massoréticos (Sl 18:1, 34:1, 56:1, 59:1 e 60:2), não com Almeida 1911.
let mtEnglishMap={};
const out='src/editorial/genesis/GEN.1.1-estruturado-completo.json';
const auditOut='src/editorial/genesis/GEN.1.1-auditoria-de-fonte.json';
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
function makeToken(data){
 const [index,surfaceHe,consonantalHe,translit,glossInContext,strong,rawCode,stem,conjugation,person,gender,number,role,roleLabel,governedBy,notesPt]=data;
 const senses=lexical.entries[strong]?.senses?.map(x=>{
  const refs=x.examples.map(e=>e.reference).join(', ');
  return x.label+' ('+refs+')';
 }).join('; ')||'';
 return {id:'GEN.1.1.'+index,index,surfaceHe,consonantalHe,translit,glossInContext,strong,
  morphology:{stem,conjugation,person,gender,number,rawCode},
  syntax:{role,roleLabel,clauseId:'GEN.1.1.C1',governedBy,notesPt},
  sensesPt:senses};
}
const lexical=JSON.parse(await readFile('src/data/lexico-hebraico/genesis-1-1-8.json','utf8'));
const rootData={
 H7225:['ראש','rʾš','princípio, primeira parte, primícias','substantivo feminino'],
 H1254:['ברא','brʾ','criar','verbo'],
 H430:['','','Deus; deuses','substantivo masculino de forma plural'],
 H853:['','','marcador de objeto direto definido','partícula'],
 H8064:['','','céu, céus','substantivo masculino de forma plural'],
 H776:['','','terra, território, solo','substantivo (normalmente feminino)']
};
const lexemes=Object.fromEntries(ids.map(id=>{
 const x=lexical.entries[id];
 if(!x)die('Lema ausente '+id);
 const [rootConsonants,rootTranslit,glossPt,partOfSpeech]=rootData[id];
 return [id,{strong:id,lemmaHe:x.lemma,lemmaTranslit:x.lemmaTransliteration,rootConsonants,rootTranslit,glossPt,partOfSpeech}];
}));
const tokens=[
 [1,'בְּרֵאשִׁית','בראשית','bərēʾšîṯ','No princípio','H7225','HR/Ncfsa','','','','feminino','singular','temporal_adjunct','Adjunto adverbial temporal','GEN.1.1.2','בְּ é prefixo preposicional (HR); o substantivo é Ncfsa no OSHB. A leitura independente ou subordinada de בְּרֵאשִׁית é discutida.'],
 [2,'בָּרָא','ברא','bārāʾ','criou','H1254','HVqp3ms','Qal','perfeito (qatal)','terceira','masculino','singular','predicate','Predicado verbal','', 'Verbo transitivo; sujeito אֱלֹהִים e dois objetos diretos definidos coordenados.'],
 [3,'אֱלֹהִים','אלהים','ʾĕlōhîm','Deus','H430','HNcmpa','','','','masculino','plural morfológico','subject','Sujeito do verbo','GEN.1.1.2','Apesar da forma nominal plural, ocorre com o verbo singular בָּרָא.'],
 [4,'אֵת','את','ʾēṯ','[marcador de objeto direto]','H853','HTo','','','','','','object_marker','Marcador do objeto direto','GEN.1.1.2','Introduz o objeto definido הַשָּׁמַיִם; é partícula sem tradução independente.'],
 [5,'הַשָּׁמַיִם','השמים','haššāmayim','os céus','H8064','HTd/Ncmpa','','','','masculino','plural morfológico','direct_object','Primeiro objeto direto','GEN.1.1.2','Artigo definido הַ (HTd) mais nome plural (Ncmpa).'],
 [6,'וְאֵת','ואת','wəʾēṯ','e [marcador de objeto direto]','H853','HC/To','','','','','','coordinated_object_marker','Conjunção e marcador de objeto','GEN.1.1.2','Conjunção וְ (HC) mais partícula אֵת (To), coordenando o segundo objeto direto.'],
 [7,'הָאָרֶץ','הארץ','hāʾāreṣ','a terra','H776','HTd/Ncbsa','','','','comum (OSHB); feminino no uso','singular','coordinated_direct_object','Segundo objeto direto coordenado','GEN.1.1.2','Artigo definido (HTd) mais Ncbsa. O lema אֶרֶץ é geralmente feminino.']
].map(row=>{if(row[14]==='')row[14]=null;return makeToken(row)});
const concordances={};
const audit={source:'OSHB v.2.2 (WLC) + ALM1911 (domínio público) + STEPBible TVTMS MT→English CC BY 4.0',
 createdAt:'gerado pela auditoria automatizada',
 alignmentUnavailable:[],alignmentWarnings:[],mappingsApplied:[],editorialSuperscriptions:[],counts:{},downloadedBooks:[],errors:[]};
const occurrences=new Map();
for(const id of ids){
 const x=JSON.parse(await readFile('public/data/concordancia-hebraica/'+id+'.json','utf8'));
 if(x.strong!==id||!x.complete||x.sourceVersion!=='v.2.2'||!Array.isArray(x.references)||new Set(x.references).size!==x.verseCount||x.references.length!==x.verseCount)die('Concordância local inconsistente: '+id);
 occurrences.set(id,x);
}
const neededBooks=new Set();
for(const x of occurrences.values())for(const ref of x.references){
 const abbr=ref.match(/^(.+?) \d+:\d+$/)?.[1];
 if(!byAbbr.has(abbr))die('Livro inexistente: '+ref);
 neededBooks.add(abbr);
}
const mappingSource=JSON.parse(await fetchText(versificationUrl));
mtEnglishMap=mappingSource['MT->English'];
if(!mtEnglishMap||Object.keys(mtEnglishMap).length<1000)die('Tabela MT→English insuficiente');
const src=new Map();
const books=[...neededBooks];
for(let offset=0;offset<books.length;offset+=5){
 await Promise.all(books.slice(offset,offset+5).map(async abbr=>{
  const row=byAbbr.get(abbr);
  const [xml,ptJson]=await Promise.all([fetchText(sourceBase+row[1]+'.xml'),fetchText(ptBase+row[2]+'.json')]);
  const hebrew=parseBook(xml,row[1]);
  const portuguese=JSON.parse(ptJson);
  if(portuguese.code!==row[2])die('Livro português não corresponde: '+row[2]);
  src.set(abbr,{row,hebrew,portuguese});
  console.log('Downloaded '+abbr,hebrew.verses.size,'verses; '+portuguese.chapters.length+' Portuguese chapters');
 }));
}
audit.downloadedBooks=books;
for(const id of ids){
 const x=occurrences.get(id);
 const countsBySection={pentateuco:0,profetas:0,escritos:0};
 const items=[];
 for(const ref of x.references){
  const parsed=ref.match(/^(.+?) (\d+):(\d+)$/);
  if(!parsed)die('Ref inválida: '+ref);
  const [,abbr,c,v]=parsed;
  const book=src.get(abbr);
  const [chapter,verse]=[Number(c),Number(v)];
  const osisRef=book.row[1]+'.'+chapter+'.'+verse;
  const words=book.hebrew.verses.get(osisRef);
  if(!words)die('Ausente do texto hebraico: '+ref+' ('+osisRef+')');
  const targetIndex=words.findIndex(w=>w.ids.has(id));
  if(targetIndex<0)die('Strong não corresponde ao WLC: '+id+' em '+ref);
  const excerptHe=words.slice(Math.max(0,targetIndex-2),Math.min(words.length,targetIndex+3)).map(w=>w.he).join(' ');
  if(!excerptHe)die('Excerto hebraico vazio: '+id+' '+ref);
  const excerptPt=checkAndGetPortuguese({row:book.row,chapter,verse,hebrewBook:book.hebrew,portugueseBook:book.portuguese,audit});
  if(!excerptPt)die('Excerto português vazio: '+id+' '+ref);
  const section=book.row[4];
  countsBySection[section]++;
  items.push({ref:book.row[2]+'.'+chapter+'.'+verse,refPt:ref,bookId:book.row[2],bookPt:book.row[3],section,sectionPt:sectionPt[section],excerptHe,excerptPt});
 }
 if(items.length!==x.verseCount||Object.values(countsBySection).reduce((a,b)=>a+b,0)!==x.verseCount)die('Total incompleto: '+id);
 concordances[id]={totalCount:x.verseCount,countsBySection,items};
 audit.counts[id]={tokenCount:x.tokenCount,verseCount:x.verseCount,bySection:countsBySection,excerpts:items.length};
 console.log(id,x.verseCount,'reference items,',x.tokenCount,'tokens');
}
const output={
 verseRef:'GEN.1.1',
 versePt:'Gn 1:1',
 translationPt:'No princípio, Deus criou os céus e a terra.',
 translationNotePt:'Tradução editorial independente. A construção temporal בְּרֵאשִׁית admite discussão sintática; a opção apresentada trata o versículo como oração principal. Nos itens de concordância, excerptPt reproduz a Almeida 1911 em ortografia histórica (domínio público), exceto cinco títulos de salmos sem versículo português numerado, traduzidos editorialmente do Texto Massorético e identificados na auditoria. As correspondências de numeração seguem a tabela STEPBible TVTMS MT→English (CC BY 4.0).',
 lexemes,tokens,concordanceByStrong:concordances
};
if(Object.keys(output).join('|')!=='verseRef|versePt|translationPt|translationNotePt|lexemes|tokens|concordanceByStrong')die('Formato JSON divergente');
if(tokens.length!==7||Object.keys(lexemes).length!==6||Object.keys(concordances).length!==6)die('Estrutura incompleta');
if(!tokens.every(t=>t.morphology.rawCode.startsWith('H')))die('Código morfológico inválido');
const seen=Object.values(concordances).reduce((acc,x)=>acc+x.items.length,0);
if(seen!==11708)die('Era esperado 11708 versículos indexados, obtidos '+seen);
audit.totalItems=seen;
audit.alignmentUnavailableCount=audit.alignmentUnavailable.length;
audit.alignmentWarningCount=audit.alignmentWarnings.length;
audit.numberOfMappedReferences=audit.mappingsApplied.length;
audit.editorialSuperscriptionCount=audit.editorialSuperscriptions.length;
await mkdir(dirname(out),{recursive:true});
await writeFile(out,JSON.stringify(output,null,2)+'\n');
await writeFile(auditOut,JSON.stringify(audit,null,2)+'\n');
console.log('SUCCESS: GEN.1.1 completo;',seen,'registros de concordância, 6 lemas, 7 tokens. Mapas de versificação:',audit.numberOfMappedReferences,'Avisos de alinhamento:',audit.alignmentUnavailableCount,audit.alignmentWarningCount);
