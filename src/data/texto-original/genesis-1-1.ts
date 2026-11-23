/**
 * Prima Scriptura — texto original de Gênesis 1:1.
 * Estado: aprovado pelo editor para gravação apenas na branch de rascunho.
 * As ocorrências serão consultadas no índice estático local por lema/Strong,
 * gerado a partir do corpus completo OSHB. Não confundir referência de exemplo
 * com listagem de todas as ocorrências.
 * O hebraico é armazenado em ordem canônica de leitura (direita → esquerda).
 */
export const genesis1v1 = {
  reference: 'Gênesis 1:1',
  source: 'Texto Massorético',
  translation: 'No princípio, Deus criou os céus e a terra.',
  translationNote: 'Tradução natural em português, distinta das glosas interlineares.',
  words: [
    {
      id: 'gn1-1-1', hebrew: 'בְּרֵאשִׁית', transliteration: 'bə-rēʾšîṯ',
      gloss: 'No princípio', strong: 'H7225', lemma: 'רֵאשִׁית',
      morphology: 'Preposição בְּ + substantivo feminino singular',
      meanings: 'Princípio, começo, primeira parte, primícias.',
      explanation: 'A preposição בְּ acrescenta o sentido de “em”. Neste contexto, a expressão é tradicionalmente traduzida “no princípio”. A relação sintática com o restante do versículo é discutida na exegese.',
      occurrencesExamples: ['Gn 1:1', 'Gn 10:10', 'Êx 23:19', 'Pv 1:7'],
    },
    {
      id: 'gn1-1-2', hebrew: 'בָּרָא', transliteration: 'bārāʾ',
      gloss: 'criou', strong: 'H1254', lemma: 'בָּרָא',
      morphology: 'Verbo Qal, perfeito, terceira pessoa masculina singular',
      meanings: 'Criar, formar, produzir.',
      explanation: 'Neste versículo, expressa a ação criadora de Deus e concorda com o sujeito אֱלֹהִים.',
      occurrencesExamples: ['Gn 1:1', 'Gn 1:21', 'Gn 1:27', 'Is 45:18'],
    },
    {
      id: 'gn1-1-3', hebrew: 'אֱלֹהִים', transliteration: 'ʾĕlōhîm',
      gloss: 'Deus', strong: 'H430', lemma: 'אֱלֹהִים',
      morphology: 'Substantivo de forma masculina plural',
      meanings: 'Deus; em outros contextos, deuses ou seres divinos.',
      explanation: 'Embora tenha forma plural, designa aqui o Deus criador e está acompanhado do verbo singular בָּרָא. A forma plural isoladamente não demonstra a doutrina da Trindade.',
      occurrencesExamples: ['Gn 1:1', 'Gn 1:2', 'Gn 1:3', 'Gn 2:2'],
    },
    {
      id: 'gn1-1-4', hebrew: 'אֵת', transliteration: 'ʾēṯ',
      gloss: '[objeto direto]', strong: 'H853', lemma: 'אֵת',
      morphology: 'Partícula marcadora do objeto direto definido',
      meanings: 'Partícula gramatical normalmente sem tradução independente.',
      explanation: 'Introduz “os céus” como objeto direto do verbo “criar”.',
      occurrencesExamples: ['Gn 1:1', 'Gn 1:16', 'Gn 1:21'],
    },
    {
      id: 'gn1-1-5', hebrew: 'הַשָּׁמַיִם', transliteration: 'haššāmayim',
      gloss: 'os céus', strong: 'H8064', lemma: 'שָׁמַיִם',
      morphology: 'Artigo definido הַ + substantivo masculino de forma plural',
      meanings: 'Céus, céu, firmamento ou espaço celeste.',
      explanation: 'O prefixo הַ corresponde ao artigo definido “os”. O substantivo שָׁמַיִם significa “céus”. Em Gênesis 1:1, a expressão “os céus e a terra” indica, em conjunto, a totalidade da criação.',
      occurrencesExamples: ['Gn 1:1', 'Gn 1:8', 'Gn 2:1', 'Sl 19:1'],
    },
    {
      id: 'gn1-1-6', hebrew: 'וְאֵת', transliteration: 'wə-ʾēṯ',
      gloss: 'e [objeto direto]', strong: 'H853', lemma: 'אֵת',
      morphology: 'Conjunção וְ + partícula do objeto direto',
      meanings: 'Conjunção “e” seguida do marcador de objeto direto.',
      explanation: 'A conjunção une “a terra” a “os céus”. A partícula אֵת introduz o objeto definido e normalmente não é traduzida.',
      occurrencesExamples: ['Gn 1:1', 'Gn 1:16', 'Gn 1:21'],
    },
    {
      id: 'gn1-1-7', hebrew: 'הָאָרֶץ', transliteration: 'hāʾāreṣ',
      gloss: 'a terra', strong: 'H776', lemma: 'אֶרֶץ',
      morphology: 'Artigo definido + substantivo feminino singular',
      meanings: 'Terra, território, chão, região ou país.',
      explanation: 'Neste contexto, completa a expressão abrangente “os céus e a terra”.',
      occurrencesExamples: ['Gn 1:1', 'Gn 1:2', 'Gn 1:10', 'Gn 12:1'],
    },
  ],
} as const;
