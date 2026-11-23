/**
 * Renderização dinâmica e acessível de fichas lexicais gregas para Apocalipse.
 * Separação explícita entre ocorrência textual (morfologia/glosa) e lema (semântica).
 */
import lexicon1 from '../data/lexico-grego/apocalipse-1-1.json';
import lexicon2 from '../data/lexico-grego/apocalipse-1-2.json';
import lexicon38 from '../data/lexico-grego/apocalipse-1-3-8.json';
import lexicon920 from '../data/lexico-grego/apocalipse-1-9-20.json';
import lexicon2_1_12 from '../data/lexico-grego/apocalipse-2-1-12.json';

type Example = {
  reference: string;
  greek: string;
  translation: string;
  explanation: string;
};

type Sense = {
  id: string;
  label: string;
  definition: string;
  examples: Example[];
};

type Entry = {
  strong: string;
  lemma: string;
  lemmaTransliteration: string;
  partOfSpeech: string;
  senses: Sense[];
};

const entries = { ...lexicon2_1_12.entries, ...lexicon920.entries, ...lexicon38.entries, ...lexicon1.entries, ...lexicon2.entries } as Record<string, Entry>;

export function lemmaForStrong(strong: string): Entry | undefined {
  return entries[strong];
}

function node<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  value?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}

export function updateLexiconLemmaAndSenses(root: HTMLElement, strong: string) {
  const entry = lemmaForStrong(strong);
  const transliteration = root.querySelector<HTMLElement>('[data-lexicon-lemma-transliteration]');
  const senses = root.querySelector<HTMLElement>('[data-lexicon-meanings]');
  if (!transliteration || !senses) return;

  if (!entry) {
    transliteration.textContent = 'Transliteração em revisão';
    senses.textContent = 'Os sentidos deste lema ainda estão em revisão.';
    return;
  }

  transliteration.textContent = entry.lemmaTransliteration;

  const sections = document.createDocumentFragment();
  for (const sense of entry.senses) {
    const section = node('section', 'lexical-sense');
    section.dataset.senseId = sense.id;
    section.setAttribute('aria-label', sense.label);
    section.appendChild(node('h5', 'lexical-sense-title', sense.label));
    section.appendChild(node('p', 'lexical-sense-definition', sense.definition));

    const examples = node('div', 'lexical-examples');
    for (const example of sense.examples) {
      const block = node('div', 'lexical-example');
      block.appendChild(node('p', 'lexical-example-reference', 'Exemplo: ' + example.reference));
      const greek = node('p', 'lexical-example-greek', example.greek);
      greek.lang = 'grc';
      block.appendChild(greek);
      block.appendChild(node('p', 'lexical-example-translation', example.translation));
      block.appendChild(node('p', 'lexical-example-note', example.explanation));
      examples.appendChild(block);
    }
    section.appendChild(examples);
    sections.appendChild(section);
  }

  senses.replaceChildren(sections);
}
