/**
 * Prima Scriptura — auditoria estática de Apocalipse 1–4.
 * Uso: node scripts/auditar-apocalipse.mjs
 * Não inventa variantes manuscritas nem substitui revisão filológica humana.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const base = process.cwd();
const chapters = {1:20,2:29,3:22,4:11};
const issues = [];
const add = (severity, ref, code, detail) => issues.push({severity,ref,code,detail});
const read = name => fs.readFileSync(path.join(base,name),'utf8');
const exists = name => fs.existsSync(path.join(base,name));
const empty = value => !String(value ?? '').trim() || ['-','—','•'].includes(String(value).trim());
const normalize = value => String(value ?? '').normalize('NFC').trim().replace(/\s+/g,' ').toLowerCase();
let totalTokens=0, totalVerses=0;
const lexiconPath='src/data/lexico-grego/apocalipse-4-1-11.json';
let lexicalEntries={};
if(!exists(lexiconPath))add('erro','Léxico','LEXICO_AUSENTE',lexiconPath);
else{
 try{
  lexicalEntries=JSON.parse(read(lexiconPath)).entries||{};
  for(const [strong,entry] of Object.entries(lexicalEntries)){
   if(!entry.lemma||!Array.isArray(entry.senses))add('erro',strong,'VERBETE_INCOMPLETO','Faltam lema ou acepções');
   for(const sense of entry.senses||[]){
    if(empty(sense.label)&&empty(sense.definition))add('alerta',strong,'SENTIDO_VAZIO','Acepção sem título ou definição');
    for(const ex of sense.examples||[]){
     if(empty(ex.greek)||empty(ex.translation))add('alerta',strong,'EXEMPLO_VAZIO','Exemplo sem grego ou tradução');
    }
   }
  }
 }catch(err){add('erro','Léxico','LEXICO_INVALIDO',err.message);}
}


for (const [ch,limit] of Object.entries(chapters)) {
 const route=`src/pages/comentarios/apocalipse/capitulo-${ch}/[versiculo].astro`;
 if(!exists(route))add('erro',`Ap ${ch}`,'ROTA_AUSENTE',route);
 else {
  const tpl=read(route);
  if(!tpl.includes('aria-current'))add('alerta',`Ap ${ch}`,'NAVEGACAO_ATIVA','Ausência de aria-current');
  if(!tpl.includes('Versículos do capítulo'))add('alerta',`Ap ${ch}`,'ROTULO_NAVEGACAO','Falta rótulo visível');
  if(!tpl.includes('getStaticPaths'))add('erro',`Ap ${ch}`,'ROTAS_ESTATICAS','Falta getStaticPaths');
 }
 for(let v=1;v<=limit;v++){
  const ref=`Ap ${ch}:${v}`;
  const dataPath=`src/data/texto-original/apocalipse/apocalipse-${ch}-${v}.ts`;
  const componentPath=`src/components/TextoOriginalApocalipse${ch}v${v}.astro`;
  if(!exists(dataPath)){add('erro',ref,'DADOS_AUSENTES',dataPath);continue;}
  if(!exists(componentPath)){add('erro',ref,'COMPONENTE_AUSENTE',componentPath);continue;}
  let data;
  try{
   const txt=read(dataPath);
   const m=txt.match(/export const\s+\w+\s*=\s*([\s\S]*?)\s+as const\s*;/);
   if(!m)throw Error('Objeto literal exportado não encontrado');
   data=vm.runInNewContext('('+m[1]+')',Object.create(null),{timeout:1000});
  }catch(e){add('erro',ref,'PARSING',e.message);continue;}
  totalVerses++;
  if(data.chapter!==Number(ch)||data.verse!==v)add('erro',ref,'REFERENCIA','Capítulo/versículo divergem do caminho');
  const words=data.words;
  if(!Array.isArray(words)||!words.length){add('erro',ref,'TOKENS','Sem palavras');continue;}
  totalTokens+=words.length;
  const component=read(componentPath);
  for(const label of ['data-lexicon-meanings','syntactic-panel','textual-criticism-panel','exegetical-panel','data-occurrences-toggle']){
   if(!component.includes(label))add('erro',ref,'TEMPLATE_SECAO',`Componente sem ${label}`);
  }
  const seen=new Set();
  for(const [i,w] of words.entries()){
   const key=`${ref} token ${i+1} (${w.greek || '?'})`;
   for(const field of ['id','greek','lemma','strong','transliteration','gloss','morphology']){
    if(empty(w[field]))add('erro',key,'CAMPO_VAZIO',field);
   }
   if(!lexicalEntries[w.strong])add('alerta',key,'STRONG_SEM_VERBETE',w.strong);
   if(!/^G\\d+$/.test(w.strong||''))add('alerta',key,'STRONG_FORMATO',w.strong);
   if(seen.has(w.id))add('erro',key,'ID_DUPLICADO',w.id);
   seen.add(w.id);
   if(/[.,;··:!?]$/.test(w.greek||''))add('alerta',key,'PONTUACAO_TOKEN','Pontuação incorporada à palavra');
   if(/[᾽’ʼ]$/.test(w.greek||'')&&!/['’]$/.test(w.transliteration||''))add('alerta',key,'APOSTROFO','Elisão sem apóstrofo transliterado');
   if(String(w.gloss||'').length>45)add('alerta',key,'GLOSA_LONGA',w.gloss);
   if(/;/.test(w.gloss||''))add('alerta',key,'GLOSA_MULTIPLA',w.gloss);
   if(['ἐμοῦ','μου'].includes(w.greek)&&['eu','nós'].includes(normalize(w.gloss)))add('erro',key,'GENITIVO_PRONOME',w.gloss);
   if(w.greek==='αὐτοῦ' && /^ele(?:,|;|$)/i.test(w.gloss||''))add('alerta',key,'GENITIVO_TERCEIRA_PESSOA',w.gloss);
   if(w.greek==='ἐν'&&/temporal|adverbial/i.test(w.syntax?.role||'')&&words.slice(i+1,i+4).some(x=>x.greek==='θρόνῳ'))add('alerta',key,'LOCATIVO_TRONO',w.syntax.role);
   if(/teológic|escatológic|Jesus Cristo|igreja de Laodiceia/i.test(w.meanings||'') && ['RA','P-','C-'].includes(w.morphgntPos))add('alerta',key,'TEOLOGIA_EM_LEXICO','Possível explicação exegética em palavra funcional');
  }
  const syn=(data.syntacticNotes||[]).filter(s=>!empty(s));
  const exe=(data.exegeticalNotes||[]).filter(s=>!empty(s));
  const txt=data.textualNotes;
  if(empty(txt))add('alerta',ref,'CRITICA_VAZIA','Nota textual vazia');
  if(/\b(sintátic|dativo locativo|particípio|morfologi|interpretaç|temporal do verbo)\b/i.test(txt||''))add('alerta',ref,'CRITICA_FORA_DE_ESCOPO','Conferir se a nota realmente discute variantes');
  const noteStrings=[...syn,...exe,txt].filter(x=>!empty(x));
  for(let i=0;i<noteStrings.length;i++)for(let j=i+1;j<noteStrings.length;j++){
   if(normalize(noteStrings[i])===normalize(noteStrings[j]))add('erro',ref,'NOTA_DUPLICADA','Texto idêntico em duas seções editoriais');
  }
  for(const note of [...syn,...exe])if(/^\s*[-—•]\s*$/.test(note))add('alerta',ref,'MARCADOR_VAZIO','Marcador sem texto');
 }
}
const result={date:new Date().toISOString(),scope:'Apocalipse 1:1–4:11',versesExpected:82,versesChecked:totalVerses,tokensChecked:totalTokens,errors:issues.filter(x=>x.severity==='erro').length,warnings:issues.filter(x=>x.severity==='alerta').length,issues};
fs.mkdirSync(path.join(base,'audit-results'),{recursive:true});
fs.writeFileSync(path.join(base,'audit-results/apocalipse-1-4.json'),JSON.stringify(result,null,2)+'\n');
console.log(`Auditoria: ${result.versesChecked}/82 versículos; ${totalTokens} tokens; ${result.errors} erros; ${result.warnings} alertas.`);
for(const issue of issues.slice(0,50))console.log(`${issue.severity.toUpperCase()} ${issue.ref} [${issue.code}]: ${issue.detail}`);
if(issues.length>50)console.log(`... ${issues.length-50} ocorrências restantes no JSON`);
if(result.errors)process.exitCode=1;
