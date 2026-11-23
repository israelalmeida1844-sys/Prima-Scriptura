# PRIMA SCRIPTURA — Homologação de Gênesis 1:1–8 e plano de publicação controlada

**Objetivo:** visualizar a edição experimental de Gênesis 1:1–8 como uma experiência integrada no Prima Scriptura, antes de qualquer alteração em produção.

**Decisão editorial vigente:** foi autorizada a preparação e a auditoria, **não** o merge em `main` nem o deploy. O site em produção deverá permanecer inalterado até autorização expressa adicional.

## Escopo da edição

- **Livro:** Gênesis, 50 capítulos na Bíblia; edição experimental restrita a **1:1–8**.
- **Material já preparado:** 8 protótipos com hebraico vocalizado, transliteração, glosas, morfologia, tradução editorial própria, ficha lexical dinâmica e concordâncias por Strong.
- **Segmentação:** Gn 1:1 (7 unidades), 1:2 (14), 1:3 (6), 1:4 (12), 1:5 (13), 1:6 (11), 1:7 (17), 1:8 (10): **90 unidades interlineares**, contando repetições de palavras.
- **Concordâncias:** **36 lemas Strong distintos** entre os oito versículos, com arquivos OSHB v.2.2, `complete: true`, referências em ordem canônica, sem duplicações e consistência numérica.
- **Redação:** edição de avaliação; não apresentar 1:9–31 e capítulos 2–50 como publicados, nem afirmar que o comentário completo de Gênesis esteja pronto.

## Rotas candidatas à publicação

| Experiência | Rota |
|---|---|
| Vitrine do livro | `/comentarios/genesis/` |
| Índice do capítulo 1 | `/comentarios/genesis/capitulo-1/` |
| Leitura Gn 1:1–8 | `/comentarios/genesis/capitulo-1/versiculo-{1..8}/` |
| Biblioteca de comentários | `/comentarios/` (card do livro como **edição parcial**) |
| Página inicial | `/` (card de Gênesis em avaliação) |

Cada página de versículo contém uma faixa com seleção direta dos oito versículos, setas anterior/próximo quando aplicáveis, retorno ao índice e o interlinear completo. O v. 8 não oferece ligação para um v. 9 inexistente; o v. 1 não oferece anterior inexistente.

## Preservação das obras e conteúdo incompleto

Os manuscritos existentes `src/content/comentarios/genesis-capitulo-1.md` até `genesis-capitulo-50.md` **não integram a edição de avaliação**. Permanecem marcados `draft: true`. Os templates da biblioteca utilizam `!data.draft`, portanto esses manuscritos não são exibidos como comentários publicados.

Para evitar regressões, o teste `scripts/homologar-genesis-rascunhos.mjs` verifica a proteção dos 50 manuscritos e limita as rotas novas do livro à página do livro e ao capítulo 1. Isso não equivale a revisá-los editorialmente.

As páginas preexistentes de **Daniel, Hebreus e 1 João**, o painel `/admin/`, o editor `/admin/glosas.html` e `/pesquisa/` são preservados; a homologação verifica que continuam respondendo corretamente.

## Fontes e titularidade

Texto WLC. Morfologia, lemas e concordâncias por Strong provenientes da Open Scriptures Hebrew Bible, versão fixa `v.2.2`, 39 livros, sob CC BY 4.0 (requisitos de atribuição preservados). Não reproduzir integralmente a tradução Almeida Revista e Atualizada (ARA): as traduções nos cartões são editoriais próprias.

A fonte Times New Roman é aplicada nos novos elementos do projeto Gênesis; a renderização de sinais hebraicos em diferentes sistemas deve ser apreciada visualmente pelo editor antes da publicação.

## Auditoria técnica

Workflow: `.github/workflows/homologar-genesis-1-1-8.yml`; **execução final de verificação visual: 45097516709**. A execução anterior (**45097179410**) teve sucesso em navegação, 36 índices, quatro resoluções, proteção dos 50 rascunhos e testes de rotas anteriores. A nova execução acrescenta verificações explícitas do contraste das trilhas de navegação e da cor de fundo dos cabeçalhos interlineares.

