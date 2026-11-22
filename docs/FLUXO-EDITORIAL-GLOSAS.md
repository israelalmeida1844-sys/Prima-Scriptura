# Fluxo editorial: salvar sem publicar

O editor `/admin/glosas.html` utiliza uma ramificação GitHub `rascunhos-glosas` para alterações das glosas de Hebreus e 1 João.

1. Entrar com a conta GitHub autorizada.
2. Escolher livro, capítulo, versículo e palavra e clicar em **Salvar rascunho**.
3. Cada salvamento altera apenas `rascunhos-glosas`; nenhum commit é feito em `main`.
4. O botão **Consultar pendências** informa o número de arquivos modificados.
5. Somente **Publicar alterações**, após confirmação, integra o conjunto de alterações em `main`. Essa ação poderá disparar uma compilação de produção.
6. O site lê a versão publicada de `main`. Rascunhos não aparecem no site público.

## Atenção às compilações e pré-visualizações

O workflow GitHub Actions `.github/workflows/verify-astro-build.yml` escuta apenas **push em main**, portanto salvamentos em `rascunhos-glosas` não executam esse workflow.

**Configuração externa indispensável:** Cloudflare Pages, Netlify ou outro provedor podem compilar branches de pré-visualização automaticamente. Para não gastar builds em cada salvamento, limite os deploys automáticos à branch `main` no painel da hospedagem. Em Cloudflare Pages, consulte **Settings > Builds & deployments > Branch control** (a nomenclatura pode variar) e desative deploys de branches de pré-visualização; preserve a branch de produção `main`. Se houver mais de um serviço de hospedagem conectado, faça isso em cada serviço.

As alterações feitas no editor **Comentários e estudos** (Decap CMS em `/admin/`) seguem um fluxo editorial próprio e não são controladas pelo botão de publicar glosas.

## Segurança e manutenção

- Não armazene tokens ou senhas no repositório.
- O editor não muda texto grego, lema, morfologia ou transliteração.
- O GitHub registra commits para cada rascunho e um commit de publicação conjunto.
- Em caso de conflito com edições feitas em `main`, o merge é recusado, para revisão manual.
- O fluxo requer autenticação OAuth do GitHub, GitHub API e permissão de escrita na conta autorizada.
- Para descartar alterações de rascunho, não regrave `main` diretamente: utilize o GitHub para rever a branch de rascunho e eventualmente excluí-la após conferir o histórico.
