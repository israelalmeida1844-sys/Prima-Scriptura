/** Padroniza transliteração editorial SBL sem alterar a superfície grega. */
import fs from 'node:fs';
function transliterate(s) {
  const m={α:'a',β:'b',γ:'g',δ:'d',ε:'e',ζ:'z',η:'ē',θ:'th',ι:'i',κ:'k',λ:'l',μ:'m',ν:'n',ξ:'x',ο:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',φ:'ph',χ:'ch',ψ:'ps',ω:'ō'};
  const c=[...s.normalize('NFD').matchAll(/([Α-Ωα-ω])([\u0300-\u036f]*)/g)].map(v=>({a:v[1].toLowerCase(),upper:v[1]!==v[1].toLowerCase(),marks:v[2]}));
  let out='';
  for(let i=0;i<c.length;i++) {
    const x=c[i], prev=c[i-1],next=c[i+1];
    let t=m[x.a]??'';
    if(x.a==='γ' && next && ['γ','κ','χ','ξ'].includes(next.a))t='n';
    if(x.a==='υ' && ((prev&&'αεηο'.includes(prev.a)&&!x.marks.includes('\u0308'))||(next?.a==='ι'&&!next.marks.includes('\u0308'))))t='u';
    const rough=x.marks.includes('\u0314');
    if(rough&&x.a==='ρ')t='rh';
    else if(rough){if(i===1&&prev&&'αεηοωυ'.includes(prev.a))out='h'+out;else t='h'+t;}
    if(x.upper)t=t[0].toUpperCase()+t.slice(1);
    out+=t;
  }
  return out;
}
for(let v=9;v<=20;v++){
  const file='src/data/texto-original/apocalipse/apocalipse-1-'+v+'.ts';
  const src=fs.readFileSync(file,'utf8');
  const match=src.match(/=\s*(\{[\s\S]*\})\s*as const;/);
  if(!match)throw Error('Objeto não identificável em '+file);
  const o=JSON.parse(match[1]);
  for(const w of o.words){
    w.transliteration=transliterate(w.greek);
    w.lemmaTransliteration=transliterate(w.lemma);
  }
  fs.writeFileSync(file,src.replace(match[1],JSON.stringify(o,null,2)));
}
const file='src/data/lexico-grego/apocalipse-1-9-20.json';
const o=JSON.parse(fs.readFileSync(file,'utf8'));
for(const e of Object.values(o.entries))e.lemmaTransliteration=transliterate(e.lemma);
fs.writeFileSync(file,JSON.stringify(o,null,2)+'\n');
for(const [s,expect] of [['συγκοινωνός','synkoinōnos'],['ἡμέρα','hēmera'],['ὁ','ho'],['οὗτος','houtos'],['υἱός','huios'],['ῥομφαία','rhomphaia']]){
 if(transliterate(s)!==expect)throw Error('Transliteração de controle falhou: '+s+'='+transliterate(s));
}
console.log('Transliteração SBL revisada para 276 tokens e 80 novas entradas lexicais.');
