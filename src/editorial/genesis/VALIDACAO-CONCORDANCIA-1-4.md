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
