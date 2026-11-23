# Gênesis 1:5 — validação editorial, filológica e técnica

**Estado:** preparado e validado tecnicamente em rascunho; **aguardando aprovação expressa**. Não foi mesclado na branch `main` nem publicado no site.

## Texto interlinear

13 unidades textuais, 10 lemas Strong distintos. Fonte primária: Texto Massorético, WLC/OSHB, com vocalização preservada e acentos cantilacionais omitidos na disposição interlinear.

Texto vocalizado sem cantilação:
> וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם וְלַחֹשֶׁךְ קָרָא לָיְלָה וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם אֶחָד׃

Tradução editorial própria: «Deus chamou à luz Dia, e às trevas chamou Noite. Houve tarde e houve manhã: dia um.»

Pontos de cautela: (a) `לָיְלָה` é o substantivo *noite*, e não a preposição לְ anteposta ao substantivo; (b) `יוֹם אֶחָד` emprega numeral cardinal, aqui «dia um»; (c) `יוֹם` tem funções contextuais diferentes na primeira e segunda ocorrência do versículo; (d) a fórmula «tarde e manhã» é descrição da sequência narrativa, e debates posteriores não devem ser apresentados como significado lexical obrigatório.

## Concordâncias exaustivas (39 livros OSHB v.2.2)

| Strong | Lema | Tokens | Versículos distintos | Origem do índice |
|---|---|---:|---:|---|
| H7121 | קָרָא | 739 | 689 | novo |
| H430 | אֱלֹהִים | 2.600 | 2.246 | reutilizado |
| H216 | אוֹר | 121 | 110 | reutilizado |
| H3117 | יוֹם | 2.304 | 1.930 | novo |
| H2822 | חֹשֶׁךְ | 80 | 77 | reutilizado |
| H3915 | לַיִל | 235 | 223 | novo |
| H1961 | הָיָה | 3.575 | 3.131 | reutilizado |
| H6153 | עֶרֶב | 134 | 125 | novo |
| H1242 | בֹּקֶר | 214 | 189 | novo |
| H259 | אֶחָד | 976 | 739 | novo |

Os índices completos estão em `public/data/concordancia-hebraica/H<ID>.json`. Todos os 10 retornam `complete: true`, `Gn 1:5` presente, contagens coerentes e referências deduplicadas. `tokenCount` conta ocorrências de lema codificadas em tokens da OSHB, não variantes ortográficas individualizadas; `verseCount` deduplica as referências por versículo. Prefixos gramaticais incorporados aos tokens não se confundem com o lema principal da unidade.

Fonte e licença: Open Scriptures Hebrew Bible (`morphhb`), v.2.2, CC BY 4.0. Atribuição: Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb

## Arquivos editoriais

- `src/data/texto-original/genesis-1-5.ts`: hebraico, transliteração, glossas, Strong, morfologia, semântica e notas.
- `src/components/TextoOriginalGenesis1v5.astro`: interlinear com seleção de palavras, concordâncias integrais e controles de visualização; Times New Roman priorizada.
- `src/pages/rascunhos/genesis-1-5.astro`: página isolada de revisão.
- `scripts/gerar-concordancia-genesis-1-1.mjs`: gerador atualizado para incluir os seis novos lemas e verificar Gn 1:5.
- `.github/workflows/auditar-genesis-1-5.yml`: auditoria pontual, sem publicação.

## Testes

GitHub Actions, execução **45092216597**, **concluída com sucesso**: gerador OSHB v.2.2 executado, dez concordâncias verificadas, 13 unidades textuais conferidas estruturalmente, `npm run build` aprovado, HTML do protótipo existente e marcação de interlinear, Times New Roman e concordância inspecionada.

https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45092216597

**Limites:** os testes de compilação/HTML não substituem revisão visual responsiva nem teste real dos cliques e carregamentos em navegador. A precisão de cada glossa e morfologia requer aprovação editorial humana; a automação não prova independemente todas as escolhas exegéticas. Nenhuma alteração à branch principal foi realizada. A branch do repositório é publicamente visível, embora não incorporada ao site.
