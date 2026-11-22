# Prima Scriptura — Comentários bíblicos

Biblioteca digital de estudos bíblicos, desenvolvida em Astro, editável com Decap CMS e preparada para publicação estática no Cloudflare Pages (com Netlify preservado como contingência).

## Projeto editorial: Livro de Daniel

- **Testamento:** Antigo Testamento.
- **Índice:** [Daniel — estudo por capítulos](/comentarios/daniel/).
- **Capítulos publicados:** 1 a 12, com exposição histórico-exegética e comentários versículo por versículo.
- **Gráficos de profecias de tempo:** Daniel 7 (1.260 anos), Daniel 8 (2.300 anos), Daniel 9 (70 semanas) e Daniel 12 (1.260, 1.290 e 1.335 anos).
- **Fonte editorial:** documento `Comentário Bíblico - Livro de Daniel`, no Google Drive.
- **Bíblia de referência:** Almeida Revista e Atualizada (ARA), consultável por links da Sociedade Bíblica do Brasil.
- **Arquivo dos comentários:** `src/content/comentarios/daniel-capitulo-{1..12}.md`.
- **Páginas de leitura:** `/comentarios/daniel/capitulo-1/` até `/comentarios/daniel/capitulo-12/`.

Os comentários autorais foram preservados na transferência; as transcrições integrais dos versículos bíblicos foram substituídas por links à ARA.

## Projeto editorial: Epístola aos Hebreus

- **Fonte editorial:** documento `Comentário Bíblico - Epístola aos Hebreus`, no Google Drive.
- **Capítulos:** 1–13, organizados por seções exegéticas e teológicas.
- **Índice:** `/comentarios/hebreus/`.
- **Introdução e bibliografia:** `/comentarios/hebreus/introducao/`.
- **Navegação:** seleção por número de versículo abre o bloco exegético correspondente. O manuscrito não contém comentários separados de cada versículo.
- **Diagramas:** Hb 4:14–16, 8:1–6, 9:1–10 e 10:19–25; posicionados nos comentários correspondentes.
- **Tradução de consulta:** ARA, por links para a Sociedade Bíblica do Brasil.
- **Arquivos:** `src/content/comentarios/hebreus-capitulo-{1..13}.md`, `src/editorial/hebreus/` e `public/diagramas/hebreus-*`.

## Projeto editorial: Primeira Epístola de João

- **Livro:** 1 João — Fé, Amor e Certeza da Vida Eterna.
- **Leitura:** [índice de 1 João](/comentarios/1-joao/).
- **Introdução geral:** `/comentarios/1-joao/introducao/`.
- **Cinco capítulos:** `/comentarios/1-joao/capitulo-1/` até `/comentarios/1-joao/capitulo-5/`.
- **Conclusão geral:** `/comentarios/1-joao/conclusao/`.
- **Tradução de referência:** Almeida Revista e Atualizada (ARA), com links de leitura para a Sociedade Bíblica do Brasil.
- **Conteúdo:** comentários expositivos, aplicações, sínteses e 86 notas bibliográficas, a partir do manuscrito editorial no Google Drive.

Os cinco capítulos estão armazenados em `src/content/comentarios/` com `draft: false`. As páginas públicas são geradas pela estrutura `src/pages/comentarios/1-joao/`.

## Desenvolvimento

Instalar e executar localmente:

```bash
npm install
npm run dev
```

Gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Migração para o Cloudflare Pages

O projeto está preparado para ser conectado ao Cloudflare Pages. A hospedagem nova deve importar **este mesmo repositório GitHub**; não é necessário duplicar os comentários ou converter o Astro.

Parâmetros de configuração:

| Campo | Valor |
| --- | --- |
| Repositório | `israelalmeida1844-sys/Prima-Scriptura` |
| Branch de produção | `main` |
| Framework | Astro |
| Diretório raiz | `/` |
| Comando de build | `npm run build` |
| Diretório de saída | `dist` |
| Node.js | `22` (arquivo `.node-version`) |

O arquivo `astro.config.mjs` usa `SITE_URL` (se definida) ou `CF_PAGES_URL` (fornecida pelo Cloudflare) para configurar a URL pública da versão construída.

**Passo que depende do proprietário:** entrar no [Cloudflare Dashboard](https://dash.cloudflare.com/), abrir **Workers & Pages**, criar um projeto **Pages** com integração GitHub e autorizar somente o repositório acima. A configuração completa e os testes posteriores estão em [CLOUDFLARE_PAGES.md](CLOUDFLARE_PAGES.md).

A autenticação do Decap CMS em `/admin/` utiliza um Worker OAuth externo configurado em `public/admin/config.yml`. Manter a configuração atual e **testar o login após criar a URL Cloudflare**; se o OAuth limitar a origem, a configuração do Worker ou do aplicativo GitHub pode exigir um ajuste. Não publicar credenciais no GitHub.

**Não desligar o Netlify** até confirmar o novo site, seus capítulos, a busca e o painel administrativo.

## Netlify — configuração antiga preservada

A configuração existente está em `netlify.toml`:

- comando de build: `npm run build`
- diretório publicado: `dist`
- versão de Node.js: `22`

Quando o site Netlify estiver conectado a este repositório, uma atualização na branch de produção (`main`, conforme a configuração de integração) deverá acionar um novo deploy. Verifique no painel do Netlify o status **Published** para confirmar que a versão está visível ao público.

## Administração e segurança

O painel de conteúdos fica em `/admin/` e utiliza o Decap CMS. O backend do GitHub e o serviço OAuth são configurados em `public/admin/config.yml`. Nunca coloque segredos de autenticação no repositório público.

## Direito autoral

O comentário remete à versão ARA da Sociedade Bíblica do Brasil sem republicar integralmente seu texto, respeitando os direitos da tradução. Revisão bibliográfica final recomendada antes de uma edição comercial.
