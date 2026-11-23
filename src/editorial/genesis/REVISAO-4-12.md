# Relatório de revisão editorial — Gênesis 4–12

**Data:** 22/11/2026  
**Estado:** rascunho interno no GitHub (branch `rascunho/genesis`), não aprovado para publicação.  
**Escopo revisado:** nove capítulos, 239 versículos abrangidos por seções, 69 notas exegéticas numeradas, aproximadamente 18,5 mil unidades de texto (contagem bruta incluindo metadados).  
**Arquivos:** `src/content/comentarios/genesis-capitulo-{4..12}.md`.

## I. Revisão das fontes e limites de interpretação

Fontes de orientação efetivamente consultadas:

1. Jacques B. Doukhan, *Comentário Bíblico Internacional Adventista do Sétimo Dia — Gênesis*, arquivo em português no Google Drive: https://drive.google.com/file/d/1j9_nwaMLHS3PYQ3ztZppRwWZxNSTntUu/view
2. *Andrews Bible Commentary: Old Testament*, org. Ángel Manuel Rodríguez (Andrews University Press, 2020): https://drive.google.com/file/d/1xMDUnVBZa-ambehCcPyUzl177iUtVato/view
3. Derek Kidner, *Gênesis: Introdução e Comentário*: https://drive.google.com/file/d/1Jr71P--STfTS0Inxk0GcJQIKnWVhj5NY/view
4. Texto bíblico hebraico para consulta: Mechon-Mamre, Gn 4–12: https://mechon-mamre.org/p/pt/pt0104.htm
5. Texto de consulta ARA, Sociedade Bíblica do Brasil: https://www.sbb.org.br/biblia/ARA/GEN.4

A redação é original, por blocos de expressão, e não reproduz diretamente parágrafos dos comentários secundários. A obra de Doukhan e sua edição internacional são versões do **mesmo comentário**, não fontes independentes.

## II. Pontos críticos de exegese submetidos a revisão especial

| Passagem | Problema | Tratamento adotado |
| --- | --- | --- |
| Gn 4:1 | `קָנִיתִי אִישׁ אֶת־יְהוָה`: sentido de *qnh* e de *ʾeṯ* | Separadas tradução comum, leitura de Doukhan e outras alternativas; rejeitada a certeza de que Eva identificava necessariamente Caim com YHWH |
| Gn 4:3–5 | Por que Deus aceitou a oferta de Abel? | *Minḥâ* pode designar oferta vegetal; não reduzir a rejeição de Caim à falta de sangue |
| Gn 4:7 | *ḥaṭṭāʾṯ rōḇēṣ*, gênero gramatical e metáfora | Observada a discordância gramatical e o paralelo com 3:16 |
| Gn 4:8 | O TM omite a fala “Vamos ao campo” | Registrada a variante da Septuaginta, sem inserção silenciosa no TM |
| Gn 4:13 | *ʿāwōn*: culpa ou castigo | Registrada a ambiguidade e seu contexto |
| Gn 4:17 | Origem da esposa de Caim | Gn 5:4 fundamenta origem familiar; não inventar seu nome, idade ou parentesco exato |
| Gn 5 | Genealogias, idades, Enoque | Distinguidas a função literária, a cronologia e as variantes entre TM/LXX/Pentateuco Samaritano |
| Gn 6:1–4 | Filhos de Deus; nefilins; 120 anos | Apresentadas alternativas, com preferência adventista contextual identificada como interpretação |
| Gn 7–8 | Sete pares, 40/150 dias, datas, Ararate | Evitados cálculos somados sem justificativa e identificação arbitrária do pico |
| Gn 9:22–27 | Nudez de Noé; ato de Cam; maldição de Canaã | Não inventar agressão sexual não descrita; explicitar que Canaã, não um grupo racial moderno, recebe a maldição |
| Gn 10:11,25 | Assur/Ninrode; divisão em Pelegue | Assinaladas dificuldades sintáticas e recusada dedução de tectônica continental |
| Gn 11 | Babel, genealogias, Cainã, Terá | Distinguido jogo de palavras de etimologia histórica; anotadas variantes e problemas de cronologia |
| Gn 12:3,13–19 | Bênção universal, meia-verdade de Sarai, entrada na casa de Faraó | *Nifal* discutido; Gn 20:12 incorporado; não afirmar consumação sexual sem texto explícito |

## III. Revisão formal e técnica realizada

- Todos os 9 arquivos conferidos quanto a frontmatter Markdown e metadados da coleção Astro (`book`, `chapter`, `verses`, `draft`).
- **239 versículos** cobertos por títulos de seção, inclusive a unidade independente de Gn 10:32.
- **69 notas** verificadas quanto a ordem numérica, referências internas e correspondência exata entre âncoras e chamadas. Nenhuma chamada sem destino ou nota sem chamada.
- Os nove arquivos incluem expressões hebraicas, comentários próprios por unidade de sentido e links à ARA.
- Os arquivos permanecem com `draft: true`; a branch `main` não foi alterada.
- Ajustes efetivamente aplicados na revisão: delimitação de Gn 4:8–15/4:16–24, correção da transliteração de Jafé em Gn 5:32 e correção da vocalização de `מְבָרְכֶיךָ` em Gn 12:3.
- Criado o verificador automático `scripts/validar-genesis-rascunhos.mjs` para repetir as checagens estruturais no repositório.

## IV. Itens que ainda exigem checagem antes de publicar

**A revisão desta rodada não equivale a uma colação humana exaustiva e certificada de cada sinal vocálico de todos os fragmentos hebraicos.** Antes de tornar `draft: false` ou mesclar a PR, completar:

1. Conferência independente, forma por forma, contra uma edição hebraica crítica (vocalização, grafia, morfologia e transliteração).
2. Verificação bibliográfica de todas as remissões secundárias e paginação efetiva das edições consultadas.
3. Conferência final de nuance semântica, ambiguidade textual, paralelos e equilíbrio teológico com revisão acadêmica humana.
4. Execução do verificador com Node.js e do `npm run build` em checkout da branch; conferir erros de renderização de Markdown e tipografia hebraica em desktop e celular.
5. Verificação de links ARA e navegação dentro do site e aprovação expressa da publicação.

**Decisão editorial:** manter todo o conteúdo de Gn 4–12 como rascunho; não mesclar e não publicar automaticamente.
