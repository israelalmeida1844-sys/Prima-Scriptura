/**
 * Renderização acessível de fichas lexicais hebraicas em Gênesis 1:1–8.
 * Separação explícita entre ocorrência (morfologia/glossa) e lema (semântica).
 * Os trechos em hebraico provêm de WLC/OSHB; nenhum dado lexical é injetado como HTML.
 */
import lexicon from '../data/lexico-hebraico/genesis-1-1-8.json';
type Example={reference:string;hebrew:string;translation:string;explanation:string};
type Sense={id:string;label:string;definition:string;examples:Example[]};
type Entry={lemma:string;lemmaTransliteration:string;senses:Sense[]};
const entries=lexicon.entries as Record<string,Entry>;
export function lemmaForStrong(strong:string):Entry | undefined {return entries[strong]}
function node<K extends keyof HTMLElementTagNameMap>(tag:K,className:string,value?:string){
  const el=document.createElement(tag);
  el.className=className;
  if(value!==undefined)el.textContent=value;
  return el;
}
export function updateLexiconLemmaAndSenses(root:HTMLElement,strong:string){
  const entry=lemmaForStrong(strong);
  const transliteration=root.querySelector<HTMLElement>('[data-lexicon-lemma-transliteration]');
  const senses=root.querySelector<HTMLElement>('[data-lexicon-meanings]');
  if(!transliteration||!senses)return;
  if(!entry){
    transliteration.textContent='Transliteração em revisão';
    senses.textContent='Os sentidos deste lema ainda estão em revisão.';
    return;
  }
  transliteration.textContent=entry.lemmaTransliteration;
  const sections=document.createDocumentFragment();
  for(const sense of entry.senses){
    const section=node('section','lexical-sense');
    section.dataset.senseId=sense.id;
    section.setAttribute('aria-label',sense.label);
    section.appendChild(node('h5','lexical-sense-title',sense.label));
    section.appendChild(node('p','lexical-sense-definition',sense.definition));
    const examples=node('div','lexical-examples');
    for(const example of sense.examples){
      const block=node('div','lexical-example');
      block.appendChild(node('p','lexical-example-reference','Exemplo: '+example.reference));
      const hebrew=node('p','lexical-example-hebrew',example.hebrew);
      hebrew.lang='he';hebrew.dir='rtl';
      block.appendChild(hebrew);
      block.appendChild(node('p','lexical-example-translation',example.translation));
      block.appendChild(node('p','lexical-example-note',example.explanation));
      examples.appendChild(block);
    }
    section.appendChild(examples);
    sections.appendChild(section);
  }
  // Ao selecionar outro lema, substitua a ficha inteira para evitar resíduo.
  senses.replaceChildren(sections);
}
