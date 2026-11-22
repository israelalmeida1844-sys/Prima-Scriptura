/**
 * Validação editorial automatizada para os rascunhos de Gênesis 4–12.
 *
 * Execução: node scripts/validar-genesis-rascunhos.mjs
 *
 * Verificações estruturais não substituem revisão exegética, lingüística
 * ou crítica do Texto Massorético e dos comentários de referência.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const expected = new Map([
  [4, 26], [5, 32], [6, 22], [7, 24], [8, 22],
  [9, 29], [10, 32], [11, 32], [12, 20],
]);

const problems = [];
let noteCount = 0;
let headingCount = 0;
let wordCount = 0;

for (const [chapter, lastVerse] of expected) {
  const path = resolve(`src/content/comentarios/genesis-capitulo-${chapter}.md`);
  const markdown = readFileSync(path, 'utf8');

  if (!markdown.startsWith('---\n')) problems.push(`Gn ${chapter}: frontmatter ausente`);
  if (!/^draft: true$/m.test(markdown)) problems.push(`Gn ${chapter}: draft não está true`);
  if (!new RegExp(`^book: "Gênesis"$`, 'm').test(markdown)) problems.push(`Gn ${chapter}: livro incorreto`);
  if (!new RegExp(`^chapter: ${chapter}$`, 'm').test(markdown)) problems.push(`Gn ${chapter}: número incorreto`);
  if (!new RegExp(`^verses: "1–${lastVerse}"$`, 'm').test(markdown)) problems.push(`Gn ${chapter}: intervalo incorreto`);
  if (!markdown.includes(`https://www.sbb.org.br/biblia/ARA/GEN.${chapter}`)) problems.push(`Gn ${chapter}: falta link à ARA`);
  if (!/[\u0590-\u05FF]/u.test(markdown)) problems.push(`Gn ${chapter}: falta texto hebraico`);

  const headings = [...markdown.matchAll(new RegExp(`^## Gênesis ${chapter}:(\\d+)(?:[–-](\\d+))?`, 'gm'))];
  headingCount += headings.length;
  const coverage = new Set();
  for (const [, start, end] of headings) {
    for (let v = Number(start); v <= Number(end || start); v++) coverage.add(v);
  }
  for (let v = 1; v <= lastVerse; v++) {
    if (!coverage.has(v)) problems.push(`Gn ${chapter}: versículo ${v} sem seção de cobertura`);
  }

  const refs = [...markdown.matchAll(new RegExp(`href="#gn${chapter}-nota-(\\d+)"`, 'g'))].map(x => Number(x[1]));
  const notes = [...markdown.matchAll(new RegExp(`id="gn${chapter}-nota-(\\d+)"`, 'g'))].map(x => Number(x[1]));
  noteCount += notes.length;
  for (let n = 1; n <= notes.length; n++) {
    if (notes[n-1] !== n) problems.push(`Gn ${chapter}: numeração de notas incorreta na posição ${n}`);
  }
  if (notes.length !== refs.length) problems.push(`Gn ${chapter}: chamadas (${refs.length}) e notas (${notes.length}) não coincidem`);
  for (const n of refs) if (!notes.includes(n)) problems.push(`Gn ${chapter}: chamada para nota ${n} sem destino`);
  for (const n of notes) if (!refs.includes(n)) problems.push(`Gn ${chapter}: nota ${n} sem chamada`);

  wordCount += markdown.split(/\s+/u).filter(Boolean).length;
}

if (problems.length) {
  console.error(`Falhou: ${problems.length} problema(s) estrutural(is) em Gênesis 4–12:\n${problems.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${expected.size} capítulos; ${headingCount} seções bíblicas; ${noteCount} notas vinculadas; cerca de ${wordCount} unidades de texto. Todos permanecem draft: true.`);
  console.log('Pendente: colação integral da vocalização e transliteração, revisão bibliográfica e leitura crítica humana antes de publicar.');
}
