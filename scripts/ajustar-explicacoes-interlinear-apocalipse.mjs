/**
 * Ajusta explicações interlineares geradas para refletir a glosa revisada
 * e o papel sintático atualmente anotado; preserva explicações filológicas
 * individuais que não seguem o modelo genérico.
 */
import fs from 'node:fs';
let changed=0;
for(let v=9;v<=20;v++){
 const file='src/data/texto-original/apocalipse/apocalipse-1-'+v+'.ts';
 const c=fs.readFileSync(file,'utf8');
 const match=c.match(/=\s*(\{[\s\S]*\})\s*as const;/);
 if(!match)throw Error('Arquivo inválido: '+file);
 const obj=JSON.parse(match[1]);
 for(const w of obj.words){
  if(w.explanation.includes('A equivalência portuguesa') || w.explanation.includes('a equivalência portuguesa')){
   w.explanation=w.morphology+'. '+w.syntax.role+'. Glosa contextual: «'+w.gloss+'». Esta glosa é auxiliar e não substitui a tradução da oração completa.';
   changed++;
  }
 }
 fs.writeFileSync(file,c.replace(match[1],JSON.stringify(obj,null,2)));
}
console.log('Explicações genéricas sincronizadas com glosas e funções sintáticas: '+changed);
