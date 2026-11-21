# Prima Scriptura — Versão 2.0

Plataforma de comentários bíblicos e estudos temáticos, criada com **Astro** e preparada para **Decap CMS**.

## Requisitos
Node.js 20.3+ (recomendado Node 22) e npm.

## Rodar localmente
```bash
npm install
npm run dev
```
Acesse o endereço informado pelo terminal (normalmente http://localhost:4321).

## Gerar o site
```bash
npm run build
npm run preview
```

## Publicar gratuitamente no Netlify
1. Crie um repositório GitHub e envie os arquivos deste projeto.
2. No Netlify, importe o repositório e configure o comando `npm run build` e a pasta `dist` (já definidos em `netlify.toml`).
3. Configure o endereço real em `astro.config.mjs`.
4. Cada push na branch principal dispara uma nova publicação.

## Painel administrativo — atenção
O caminho `/admin/` contém o Decap CMS, **mas o login não funcionará até configurar GitHub e OAuth**. O Netlify não fornece automaticamente autenticação para o backend GitHub. Configure um provedor OAuth seguro, ajuste `public/admin/config.yml` e autorize somente editores confiáveis. Não coloque tokens ou segredos em arquivos públicos.

Após a configuração, acesse `https://SEU-SITE.netlify.app/admin/` para criar artigos. O fluxo editorial salva os textos no GitHub e o Netlify recompila o site quando as alterações são incorporadas à branch principal.

## Estrutura de conteúdos
- `src/content/comentarios/`: comentários em Markdown com metadados de livro, capítulo e versículos.
- `src/content/estudos/`: estudos temáticos em Markdown.
- `src/pages/`: páginas públicas, listagens, pesquisa e páginas individuais.
- `public/admin/config.yml`: campos do editor.

A busca é feita no navegador sobre títulos, descrições e metadados publicados (não indexa o corpo integral dos artigos).

## Direitos autorais
Não publique traduções bíblicas protegidas ou trechos extensos de obras sem autorização. Para a ARA, confira as condições de licenciamento e atribuição da Sociedade Bíblica do Brasil.

## Situação
Protótipo funcional com dois textos demonstrativos. Ainda é necessário configurar autenticação e publicar em hospedagem para uso real.
