# Prima Scriptura — relatório consolidado Gênesis 1:2–8

**Estado:** conjunto editorial em `rascunho/genesis`, não publicado. **Modelo base aprovado:** Gênesis 1:1 (preservado).

## Entregas verificadas

| Versículo | Unidades | Lemas distintos no versículo | Registros integrais por lema | Falhas de alinhamento | Avisos |
|---|---:|---:|---:|---:|---:|
| Gn 1:2 | 14 | 12 | 14.961 | 0 | 0 |
| Gn 1:3 | 6 | 4 | 9.824 | 0 | 0 |
| Gn 1:4 | 12 | 9 | 15.140 | 0 | 0 |
| Gn 1:5 | 13 | 10 | 9.459 | 0 | 0 |
| Gn 1:6 | 11 | 8 | 10.932 | 0 | 0 |
| Gn 1:7 | 17 | 12 | 25.393 | 0 | 0 |
| Gn 1:8 | 10 | 9 | 8.872 | 0 | 0 |

**Total:** **83 unidades**, **34 lemas Strong distintos no conjunto**, **94.581 registros de concordância nos sete arquivos finais**. Esses registros podem repetir um mesmo versículo em índices de lemas diferentes ou em arquivos diferentes. **4** concordâncias já aprovadas em Gn 1:1 foram reutilizadas sem edição. A origem dos lemas e das frequências é a OSHB v.2.2 (39 livros).

## Metodologia e ferramentas

O gerador `scripts/gerar-genesis-1-2-8-estruturado.mjs` consulta o WLC/OSHB v.2.2 uma única vez por livro, confirma a sequência e as consoantes hebraicas de cada uma das 83 unidades, verifica seu número Strong, extrai diretamente o `rawCode` morfológico e junta a análise sintática editorial de `scripts/dados-sintaticos-genesis-1-2-8.mjs`. Sua saída respeita exatamente os sete campos aprovados em Gn 1:1 e produz sete arquivos `GEN.1.n-estruturado-completo.json` e sete auditorias independentes. A metodologia distingue lemas, formas, morfemas prefixais, governadores sintáticos, orações e sentidos contextuais. As contagens referem-se a versículos distintos, com distribuição Torá/Profetas/Escritos.

Os excertos em hebraico provêm do WLC. A tradução editorial dos versículos foi mantida dos protótipos anteriores. Os excertos portugueses históricos são da Almeida 1911 (domínio público); a versificação foi alinhada com a tabela STEPBible TVTMS MT→English (CC BY 4.0). Para títulos massoréticos não numerados nas edições portuguesas, foram fornecidas traduções editoriais identificadas no relatório, não passagens inventadas da Almeida. Essa opção preserva a existência de cada versículo do índice hebraico. Não se afirma alinhamento interlinear completo entre o excerto hebraico e toda a sentença portuguesa.

## Controle de qualidade e pendências

A auditoria verificou sequências das palavras, morfologia real por token, presença do Strong em WLC, relações sintáticas apontando para tokens existentes, validade de cada seção bíblica, igualdade `items.length === totalCount`, contagem canônica e integridade de todos os excertos, sem diferenças de versificação não resolvidas. O modelo Gn 1:1 não foi alterado. Foram igualmente preservados os protótipos do site, os índices Strong originais e a branch de produção.

**Pendente:** revisão filológica humana das decisões sintáticas e de polissemia. O corpus comprova a presença do lema e a forma hebraica, mas não determina sozinho qual acepção é a melhor em toda ocorrência. O aparato crítico de variantes antigas não foi submetido a colação exaustiva.

## Arquivos e referências

Dados: `src/editorial/genesis/GEN.1.{2..8}-estruturado-completo.json`; auditorias: `GEN.1.{2..8}-auditoria-de-fonte.json`; notas: `NOTAS-COMPLETAS-GENESIS-1-{2..8}.md`; resumo: `GEN.1.2-8-relatorio-geracao.json`. Arquivos geradores: `scripts/gerar-genesis-1-2-8-estruturado.mjs`, `scripts/dados-sintaticos-genesis-1-2-8.mjs`.

Créditos: WLC/OSHB v.2.2 (https://github.com/openscriptures/morphhb); Almeida de 1911 (https://github.com/damarals/biblias); STEPBible TVTMS MT→English (https://github.com/metaxiamultimedia/scriptures-js-source-stepbible-versification). **Toda a operação permanece exclusivamente em `rascunho/genesis`, sem publicação.**
