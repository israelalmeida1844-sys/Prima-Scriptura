# Gênesis 1:4 — auditoria editorial e técnica

**Estado:** dados e protótipo concluídos em **rascunho**, aguardando aprovação editorial; **não publicado**.

## Corpus e índices

Fonte: Open Scriptures Hebrew Bible, `morphhb`, tag fixa `v.2.2`, 39 livros, texto WLC, índices de lemas Strong, licença CC BY 4.0. Atribuição: Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb

| Strong | Lema | Tokens | Versículos distintos |
|---|---|---:|---:|
| H7200 | רָאָה | 1.314 | 1.206 |
| H3588 | כִּי | 4.488 | 3.910 |
| H2896 | טוֹב | 565 | 521 |
| H914 | בָּדַל | 42 | 40 |
| H996 | בֵּין | 410 | 248 |

Os cinco arquivos integrais estão em `public/data/concordancia-hebraica/H*.json`. Cada índice possui `complete: true`, contagens consistentes, referências deduplicadas em ordem de leitura e `Gn 1:4` presente. A distinção entre tokens e versículos é mantida; contagem de Strong não equivale automaticamente a uma concordância morfológica de formas específicas.

## Interlinear e protótipo

- 12 unidades hebraicas em `src/data/texto-original/genesis-1-4.ts`, com transliteração, glossa, análise morfológica, semântica e explicação.
- Interface isolada em `src/components/TextoOriginalGenesis1v4.astro` e `src/pages/rascunhos/genesis-1-4.astro`.
- Família tipográfica `Times New Roman` como primeira opção, com fontes alternativas quando indisponível.
- Tradução editorial própria para evitar reprodução extensa da ARA.
- Concordâncias consultadas por arquivos locais estáticos; sem chamada a fontes externas para visitantes.

## Auditoria automatizada

GitHub Actions, fluxo `Auditar Gênesis 1:4 (somente rascunho)`, execução **45091724001**: **sucesso**. Gerador reexecutado contra corpus OSHB v.2.2; índices validados; `npm run build` do Astro executado com sucesso; arquivo de saída da prévia conferido; indicadores do interlinear e Times New Roman conferidos no HTML; índices salvos exclusivamente em `rascunho/genesis`.

Registro da execução: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45091724001

**Limite da auditoria:** compilação e inspeção automatizada de HTML **não equivalem a teste visual responsivo ou de interação em navegador real**. Esse teste de interface permanece necessário antes de eventual publicação. Nenhuma alteração foi incorporada à branch `main`; nenhuma publicação manual foi realizada. A configuração de hospedagem pode administrar prévias automáticas de branches independentemente deste trabalho.


## Padronização conjunta de Gênesis 1:4–5 (22/11/2026)

Revisados os componentes de ambos os versículos na branch `rascunho/genesis`: a ficha lexical agora usa grid com coluna de rótulos ampliada em desktop e disposição vertical em telas estreitas, evitando a colisão de “Transliteração” com seu conteúdo. Consolidado o uso de Times New Roman; removida uma folha de estilos duplicada e aumentada a legibilidade das glossas. A rolagem horizontal está restrita à faixa interlinear de palavras, sem provocar transbordamento horizontal do documento.

A seleção lexical invalida pedidos anteriores; o botão de recolher também interrompe logicamente carregamentos e renderizações em curso. A consulta das concordâncias verifica integridade, sinaliza separadamente índice incompleto e erro de carregamento e mantém o botão de reabertura. Nenhum dos JSONs Strong foi alterado por esta padronização.

**Teste em navegador real:** fluxo GitHub Actions com Chromium e Playwright executado com sucesso na execução **45092991107**: compilação Astro; 12 unidades de Gn 1:4 e 13 de Gn 1:5; seleção por clique de todas as unidades; quatro controles (hebraico, transliteração, glosas e tradução); abertura/fechamento de concordância; tipografia computada; detecção geométrica de colisão rótulo/valor; ausência de transbordamento horizontal do documento e de erros JavaScript; viewports de 1440, 390 e 320 px; cenários simulados de arquivo ausente (HTTP 404) e índice incompleto em Gn 1:4.

Relatório: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45092991107

**Limites da validação:** os testes de navegador automatizados não substituem inspeção editorial humana de aparência, qualidade de renderização de cada glifo hebraico em sistemas variados e leitura exegética integral. A faixa de palavras pode rolar horizontalmente de modo intencional, sem rolagem lateral da página. Nenhum deploy ou merge foi realizado; os rascunhos permanecem sujeitos à aprovação antes de publicação.
