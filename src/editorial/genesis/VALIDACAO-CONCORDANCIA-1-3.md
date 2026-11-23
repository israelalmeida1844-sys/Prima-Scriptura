# Gênesis 1:3 — entrega editorial em rascunho

**Situação:** protótipo interlinear e concordâncias exaustivas salvos exclusivamente em `rascunho/genesis`; não foi solicitada nem executada mesclagem na branch `main` ou publicação manual.

## Texto e interface

- Texto de seis palavras hebraicas, quatro lemas distintos: H559 (אָמַר), H430 (אֱלֹהִים), H1961 (הָיָה), H216 (אוֹר).
- Tradução editorial: «Então Deus disse: “Haja luz”, e houve luz.» Não reproduz integralmente texto da ARA.
- Modos controláveis de hebraico, transliteração, glossa e tradução; ficha lexical com morfologia, lema, sentidos, observação e concordância local por Strong.
- Fonte Times New Roman aplicada ao componente, inclusive palavras, rótulos e controles, com fallback Times/serif; disponibilidade de glifos hebraicos depende da fonte instalada no dispositivo.
- Protótipo de revisão: `src/pages/rascunhos/genesis-1-3.astro`; não vinculado à navegação publicada.

## Concordância exaustiva

| Código | Lema | Tokens | Versículos distintos |
|---|---|---:|---:|
| H559 | אָמַר | 5.318 | 4.337 |
| H216 | אוֹר | 121 | 110 |

- Fonte: Open Scriptures Hebrew Bible (OSHB) v.2.2, 39 livros, 23.213 versículos, corpus `wlc/{Livro}.xml`.
- Metodologia consistente com os índices de Gênesis 1:1–2: extrair códigos numéricos Strong do atributo `lemma`; contar cada token e deduplicar referências por versículo.
- Validação: nenhuma referência duplicada; `verseCount === references.length`; `tokenCount >= verseCount`; os dois arquivos têm `complete: true` e identificação de fonte, versão, licença e atribuição.
- Índices em `public/data/concordancia-hebraica/H559.json` e `H216.json`; dados de auditoria em `src/editorial/genesis/concordancia-1-3-lote-01.json` a `05.json`.
- Atualizado o gerador, incluindo verificação do versículo piloto, e o manifesto geral para 18 códigos Strong.
- Licença OSHB: CC BY 4.0. Atribuição: “Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb”.

**Limites:** não foi executado `npm run build`, não houve teste visual em navegador e não se verificou nem se desativou eventual deploy automático de pré-visualização configurado pelo serviço de hospedagem. A branch principal não foi alterada.
