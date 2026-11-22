# Migração do Prima Scriptura para Cloudflare Pages

Esta migração mantém a biblioteca e o painel administrativo no mesmo repositório GitHub. É um site **Astro estático**; não precisa instalar o adaptador `@astrojs/cloudflare` nem converter as páginas em funções de servidor.

## O que já está pronto no repositório

- Comentário de **Daniel**, capítulos 1 a 3, na seção Antigo Testamento.
- Comentário de **1 João**, capítulos 1 a 5, introdução e conclusão, na seção Novo Testamento.
- Páginas, índices, pesquisa e design editorial existentes.
- `.node-version` fixa Node.js 22.
- `astro.config.mjs` usa a variável `SITE_URL` quando informada; caso contrário, aproveita `CF_PAGES_URL` no build Cloudflare. Sem ambas, conserva a URL histórica do Netlify para testes locais.
- GitHub Actions verifica o resultado de `npm run build` e os arquivos gerados em `dist/`.

## Passo a passo na conta Cloudflare

1. Acesse https://dash.cloudflare.com/ com sua conta Cloudflare.
2. Abra **Workers & Pages** > **Create application** > **Pages** > **Connect to Git** (ou **Import an existing Git repository**, conforme a interface).
3. Conecte o **GitHub**. Ao autorizar o aplicativo da Cloudflare, selecione de preferência **Only select repositories** e libere apenas `israelalmeida1844-sys/Prima-Scriptura`.
4. Escolha o repositório `israelalmeida1844-sys/Prima-Scriptura`. Não crie um novo repositório e não copie os arquivos manualmente.
5. Configure:
   - **Production branch:** `main`.
   - **Framework preset:** `Astro` (quando houver).
   - **Root directory:** diretório raiz do repositório.
   - **Build command:** `npm run build`.
   - **Build output directory:** `dist`.
   - **Node.js:** 22 (o projeto já possui `.node-version`).
6. Selecione **Save and Deploy** ou **Deploy**.
7. Após o status **Success**, abra o domínio `*.pages.dev` que aparecer no painel. O endereço é criado pela Cloudflare e **não pode ser determinado antes da criação**.
8. Se quiser usar esse endereço como URL principal para os metadados do Astro, em **Settings > Environment variables**, crie `SITE_URL` com o endereço de produção fornecido (inclua `https://`), depois faça um novo deploy. A variável é opcional, pois a Cloudflare injeta `CF_PAGES_URL` durante a compilação.

## Checklist de conferência do novo site

A partir do **domínio real informado pelo Cloudflare**, verifique:

- `/` — página inicial;
- `/comentarios/` — biblioteca separada por Antigo e Novo Testamento;
- `/comentarios/daniel/` e `/comentarios/daniel/capitulo-1/` até `capitulo-3/`;
- `/comentarios/1-joao/` e `/comentarios/1-joao/capitulo-1/` até `capitulo-5/`;
- `/comentarios/1-joao/introducao/` e `/comentarios/1-joao/conclusao/`;
- `/pesquisa/` — pesquisa da biblioteca;
- `/admin/` — carregamento do Decap CMS e login, leitura e edição de um rascunho de teste.

### Administração: atenção ao OAuth

O projeto já utiliza um serviço OAuth separado:
`https://prima-scriptura-auth.israelalmeida1844.workers.dev`, definido em `public/admin/config.yml`.

Não modifique a URL ou as credenciais sem verificar a integração. O painel pode funcionar sem alterações, mas **é obrigatório testar** a nova origem `pages.dev`: serviços OAuth podem validar a origem, o endereço de retorno ou a lista de domínios permitidos. Se o login falhar, revise as configurações do Worker e do aplicativo OAuth do GitHub na conta do proprietário. Não compartilhe client secrets em chats, commits ou capturas.

## Segurança e reversão

Não exclua o repositório, os arquivos de conteúdo nem a configuração do Netlify durante os testes. A Cloudflare não apaga o site antigo; o mesmo código pode permanecer publicado em dois provedores até validar a migração.

Depois de confirmar o novo endereço e o login do painel, atualize links externos (divulgação, favoritos e eventuais metadados), e então decida se deseja desativar a publicação pelo Netlify.

Fontes oficiais:
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
