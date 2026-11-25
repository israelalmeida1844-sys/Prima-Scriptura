/**
 * Prima Scriptura — texto grego de Apocalipse 1:2.
 * Texto, tokens, pontuação e morfologia literalmente conferidos com MorphGNT 6.12,
 * corpus SBLGNT, commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d.
 * Tradução, glosas, transliterações, sintaxe e comentários: edição acadêmica própria.
 * Modificações reservadas a rascunho/apocalipse; não publicar automaticamente.
 */
export const apocalipse1v2 = {
  "reference": "Apocalipse 1:2",
  "book": "Apocalipse",
  "chapter": 1,
  "verse": 2,
  "source": "SBL Greek New Testament (SBLGNT), via MorphGNT",
  "morphologySource": "MorphGNT 6.12 (James K. Tauber); commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d",
  "translation": "O qual testemunhou a palavra de Deus e o testemunho de Jesus Cristo, tudo quanto viu.",
  "translationNote": "Tradução editorial própria; o relativo «o qual» retoma João, referido no versículo 1. A sequência grega conserva dois objetos coordenados e uma oração relativa final que descreve a extensão do testemunho.",
  "textualNotes": "O aparato do SBLGNT não registra divergência entre as edições comparadas neste versículo (não equivale à ausência de variantes manuscritas). Cotejo lexical com o Textus Receptus de Scrivener (1894): «ἐμαρτύρησεν» → «ἐμαρτύρησε»; «εἶδεν» → «τε εἶδε».",
  "exegeticalNotes": [
    "O vocabulário de testemunho liga a missão de João à palavra divina e ao testemunho de Jesus; cf. Ap 1:9; 19:10.",
    "A expressão tudo quanto viu apresenta o relato como testemunho da revelação recebida, sem restringir a experiência profética a percepção ocular comum."
  ],
  "words": [
    {
      "id": "ap1-2-1",
      "shortMorph": "RelPro-NSM",
      "greek": "ὃς",
      "transliteration": "hos",
      "gloss": "o qual",
      "strong": "G3739",
      "lemma": "ὅς",
      "lemmaTransliteration": "hos",
      "partOfSpeech": "Pronome relativo",
      "morphologyCode": "----NSM-",
      "morphology": "Pronome relativo nominativo singular masculino",
      "meanings": "o qual; que; quem",
      "explanation": "Pronome relativo que retoma João, sujeito de ἐμαρτύρησεν. O nominativo decorre da função sintática na nova oração, embora Ἰωάννῃ em 1:1 esteja no dativo.",
      "occurrencesExamples": [
        "Ap 1:1",
        "Ap 1:2"
      ],
      "syntax": {
        "role": "Relativo sujeito (retoma João)",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-2"
      },
      "morphgntPos": "RR"
    },
    {
      "id": "ap1-2-2",
      "shortMorph": "V-AAI-3S",
      "greek": "ἐμαρτύρησεν",
      "transliteration": "emartyrēsen",
      "gloss": "testemunhou",
      "strong": "G3140",
      "lemma": "μαρτυρέω",
      "lemmaTransliteration": "martyreō",
      "partOfSpeech": "Verbo",
      "morphologyCode": "3AAI-S--",
      "morphology": "Aoristo ativo indicativo, terceira pessoa singular",
      "meanings": "testemunhar; atestar; dar testemunho",
      "explanation": "Verbo finito da relativa, com João por sujeito. O aoristo apresenta globalmente o ato de dar testemunho da revelação; sua forma isolada não estabelece o momento exato em que cada visão foi registrada.",
      "occurrencesExamples": [
        "Ap 1:2",
        "Jo 1:34",
        "Jo 19:35"
      ],
      "syntax": {
        "role": "Predicado verbal",
        "clauseId": "AP.1.2.C1",
        "governedBy": null
      },
      "morphgntPos": "V-"
    },
    {
      "id": "ap1-2-3",
      "shortMorph": "Art-ASM",
      "greek": "τὸν",
      "transliteration": "ton",
      "gloss": "a",
      "strong": "G3588",
      "lemma": "ὁ",
      "lemmaTransliteration": "ho",
      "partOfSpeech": "Artigo definido",
      "morphologyCode": "----ASM-",
      "morphology": "Artigo acusativo singular masculino",
      "meanings": "artigo definido, marcador de determinação",
      "explanation": "Determina λόγον, em concordância de caso, gênero e número. Juntamente com o substantivo, forma o primeiro objeto direto de ἐμαρτύρησεν.",
      "occurrencesExamples": [
        "Ap 1:2"
      ],
      "syntax": {
        "role": "Determinante do objeto direto",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-4"
      },
      "morphgntPos": "RA"
    },
    {
      "id": "ap1-2-4",
      "shortMorph": "N-ASM",
      "greek": "λόγον",
      "transliteration": "logon",
      "gloss": "palavra",
      "strong": "G3056",
      "lemma": "λόγος",
      "lemmaTransliteration": "logos",
      "partOfSpeech": "Substantivo",
      "morphologyCode": "----ASM-",
      "morphology": "Substantivo acusativo singular masculino",
      "meanings": "palavra; discurso; mensagem; razão",
      "explanation": "Primeiro objeto direto do verbo testemunhar. Na expressão τὸν λόγον τοῦ θεοῦ, designa a mensagem ou palavra procedente de Deus; não se deve impor automaticamente o emprego cristológico de λόγος em João 1:1.",
      "occurrencesExamples": [
        "Ap 1:2",
        "Ap 1:9",
        "Ap 6:9",
        "Jo 1:1"
      ],
      "syntax": {
        "role": "Objeto direto (primeiro membro)",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-2"
      },
      "morphgntPos": "N-"
    },
    {
      "id": "ap1-2-5",
      "shortMorph": "Art-GSM",
      "greek": "τοῦ",
      "transliteration": "tou",
      "gloss": "do",
      "strong": "G3588",
      "lemma": "ὁ",
      "lemmaTransliteration": "ho",
      "partOfSpeech": "Artigo definido",
      "morphologyCode": "----GSM-",
      "morphology": "Artigo genitivo singular masculino",
      "meanings": "artigo definido, marcador de determinação",
      "explanation": "Determina θεοῦ no genitivo, vinculando-o ao substantivo λόγον. Em português, artigo e genitivo correspondem idiomaticamente à construção «de Deus».",
      "occurrencesExamples": [
        "Ap 1:2"
      ],
      "syntax": {
        "role": "Determinante do genitivo",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-6"
      },
      "morphgntPos": "RA"
    },
    {
      "id": "ap1-2-6",
      "shortMorph": "N-GSM",
      "greek": "θεοῦ",
      "transliteration": "theou",
      "gloss": "Deus",
      "strong": "G2316",
      "lemma": "θεός",
      "lemmaTransliteration": "theos",
      "partOfSpeech": "Substantivo",
      "morphologyCode": "----GSM-",
      "morphology": "Substantivo genitivo singular masculino",
      "meanings": "Deus; divindade",
      "explanation": "Complemento genitivo que identifica a origem ou associação divina da palavra. O sentido contextual é «palavra de Deus», não um segundo objeto direto de ἐμαρτύρησεν.",
      "occurrencesExamples": [
        "Ap 1:2",
        "Ap 1:9"
      ],
      "syntax": {
        "role": "Complemento genitivo de λόγον",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-4"
      },
      "morphgntPos": "N-"
    },
    {
      "id": "ap1-2-7",
      "shortMorph": "Conj",
      "greek": "καὶ",
      "transliteration": "kai",
      "gloss": "e",
      "strong": "G2532",
      "lemma": "καί",
      "lemmaTransliteration": "kai",
      "partOfSpeech": "Conjunção coordenativa",
      "morphologyCode": "--------",
      "morphology": "Conjunção copulativa, sem flexão",
      "meanings": "e; também; até",
      "explanation": "Coordena os dois núcleos acusativos λόγον e μαρτυρίαν sob o mesmo predicado ἐμαρτύρησεν; não introduz necessariamente uma segunda ação independente.",
      "occurrencesExamples": [
        "Ap 1:2"
      ],
      "syntax": {
        "role": "Coordenador de objetos diretos",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-9"
      },
      "morphgntPos": "C-"
    },
    {
      "id": "ap1-2-8",
      "shortMorph": "Art-ASF",
      "greek": "τὴν",
      "transliteration": "tēn",
      "gloss": "a",
      "strong": "G3588",
      "lemma": "ὁ",
      "lemmaTransliteration": "ho",
      "partOfSpeech": "Artigo definido",
      "morphologyCode": "----ASF-",
      "morphology": "Artigo acusativo singular feminino",
      "meanings": "artigo definido, marcador de determinação",
      "explanation": "Determina μαρτυρίαν, em concordância de acusativo singular feminino. A tradução idiomática é «o testemunho», embora o gênero do substantivo grego seja feminino.",
      "occurrencesExamples": [
        "Ap 1:2"
      ],
      "syntax": {
        "role": "Determinante do segundo objeto",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-9"
      },
      "morphgntPos": "RA"
    },
    {
      "id": "ap1-2-9",
      "shortMorph": "N-ASF",
      "greek": "μαρτυρίαν",
      "transliteration": "martyrian",
      "gloss": "testemunho",
      "strong": "G3141",
      "lemma": "μαρτυρία",
      "lemmaTransliteration": "martyria",
      "partOfSpeech": "Substantivo",
      "morphologyCode": "----ASF-",
      "morphology": "Substantivo acusativo singular feminino",
      "meanings": "testemunho; depoimento; evidência",
      "explanation": "Segundo objeto direto, coordenado a λόγον. O genitivo seguinte permite interpretar o testemunho originado de Jesus, acerca de Jesus ou associado a ele; a gramática, sozinha, não elimina essas possibilidades.",
      "occurrencesExamples": [
        "Ap 1:2",
        "Ap 1:9",
        "Ap 12:17",
        "Ap 19:10"
      ],
      "syntax": {
        "role": "Objeto direto coordenado",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-2"
      },
      "morphgntPos": "N-"
    },
    {
      "id": "ap1-2-10",
      "shortMorph": "N-GSM",
      "greek": "Ἰησοῦ",
      "transliteration": "Iēsou",
      "gloss": "de Jesus",
      "strong": "G2424",
      "lemma": "Ἰησοῦς",
      "lemmaTransliteration": "Iēsous",
      "partOfSpeech": "Substantivo próprio",
      "morphologyCode": "----GSM-",
      "morphology": "Substantivo próprio genitivo singular masculino",
      "meanings": "Jesus",
      "explanation": "Primeiro termo do genitivo composto Ἰησοῦ Χριστοῦ, dependente de μαρτυρίαν. Identifica Jesus como referente do testemunho, sem decidir isoladamente o valor subjetivo ou objetivo do genitivo.",
      "occurrencesExamples": [
        "Ap 1:2",
        "Ap 1:1"
      ],
      "syntax": {
        "role": "Complemento genitivo de μαρτυρίαν",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-9"
      },
      "morphgntPos": "N-"
    },
    {
      "id": "ap1-2-11",
      "shortMorph": "N-GSM",
      "greek": "Χριστοῦ",
      "transliteration": "Christou",
      "gloss": "Cristo",
      "strong": "G5547",
      "lemma": "Χριστός",
      "lemmaTransliteration": "Christos",
      "partOfSpeech": "Título messiânico",
      "morphologyCode": "----GSM-",
      "morphology": "Substantivo/título genitivo singular masculino",
      "meanings": "Cristo; ungido; Messias",
      "explanation": "Título messiânico em aposição a Ἰησοῦ, no mesmo caso genitivo. A forma Χριστοῦ está unida à identificação «Jesus Cristo», não constitui novo referente independente.",
      "occurrencesExamples": [
        "Ap 1:2",
        "Ap 1:1"
      ],
      "syntax": {
        "role": "Aposição ao nome Jesus",
        "clauseId": "AP.1.2.C1",
        "governedBy": "ap1-2-10"
      },
      "morphgntPos": "N-",
      "trailingPunctuation": ","
    },
    {
      "id": "ap1-2-12",
      "shortMorph": "RelPro-APN",
      "greek": "ὅσα",
      "transliteration": "hosa",
      "gloss": "tudo quanto",
      "strong": "G3745",
      "lemma": "ὅσος",
      "lemmaTransliteration": "hosos",
      "partOfSpeech": "Pronome relativo de quantidade",
      "morphologyCode": "----APN-",
      "morphology": "Pronome relativo acusativo plural neutro",
      "meanings": "quanto; tantos quantos; tudo quanto",
      "explanation": "Introduz construção relativa livre com valor totalizante: «tudo quanto» João viu. O acusativo plural neutro funciona como objeto direto de εἶδεν, sintetizando o conteúdo do testemunho.",
      "occurrencesExamples": [
        "Ap 1:2"
      ],
      "syntax": {
        "role": "Objeto direto da relativa livre",
        "clauseId": "AP.1.2.C2",
        "governedBy": "ap1-2-13"
      },
      "morphgntPos": "RR"
    },
    {
      "id": "ap1-2-13",
      "shortMorph": "V-AAI-3S",
      "greek": "εἶδεν",
      "transliteration": "eiden",
      "gloss": "viu",
      "strong": "G3708",
      "lemma": "ὁράω",
      "lemmaTransliteration": "horaō",
      "partOfSpeech": "Verbo",
      "morphologyCode": "3AAI-S--",
      "morphology": "Aoristo ativo indicativo, terceira pessoa singular (ὁράω)",
      "meanings": "ver; observar; perceber",
      "explanation": "Predicado da oração relativa introduzida por ὅσα; João permanece sujeito implícito. No contexto apocalíptico, «ver» pode incluir percepção visionária, sem que a forma verbal prove todos os detalhes do modo da visão.",
      "occurrencesExamples": [
        "Ap 1:2",
        "Ap 6:9",
        "Jo 1:34"
      ],
      "syntax": {
        "role": "Predicado da relativa livre",
        "clauseId": "AP.1.2.C2",
        "governedBy": null
      },
      "morphgntPos": "V-",
      "trailingPunctuation": "."
    }
  ],
  "syntacticNotes": [
    "ὃς é sujeito da relativa e retoma João em Ap 1:1; o aoristo ἐμαρτύρησεν apresenta seu testemunho globalmente.",
    "τὸν λόγον τοῦ θεοῦ e τὴν μαρτυρίαν Ἰησοῦ Χριστοῦ são objetos diretos coordenados. O genitivo de Jesus Cristo admite relação de origem ou conteúdo, a ser avaliada pelo contexto.",
    "ὅσα εἶδεν é relativa livre em função epexegética, resumindo o conteúdo testemunhado."
  ]
} as const;
