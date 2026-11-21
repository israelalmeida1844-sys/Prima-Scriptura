# Prima Scriptura — Comentários bíblicos

Biblioteca digital de estudos bíblicos, desenvolvida em Astro, editável com Decap CMS e preparada para publicação automática pelo Netlify.

## Projeto editorial: Livro de Daniel

- **Testamento:** Antigo Testamento.
- **Índice:** [Daniel — estudo por capítulos](https://prima-scriptura.netlify.app/comentarios/daniel/).
- **Capítulos publicados:** 1, 2 e 3, com exposição histórico-exegética e comentários versículo por versículo.
- **Capítulos 4–12:** previstos no índice, ainda não publicados.
- **Fonte editorial:** documento `Comentário Bíblico - Livro de Daniel`, no Google Drive.
- **Bíblia de referência:** Almeida Revista e Atualizada (ARA), consultável por links da Sociedade Bíblica do Brasil.
- **Arquivo dos comentários:** `src/content/comentarios/daniel-capitulo-{1,2,3}.md`.
- **Páginas de leitura:** `/comentarios/daniel/capitulo-1/` até `/comentarios/daniel/capitulo-3/`.

Os comentários autorais foram preservados na transferência; as transcrições integrais dos versículos bíblicos foram substituídas por links à ARA.

## Projeto editorial: Primeira Epístola de João

- **Livro:** 1 João — Fé, Amor e Certeza da Vida Eterna.
- **Leitura:** [índice de 1 João](https://prima-scriptura.netlify.app/comentarios/1-joao/).
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

## Publicação no Netlify

A configuração existente está em `netlify.toml`:

- comando de build: `npm run build`
- diretório publicado: `dist`
- versão de Node.js: `22`

Quando o site Netlify estiver conectado a este repositório, uma atualização na branch de produção (`main`, conforme a configuração de integração) deverá acionar um novo deploy. Verifique no painel do Netlify o status **Published** para confirmar que a versão está visível ao público.

## Administração e segurança

O painel de conteúdos fica em `/admin/` e utiliza o Decap CMS. O backend do GitHub e o serviço OAuth são configurados em `public/admin/config.yml`. Nunca coloque segredos de autenticação no repositório público.

## Direito autoral

O comentário remete à versão ARA da Sociedade Bíblica do Brasil sem republicar integralmente seu texto, respeitando os direitos da tradução. Revisão bibliográfica final recomendada antes de uma edição comercial.
