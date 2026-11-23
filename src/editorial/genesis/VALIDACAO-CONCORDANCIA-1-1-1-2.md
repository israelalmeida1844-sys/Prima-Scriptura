# Validação filológica e estrutural da concordância — Gênesis 1:1–2

**Situação:** índices gerados, gravados e reabertos diretamente no GitHub, somente na branch `rascunho/genesis`; **site não publicado**. Os dados foram produzidos lendo os 39 arquivos originais OSHB v.2.2, em quatro lotes, por meio do conector GitHub. O método segue o escopo do gerador `scripts/gerar-concordancia-genesis-1-1.mjs`.

## Fonte, abrangência e atribuição

- **Fonte:** Open Scriptures Hebrew Bible (OSHB) v.2.2, `wlc/{Livro}.xml`, baseada no Westminster Leningrad Codex. Endereço: https://github.com/openscriptures/morphhb
- **39 livros**, **23.213 versículos** processados. Incluídos todos os livros do cânon hebraico; passagens em aramaico presentes nos livros bíblicos também pertencem ao corpus.
- **16 lemas-base / códigos Strong** indexados, cobrindo todos os vocábulos de Gn 1:1–2 (repetições no mesmo versículo compartilham entrada).
- **Contagem de tokens:** cada token OSHB identificado com aquele código lexical conta como uma ocorrência. **Contagem de versículos:** referências distintas, sem repetir `Gn 1:2` caso o lema apareça duas vezes.
- Em `lemma="c/d/776"`, por exemplo, a identificação retém a base `776` e aceita o prefixo. Qualificadores de homógrafos (`a`, `b`) são normalizados ao código Strong-base; a listagem é **exaustiva para o código-base OSHB**, não uma discriminação de todos os sentidos lexicais possíveis.
- **Licença de morfologia/lema:** CC BY 4.0. Atribuição: “Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb”.

## Contagens verificadas para Gênesis 1:2

| Strong | Lema | Ocorrências de tokens | Versículos distintos |
|---|---|---:|---:|
| H776 | אֶרֶץ | 2505 | 2190 |
| H1961 | הָיָה | 3575 | 3131 |
| H8414 | תֹּהוּ | 20 | 19 |
| H922 | בֹּהוּ | 3 | 3 |
| H2822 | חֹשֶׁךְ | 80 | 77 |
| H5921 | עַל | 5781 | 4493 |
| H6440 | פָּנִים | 2127 | 1891 |
| H8415 | תְּהוֹם | 36 | 35 |
| H7307 | רוּחַ | 378 | 348 |
| H430 | אֱלֹהִים | 2600 | 2246 |
| H7363 | רָחַף | 3 | 3 |
| H4325 | מַיִם | 582 | 525 |

**Observação:** Gn 1:2 possui 14 tokens hebraicos na segmentação editorial, mas dois lemas se repetem duas vezes (`עַל`, `פָּנִים`); por isso há 12 códigos Strong distintos neste verso.

Outros quatro códigos são exclusivos de Gn 1:1: **H7225** (51 tokens/49 versículos), **H1254** (54/46), **H853** (10.979/6.782), **H8064** (421/395). As entradas H430 e H776 são compartilhadas entre os dois versículos.

## Conferências independentes e critérios de aceitação

1. Os **39 livros foram lidos** e cada livro apresentou versículos OSIS; nenhum lote ficou vazio.
2. O total de versículos processados nos quatro lotes é **23.213**.
3. Cada um dos **16 arquivos finais JSON foi novamente baixado da branch** e analisado: `complete:true`, `strong` correspondente ao nome, `verseCount = references.length` e `tokenCount >= verseCount`.
4. Nenhum arquivo apresentou **referência duplicada** após a agregação dos 39 livros.
5. O manifesto `genesis-1-1-2-manifest.json` foi gravado com 39 livros, versão v.2.2 e os 16 códigos exigidos.
6. Os dois lemas de três ocorrências foram conferidos nominalmente contra a listagem do próprio corpus:
   - **H922** — `Gn 1:2; Is 34:11; Jr 4:23`.
   - **H7363** — `Gn 1:2; Dt 32:11; Jr 23:9`.
7. A entrada **H8414** possui 20 tokens distribuídos por 19 versículos; é um exemplo em que **ocorrências não equivalem a referências**.
8. A lista do leitor é carregada exclusivamente do arquivo local `/data/concordancia-hebraica/HNNNN.json`, em ordem de livros e versículos, com referências horizontais, abreviadas e separadas por ponto e vírgula.

## Artefatos e decisões pendentes

- Arquivos definitivos: `public/data/concordancia-hebraica/H{codigo}.json` (16 arquivos) e manifesto `public/data/concordancia-hebraica/genesis-1-1-2-manifest.json`.
- Dados intermediários de auditoria: `src/editorial/genesis/indices-parciais-01.json` a `04.json`.
- **Não executados:** `npm run build` e teste visual real no navegador. É necessário realizar esses testes antes de publicar.
- **Não incluído:** exibir o versículo integral ao selecionar uma referência. A exigência aprovada nesta etapa é a listagem exaustiva de referências abreviadas.
- **Atenção lexical:** contagens baseadas na classificação do corpus OSHB v.2.2 podem diferir de outras concordâncias por critérios de lematização, subdivisão e normalização dos códigos. Não as atribuir a todas as edições da Bíblia Hebraica.
- **Deploy/merge:** não solicitado, não executado e não autorizado.
