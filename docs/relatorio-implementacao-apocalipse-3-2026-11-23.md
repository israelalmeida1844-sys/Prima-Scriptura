# Prima Scriptura — Implementação interlinear de Apocalipse 3:1–22
**Data:** 23/11/2026
**Branch:** `rascunho/apocalipse`
**Publicação:** não autorizada; `main` preservada.

## Entregas efetivamente persistidas
- 22 arquivos `src/data/texto-original/apocalipse/apocalipse-3-{1..22}.ts`, com sequência grega SBLGNT via MorphGNT 6.12, 525 palavras, lema, classe, código morfológico, Strong, transliteração e glosa.
- 22 componentes `src/components/TextoOriginalApocalipse3v*.astro`, derivados da interface do capítulo 2, com controles de grego, transliteração, glosa, morfologia e tradução, ficha lexical e consulta de concordâncias.
- Rotas Astro `src/pages/comentarios/apocalipse/capitulo-3/[versiculo].astro` e página `index.astro` com navegação entre 22 versículos e links de retorno.
- Léxico em `src/data/lexico-grego/apocalipse-3-1-22.json`: 352 entradas (282 herdadas, 70 novas), com definições contextualizadas para os 70 verbetes novos em arquivo editorial independente.
- 70 arquivos de índices de concordância `public/data/concordancia-grega/G*.json` derivados do corpus MorphGNT completo e fixado, preservando os índices dos capítulos anteriores.
- Tradução editorial e notas por versículo, associadas ao relatório acadêmico `docs/revisao-academica-apocalipse-3-1-22-2026-11-23.md`.
- Script reprodutível `scripts/gerar-apocalipse-3-1-22.mjs`, gerador de concordâncias e workflow `.github/workflows/validar-apocalipse-3-1-22.yml`.

## Auditoria quantitativa
| Verificação | Resultado |
|---|---:|
| Versículos | 22 |
| Tokens gregos | 525 |
| Lemas distintos no capítulo | 170 |
| Entradas do léxico agregado | 352 |
| Entradas lexicais novas | 70 |
| Livros do corpus de concordância | 27 |
| Tokens totais do NT MorphGNT | 137.554 |
| Ocorrências dos 70 lemas novos | 4.195 |
| Referências distintas de versículos dos 70 lemas | 3.867 |

## Método
Foram recuperados arquivos grandes (Mateus, Lucas e Atos) por SHA de blob depois de detectar que a API não retornava conteúdo por caminho. A fonte textual permaneceu a edição MorphGNT/SBLGNT no commit `aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d`.

**ζηλεύω / G2206 (Ap 3:19):** correspondência lexical verificada externamente com a variante de lema ζηλόω; a forma grega da edição base foi preservada. Referência lexical: https://www.blueletterbible.org/lexicon/g2206/nasb20/mgnt/.

## Verificações concluídas
- Os 22 arquivos de versículos foram relidos e apresentavam todos os campos essenciais preenchidos, sem identificadores Strong inválidos.
- A contagem dos 22 arquivos soma 525 tokens em sequência coincidente com o corpus-fonte usado na geração.
- Seis componentes representativos (1,6,7,14,19,22) foram conferidos quanto a seus cinco controles, referências e ausência de imports do capítulo 2.
- A rota dinâmica possui 22 caminhos e navegação até o versículo 22.
- A transliteração dos 525 tokens e 352 lemas lexicais foi padronizada pelo algoritmo editorial já empregado nos capítulos anteriores.
- Os 70 índices foram criados e a consolidação confere 27 livros e ausência de duplicação de referências de versículos por lema.

## Limites da homologação
- **Build Astro e testes de navegador:** a execução do novo workflow para Apocalipse 3 não foi confirmada por relatório específico. O relatório pré-existente de Apocalipse 1–2 não deve ser reutilizado como prova de aprovação do capítulo 3.
- **Glosas e sintaxe:** além de 70 novos verbetes contextualizados, a análise de dependências sintáticas das 525 palavras ainda precisa de revisão especializada individual. O texto contém notas acadêmicas, mas isso não equivale a uma árvore sintática aprovada.
- **Aparato crítico:** as variantes foram discutidas com o aparato comparativo da edição SBLGNT, mas não foi realizada colação independente de todos os manuscritos.
- **Publicação:** proibida até aprovação editorial explícita.

**Parecer:** os 22 interlineares e 70 concordâncias novas estão implementados em rascunho; homologação acadêmica e teste de compilação independentes pendentes.
