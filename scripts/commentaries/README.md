# Tradução em massa – Prima Scriptura

O utilitário processa todos os livros e capítulos disponíveis no manifesto local de comentários, em paralelo e com retomada de execução. Os textos originais não são alterados. Arquivos já traduzidos são preservados. Cada original é associado pelo SHA-256 e registros com licença não autorizada ou bytes inválidos são contabilizados separadamente. Traduções novas são preliminares (draft), não consideradas revisadas humanamente.

## Planejamento gratuito (nenhuma chamada de API)

Na raiz de um checkout completo do repositório, com Node.js 20+:

```sh
node scripts/commentaries/translate-all.mjs --self-test
node scripts/commentaries/translate-all.mjs
```

A segunda instrução inspeciona o acervo, indica registros pendentes, caracteres, registros bloqueados e quantidade aproximada de chamadas. A estimativa de tokens é apenas indicativa, não uma cotação de custo. A tradução em massa não começa automaticamente.

## Execução

Configure `GEMINI_API_KEY` como variável de ambiente de forma segura e `GEMINI_MODEL` com um modelo Gemini disponível para a sua conta. Não grave a chave em código, commits ou conversas. Antes da execução, confira o plano de cobrança e limite atual da conta. O modo gratuito tem cotas; a API pode faturar a operação se a conta tiver faturamento ativo.

Exemplo de teste com limite estrito de uma chamada:

```sh
node scripts/commentaries/translate-all.mjs --execute --book Rev --limit-chapters 1 --max-requests 1 --concurrency 1
```

Depois de avaliar o resultado e autorizar o volume:

```sh
node scripts/commentaries/translate-all.mjs --execute --max-requests 100 --concurrency 3
```

Ajuste o limite de chamadas e a concorrência aos limites da conta. O limite inclui todas as tentativas, não apenas sucessos. Erros de credencial, acesso ou cota interrompem o processamento; arquivos completos já validados continuam salvos e os segmentos completos são mantidos em checkpoints locais. Repita a execução para retomar. Nenhum push ou deployment é executado pelo script.

## Validação e revisão

Confira o relatório final, os totais, as traduções em contexto e os casos bloqueados. Valide a integridade e cobertura antes de uma publicação em lote. Faça cotejo acadêmico independente antes de promover o estado editorial a reviewed.

O site consulta exclusivamente os arquivos locais em `public/commentaries-pt`; não invoca a API durante a leitura.
