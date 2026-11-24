#!/usr/bin/env node
/**
 * Prima Scriptura — auditoria reprodutível de Apocalipse 4:1–11.
 * Fonte MorphGNT 6.12 fixada no commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d.
 * Executar: node scripts/auditar-apocalipse-4-completo.mjs /tmp/prima-morphgnt
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const sourceRoot = process.argv[2] || process.env.PRIMA_MORPHGNT_DIR;
assert.ok(sourceRoot, 'Informe o diretório do MorphGNT 6.12');
const read = (file) => fs.readFileSync(file, 'utf8');
const json = (file) => JSON.parse(read(file));
const refFiles = Array.from({ length: 11 }, (_, i) => 'src/data/texto-original/apocalipse/apocalipse-4-' + (i + 1) + '.ts');
const report = json('.github/reports/apocalipse-4-auditoria-morphgnt.json');
const lexicon = json('src/data/lexico-grego/apocalipse-4-1-11.json').entries;
assert.equal(report.corpusBooks, 27);
assert.equal(report.booksChecked.length, 27);
assert.equal(Object.keys(report.entries).length, 46);

const aliases = {
  Mc: 'Mk', Lc: 'Lk', Jo: 'Jn', At: 'Ac', Rm: 'Ro', Gl: 'Ga',
  Ef: 'Eph', Fp: 'Php', Cl: 'Col', '1Ts': '1Th', '2Ts': '2Th',
  '1Tm': '1Ti', '2Tm': '2Ti', Tt: 'Tit', Fm: 'Phm', Hb: 'Heb',
  Tg: 'Jas', '1Jo': '1Jn', '2Jo': '2Jn', '3Jo': '3Jn',
  Jd: 'Jud', Ap: 'Re'
};
const normalizeRef = (r) => {
  const m = /^(\S+)\s+(\d+):(\d+)$/.exec(r);
  assert.ok(m, 'Referência inválida: ' + r);
  return (aliases[m[1]] || m[1]) + ' ' + Number(m[2]) + ':' + Number(m[3]);
};
const normalizeGreek = (s) => s.replace(/[.,;··:!?]+$/u, '');
const cache = new Map();
const getIndex = (strong) => {
  if (!cache.has(strong)) {
    const p = 'public/data/concordancia-grega/' + strong + '.json';
    assert.ok(fs.existsSync(p), 'Concordância ausente: ' + strong);
    const d = json(p);
    assert.equal(d.strong, strong, 'Número Strong não corresponde ao nome do arquivo');
    assert.equal(d.complete, true, 'Concordância marcada como incompleta: ' + strong);
    assert.equal(d.corpusBooks, 27, 'Corpus não abrange os 27 livros: ' + strong);
    assert.equal(d.verseCount, d.references.length, 'Contagem de versículos divergente: ' + strong);
    assert.equal(new Set(d.references.map(r => typeof r === 'string' ? r : r.reference)).size, d.verseCount, 'Referências duplicadas: ' + strong);
    assert.equal(Object.values(d.bookDistribution).reduce((a, b) => a + b, 0), d.tokenCount, 'Distribuição por livro divergente: ' + strong);
    cache.set(strong, d);
  }
  return cache.get(strong);
};

const revelation = read(path.join(sourceRoot, '87-Re-morphgnt.txt'));
const rows = revelation.split(/\r?\n/).filter(Boolean).map(line => line.trim().split(/\s+/));
let tokens = 0;
const seenStrongs = new Set();
for (let n = 1; n <= 11; n++) {
  const source = read(refFiles[n - 1]);
  const match = source.match(/=\s*(\{[\s\S]*\})\s*as const;/);
  assert.ok(match, 'Objeto TypeScript não interpretável: Ap 4:' + n);
  const d = JSON.parse(match[1]);
  assert.equal(d.reference, 'Apocalipse 4:' + n);
  assert.equal(d.chapter, 4);
  assert.equal(d.verse, n);
  assert.ok(d.translation && d.textualNotes && d.exegeticalNotes.length);
  const verseRows = rows.filter(x => x[0] === '2704' + String(n).padStart(2, '0'));
  assert.equal(d.words.length, verseRows.length, 'Número de tokens de Ap 4:' + n);
  d.words.forEach((w, i) => {
    const x = verseRows[i];
    assert.equal(normalizeGreek(w.greek), x[4], 'Forma grega em Ap 4:' + n + ', token ' + (i + 1));
    assert.equal(w.lemma, x[6], 'Lema em Ap 4:' + n + ', token ' + (i + 1));
    assert.equal(w.morphgntPos, x[1], 'Classe MorphGNT em Ap 4:' + n);
    assert.equal(w.morphologyCode, x[2], 'Parsing MorphGNT em Ap 4:' + n);
    assert.equal(w.morphologyCode.length, 8);
    assert.match(w.strong, /^G\d+$/);
    assert.ok(w.transliteration && w.gloss && w.explanation && w.syntax?.role);
    assert.ok(!/a revisar/i.test(w.syntax.role), 'Análise sintática provisória: ' + w.id);
    assert.ok(lexicon[w.strong], 'Verbete lexical ausente: ' + w.strong);
    const concordance = getIndex(w.strong);
    const references = concordance.references.map(r => normalizeRef(typeof r === 'string' ? r : r.reference));
    assert.ok(references.includes('Re 4:' + n), 'Versículo ausente de concordância: ' + w.strong + ' Ap 4:' + n);
    seenStrongs.add(w.strong);
    tokens++;
  });
}
assert.equal(tokens, 293);
assert.equal(seenStrongs.size, 113, 'Número de lemas Strong do capítulo 4');
assert.equal(json('public/data/concordancia-grega/G1163.json').tokenCount, 101);
assert.equal(json('public/data/concordancia-grega/G1163.json').verseCount, 100);
for (const ref of ['Mt 26:35', 'Mk 14:31', 'Lk 18:1', 'Ac 25:24', 'Ac 26:9']) {
  assert.ok(getIndex('G1163').references.some(r => normalizeRef(typeof r === 'string' ? r : r.reference) === ref), 'Referência G1163 anteriormente omitida: ' + ref);
}

// Auditoria independente dos 46 lemas introduzidos: ler cada linha dos 27 livros.
const idsByLemma = new Map();
const stats = new Map();
for (const [id, e] of Object.entries(report.entries)) {
  assert.equal(lexicon[id]?.lemma, e.lemma, 'Lema diverge do léxico: ' + id);
  if (!idsByLemma.has(e.lemma)) idsByLemma.set(e.lemma, []);
  idsByLemma.get(e.lemma).push(id);
  stats.set(id, { tokens: 0, refs: new Set(), distribution: {} });
}
const books = ['Mt', 'Mc', 'Lc', 'Jo', 'At', 'Rm', '1Co', '2Co', 'Gl', 'Ef', 'Fp',
  'Cl', '1Ts', '2Ts', '1Tm', '2Tm', 'Tt', 'Fm', 'Hb', 'Tg', '1Pe', '2Pe',
  '1Jo', '2Jo', '3Jo', 'Jd', 'Ap'];
report.booksChecked.forEach((bookFile, i) => {
  const file = path.join(sourceRoot, bookFile + '-morphgnt.txt');
  const book = aliases[books[i]] || books[i];
  for (const line of read(file).split(/\r?\n/)) {
    if (!line) continue;
    const x = line.trim().split(/\s+/);
    if (x.length < 7) continue;
    for (const id of idsByLemma.get(x[6]) || []) {
      const stat = stats.get(id);
      stat.tokens++;
      stat.distribution[book] = (stat.distribution[book] || 0) + 1;
      stat.refs.add(book + ' ' + Number(x[0].slice(2, 4)) + ':' + Number(x[0].slice(4, 6)));
    }
  }
});
for (const [id, stat] of stats) {
  const index = getIndex(id), e = report.entries[id];
  assert.equal(stat.tokens, e.tokenCount, 'Relatório diverge do corpus: ' + id);
  assert.equal(stat.refs.size, e.verseCount, 'Relatório de versículos diverge: ' + id);
  assert.equal(index.tokenCount, stat.tokens, 'Total de tokens incorreto: ' + id);
  assert.equal(index.verseCount, stat.refs.size, 'Total de versículos incorreto: ' + id);
  const refs = index.references.map(r => normalizeRef(typeof r === 'string' ? r : r.reference));
  assert.deepEqual([...refs].sort(), [...stat.refs].sort(), 'Concordância diverge dos 27 livros: ' + id);
  for (const [book, count] of Object.entries(stat.distribution)) {
    assert.equal(index.bookDistribution[book], count, 'Distribuição por livro incorreta: ' + id + ' / ' + book);
  }
}
console.log('APROVADO: 11 versículos, 293 tokens, 113 fichas Strong, 46 concordâncias confrontadas com os 27 livros MorphGNT 6.12.');
