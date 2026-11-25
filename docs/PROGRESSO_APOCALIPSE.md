# Progresso de Apocalipse — Prima Scriptura

## Estado inicial verificado

Reconhecimento de 25/11/2026. Branch exclusiva `rascunho/apocalipse`, cabeça inicial `eeed5173d055f9272c6e61ec192ccefc79c74433`.

- Astro ^5.0.0 e @astrojs/mdx ^4.0.0. Scripts npm existentes: dev, build, preview.
- Dados individuais: `src/data/texto-original/apocalipse/apocalipse-C-V.ts`.
- Índice geral anuncia capítulos 1–9, com 3.877 unidades (declaração existente; não recontada integralmente nesta sessão).
- Capítulo 9: índice, rota dinâmica `[versiculo].astro` com 21 parâmetros estáticos e 21 componentes importados. Dados individuais dos 21 versículos conferidos.
- Capítulo 10: índice não encontrado na branch.
- Há testes específicos de Ap 8: `scripts/validar-apocalipse8.mjs`, `scripts/testar-apocalipse8-browser.mjs` e workflow `validar-apocalipse-8.yml`. Preservados.

## Auditoria objetiva de Ap 9

Fonte consultada: [MorphGNT 6.12 fixado](https://github.com/morphgnt/sblgnt/blob/aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d/87-Re-morphgnt.txt), blob `bf6fde5561b55eef837ae05067d270cdbc858c25`.

| Métrica | Resultado |
|---|---:|
| Versículos presentes | 21/21 |
| Unidades | 496 |
| IDs únicos | 496 |
| Strong distintos | 158 |
| Divergências de forma, lema, código morfológico e classe no cotejo inicial | 0 |
| Glosas vazias | 0 |
| Funções sintáticas genéricas iniciais | 361 |
| Explicações que repetiam apenas a glosa | 496 |

Os dados de Ap 9:1 foram individualizados (24 unidades) e novamente confrontados com o corpus, sem divergências nos campos objetivos. Foram revisados glosas pertinentes, funções sintáticas, definições, explicações e notas do versículo. Não se afirma homologação acadêmica ou de crítica textual.

Commit de revisão: `db9a67149c7ff843b92329f106e97ded19dffb92`.
Validador inicial: `6b300f11d0bbfd400a359cadbc7cae999b9be853`.
A lógica do validador foi executada sobre os dados obtidos e a fonte: 496 unidades, zero erros estruturais detectados, 817 sinalizações editoriais remanescentes. A execução completa via Node/CLI, compilação e navegador não ocorreu nesta sessão: o ambiente local não resolveu github.com para clonar o repositório. Não confundir sinalizações com quantidade de erros acadêmicos distintos.

## Situação por lote

| Lote | Escopo | Estado |
|---|---|---|
| 0 | Reconhecimento, qualidade e auditoria inicial | Em andamento; validador inicial criado |
| 1 | 9–10 | Ap 9: dados presentes, Ap 9:1 revisado; 9:2–21 pendentes; Ap 10 índice não encontrado |
| 2 | 11–12 | Não auditado |
| 3 | 13–14 | Não auditado |
| 4 | 15–16 | Não auditado |
| 5 | 17–18 | Não auditado |
| 6 | 19–20 | Não auditado |
| 7 | 21–22 | Não auditado |
| 8 | Auditoria integral | Pendente |

## Próxima execução

1. Clonar a branch de rascunho em ambiente autorizado com acesso à rede.
2. Executar `node scripts/validators/auditar-apocalipse.mjs /caminho/87-Re-morphgnt.txt 9 9 --strict`, corrigir individualmente as sinalizações e verificar concordâncias, transliterações e crítica textual.
3. Verificar a rota dinâmica de 9, seus controles e navegação entre capítulos; executar build e testes de navegador.
4. Concluir Ap 10, usando a arquitetura existente. Continuar por lotes após validação.
5. Para Ap 12–13, confirmar a localização portuguesa de SBLGNT 12:18 (sete unidades) antes de estender o auditor; ele interrompe deliberadamente nesse intervalo.
6. Não publicar, não efetuar merge, não alterar main.

## Limitações

A validação automatizada não determina qualidade semântica, filológica ou exegética. Nenhuma consulta a obras acadêmicas protegidas é alegada nesta etapa. O cotejo integral de aparato crítico, concordâncias e interface permanece pendente.
