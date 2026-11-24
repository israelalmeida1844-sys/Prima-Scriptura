/**
 * Prima Scriptura — Apocalipse 1–4.
 * Fonte unificada do léxico para renderização estática e interação por token.
 * As observações sintáticas e exegéticas pertencem às seções do versículo.
 */
import lexicon from '../data/lexico-grego/apocalipse-4-1-11.json';
type Example={reference:string;greek:string;transliteration?:string;translation:string;explanation?:string};
type Sense={id:string;label:string;definition:string;examples:Example[]};
type Entry={strong:string;lemma:string;lemmaTransliteration:string;partOfSpeech:string;senses:Sense[]};
const entries=lexicon.entries as Record<string,Entry>;
export const lemmaForStrong=(strong:string):Entry|undefined=>entries[strong];

/** Transliteração auxiliar dos exemplos; sem marcação dos acentos, não substitui glosa. */
export function transliterateGreekSnippet(greek:string):string{
 const m:Record<string,string>={
 'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'ē','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','φ':'ph','χ':'ch','ψ':'ps','ω':'ō'
 };
 return (greek.normalize('NFD').match(/\P{M}\p{M}*/gu)||[]).map(chunk=>{
   const first=chunk[0],base=first.toLowerCase(),roman=m[base];
   if(!roman)return first==='᾽'||first==='’'?"'":first;
   const rough=chunk.includes('\u0314');
   const result=(rough?(base==='ρ'?'r':'h'):'')+roman;
   return first===first.toUpperCase()?result[0].toUpperCase()+result.slice(1):result;
 }).join('').replace(/[᾽’ʼ]/gu,"'");
}
function el<K extends keyof HTMLElementTagNameMap>(tag:K,className:string,value?:string):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);n.className=className;if(value!==undefined)n.textContent=value;return n;
}
const useful=(s?:string)=>Boolean(s&&s.trim()&&s.trim()!=='-'&&s.trim()!=='—'&&s.trim()!=='•');
export function updateLexiconLemmaAndSenses(root:HTMLElement,strong:string){
 const entry=lemmaForStrong(strong);
 const tr=root.querySelector<HTMLElement>('[data-lexicon-lemma-transliteration]');
 const senses=root.querySelector<HTMLElement>('[data-lexicon-meanings]');
 if(!tr||!senses)return;
 if(!entry){tr.textContent='Lema em revisão';senses.textContent='Verbete lexical não disponível nesta edição.';return;}
 tr.textContent=entry.lemmaTransliteration;
 const fragment=document.createDocumentFragment();
 for(const sense of entry.senses||[]){
   if(!useful(sense.label)&&!useful(sense.definition))continue;
   const section=el('section','lexical-sense');
   section.dataset.senseId=sense.id;
   if(useful(sense.label))section.appendChild(el('h5','lexical-sense-title',sense.label.trim()));
   if(useful(sense.definition))section.appendChild(el('p','lexical-sense-definition',sense.definition.trim()));
   const examples=el('div','lexical-examples');let count=0;
   for(const sample of sense.examples||[]){
     if(!useful(sample.greek)||!useful(sample.translation))continue;
     const block=el('div','lexical-example');
     if(useful(sample.reference))block.appendChild(el('p','lexical-example-reference','Exemplo: '+sample.reference.trim()));
     block.appendChild(el('span','example-field-label','Grego'));
     const g=el('p','lexical-example-greek',sample.greek.trim());g.lang='grc';block.appendChild(g);
     block.appendChild(el('span','example-field-label','Transliteração auxiliar'));
     block.appendChild(el('p','lexical-example-transliteration',sample.transliteration?.trim()||transliterateGreekSnippet(sample.greek)));
     block.appendChild(el('span','example-field-label','Tradução'));
     block.appendChild(el('p','lexical-example-translation',sample.translation.trim()));
     if(useful(sample.explanation))block.appendChild(el('p','lexical-example-note',sample.explanation!.trim()));
     examples.appendChild(block);count++;
   }
   if(count)section.appendChild(examples);
   fragment.appendChild(section);
 }
 senses.replaceChildren(fragment);
 if(!senses.childElementCount)senses.textContent='Nenhum exemplo lexical validado para exibição.';
}
