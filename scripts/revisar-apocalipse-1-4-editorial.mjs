import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root='src/data/texto-original/apocalipse/';
const numbers={1:20,2:29,3:22,4:11};
const clean=s=>String(s??'').trim();
const bare=s=>clean(s).replace(/[.,;··:!?]+$/u,'');
const unique=arr=>[...new Set(arr.map(clean).filter(Boolean))];
const reports=[];
let edits={glosses:0,apostrophes:0,syntacticRoles:0,notes:0,explanations:0};
const variantsDefault='Esta ficha não apresenta variante manuscrita específica verificada para o versículo. A ausência de variante relevante não pode ser afirmada sem colação dos aparatos NA28/ECM e das testemunhas; o texto exibido segue o SBLGNT.';
const readModel=(chapter,verse)=>{
 const path=root+'apocalipse-'+chapter+'-'+verse+'.ts';
 const source=fs.readFileSync(path,'utf8');
 const match=/export const\s+(apocalipse\d+v\d+)\s*=\s*/.exec(source);
 assert.ok(match,'Exportação inesperada: '+path);
 const left=source.indexOf('{',match.index+match[0].length),right=source.lastIndexOf('}')+1;
 let data;
 try{data=JSON.parse(source.slice(left,right));}
 catch{data=vm.runInNewContext('('+source.slice(left,right)+')',{}, {timeout:1000});}
 assert.equal(data.chapter,chapter);assert.equal(data.verse,verse);
 return {path,source,left,right,name:match[1],data};
};
const originalWord=(w)=>[w.greek,w.lemma,w.morphologyCode,w.morphgntPos||null,w.strong];
const article={
 'ὁ':'o','ἡ':'a','οἱ':'os','αἱ':'as','τό':'o','τὸ':'o','τά':'os','τὰ':'os',
 'τοῦ':'do','τῆς':'da','τῶν':'dos','τῷ':'ao','τῇ':'à','τοῖς':'aos','ταῖς':'às',
 'τόν':'o','τὸν':'o','τὴν':'a','τοὺς':'os','τὰς':'as','τῶ':'ao'
};
const pronoun=(w,words,i)=>{
 const g=bare(w.greek).toLowerCase(),m=w.morphologyCode||'';
 if(['ἐμοῦ','μου'].includes(g)){
  const p=words[i-1]&&bare(words[i-1].greek);
  return g==='ἐμοῦ'?'de mim':(p==='θρόνῳ'||p==='πατρός'||p==='ὀνόματι'||p==='κύριε'?'meu':'meu');
 }
 if(g==='σου')return 'teu';
 if(g==='ἡμῶν')return 'nosso';
 if(g==='ὑμῶν')return 'de vocês';
 if(g==='αὐτοῦ')return 'dele';
 if(g==='αὐτῆς')return 'dela';
 if(g==='αὐτῶν')return m.includes('GPF')?'delas':'deles';
 if(g==='αὐτῷ')return 'a ele';
 if(g==='αὐτῇ')return 'a ela';
 if(g==='αὐτοῖς')return 'a eles';
 if(g==='αὐταῖς')return 'a elas';
 if(g==='αὐτόν')return 'ele';
 if(g==='αὐτήν')return 'ela';
 if(g==='ἐγώ'||g==='ἐγὼ')return 'eu';
 return null;
};
const specialGloss=(w,words,i,chapter,verse)=>{
 const g=bare(w.greek),lower=g.toLowerCase(),strong=w.strong;
 if(strong==='G3588'){
  const a=article[lower];
  const prev=words[i-1]&&bare(words[i-1].greek).toLowerCase();
  if(prev==='ἐν'&&['τῷ','τῇ','τοῖς','ταῖς'].includes(lower))return {'τῷ':'o','τῇ':'a','τοῖς':'os','ταῖς':'as'}[lower];
  return a||null;
 }
 if(['G846','G1473','G4771','G2248','G5210'].includes(strong)){
  const p=pronoun(w,words,i);if(p)return p;
 }
 if(strong==='G2532')return 'e';
 if(strong==='G1722')return 'em';
 if(strong==='G1163')return 'é necessário';
 if(strong==='G1325'&&lower==='δώσω')return 'concederei';
 if(strong==='G3528'){
  if(lower==='νικῶν')return 'que vence';
  if(lower==='ἐνίκησα')return 'venci';
  if(lower==='ἐνίκησεν')return 'venceu';
 }
 if(strong==='G1510'){
  if(lower==='εἶ')return 'és';
  if(lower==='ἐστίν'||lower==='ἐστιν')return 'é';
  if(lower==='εἰσιν')return 'são';
  if(lower==='ἦν')return 'era';
  if(lower==='ἦσαν')return 'existiam';
 }
 if(chapter===3&&verse===21){
  if(g==='μετ’')return 'com';
  if(g==='κἀγὼ')return 'eu também';
 }
 return null;
};
const broadGloss=(w)=>{
 const s=clean(w.gloss);
 if(!s)return s;
 if(/Artigo definido identificador e determinador/i.test(s))return 'o';
 if(/Conjunção aditiva e coordenativa/i.test(s))return 'e';
 if(/Pronome pessoal de terceira pessoa/i.test(s))return 'dele';
 if(/uso adverbial ou temporal/i.test(s)&&w.strong==='G1722')return 'em';
 if(s.length>=34&&/[;,]/.test(s))return clean(s.split(/[;,]/)[0]).toLowerCase();
 return s;
};
const role=(w,words,i,chapter,verse)=>{
 const g=bare(w.greek).toLowerCase(),a=words[i+1]&&bare(words[i+1].greek).toLowerCase(),b=words[i+2]&&bare(words[i+2].greek).toLowerCase();
 if(chapter===3&&verse===21){
  const exact={
    'αὐτῷ':'Dativo de destinatário de δώσω (a ele)',
    'μετ’':'Preposição μετά que rege o genitivo ἐμοῦ (companhia)',
    'ἐμοῦ':'Genitivo regido por μετά (comigo)',
    'μου':'Genitivo possessivo (meu)',
    'ὡς':'Conjunção comparativa que introduz a cláusula da vitória de Cristo',
    'κἀγὼ':'Sujeito enfático da oração comparativa (eu também)',
    'καὶ':'Conjunção que coordena os verbos de Cristo',
    'μετὰ':'Preposição μετά que rege o genitivo τοῦ πατρός (companhia)',
    'αὐτοῦ':'Genitivo possessivo: trono dele'
  };
  if(g==='ἐν'&&['τῷ','τῇ'].includes(a)&&b==='θρόνῳ')return 'Preposição ἐν com dativo locativo: «no trono»';
  if(g==='θρόνῳ')return 'Núcleo do sintagma dativo locativo regido por ἐν';
  if(exact[g])return exact[g];
 }
 if(g==='ἐν'&&['τῷ','τῇ'].includes(a)&&b==='θρόνῳ')return 'Preposição ἐν com dativo locativo: «no trono»';
 if(g==='θρόνῳ'&&i>=2&&bare(words[i-2].greek)==='ἐν')return 'Substantivo dativo com valor locativo regido por ἐν';
 const old=clean(w.syntax?.role);
 if(old&&!/a revisar|não definida|a definir|função indeterminada|sem análise/i.test(old))return old;
 if(w.strong==='G3588')return 'Determinante do sintagma nominal';
 if(w.morphgntPos==='C-'||/Conjunção/i.test(w.partOfSpeech))return 'Conector entre orações ou termos coordenados';
 if(w.morphgntPos==='P-'||/Preposição/i.test(w.partOfSpeech))return 'Introduz complemento preposicional; regência interpretada no contexto';
 if(w.morphgntPos==='V-'||/Verbo/i.test(w.partOfSpeech)){
  if(/particípio/i.test(w.morphology||''))return 'Forma participial; relação contextual com a oração';
  if(/infinitivo/i.test(w.morphology||''))return 'Forma infinitiva dependente da oração';
  return 'Núcleo verbal da oração';
 }
 if(w.morphgntPos==='N-'||/Substantivo/i.test(w.partOfSpeech))return 'Núcleo de sintagma nominal';
 if(/Pronome/i.test(w.partOfSpeech)){
  if(/genitivo/i.test(w.morphology||''))return 'Pronome no genitivo; valor definido pela construção';
  if(/dativo/i.test(w.morphology||''))return 'Pronome no dativo; valor definido pela construção';
  return 'Pronome com função referencial na oração';
 }
 if(/Adjetivo/i.test(w.partOfSpeech))return 'Modificador nominal ou predicativo segundo a construção';
 return 'Elemento conectivo ou modificador no contexto da oração';
};
const cleanNote=s=>clean(s).replace(/^\[(?:Revisão acadêmica complementar|Nota acadêmica)\]\s*/iu,'').replace(/^Exegese:\s*/iu,'').replace(/^Crítica textual:\s*/iu,'').trim();
function processNotes(d,chapter,verse){
 if(Array.isArray(d.syntacticNotes)&&d.syntacticNotes.length)return;
 const raw=clean(d.textualNotes);
 const oldExe=Array.isArray(d.exegeticalNotes)?d.exegeticalNotes:[];
 const hasVerifiedEditionContrast=/(Textus Receptus|Scrivener|texto bizantino|texto majoritário)/i.test(raw)&&!/(necessita cotejo|alega[cç][ãa]o anterior|sem unidade)/i.test(raw);
 let critical=variantsDefault;
 let blocks=raw.split(/\n\s*\n/).map(clean).filter(Boolean);
 if(hasVerifiedEditionContrast){
  const first=blocks[0]||'';
  const cut=first.search(/(?:\s+[Ἀ-῾][\s\S]{0,40}\s+(?:são|está|é|introduz|descreve|expressa|contém|regem|apresenta|funcionam|retoma))|(?:\s+κρατῶν\s)/u);
  let candidate=cut>90?first.slice(0,cut).trim():first;
  if(candidate.includes('Crítica textual:'))candidate=candidate.split('Crítica textual:').at(-1).trim();
  candidate=candidate.replace(/\[Revisão acadêmica complementar\][\s\S]*/u,'').trim();
  critical='Comparação editorial de edições gregas (não substitui colação de manuscritos): '+candidate;
 }
 const gram=[],exe=[];
 for(const block of blocks){
  let v=cleanNote(block);
  if(!v)continue;
  if(/^Crítica textual:/i.test(block)||/^Aparato crítico:/i.test(block))continue;
  if(/^Exegese:/i.test(block)){exe.push(v);continue;}
  if(hasVerifiedEditionContrast&&block===blocks[0])continue;
  v=v.replace(/\s*Aparato crítico:.*$/su,'').trim();
  if(v&&v!==critical)gram.push(v);
 }
 for(const old of oldExe){
  if(!old||clean(old)===raw)continue;
  for(const s of clean(old).split(/\n\s*\n/)){
   if(/^Crítica textual:/i.test(s))continue;
   const v=cleanNote(s);
   if(!v)continue;
   if(/(?:nominativo|genitivo|dativo|partic[ií]pio|aoristo|morfologia|preposi[cç][ãa]o|sujeito|indicativo|infinitivo)/i.test(v)&&!/(doutrina|teologia|salva[cç][ãa]o|Cristo identifica|trono prometido|símbolo)/i.test(v))gram.push(v);
   else exe.push(v);
  }
 }
 if(chapter===1&&verse===1){
  gram.length=0;
  gram.push('O título Ἀποκάλυψις Ἰησοῦ Χριστοῦ contém genitivo cuja função deve ser analisada à luz do desenvolvimento da oração, especialmente ἣν ἔδωκεν αὐτῷ ὁ θεός.');
  exe.push('Jesus recebe a revelação de Deus e participa de sua comunicação; a dimensão cristológica do conteúdo deve ser examinada no conjunto do livro.');
 }
 if(chapter===3&&verse===21){
  gram.length=0;exe.length=0;
  gram.push('ὁ νικῶν é particípio presente articular substantivado («aquele que vence»). δώσω rege o infinitivo aoristo καθίσαι; ὡς κἀγὼ estabelece a comparação entre a vitória de Cristo e a promessa ao vencedor.');
  gram.push('μετ’ ἐμοῦ e μετὰ τοῦ πατρός μου contêm μετά com genitivo de companhia. ἐν τῷ θρόνῳ μου e ἐν τῷ θρόνῳ αὐτοῦ contêm ἐν + dativo locativo («no meu trono», «no trono dele»).');
  exe.push('A promessa de participação no trono utiliza linguagem régia e escatológica; comparar Ap 4–5 e 20–22. Não equivale, por si só, a uma declaração de igualdade ontológica com o Pai.');
 }
 const uniqGram=unique(gram.filter(s=>!/(crítica textual|aparato crítico|testemunho individual|não há variantes)/i.test(s)));
 const uniqExe=unique(exe.filter(s=>!/(crítica textual|aparato crítico|testemunho individual|não há variantes)/i.test(s)));
 if(uniqGram.length===0)uniqGram.push('A análise morfológica palavra a palavra consta da ficha lexical; as construções que dependem de interpretação são apresentadas de modo conservador.');
 d.textualNotes=critical;
 d.syntacticNotes=uniqGram;
 d.exegeticalNotes=uniqExe;
 edits.notes++;
}
function wordNote(w){
 const g=bare(w.greek);
 const role=clean(w.syntax?.role);
 if(w.strong==='G3588')return 'O artigo acompanha o termo nominal ou substantiva um elemento da oração; verificar sua concordância com o termo determinado.';
 if(w.strong==='G1722')return role.includes('locativo')?'Nesta construção, ἐν rege o dativo com valor locativo.':'O valor da preposição ἐν é determinado pelo dativo e pelo contexto da construção.';
 if(w.strong==='G846')return 'A referência do pronome e seu papel na construção são determinados pelo caso e pelo antecedente imediato.';
 if(w.strong==='G2532')return 'Conjunção coordenativa; seu valor exato depende da relação entre os membros que conecta.';
 if(w.morphgntPos==='V-')return 'O valor temporal e aspectual desta forma deve ser interpretado no contexto da oração, sem inferir cronologia apenas da flexão.';
 return 'A função deste vocábulo na construção está identificada no campo sintático, separada dos comentários exegéticos.';
}
function fixWords(d,c,v){
 const immutable=d.words.map(originalWord).map(x=>JSON.stringify(x));
 d.words.forEach((w,i)=>{
  const current=clean(w.gloss),s=specialGloss(w,d.words,i,c,v)||broadGloss(w);
  if(s!==current&&s){w.gloss=s;edits.glosses++;}
  if(/[᾽’ʼ']$/u.test(bare(w.greek))){const previous=w.transliteration;w.transliteration=w.transliteration.replace(/[᾽’ʼ']$/u,"'");if(!/'$/u.test(w.transliteration))w.transliteration+="'";if(w.transliteration!==previous)edits.apostrophes++;}
  if(w.syntax){
   const newRole=role(w,d.words,i,c,v);
   if(newRole!==w.syntax.role){w.syntax.role=newRole;edits.syntacticRoles++;}
  }
  if(/^Forma «/u.test(clean(w.explanation))){
   w.explanation=wordNote(w);
   edits.explanations++;
  }
 });
 assert.deepEqual(d.words.map(originalWord).map(x=>JSON.stringify(x)),immutable,'Token grego ou análise morfológica alterado em Ap '+c+':'+v);
}
for(const [key,count] of Object.entries(numbers)){
 const chapter=Number(key);
 for(let verse=1;verse<=count;verse++){
  const r=readModel(chapter,verse);
  assert.ok(Array.isArray(r.data.words)&&r.data.words.length,'Sem tokens: '+r.path);
  processNotes(r.data,chapter,verse);
  fixWords(r.data,chapter,verse);
  const updated=r.source.slice(0,r.left)+JSON.stringify(r.data,null,2)+r.source.slice(r.right);
  fs.writeFileSync(r.path,updated);
  reports.push({chapter,verse,tokens:r.data.words.length,grammaticalNotes:r.data.syntacticNotes.length,exegeticalNotes:r.data.exegeticalNotes.length});
 }
}
fs.mkdirSync('.github/reports',{recursive:true});
const reportFile='.github/reports/apocalipse-1-4-revisao-editorial.json';
const prior=fs.existsSync(reportFile)?JSON.parse(fs.readFileSync(reportFile,'utf8')):null;
const totals={...edits};if(prior?.changes)for(const key of Object.keys(totals))totals[key]+=prior.changes[key]||0;
fs.writeFileSync(reportFile,JSON.stringify({source:'SBLGNT/MorphGNT 6.12; análise editorial conservadora sem colação integral de aparato crítico',chapters:4,verses:reports.length,tokens:reports.reduce((a,b)=>a+b.tokens,0),changes:totals,detail:reports},null,2)+'\n');
console.log(JSON.stringify({verses:reports.length,tokens:reports.reduce((a,b)=>a+b.tokens,0),changes:edits}));
