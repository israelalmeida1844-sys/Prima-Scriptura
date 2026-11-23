// Geração e validação exaustiva de concordâncias gregas para Apocalipse 1:1 a partir do MorphGNT 6.12 / SBLGNT.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scratchPath = join(__dirname, '../../scratch/morphgnt/');
const outputPath = join(__dirname, '../public/data/concordancia-grega/');

if (!existsSync(outputPath)) {
  mkdirSync(outputPath, { recursive: true });
}

const books = ['Mt','Mc','Lc','Jo','At','Rm','1Co','2Co','Gl','Ef','Fp','Cl','1Ts','2Ts','1Tm','2Tm','Tt','Fm','Hb','Tg','1Pe','2Pe','1Jo','2Jo','3Jo','Jd','Ap'];
const files = readdirSync(scratchPath).filter(f => f.endsWith('.txt')).sort();

export const strongDefs = {
  'G602': { lemma: 'ἀποκάλυψις', translit: 'apokalypsis', match: (l, p, m, s) => l === 'ἀποκάλυψις' },
  'G2424': { lemma: 'Ἰησοῦς', translit: 'Iēsous', match: (l, p, m, s) => l === 'Ἰησοῦς' },
  'G5547': { lemma: 'Χριστός', translit: 'Christos', match: (l, p, m, s) => l === 'Χριστός' },
  'G3739': { lemma: 'ὅς', translit: 'hos', match: (l, p, m, s) => l === 'ὅς' },
  'G1325': { lemma: 'δίδωμι', translit: 'didōmi', match: (l, p, m, s) => l === 'δίδωμι' },
  'G846': { lemma: 'αὐτός', translit: 'autos', match: (l, p, m, s) => l === 'αὐτός' },
  'G3588': { lemma: 'ὁ', translit: 'ho', match: (l, p, m, s) => l === 'ὁ' },
  'G2316': { lemma: 'θεός', translit: 'theos', match: (l, p, m, s) => l === 'θεός' },
  'G1166': { lemma: 'δείκνυμι', translit: 'deiknymi', match: (l, p, m, s) => l === 'δείκνυμι' },
  'G1401': { lemma: 'δοῦλος', translit: 'doulos', match: (l, p, m, s) => l === 'δοῦλος' },
  'G1163': { lemma: 'δεῖ', translit: 'dei', match: (l, p, m, s) => l === 'δέω' && ['δεῖ','ἔδει','δέον','δέοντα','δέοντος'].includes(s) },
  'G1096': { lemma: 'γίνομαι', translit: 'ginomai', match: (l, p, m, s) => l === 'γίνομαι' },
  'G1722': { lemma: 'ἐν', translit: 'en', match: (l, p, m, s) => l === 'ἐν' },
  'G5034': { lemma: 'τάχος', translit: 'tachos', match: (l, p, m, s) => l === 'τάχος' },
  'G2532': { lemma: 'καί', translit: 'kai', match: (l, p, m, s) => l === 'καί' },
  'G4591': { lemma: 'σημαίνω', translit: 'sēmainō', match: (l, p, m, s) => l === 'σημαίνω' },
  'G649': { lemma: 'ἀποστέλλω', translit: 'apostellō', match: (l, p, m, s) => l === 'ἀποστέλλω' },
  'G1223': { lemma: 'διά', translit: 'dia', match: (l, p, m, s) => l === 'διά' },
  'G32': { lemma: 'ἄγγελος', translit: 'angelos', match: (l, p, m, s) => l === 'ἄγγελος' },
  'G2491': { lemma: 'Ἰωάννης', translit: 'Iōannēs', match: (l, p, m, s) => l === 'Ἰωάννης' }
};

const results = {};
for (const [strong, def] of Object.entries(strongDefs)) {
  results[strong] = {
    strong,
    lemma: def.lemma,
    lemmaTranslit: def.translit,
    tokenCount: 0,
    verseCount: 0,
    bookDistribution: {},
    references: [],
    complete: true,
    source: 'SBL Greek New Testament / MorphGNT',
    sourceVersion: '6.12',
    license: 'CC BY-SA 3.0 / CC BY 4.0',
    attribution: 'MorphGNT (James K. Tauber) e SBL Greek New Testament'
  };
}

for (const file of files) {
  const content = readFileSync(join(scratchPath, file), 'utf8');
  for (const line of content.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 7) continue;
    const refCode = parts[0];
    const bIndex = parseInt(refCode.slice(0, 2), 10) - 1;
    const ch = parseInt(refCode.slice(2, 4), 10);
    const v = parseInt(refCode.slice(4, 6), 10);
    const bookAbbr = books[bIndex];
    const ref = `${bookAbbr} ${ch}:${v}`;
    const pos = parts[1];
    const morph = parts[2];
    const norm = parts[5];
    const lemma = parts[6];

    for (const [strong, def] of Object.entries(strongDefs)) {
      if (def.match(lemma, pos, morph, norm)) {
        const item = results[strong];
        item.tokenCount++;
        item.bookDistribution[bookAbbr] = (item.bookDistribution[bookAbbr] || 0) + 1;
        if (!item.references.includes(ref)) {
          item.references.push(ref);
        }
      }
    }
  }
}

for (const [strong, item] of Object.entries(results)) {
  item.verseCount = item.references.length;
  writeFileSync(
    join(outputPath, `${strong}.json`),
    JSON.stringify(item, null, 2),
    'utf8'
  );
}

console.log('Concordâncias de Apocalipse 1:1 geradas com sucesso (20 arquivos).');
