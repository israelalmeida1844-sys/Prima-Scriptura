// Script de validação acadêmica e técnica rigorosa de Apocalipse 1:1 — Prima Scriptura
import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import { apocalipse1v1 } from '../src/data/texto-original/apocalipse/apocalipse-1-1.ts';

console.log('--- INICIANDO VALIDAÇÃO ACADÊMICA E TÉCNICA DE APOCALIPSE 1:1 ---');

// 1. Verificação do texto base e dos tokens
assert.equal(apocalipse1v1.reference, 'Apocalipse 1:1', 'Referência deve ser Apocalipse 1:1');
assert.equal(apocalipse1v1.words.length, 28, 'Apocalipse 1:1 deve conter exatamente 28 tokens');

const expectedSurfaces = [
  'Ἀποκάλυψις', 'Ἰησοῦ', 'Χριστοῦ,', 'ἣν', 'ἔδωκεν', 'αὐτῷ', 'ὁ', 'θεὸς',
  'δεῖξαι', 'τοῖς', 'δούλοις', 'αὐτοῦ,', 'ἃ', 'δεῖ', 'γενέσθαι', 'ἐν',
  'τάχει,', 'καὶ', 'ἐσήμανεν', 'ἀποστείλας', 'διὰ', 'τοῦ', 'ἀγγέλου',
  'αὐτοῦ', 'τῷ', 'δούλῳ', 'αὐτοῦ', 'Ἰωάννῃ,'
];

const expectedMorphCodes = [
  '----NSF-', '----GSM-', '----GSM-', '----ASF-', '3AAI-S--', '----DSM-', '----NSM-', '----NSM-',
  '-AAN----', '----DPM-', '----DPM-', '----GSM-', '----APN-', '3PAI-S--', '-AMN----', '--------',
  '----DSN-', '--------', '3AAI-S--', '-AAPNSM-', '--------', '----GSM-', '----GSM-',
  '----GSM-', '----DSM-', '----DSM-', '----GSM-', '----DSM-'
];

for (let i = 0; i < apocalipse1v1.words.length; i++) {
  const w = apocalipse1v1.words[i];
  assert.equal(w.greek, expectedSurfaces[i], `Palavra ${i + 1} difere do SBLGNT`);
  assert.equal(w.morphologyCode, expectedMorphCodes[i], `Morfologia de ${w.greek} difere do MorphGNT`);
  assert.ok(w.strong.startsWith('G'), `Strong ${w.strong} deve iniciar com G`);
  assert.ok(w.shortMorph && w.shortMorph.length > 0, `shortMorph ausente na palavra ${i + 1}`);
  assert.ok(w.gloss.length > 0 && w.gloss !== '—', `Glosa vazia na palavra ${i + 1}`);
  assert.ok(w.transliteration.length > 0, `Transliteração ausente na palavra ${i + 1}`);
  assert.ok(w.explanation.length > 20, `Explicação exegética insuficiente na palavra ${i + 1}`);
  assert.ok(w.occurrencesExamples.length > 0, `Exemplos de ocorrência ausentes na palavra ${i + 1}`);
}
console.log('✓ 28 tokens validados em perfeita conformidade com SBLGNT e MorphGNT 6.12.');

// 2. Validação do Léxico Grego
const lexiconPath = new URL('../src/data/lexico-grego/apocalipse-1-1.json', import.meta.url);
assert.ok(existsSync(lexiconPath), 'Arquivo de léxico deve existir');
const lexicon = JSON.parse(readFileSync(lexiconPath, 'utf8'));

const uniqueStrongs = Array.from(new Set(apocalipse1v1.words.map(w => w.strong)));
assert.equal(uniqueStrongs.length, 20, 'Devem existir exatamente 20 números Strong distintos em Ap 1:1');

for (const strong of uniqueStrongs) {
  const entry = lexicon.entries[strong];
  assert.ok(entry, `Entrada para ${strong} ausente no léxico`);
  assert.ok(entry.lemma && entry.lemma.length > 0, `Lema ausente para ${strong}`);
  assert.ok(entry.lemmaTransliteration && entry.lemmaTransliteration.length > 0, `Transliteração do lema ausente para ${strong}`);
  assert.ok(entry.partOfSpeech && entry.partOfSpeech.length > 0, `Classe gramatical ausente para ${strong}`);
  assert.ok(Array.isArray(entry.senses) && entry.senses.length > 0, `Acepções ausentes para ${strong}`);

  for (const sense of entry.senses) {
    assert.ok(sense.id && sense.label && sense.definition, `Campos de acepção incompletos em ${strong}`);
    assert.ok(Array.isArray(sense.examples) && sense.examples.length > 0, `Exemplos ausentes na acepção ${sense.id}`);
    for (const ex of sense.examples) {
      assert.ok(ex.reference && ex.greek && ex.translation && ex.explanation, `Exemplo incompleto em ${sense.id}`);
    }
  }
}
console.log('✓ 20 entradas lexicais completas com acepções semânticas e exemplos bíblicos validadas.');

// 3. Validação das Concordâncias Exaustivas Locais
for (const strong of uniqueStrongs) {
  const concPath = new URL(`../public/data/concordancia-grega/${strong}.json`, import.meta.url);
  assert.ok(existsSync(concPath), `Arquivo de concordância ${strong}.json ausente`);
  const conc = JSON.parse(readFileSync(concPath, 'utf8'));

  assert.equal(conc.strong, strong, `Strong divergente no arquivo de ${strong}`);
  assert.equal(conc.complete, true, `Concordância de ${strong} deve estar marcada como complete=true`);
  assert.ok(Number.isInteger(conc.tokenCount) && conc.tokenCount > 0, `tokenCount inválido para ${strong}`);
  assert.ok(Number.isInteger(conc.verseCount) && conc.verseCount > 0, `verseCount inválido para ${strong}`);
  assert.ok(conc.tokenCount >= conc.verseCount, `tokenCount (${conc.tokenCount}) deve ser >= verseCount (${conc.verseCount}) para ${strong}`);
  assert.equal(conc.references.length, conc.verseCount, `Quantidade de referências difere de verseCount para ${strong}`);
  assert.equal(new Set(conc.references).size, conc.verseCount, `Referências duplicadas encontradas para ${strong}`);

  // Validação da distribuição por livros
  const distTotal = Object.values(conc.bookDistribution).reduce((a, b) => a + b, 0);
  assert.equal(distTotal, conc.tokenCount, `Soma da distribuição por livros difere de tokenCount para ${strong}`);
}
console.log('✓ 20 arquivos de concordância canônica exaustiva validados com contagens e integridade perfeitas.');

// 4. Verificação de Textos Editoriais
assert.ok(apocalipse1v1.translation.length > 40, 'Tradução editorial deve ser expressiva e fluente');
assert.ok(apocalipse1v1.textualNotes.length > 40, 'Nota de crítica textual deve estar presente');

console.log('--- TODOS OS TESTES ACADÊMICOS E FILOLÓGICOS FORAM APROVADOS COM SUCESSO! ---');
