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
  if(w.morphgntPos==='V-'){
    const code=w.morphologyCode;
    const tense={P:'presente',I:'imperfeito',F:'futuro',A:'aoristo',X:'perfeito',Y:'mais-que-perfeito'}[code[1]]??'tempo não especificado';
    const voice={A:'ativa',M:'média',P:'passiva'}[code[2]]??'não especificada';
    const mode={I:'indicativo',D:'imperativo',S:'subjuntivo',O:'optativo',N:'infinitivo',P:'particípio'}[code[3]]??'não especificado';
    const cases={N:'nominativo',G:'genitivo',D:'dativo',A:'acusativo',V:'vocativo'};
    const genders={M:'masculino',F:'feminino',N:'neutro'};
    const numbers={S:'singular',P:'plural'};
    const nominal=mode==='particípio'?[cases[code[4]],numbers[code[5]],genders[code[6]]].filter(Boolean).join(' '):'';
    const person=/[123]/.test(code[0])?code[0]+'ª pessoa '+(numbers[code[5]]??''):'';
    w.morphology='Verbo no '+tense+', voz '+voice+', '+mode+(nominal?' '+nominal:person?', '+person:'');
  }
  if(w.explanation.includes('A equivalência portuguesa') || w.explanation.includes('a equivalência portuguesa') || w.explanation.includes('Esta glosa é auxiliar e não substitui a tradução da oração completa.')){
   w.explanation=w.morphology+'. '+w.syntax.role+'. Glosa contextual: «'+w.gloss+'». Esta glosa é auxiliar e não substitui a tradução da oração completa.';
   changed++;
  }
 }
 fs.writeFileSync(file,c.replace(match[1],JSON.stringify(obj,null,2)));
}
console.log('Explicações genéricas sincronizadas com glosas e funções sintáticas: '+changed);
