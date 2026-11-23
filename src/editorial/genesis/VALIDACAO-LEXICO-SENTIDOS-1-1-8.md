# PRIMA SCRIPTURA — Homologação lexical de Gênesis 1:1–8

**Status editorial:** material integralmente salvo em `rascunho/genesis`, **sem alteração de `main` e sem deploy**. A implementação técnica está pronta para homologação; acepções e exemplos continuam sujeitos a revisão filológica humana antes da publicação.

## 1. Propósito e abrangência

A reformulação atinge todas as **90 unidades textuais** de Gênesis 1:1–8 e centraliza **36 lemas Strong** em um léxico hebraico compartilhado com **73 grupos de acepções/uso** e **80 exemplos bíblicos**.

Em cada ficha lexical, **Lema** passa a apresentar a palavra de dicionário em hebraico grande, com transliteração **própria do lema** em linha abaixo, distinta da forma flexionada presente no versículo. O campo **Sentidos e exemplos** passa a exibir acepções didáticas, definições, referências em ordem bíblica, trechos reais hebraicos do WLC, tradução editorial portuguesa e nota explicativa. As concordâncias exaustivas permanecem separadas e **inalteradas**.

### Exemplo do termo solicitado pelo editor

**Forma em Gn 1:2:** וְהָאָרֶץ (*wəhāʾāreṣ*).

**Lema:** אֶרֶץ (*ʾereṣ*), Strong H776.

**Sentidos e testemunhos ilustrativos**:
- **Terra:** Gn 1:1 — oposição abrangente entre céus e terra.
- **País ou território:** Gn 12:1 — a terra para a qual Abrão recebe ordem de ir.
- **Solo ou chão:** Gn 2:5 — contexto de vegetação e terreno.

As referências foram selecionadas por clareza de acepção; não se pretende afirmar que todos os sentidos coexistem simultaneamente em Gn 1:2. A partícula וְ e o artigo הָ da forma flexionada não pertencem ao lema H776.

## 2. Separação estrutural dos dados

A implementação conserva as fichas específicas dos versículos em `src/data/texto-original/genesis-1-{1..8}.ts` e introduz uma **única entrada por Strong** para os dados lexicais e exemplos. A morfologia da ocorrência, a glossa e a explicação contextual não foram mescladas ou substituídas pelas acepções gerais.

Arquivos principais:
- `scripts/dados-editoriais-lexico-genesis.mjs`: curadoria original das 36 entradas, acepções e 80 referências.
- `scripts/gerar-lexico-exemplos-genesis.mjs`: obtenção das palavras hebraicas do corpus **OSHB v.2.2**, conferência da presença do Strong nas 80 referências e geração determinística do JSON. Elimina os separadores editoriais de morfemas (`/`) presentes no XML de origem, preservando consoantes e vogais.
- `src/data/lexico-hebraico/genesis-1-1-8.json`: dados compartilhados gerados, com texto hebraico efetivamente extraído do WLC.
- `src/components/GenesisLexiconSenseList.astro`: renderização inicial SSR (sem depender de JavaScript).
- `src/scripts/lexico-hebraico-genesis.ts`: atualização segura da ficha ao clicar em outra palavra, usando `textContent` e DOM, nunca HTML bruto.
- `src/styles/genesis-lexicon.css`: tipografia Times New Roman, dimensões responsivas do lema e estrutura semântica dos exemplos.
- `src/components/TextoOriginalGenesis1v{1..8}.astro`: oito componentes adaptados, preservando as interações anteriores.
- `scripts/testar-lexico-genesis-1-1-8.mjs` e `.github/workflows/homologar-lexico-genesis.yml`: validação de ponta a ponta em Chromium.
- `.github/workflows/validar-lexico-genesis-1-1-8.yml`: primeira validação de geração dos trechos hebraicos.

## 3. Proveniência e limitações acadêmicas

**Fonte textual diretamente inspecionada:** Westminster Leningrad Codex, incorporado na Open Scriptures Hebrew Bible, tag `v.2.2`, https://github.com/openscriptures/morphhb . Atribuição de morfologia e índices OSHB: CC BY 4.0. O texto hebraico massorético encontra-se em domínio público.