Auditorias incluídas:
1. Inspeção da branch de origem e registro de SHAs de `main` e do rascunho.
2. Registro da lista de diferenças entre branches como artefato.
3. Verificação da proteção editorial dos 50 capítulos.
4. Verificação dos **36 índices** (conteúdo, licenças, contagens, referências sem duplicações, ordenação).
5. Compilação estática Astro sem deploy.
6. Testes de navegação entre livro, capítulo e oito versículos; verificação de links.
7. Teste em Chromium nas larguras **1440, 768, 390 e 320 px**.
8. Alternância de hebraico, transliteração, glosas e tradução; verificação da opção «vento de Deus» em Gn 1:2.
9. Seleção de todas as unidades lexicais, abertura e fechamento de concordâncias, estados de erro, posicionamento dos rótulos, ausência de scroll horizontal do documento e erros de JavaScript.
10. Confirmação de rotas existentes de outros livros, pesquisa e administração.
11. Capturas de tela desktop e celular da vitrine do livro, índice do capítulo e versículos 1 e 8.

**Evidências e capturas de tela:** https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45097516709 (aba «Artifacts» após concluir). Esta é uma evidência visual do Astro em preview local isolado, não uma URL pública já implantada.

## Atenção: NÃO efetuar merge da branch inteira

A comparação `main...rascunho/genesis` mostrou uma quantidade considerável de conteúdo editorial de Gênesis para além do escopo, inclusive **50 capítulos completos em estado draft**, e alterações em `package.json`. Portanto, é arriscado promover a branch inteira sem selecionar previamente os arquivos.

### Pacote de produção a selecionar, após autorização específica

- `src/pages/comentarios/genesis/**` (landing page, índice e oito versículos).
- `src/components/TextoOriginalGenesis1v{1..8}.astro`.
- `src/data/texto-original/genesis-1-{1..8}.ts`.
- `public/data/concordancia-hebraica/H*.json` **somente** para os 36 lemas pertinentes, juntamente com os metadados de proveniência.
- `src/pages/comentarios/index.astro` — alteração pontual e conferida do catálogo.
- `src/pages/index.astro` — card pontual do livro.
- Gerador e configuração de build somente se indispensáveis; privilegiar o uso dos JSONs estáticos já validados, evitando download redundante de 39 livros a cada deploy.
- Scripts e workflow de verificação, se necessário para a auditoria de produção.

**Excluir explicitamente** do pacote de publicação os 50 arquivos `src/content/comentarios/genesis-capitulo-*.md` ainda em rascunho, fluxos temporários de auditoria redundantes e qualquer alteração não relacionada que esteja acumulada na branch de desenvolvimento.

A edição experimental não deve interferir nos livros já disponíveis nem nos fluxos do painel Decap CMS.

## Hospedagem, custo e reversão

O repositório contém `netlify.toml` e `CLOUDFLARE_PAGES.md`, com documentação de integração à Cloudflare Pages; **isso não prova qual provedor está servindo atualmente o domínio principal**. Confirmar o projeto e seu branch de produção diretamente na hospedagem antes de acionar qualquer deploy.

Estratégia preferencial: **prévia de branch/URL separada**, se o provedor já oferecer essa possibilidade **sem custo ou mudança de plano**. Se depender de deploy de produção, solicitar segunda autorização após mostrar o escopo final. Preservar o SHA de `main` anterior, testar o artefato estático localmente, aplicar pacote seletivo, realizar preferencialmente um único build de produção e verificar a versão real depois.

Verificações do GitHub Actions não devem ser descritas como consumo da cota de compilação da hospedagem. Não foram observados dados de cobrança ou de cota da conta Cloudflare/Netlify nesta auditoria.

## Critério para a próxima aprovação

1. Ler este relatório e revisar as capturas de tela da homologação.
2. Conferir a branch `main` e o seu SHA atual.
3. Confirmar qual serviço hospedará a prévia e qual URL será alterada.
4. Concordar explicitamente com o pacote **seletivo** de arquivos e o compromisso de não liberar os 50 rascunhos.
5. Autorizar separadamente o ato de publicação/merge/deploy.

**Até lá: sem commit em `main`, sem pull request de publicação, sem deploy e sem qualquer alegação de que os oito versículos estejam disponíveis no site público.**

## Ajustes identificados por inspeção visual das capturas

A primeira captura real da página interlinear mostrou um defeito que o teste funcional inicial não detectara: o estilo global `header` do layout Base aplicava fundo azul-escuro ao cabeçalho da ficha, tornando o título escuro ilegível. Foi corrigido o seletor do cabeçalho em **todos os oito** componentes, mantendo fundo transparente, texto legível e a mesma tipografia. Também foi corrigido o contraste dos links dos breadcrumbs nas três rotas novas: o estilo global `nav a` aplicava cor clara sobre o fundo branco. A suíte visual agora verifica as duas propriedades CSS computadas e gera novas capturas após a correção. **Não dispensar a revisão humana das capturas produzidas pela nova execução.**
