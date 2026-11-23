import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const folder='src/content/comentarios';
const files=(await readdir(folder)).filter(name=>/^genesis-capitulo-\d+\.md$/.test(name));
assert.equal(files.length,50,'Esperados 50 capítulos de Gênesis mantidos como rascunho.');
const seen=new Set();
for(const name of files){
  const n=Number(name.match(/\d+/)[0]);
  seen.add(n);
  const text=await readFile(folder+'/'+name,'utf8');
  const frontmatter=text.match(/^---\s*\n([\s\S]*?)\n---/);
  assert.ok(frontmatter,'Sem frontmatter: '+name);
  assert.match(frontmatter[1],/^draft:\s*true\s*$/m,'Risco de publicação automática: '+name);
  assert.match(frontmatter[1],/^book:\s*['"]?Gênesis['"]?\s*$/m,'Livro inesperado: '+name);
  assert.match(frontmatter[1],new RegExp('^chapter:\\s*'+n+'\\s*$','m'),'Capítulo divergente: '+name);
}
for(let n=1;n<=50;n++)assert.ok(seen.has(n),'Ausente Gênesis capítulo '+n);
const pages=await readdir('src/pages/comentarios/genesis');
assert.deepEqual([...pages].sort(),['capitulo-1','index.astro'],'Rota inesperada de Gênesis na biblioteca.');
console.log('PASS: os 50 capítulos de Gênesis permanecem marcados draft:true; somente o capítulo 1 tem página de avaliação.');
