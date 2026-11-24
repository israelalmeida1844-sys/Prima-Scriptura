import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,c)=>fs.writeFileSync(p,c);
const counts={1:20,2:29,3:22,4:11};
let components=0,ids=0,navigation=0;
for(const [cs,count] of Object.entries(counts)){
 const chapter=Number(cs);
 for(let verse=1;verse<=count;verse++){
  const path='src/components/TextoOriginalApocalipse'+chapter+'v'+verse+'.astro';
  let c=read(path);
  const data='apocalipse'+chapter+'v'+verse;
  const original='<span class="word-greek" lang="grc" dir="ltr">{word.greek}</span>';
  const replacement='<span class="word-greek" lang="grc" dir="ltr"><span class="greek-form">{word.greek.replace(/[,.;··:!?]+$/u, \'\')}</span><span class="greek-punctuation" aria-hidden="true">{word.greek.match(/[,.;··:!?]+$/u)?.[0] ?? \'\'}</span></span>';
  assert.ok(c.includes(original),'Greek token markup not found: '+path);
  c=c.replace(original,replacement);
  const notePattern=/  <section class="textual-criticism-panel">[\s\S]*?  <\/section>/;
  assert.match(c,notePattern,'Note section missing: '+path);
  const notes=[
   '  <!-- Seções editoriais separadas: gramática, crítica textual e exegese. -->',
   '  <section class="syntactic-panel" aria-label="Observações gramaticais do versículo">',
   '    <h4>Observações gramaticais e sintáticas</h4>',
   '    <ul>{'+data+'.syntacticNotes.map(note => <li>{note}</li>)}</ul>',
   '  </section>',
   '',
   '  <section class="textual-criticism-panel" aria-label="Crítica textual documentada">',
   '    <h4>Nota de crítica textual</h4>',
   '    <p>{'+data+'.textualNotes}</p>',
   '  </section>',
   '',
   '  <section class="exegetical-panel" aria-label="Interpretação exegética do versículo">',
   '    <h4>Notas exegéticas</h4>',
   '    {'+data+'.exegeticalNotes.length ? <ul>{'+data+'.exegeticalNotes.map(note => <li>{note}</li>)}</ul> : <p>Sem nota exegética adicional neste versículo.</p>}',
   '  </section>'
  ].join('\n');
  c=c.replace(notePattern,notes);
  const pid='ap'+chapter+'-'+verse+'-occurrences';
  const old=/(aria-controls|id)="ap\d+-\d+-occurrences"/g;
  const matches=[...c.matchAll(old)];
  assert.equal(matches.length,2,'Concordance panel identifiers: '+path);
  c=c.replace(old,(all,attr)=>attr+'="'+pid+'"');
  c=c.replace('<p data-lexicon-explanation>','<p class="lexical-usage-note" data-lexicon-explanation>');
  write(path,c);components++;ids++;
 }
 const path='src/pages/comentarios/apocalipse/capitulo-'+chapter+'/[versiculo].astro';
 let c=read(path);
 const marker='<nav class="verse-picker"';
 assert.ok(c.includes(marker),'Verse navigation missing: '+path);
 c=c.replace(marker,'<p class="verse-picker-heading">Versículos do capítulo</p>\n      <nav class="verse-picker"');
 c=c.replace('</style>','  .verse-picker-heading { font-family: "Times New Roman", Times, serif; font-size: 15px; font-weight: 700; color: #1c3554; margin: 17px 0 10px; }\n  .verse-picker a[aria-current="page"] { outline: 3px solid #c6a15b; outline-offset: 2px; font-weight: 800; box-shadow: 0 2px 7px #1c355433; }\n</style>');
 assert.ok(c.includes('Versículos do capítulo'));write(path,c);navigation++;
}
const css='src/styles/apocalipse-lexicon.css';
let style=read(css);
style+='\n/* Revisão editorial: capítulos 1–4 */\n'+
'.word-greek .greek-form { display: inline; }\n'+
'.word-greek .greek-punctuation { display: inline; margin-left: 1px; color: #5e6979; font-weight: 400; }\n'+
'.syntactic-panel, .exegetical-panel { margin-top: 18px; padding-top: 16px; border-top: 1px solid #e4e0d8; }\n'+
'.syntactic-panel h4, .exegetical-panel h4 { font-family: "Times New Roman",Times,serif; color:#193753; font-size:15px; margin: 0 0 10px; }\n'+
'.syntactic-panel ul, .exegetical-panel ul { padding-left: 21px; margin: 0; display:grid; gap: 12px; }\n'+
'.syntactic-panel li, .exegetical-panel li { color:#374a60; font-size:14.5px; line-height:1.7; overflow-wrap:anywhere; }\n'+
'.syntactic-panel li:empty, .exegetical-panel li:empty { display:none; }\n'+
'.textual-criticism-panel { padding:15px 0; background:#fcfbf9; border-radius:8px; }\n'+
'.textual-criticism-panel h4 { color:#6b5e4b; }\n'+
'.lexical-usage-note { margin: 8px 0 14px; padding: 10px 12px; border-left: 3px solid #b3a28d; color:#43536a; font-size:14px; }\n'+
'.lexical-example-reference { margin-bottom: 7px; }\n'+
'.lexical-example-greek { margin: 2px 0 8px; font-size:20px; }\n'+
'.lexical-example-transliteration { margin: 0 0 10px; font-size:14px; color:#4f6378; font-style:italic; }\n'+
'.lexical-example-translation { margin: 0 0 10px; font-size:15px; color:#1c3554; font-style:normal; }\n'+
'.example-field-label { display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#7b8493; margin:0 0 3px; }\n'+
'.lexical-example-note:empty, .lexical-sense-definition:empty { display:none; }\n';
write(css,style);
console.log(JSON.stringify({components,navigationPages:navigation,concordanceIds:ids}));
