/**
 * Auditoria de Apocalipse 1:2: 13 unidades gregas verificadas, lemas, sintaxe,
 * exemplos de léxico e referências exaustivas de 27 livros MorphGNT.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {apocalipse1v2 as v2} from '../src/data/texto-original/apocalipse/apocalipse-1-2.ts';
import {apocalipse1v1 as v1} from '../src/data/texto-original/apocalipse/apocalipse-1-1.ts';
const lex1=JSON.parse(fs.readFileSync('src/data/lexico-grego/apocalipse-1-1.json','utf8'));
const lex2=JSON.parse(fs.readFileSync('src/data/lexico-grego/apocalipse-1-2.json','utf8'));
const expected=[
 ['ὃς','G3739','ὅς','----NSM-','RelPro-NSM'],
 ['ἐμαρτύρησεν','G3140','μαρτυρέω','3AAI-S--','V-AAI-3S'],
 ['τὸν','G3588','ὁ','----ASM-','Art-ASM'],
 ['λόγον','G3056','λόγος','----ASM-','N-ASM'],
 ['τοῦ','G3588','ὁ','----GSM-','Art-GSM'],
 ['θεοῦ','G2316','θεός','----GSM-','N-GSM'],
 ['καὶ','G2532','καί','--------','Conj'],
 ['τὴν','G3588','ὁ','----ASF-','Art-ASF'],
 ['μαρτυρίαν','G3141','μαρτυρία','----ASF-','N-ASF'],
 ['Ἰησοῦ','G2424','Ἰησοῦς','----GSM-','N-GSM'],
 ['Χριστοῦ,','G5547','Χριστός','----GSM-','N-GSM'],
 ['ὅσα','G3745','ὅσος','----APN-','RelPro-APN'],
 ['εἶδεν.','G3708','ὁράω','3AAI-S--','V-AAI-3S']
];
const additional=['G3140','G3056','G3141','G3745','G3708'];
const old=new Set(v1.words.map(w=>w.strong));
const current=new Set(v2.words.map(w=>w.strong));
assert.equal(v1.words.length,28,'Gn 1:1? Não — Ap 1:1 deve ter 28 tokens');
assert.equal(v2.reference,'Apocalipse 1:2');
assert.equal(v2.words.length,13);
assert.equal(current.size,11);
assert.deepEqual([...current].filter(id=>!old.has(id)).sort(),additional.slice().sort());
assert.equal(new Set([...old,...current]).size,25);
assert.ok(v2.translation.length>65 && v2.textualNotes.length>100);
assert.equal(v2.exegeticalNotes.length,5);
for(let i=0;i<expected.length;i++){
 const w=v2.words[i],e=expected[i];
 assert.equal(w.id,'ap1-2-'+(i+1));
 assert.equal(w.greek,e[0]);assert.equal(w.strong,e[1]);assert.equal(w.lemma,e[2]);
 assert.equal(w.morphologyCode,e[3]);assert.equal(w.shortMorph,e[4]);
 assert.equal(w.morphologyCode.length,8);
 assert.ok(w.gloss&&w.transliteration&&w.explanation.length>50);
 assert.ok(w.occurrencesExamples.includes('Ap 1:2'));
 assert.ok(w.syntax.role.length>4&&/^AP\.1\.2\.C[12]$/.test(w.syntax.clauseId));
 assert.ok(w.syntax.governedBy===null||v2.words.some(o=>o.id===w.syntax.governedBy),'Dependência inválida '+w.id);
 const entry=lex2.entries[w.strong]??lex1.entries[w.strong];
 assert.ok(entry && entry.lemma===w.lemma,'Lema divergente em '+w.id);
}
assert.equal(Object.keys(lex2.entries).length,5);
const results={};
for(const id of current){
 const source='public/data/concordancia-grega/'+id+'.json';
 assert.ok(fs.existsSync(source),'Índice ausente: '+id);
 const data=JSON.parse(fs.readFileSync(source,'utf8'));
 assert.equal(data.strong,id);
 assert.equal(data.lemma,(lex2.entries[id]??lex1.entries[id]).lemma);
 assert.equal(data.complete,true);
 assert.equal(data.verseCount,data.references.length);
 assert.equal(new Set(data.references).size,data.verseCount,'Referências repetidas '+id);
 assert.ok(data.tokenCount>=data.verseCount&&data.verseCount>=1);
 assert.equal(Object.values(data.bookDistribution).reduce((a,b)=>a+b,0),data.tokenCount);
 assert.ok(data.references.includes('Ap 1:2'),'Ocorrência textual não localizada '+id);
 if(additional.includes(id))assert.equal(data.sourceCommit,'aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d');
 results[id]={tokenCount:data.tokenCount,verseCount:data.verseCount,bookDistribution:data.bookDistribution};
}
for(const id of additional){
 const e=lex2.entries[id];
 assert.ok(e && e.lemma && e.lemmaTransliteration && e.partOfSpeech);
 assert.ok(Array.isArray(e.senses)&&e.senses.length>=2);
 for(const sense of e.senses){
  assert.ok(sense.id&&sense.label&&sense.definition.length>30);
  assert.ok(sense.examples.length);
  for(const ex of sense.examples){
   assert.ok(ex.reference&&ex.greek&&ex.wordForm&&ex.translation&&ex.explanation);
   assert.ok(ex.greek.includes(ex.wordForm),'Exemplo grego sem a forma '+ex.reference+' / '+id);
   const c=JSON.parse(fs.readFileSync('public/data/concordancia-grega/'+id+'.json','utf8'));
   assert.ok(c.references.includes(ex.reference),'Referência lexical não localizada no índice: '+id+' '+ex.reference);
  }
 }
}
const allIndexFiles=fs.readdirSync('public/data/concordancia-grega/').filter(x=>/^G\d+\.json$/.test(x));
assert.equal(allIndexFiles.length,25,'Devem existir 25 índices no projeto, dos quais 5 são novos');
for(const v of [1,2]){
 assert.ok(fs.existsSync('src/components/TextoOriginalApocalipse1v'+v+'.astro'));
}
const report={
 reference:'Apocalipse 1:2',state:'rascunho, não publicado',
 criticalText:'SBL Greek New Testament (SBLGNT)',
 morphology:'MorphGNT 6.12',morphgntCommit:'aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',
 tokenCount:13,lemmaCount:11,newLemmaCount:5,uniqueLemmasAp1_1_2:25,
 newConcordanceCount:additional.length,
 allConcordancesInProject:allIndexFiles.length,
 newIndexes:Object.fromEntries(additional.map(id=>[id,results[id]])),
 totalReferenceRowsForVerse:[...current].reduce((n,id)=>n+results[id].verseCount,0),
 riskNotes:[
  'Validação de formas e códigos contra arquivo de versículo MorphGNT; análise sintática e acepções são editoriais.',
  'Contagens de concordância são de versículos distintos, não de tokens; um lema pode ocorrer várias vezes no mesmo versículo.',
  'A leitura SBLGNT ὅσα εἶδεν distingue-se da variante com τε em outras tradições textuais.'
 ]
};
const dir='src/editorial/apocalipse/';
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(dir+'AP.1.2-auditoria.json',JSON.stringify(report,null,2)+'\n','utf8');
const rows=v2.words.map((w,i)=>'| '+(i+1)+' | '+w.greek+' | '+w.transliteration+' | '+w.gloss+' | '+w.strong+' | '+w.morphologyCode+' | '+w.shortMorph+' | '+w.syntax.role+' | '+w.syntax.clauseId+' |');
const indexes=additional.map(id=>'| '+id+' | '+lex2.entries[id].lemma+' | '+results[id].tokenCount.toLocaleString('pt-BR')+' | '+results[id].verseCount.toLocaleString('pt-BR')+' |');
const notes=[
 '# Prima Scriptura — Apocalipse 1:2',
 '',
 '> Edição acadêmica em **rascunho/apocalipse**. Dados auditados mecanicamente; decisões lexicais e sintáticas sujeitas à revisão acadêmica.',
 '',
 '## Texto grego (SBLGNT / MorphGNT 6.12)',
 '',
 '> '+v2.words.map(w=>w.greek).join(' '),
 '',
 '**Tradução editorial:** '+v2.translation,
 '',
 '## Comentário e problemas de exegese',
 '',
 ...v2.exegeticalNotes.map((n,i)=>(i+1)+'. '+n),
 '',
 '## Análise palavra por palavra',
 '',
 '| Nº | Grego | Translit. | Glossa | Strong | Código MorphGNT | Forma breve | Função sintática | Oração |',
 '|---:|---|---|---|---|---|---|---|---|',
 ...rows,'',
 '## Concordâncias adicionais completas',
 '',
 '| Strong | Lema | Tokens no NT | Versículos distintos |',
 '|---|---|---:|---:|',...indexes,'',
 '**Total de registros de concordância indexados por lema neste versículo:** '+report.totalReferenceRowsForVerse.toLocaleString('pt-BR')+'. Alguns lemas têm versículos em comum; não são referências únicas globais.',
 '',
 '## Questões de tradução e crítica textual',
 '',
 v2.translationNote,'',v2.textualNotes,
 '',
 '## Procedência e limites',
 '',
 'Fonte do texto e dos códigos: MorphGNT 6.12 / SBLGNT, commit fixado em '+report.morphgntCommit+'. Os índices dos cinco novos lemas foram calculados sobre os 27 arquivos do Novo Testamento completo. ',
 '',
 'Glosas, transliteração, notas exegéticas, sintaxe e acepções são produção editorial em português. Não afirmar que a verificação de código morfológico comprova automaticamente uma interpretação exegética. Manuscritos e aparato crítico exigem revisão independente.',
 '',
 'O modelo de Apocalipse 1:1 e seus 20 índices originais devem permanecer intactos; a interface deste capítulo herda Times New Roman, orientação LTR e paleta azul-escuro e dourado.',
 ''
].join('\n');
fs.writeFileSync(dir+'NOTAS-APOCALIPSE-1-2.md',notes,'utf8');
console.log('AP 1:2 APROVADO:',JSON.stringify({tokens:report.tokenCount,lemas:report.lemmaCount,novos:report.newLemmaCount,concordancias:additional.length,linhas:report.totalReferenceRowsForVerse}));
