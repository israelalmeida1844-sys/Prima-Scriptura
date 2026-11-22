/**
 * Gera arquivos locais de concordância para os lemas presentes em Gênesis 1:1.
 *
 * Fonte: Open Scriptures Hebrew Bible (OSHB), https://github.com/openscriptures/morphhb
 * Texto WLC: domínio público. Lemas/morfologia OSHB: CC BY 4.0.
 * Atribuição exigida: "Original work of the Open Scriptures Hebrew Bible available
 * at https://github.com/openscriptures/morphhb".
 *
 * IMPORTANTE: esta ferramenta faz download somente DURANTE A GERAÇÃO, não durante
 * a consulta dos visitantes do Prima Scriptura. O resultado é JSON local estático.
 * Não interpretar um índice ausente ou incompleto como zero ocorrências.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const BOOKS = [
  ['Gen','Gn'],['Exod','Êx'],['Lev','Lv'],['Num','Nm'],['Deut','Dt'],
  ['Josh','Js'],['Judg','Jz'],['Ruth','Rt'],['1Sam','1Sm'],['2Sam','2Sm'],
  ['1Kgs','1Rs'],['2Kgs','2Rs'],['1Chr','1Cr'],['2Chr','2Cr'],
  ['Ezra','Ed'],['Neh','Ne'],['Esth','Et'],['Job','Jó'],['Ps','Sl'],
  ['Prov','Pv'],['Eccl','Ec'],['Song','Ct'],['Isa','Is'],['Jer','Jr'],
  ['Lam','Lm'],['Ezek','Ez'],['Dan','Dn'],['Hos','Os'],['Joel','Jl'],
  ['Amos','Am'],['Obad','Ob'],['Jonah','Jn'],['Mic','Mq'],['Nah','Na'],
  ['Hab','Hc'],['Zeph','Sf'],['Hag','Ag'],['Zech','Zc'],['Mal','Ml']
];

const TARGETS = ['H7225','H1254','H430','H853','H8064','H776'];
const TAG = 'v.2.2'; // Versão fixa, para reprodução das contagens
const ORIGIN = 'https://raw.githubusercontent.com/openscriptures/morphhb/' + TAG + '/wlc/';
const OUTPUT_DIR = resolve('public/data/concordancia-hebraica');
const AUTHOR_CREDIT = 'Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb';
const force = process.argv.includes('--force');
const manifestPath = resolve(OUTPUT_DIR, 'genesis-1-1-manifest.json');

async function fetchSource(book) {
  const url = ORIGIN + book + '.xml';
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const resp = await fetch(url, { signal: controller.signal });
      if (!resp.ok) throw new Error(book + ': HTTP ' + resp.status);
      const text = await resp.text();
      if (!text.includes('<verse ') || !text.includes('osisID=')) {
        throw new Error(book + ': arquivo XML sem versículos OSIS');
      }
      return text;
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, (attempt + 1) * 1500));
    } finally {
      clearTimeout(timeout);
    }
  }
}

function parseBook(xml, book, abbrev, output) {
  let verseCount = 0;
  const verses = xml.matchAll(/<verse\b([^>]*\bosisID="([^"]+)"[^>]*)>([\s\S]*?)<\/verse>/g);
  for (const [, , id, body] of verses) {
    const m = id.match(/\.([0-9]+)\.([0-9]+)$/);
    if (!m) continue;
    verseCount++;
    const reference = abbrev + ' ' + Number(m[1]) + ':' + Number(m[2]);
    for (const [, attrs] of body.matchAll(/<w\b([^>]*)>/g)) {
      const attr = attrs.match(/\blemma="([^"]+)"/);
      if (!attr) continue;
      // Lemma pode conter prefixos ('c/853'), diversos elementos e Strong
      // estendido ('430 a'). Selecionar somente os elementos numéricos exatos.
      const components = attr[1].split(/[\/\s]+/);
      const keys = new Set(components.filter(x => /^\d{1,5}$/.test(x)).map(n => 'H' + Number(n)));
      for (const key of keys) {
        if (!output[key]) continue;
        const item = output[key];
        item.tokenCount++;
        if (item.references[item.references.length - 1] !== reference) {
          item.references.push(reference);
        }
      }
    }
  }
  if (verseCount < 1) throw new Error(book + ': nenhum versículo reconhecido');
  return verseCount;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  if (!force) {
    try {
      const m = JSON.parse(await readFile(manifestPath, 'utf8'));
      if (m.complete === true && m.sourceVersion === TAG &&
          TARGETS.every(x => m.strongs.includes(x))) {
        for (const key of TARGETS) {
          const saved = JSON.parse(await readFile(resolve(OUTPUT_DIR, key + '.json'), 'utf8'));
          if (saved.complete !== true || !saved.references?.length) throw new Error('índice incompleto');
        }
        console.log('Concordância completa já presente. Use --force para regenerar.');
        return;
      }
    } catch { /* índice ausente ou incompleto: gerar */ }
  }
  const output = Object.fromEntries(TARGETS.map(key => [key, { strong: key, tokenCount: 0, references: [] }]));
  const totals = {};
  for (const [book, abbrev] of BOOKS) {
    const xml = await fetchSource(book);
    totals[book] = parseBook(xml, book, abbrev, output);
    console.log(book + ': ' + totals[book] + ' versículos indexados');
  }
  // Validações do próprio versículo piloto e da cobertura dos 39 livros.
  const gen11 = 'Gn 1:1';
  for (const key of TARGETS) {
    const item = output[key];
    if (!item.references.includes(gen11)) throw new Error(key + ': Gn 1:1 não encontrado');
    if (item.references.length > item.tokenCount) throw new Error(key + ': contagem inconsistente');
  }
  if (Object.keys(totals).length !== 39) throw new Error('Corpus bíblico incompleto');
  // Escreve primeiro os índices. Manifesto completo é gravado SOMENTE ao final.
  for (const key of TARGETS) {
    const item = { ...output[key], verseCount: output[key].references.length,
      complete: true, source: 'Open Scriptures Hebrew Bible', sourceVersion: TAG,
      license: 'CC BY 4.0', attribution: AUTHOR_CREDIT };
    await writeFile(resolve(OUTPUT_DIR, key + '.json'), JSON.stringify(item), 'utf8');
  }
  await writeFile(manifestPath, JSON.stringify({ complete: true, sourceVersion: TAG,
    strongs: TARGETS, books: Object.keys(totals).length,
    verseCounts: totals, license: 'CC BY 4.0', attribution: AUTHOR_CREDIT }, null, 2));
  console.log('Índice gerado:', Object.fromEntries(TARGETS.map(key =>
    [key, { tokens: output[key].tokenCount, versos: output[key].references.length }])));
}

main().catch(error => { console.error('ERRO: Concordância NÃO foi concluída:', error); process.exitCode = 1; });
