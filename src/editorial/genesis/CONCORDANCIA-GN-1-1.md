# Concordância interna de Gênesis 1:1 — implementação aprovada

**Status:** código e 16 índices completos da OSHB v.2.2 gravados e validados na branch `rascunho/genesis`, ainda não publicados. Consulte [relatório de validação](VALIDACAO-CONCORDANCIA-1-1-1-2.md).

## 1. Especificações editoriais aprovadas

1. Manter texto original em hebraico, direita para esquerda, com fonte Times New Roman; transliteração e glosa independentes.
2. Manter ficha lexical por palavra com lema, morfologia e significado contextual.
3. Manter a tradução aprovada: **“No princípio, Deus criou os céus e a terra.”**
4. Ao clicar em **“Mostrar todas as ocorrências”**, expandir **dentro do Prima Scriptura** a lista horizontal de referências bíblicas abreviadas, separadas por ponto e vírgula, com quebra automática de linha em telas menores.
5. Referências ordenadas pela sequência canônica da base da Bíblia Hebraica (39 livros), não pela ordem alfabética das abreviações.
6. Cada referência é um elemento selecionável dentro do site. A leitura contextual completa do versículo selecionado ainda requer elaboração editorial, não incluída neste passo.
7. Não utilizar serviços de concordância externos no navegador. O conteúdo é carregado de arquivos JSON estáticos sob `/data/concordancia-hebraica/`.

## 2. Corpus e critérios técnicos

**Fonte:** [Open Scriptures Hebrew Bible](https://github.com/openscriptures/morphhb), baseada no Westminster Leningrad Codex e acrescida de análises de lema e morfologia. Versão de referência: **v.2.2**.

**Atribuição exigida pela licença CC BY 4.0:**

> Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb

A ferramenta `scripts/gerar-concordancia-genesis-1-1.mjs` lê os 39 arquivos OSIS XML de `wlc/` da versão indicada e seleciona as formas lexicais equivalentes aos Strong:

- **H7225** — `רֵאשִׁית`
- **H1254** — `בָּרָא`
- **H430** — `אֱלֹהִים`
- **H853** — marcador de objeto direto `אֵת`; usado também na forma prefixada `וְאֵת`
- **H8064** — `שָׁמַיִם`
- **H776** — `אֶרֶץ`

Os prefixos e sufixos marcados no lema OSHB são analisados com separação por `/`. O índice não se limita à grafia com artigo encontrada em Gênesis 1:1.

**Diferença de contagem:** `tokenCount` registra todas as ocorrências de tokens classificados com o lema; `verseCount` conta versículos distintos, de modo que duas ocorrências do mesmo lema no mesmo versículo resultam em apenas uma referência listada. Assim, `H853` aparece duas vezes em Gn 1:1, mas `Gn 1:1` é mostrado só uma vez.

A interface disponibiliza as **referências completas, não uma lista de exemplos**. Em lemas frequentes, as referências são inseridas em lotes visuais para evitar travamento do navegador.

## 3. Geração dos dados

- Comando manual: `npm run concordancia:gerar`.
- Durante a compilação: `npm run build` executa primeiro `prebuild`, que gera o índice caso os arquivos locais completos ainda não existam.
- Os **16 arquivos gerados e verificados** encontram-se em `public/data/concordancia-hebraica/H{Strong}.json`, abrangendo Gênesis 1:1–2, além do manifesto `genesis-1-1-2-manifest.json`.
- Depois da geração, **a navegação do leitor não consulta a Open Scriptures, o GitHub ou qualquer servidor externo**: recebe o JSON local do próprio Prima Scriptura.
- Se os arquivos locais estiverem ausentes/incompletos, a interface **não apresenta referências de exemplo como se fossem resultados completos**: exibe aviso de geração pendente.
- A indexação completa foi executada por leitura direta dos 39 arquivos originais OSHB via conector GitHub, em quatro lotes, com agregação e conferência dos 16 arquivos JSON finais. Como os índices e o manifesto já estão presentes na branch, o `prebuild` está programado para reutilizá-los após conferir sua integridade básica, sem novo download.
- Ainda não houve `npm run build` nem inspeção da interface no navegador. Essas verificações continuam obrigatórias antes da aprovação de publicação.

## 4. Limites da etapa atual

**Concluído:** código gerador; integração com `prebuild`; interface horizontal interna expansível; separadores `;`; dados por lema; **16 índices gerados e validados diretamente contra o corpus OSHB (39 livros, 23.213 versículos)**; remoção dos links para Bible Hub no protótipo.

**Pendente:** executar `npm run build`, testar a visualização em navegador e, caso venha a ser solicitado, adicionar o texto completo ao selecionar uma referência. A geração e a conferência dos índices estão concluídas; a validação de funcionamento do site ainda não.

**Publicação:** proibida sem autorização editorial. A branch `main` não deve ser alterada e não se deve mesclar a PR automaticamente.