O validador cruza cada exemplo com o arquivo `HNNNN.json` e lê o XML do livro correspondente, confirmando que **a palavra etiquetada pelo Strong está no versículo citado**. O trecho hebraico é **extraído do texto da fonte** em vez de reconstruído a partir da tradução.

**Limite importante:** a validação mecânica comprova a ocorrência do lema, **não a análise de sentido**. A classificação dos 73 usos e as explicações portuguesas são sínteses editoriais que precisam de revisão acadêmica humana. Não foi realizada conferência individual documentada de todas as entradas de HALOT, DCH ou BDB. Logo, **não atribuir definições a esses léxicos sem consulta demonstrável**. As traduções são editoriais e não reproduções literais extensas da ARA.

Algumas classificações distinguem explicitamente usos de **troncos verbais diferentes** (por exemplo, בָּרָא em Js 17:15) para não transferir mecanicamente sentidos para Gn 1:1. As partículas e preposições recebem grupos de funções, não falsas multiplicações de sentidos.

**Variante lematizada:** Strong H3915 possui as formas lexicais relacionadas `לַיִל` e `לַיְלָה`. O léxico central foi alinhado com `לַיִל` do registro já existente de Gn 1:5, cuja transliteração canônica aqui é `layil`. Isso evita apresentar dois lemas distintos para o mesmo Strong em Gênesis 1:1–8.

## 4. Critérios de interface e acessibilidade

- Lema hebraico ampliado: cerca de 28–34 px, dependendo da resolução.
- Transliteração da entrada lexical: 16–18 px, logo abaixo da palavra.
- `lang="he"` e `dir="rtl"` no hebraico; `dir="ltr"` na transliteração.
- Um bloco visual por grupo de acepções, com exemplos sem necessidade de expandir a concordância.
- CSS das linhas `dt/dd` restrito aos filhos diretos, para que cartões internos não herdem layout de duas colunas.
- Todos os novos elementos em Times New Roman, incluindo hebraico quando suportado e fontes hebraicas alternativas de legibilidade.
- Ao trocar de palavra, a apresentação semântica é inteiramente substituída, evitando exemplos residuais da seleção anterior.
- Ausência de dependências externas ou chamadas remotas no navegador: o JSON lexical é incluído no pacote Astro; as concordâncias continuam em arquivos locais carregados sob demanda.

## 5. Validação e evidência

**Geração WLC/OSHB e conferência de referências:** GitHub Actions `45100798289`, **sucesso**: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45100798289 .

**Homologação Chromium dos oito versículos, 90 palavras e quatro larguras: APROVADA.** GitHub Actions `45101176599`, https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45101176599 . Resultado final dos testes: «VALIDAÇÃO COMPLETA: 36 lemas, 80 exemplos, 90 palavras por resolução, 4 resoluções, navegação e concordâncias preservadas». Captura de tela: artefato `14785521568` em https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45101176599/artifacts/14785521568 . A captura H776/Gn 1:2 (390 px) foi inspecionada visualmente: os três sentidos, as amostras hebraicas e o lema ampliado estão legíveis, sem transbordamento horizontal.

O roteiro testa 1440, 768, 390 e 320 px; verifica a ficha lexical completa de cada uma das 90 palavras, mudança dos exemplos e dos lemas, idioma/direção de escrita, tamanho/família tipográfica, estado dos botões, carregamento da concordância, ausência de overflow e ausência de erros JavaScript.

**Nota de execução:** primeira homologação 45100977359 encontrou diferença entre o lema H3915 central e o registro de Gn 1:5. A inconsistência foi corrigida e uma nova homologação integral foi disparada. Não apresentar a primeira execução como sucesso.

## 6. Decisão de publicação

**NÃO PUBLICADO**. Todas as alterações estão em `rascunho/genesis`. Nenhum merge, commit em `main` ou deploy foi autorizado nesta etapa. Os oito versículos atualmente em produção continuam com as fichas antigas até o editor aprovar explicitamente a liberação desta ampliação.

**Próxima ação editorial:** inspecionar o relatório, avaliar a ficha de H776 no navegador/captura e aprovar ou solicitar revisões dos sentidos. Somente após nova autorização preparar uma publicação seletiva do léxico, dos oito componentes e dos recursos compartilhados, preservando a versão principal.
