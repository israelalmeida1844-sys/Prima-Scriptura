/**
 * Gera índices de concordância a partir do corpus MorphGNT 6.12 imutável.
 * Entrada: diretórios externos apontados por MORPHGNT_DIR e LEMMAS_DIR.
 * Não modifica índices previamente existentes; mantém a revisão 1:1–8.
 */
import fs from 'node:fs';
import path from 'node:path';

const corpusDir = process.env.MORPHGNT_DIR ?? '/tmp/prima-morphgnt';
const mappingsDir = process.env.LEMMAS_DIR ?? '/tmp/prima-lemma-mappings';
const lexiconFile = 'src/data/lexico-grego/apocalipse-2-13-29.json';
const outputDir = 'public/data/concordancia-grega';
const entries = JSON.parse(fs.readFileSync(lexiconFile, 'utf8')).entries;
const names = [
  ['Mt','Mateus'],['Mk','Marcos'],['Lk','Lucas'],['Jn','João'],
  ['Ac','Atos'],['Ro','Romanos'],['1Co','1 Coríntios'],['2Co','2 Coríntios'],
  ['Ga','Gálatas'],['Eph','Efésios'],['Php','Filipenses'],['Col','Colossenses'],
  ['1Th','1 Tessalonicenses'],['2Th','2 Tessalonicenses'],
  ['1Ti','1 Timóteo'],['2Ti','2 Timóteo'],['Tit','Tito'],['Phm','Filemom'],
  ['Heb','Hebreus'],['Jas','Tiago'],['1Pe','1 Pedro'],['2Pe','2 Pedro'],
  ['1Jn','1 João'],['2Jn','2 João'],['3Jn','3 João'],['Jud','Judas'],['Re','Apocalipse']
];
const greekToStrong = new Map();
let currentLemma = '';
for (const line of fs.readFileSync(path.join(mappingsDir, 'lexemes.yaml'), 'utf8').split(/\r?\n/)) {
  if (/^[^\s#].*:\s*$/.test(line)) currentLemma = line.slice(0, -1);
  else {
    const match = line.match(/^    strongs:\s*(\d+)/);
    if (match && currentLemma) greekToStrong.set(currentLemma, 'G' + match[1]);
  }
}
// Exceção documentada: ἐραυνάω = G2045, grafia alternante de ἐρευνάω.
// Fonte externa independente: blueletterbible.org/lexicon/g2045/mgnt/mgnt
greekToStrong.set('ἐραυνάω','G2045');
const results = new Map(Object.keys(entries).map(id => [id, {
  tokenCount: 0, bookDistribution: {}, references: [], seen: new Set()
}]));
const stripMarks = s => s.replace(/[⸀⸂⸃⸄⸅]/g, '');
let corpusBooks = 0, tokenTotal = 0;
for (let i = 0; i < names.length; i++) {
  const [abbr, book] = names[i];
  const name = String(i + 61).padStart(2, '0') + '-' + abbr + '-morphgnt.txt';
  const lines = fs.readFileSync(path.join(corpusDir, name), 'utf8').split(/\r?\n/);
  const byVerse = new Map();
  for (const line of lines) {
    if (!line.trim()) continue;
    const t = line.trim().split(/\s+/);
    if (t.length < 7) throw new Error('Linha morfológica inválida: ' + name + ': ' + line);
    const [loc, , , surface, , , lemma] = t;
    if (loc.length !== 6) throw new Error('Localizador inválido: ' + loc);
    tokenTotal++;
    const chapter = Number(loc.slice(2, 4)), verse = Number(loc.slice(4, 6));
    const key = loc, token = {book, abbr, chapter, verse, surface:stripMarks(surface), lemma, strong:greekToStrong.get(lemma)};
    if (!byVerse.has(key)) byVerse.set(key, []);
    byVerse.get(key).push(token);
  }
  for (const tokens of byVerse.values()) {
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!results.has(t.strong)) continue;
      const r = results.get(t.strong);
      r.tokenCount++;
      r.bookDistribution[t.book] = (r.bookDistribution[t.book] ?? 0) + 1;
      const unique = t.book + ':' + t.chapter + ':' + t.verse;
      if (r.seen.has(unique)) continue;
      r.seen.add(unique);
      const context = tokens.slice(Math.max(0,i-1),Math.min(tokens.length,i+2)).map(z=>z.surface).join(' ');
      r.references.push({book:t.book,chapter:t.chapter,verse:t.verse,reference:t.abbr+' '+t.chapter+':'+t.verse,text:context,highlightedWord:t.surface});
    }
  }
  corpusBooks++;
}
let created = 0, kept = 0, invalid = [];
fs.mkdirSync(outputDir, {recursive:true});
for (const [id, entry] of Object.entries(entries)) {
  const r = results.get(id);
  if (!r || r.tokenCount === 0) {invalid.push(id); continue;}
  const outputFile = path.join(outputDir, id + '.json');
  if (fs.existsSync(outputFile)) {
    const previous = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    if (!previous.complete || !Array.isArray(previous.references)) throw new Error('Índice anterior incompleto: '+id);
    if (previous.lemmaTranslit !== entry.lemmaTransliteration && previous.source?.includes('aaed91e')) {
      previous.lemmaTranslit = entry.lemmaTransliteration;
      fs.writeFileSync(outputFile, JSON.stringify(previous,null,2)+'\n');
    }
    kept++;
    continue;
  }
  const record = {
    strong:id, lemma:entry.lemma, lemmaTranslit:entry.lemmaTransliteration,
    tokenCount:r.tokenCount, verseCount:r.references.length,
    bookDistribution:r.bookDistribution, references:r.references,
    complete:true, corpusBooks, source:'SBLGNT / MorphGNT 6.12 (aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d)',
    note:'Textos gregos são excertos curtos contextualizadores, não reproduções integrais de versículos.'
  };
  fs.writeFileSync(outputFile, JSON.stringify(record,null,2)+'\n');
  created++;
}
if(invalid.length)throw new Error('Lemas sem ocorrência no corpus: '+invalid.join(', '));
const audit={corpusBooks,corpusTokens:tokenTotal,newStrongEntries:Object.keys(entries).length,created,kept,
  allFilesExist:Object.keys(entries).every(k=>fs.existsSync(path.join(outputDir,k+'.json'))),
  sampleG4791:results.get('G4791') ? {tokenCount:results.get('G4791').tokenCount,verseCount:results.get('G4791').references.length} : null};
fs.writeFileSync('src/data/lexico-grego/apocalipse-2-13-29-concordancias-relatorio.json',JSON.stringify(audit,null,2)+'\n');
console.log(JSON.stringify(audit,null,2));
