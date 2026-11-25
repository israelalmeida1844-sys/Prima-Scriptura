# Instruções permanentes — Prima Scriptura

## Trabalho autorizado
- Para Apocalipse, commits exclusivamente em `rascunho/apocalipse`; nunca diretamente em main, nunca merge ou publicação automática. Manter dados dos demais livros.
- Antes de editar, conferir branch, estado do Git, histórico e arquitetura existente. Não reverter trabalho alheio.
- Não expor credenciais nem usar operações destrutivas.
- Registrar progresso em `docs/PROGRESSO_APOCALIPSE.md`.

## Arquitetura verificada inicialmente
Astro 5, TypeScript, componentes Astro. Dados do interlinear em `src/data/texto-original/apocalipse/`; páginas em `src/pages/comentarios/apocalipse/`; componentes em `src/components/`; concordâncias em `public/data/concordancia-grega/`; scripts em `scripts/`. Conferir estrutura real antes de expandir. Ap 5:2 é referência de estrutura e qualidade, não autoridade infalível.

## Padrão editorial
- Texto grego: SBLGNT (Holmes, 2010); morfologia e lemas: MorphGNT 6.12, commit `aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d`.
- Conservar ordem, acentos, espíritos, iota subscrito e pontuação da edição. Mapear versificação portuguesa (404 versículos) e grega sem omissão ou duplicação.
- Tradução editorial contextual em português; respeitar direitos da ARA. Glosa, definição, explicação da palavra, morfologia e função sintática são campos diferentes.
- Transliteração uniforme, Times New Roman, interlinear horizontal responsivo, ficha da unidade selecionada, navegação anterior/próxima, índice e botões funcionais.
- Notas sintáticas individualizadas; exegese contextual e intertextual; historicismo adventista identificado como perspectiva interpretativa, não resultado necessário da gramática.
- Crítica textual exclusivamente com leituras e fontes efetivamente verificadas. Quando insuficientes, declarar limitação; jamais fabricar citações, siglas ou aparato.
- Não chamar placeholders ou textos repetidos de revisão concluída.

## Validação
- `npm install` (ou `npm ci` se lockfile estiver disponível), `npm run build`; verificar scripts reais antes de executá-los.
- `node scripts/validators/auditar-apocalipse.mjs <87-Re-morphgnt.txt> 9 9 --strict` compara os campos objetivos e sinaliza preenchimentos genéricos. Ap 12–13 depende de mapeamento editorial confirmado.
- Preservar scripts e workflows específicos existentes e testar regressões.
- Validar rotas, seleção de palavras, concordâncias, controles, navegação e responsividade em navegador.
- Validadores automáticos não substituem revisão acadêmica. Não alegar compilação, testes ou homologação sem execução real e evidência.

## Continuidade
Trabalhar por lotes 9–10, 11–12, 13–14, 15–16, 17–18, 19–20, 21–22; depois auditar 1–22. Registrar limitações, erros e commits por lote. Preparar PR de avaliação somente após critérios de aceitação, sem merge.
