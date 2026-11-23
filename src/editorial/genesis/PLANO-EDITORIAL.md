# Gênesis — Projeto editorial (rascunho)

**Estado:** preparação; não publicado.  
**Destino:** site Prima Scriptura.  
**Branch:** `rascunho/genesis`.  
**Coleção Astro:** `src/content/comentarios/`, sempre `draft: true` até aprovação expressa.

## Identidade do comentário

Comentário bíblico de profundidade intermediária-alta, porém legível em telas. Unidade editorial preferida: **blocos de palavras ou pequenas expressões do versículo**, e não ensaios extensos por versículo. A seleção dos blocos deve respeitar a sintaxe e o sentido do hebraico.

## Método obrigatório

1. Partir do **Texto Massorético hebraico** de cada passagem; verificar grafia, vocalização e segmentação.
2. Apresentar o texto original, transliteração didática e um comentário original para cada unidade significativa.
3. Explicar morfologia, semântica, paralelismos, repetições e estruturas literárias somente quando forem relevantes para a compreensão.
4. Distinguir cuidadosamente significado lexical, interpretação contextual e desenvolvimento teológico; registrar alternativas pertinentes sem criar falsas certezas.
5. Adotar abordagem adventista em diálogo responsável com outras leituras, sem transformar o texto em debate técnico excessivo.
6. Manter parágrafos curtos. Referência habitual de extensão: aproximadamente 80–180 palavras por bloco, flexível conforme a complexidade.
7. ARA é a **tradução bíblica de referência**. Não reproduzir capítulos inteiros dessa tradução no repositório: usar links oficiais e glosas próprias para orientação.
8. Fontes secundárias orientam a análise, **não precisam aparecer como citações diretas** e não devem ser copiadas.
9. Antes da publicação, realizar revisão de hebraico, conteúdo, tom, ortografia, links, acesso móvel e coerência editorial.

## Fontes de orientação identificadas no Google Drive

- [Comentário Bíblico Internacional Adventista do Sétimo Dia — Gênesis, edição portuguesa](https://drive.google.com/file/d/1j9_nwaMLHS3PYQ3ztZppRwWZxNSTntUu/view?usp=drivesdk). Comentário associado a Jacques B. Doukhan.
- [Seventh-Day Adventist International Bible Commentary — Genesis, edição original](https://drive.google.com/file/d/145LyjOM_nzVX_BB3rGnecenmlQbDgfu9/view?usp=drivesdk). **Mesma obra em outra edição, não referência independente.**
- [Derek Kidner, Gênesis: Introdução e Comentário](https://drive.google.com/file/d/1Jr71P--STfTS0Inxk0GcJQIKnWVhj5NY/view?usp=drivesdk). Série Cultura Bíblica.

O texto bíblico hebraico é a referência primária. As obras acima ajudam a orientar a leitura e comparar alternativas; não substituem a conferência direta das formas hebraicas.

## Padrão por capítulo

- Cabeçalho com estado editorial e referência ARA por link.
- Breve apresentação da seção.
- Para cada versículo ou sequência: hebraico, transliteração e subtítulos em formato `“Expressão em português” — expressão hebraica (transliteração)`.
- Explicação exegética original, com equilíbrio entre precisão linguística e clareza.
- Eventuais excursus técnicos em etapa posterior, separados do corpo principal.

## Progresso

- [x] Localizar fontes e orientar a metodologia.
- [x] Criar branch isolada, sem alterar `main`.
- [x] Iniciar Gênesis 1:1–5 por expressões.
- [x] Ampliar a primeira redação de Gênesis 1:6–31 e acrescentar 11 notas exegéticas numeradas.
- [ ] Revisar formalmente grafia, vocalização, transliteração e análises de Gênesis 1:1–31.
- [ ] Verificar as 11 notas do comentário e padronizar a numeração por capítulo.
- [x] Concluir a primeira redação de Gênesis 1:6–31 (pendente de revisão acadêmica).
- [ ] Revisar introdução geral, estrutura e bibliografia de trabalho.
- [x] Produzir primeira redação de Gênesis 2:1–25, com 14 notas e atenção especial à nudez em 2:25.
- [x] Produzir primeira redação de Gênesis 3:1–24, com 12 notas e comparação lexical com 2:25.
- [x] Localizar e consultar *Andrews Bible Commentary: Old Testament* (2020), pp. 143–147, no Google Drive.
- [ ] Conferir o hebraico e as transliterações de Gênesis 2–3 contra edição crítica e revisar a precisão das notas.
- [x] Primeira redação de Gênesis 4–12 concluída (nove capítulos, 69 notas exegéticas).
- [x] Revisão crítica de passagens sensíveis, especialmente Gn 4:1 e 4:17; veja `REVISAO-4-12.md`.
- [x] Criado verificador estrutural dos rascunhos (`scripts/validar-genesis-rascunhos.mjs`).
- [ ] Realizar colação hebraica crítica integral e aprovação editorial dos capítulos 4–12.
- [x] Primeira redação dos capítulos 13–20 concluída (195 versículos cobertos, 55 notas exegéticas).
- [x] Revisão estrutural de Gênesis 13–20 concluída; relatório em `REVISAO-13-20.md`.
- [x] Validador do repositório ampliado para Gênesis 4–20.
- [ ] Conferência acadêmica integral das formas hebraicas de Gênesis 13–20 e testes de build do site.
- [x] Primeira redação dos capítulos 21–30 concluída (360 versículos, 190 blocos de comentário, 62 notas).
- [x] Auditoria estrutural de Gn 21–30 registrada em `REVISAO-21-30.md`.
- [x] Validador do repositório ampliado para Gn 4–30.
- [ ] Colação exaustiva das expressões hebraicas e revisão de bibliografia de Gn 21–30.
- [x] Primeira redação dos capítulos 31–50 concluída (659 versículos abrangidos, 222 blocos hebraicos, 192 notas).
- [x] Auditoria estrutural de Gn 31–50 concluída e documentada em `REVISAO-31-50.md`.
- [x] Verificador editorial ampliado para os capítulos 4–50.
- [x] **Primeira redação dos 50 capítulos de Gênesis registrada no GitHub, em rascunho.**
- [ ] Realizar colação filológica sistemática de Gênesis 1–50, inclusive notas, variantes e transliterações.
- [ ] Verificar bibliografia e aparatos de passagens textualmente controversas.
- [ ] Executar testes de compilação, revisão de links e visualização do hebraico no Astro.
- [ ] Submeter a redação completa à aprovação editorial antes de publicar.
- [ ] Projetar interface hebraica e blocos interativos do site, somente após validar o padrão editorial.
- [ ] Solicitar aprovação editorial antes de qualquer alteração em `main` ou publicação.

**Importante:** repositório público significa que esta branch e seu rascunho podem ser vistos no GitHub mesmo sem publicação no site. O campo `draft: true` e o isolamento da branch impedem que estes arquivos entrem na publicação atual de `main`, mas não garantem sigilo no GitHub.


## Atualização editorial — Gênesis 2–3

A análise de Gn 2:25 distingue עֲרוּמִּים (*ʿărummîm*, nudez sem vergonha) de עָרוּם (*ʿārûm*, astúcia da serpente, 3:1), em jogo de palavras atestado nas obras de Doukhan e no *Andrews Bible Commentary*. Gn 3:7 emprega עֵירֻמִּם (*ʿêrummim*). A alternância lexical **não comprova**, por si só, uma oposição técnica entre nudez sagrada e pecaminosa; a mudança de sentido emerge da narrativa.

[Andrews Bible Commentary: Old Testament, arquivo localizado no Drive](https://drive.google.com/file/d/1xMDUnVBZa-ambehCcPyUzl177iUtVato/view?usp=drivesdk).

As notas são explicativas e de apoio bibliográfico, sem transcrição direta das obras, e os arquivos permanecem `draft: true` na branch de trabalho.


## Rodada de Gênesis 4–12 (22/11/2026)

Nove capítulos acrescentados à branch isolada, todos com `draft: true`. As notas exegéticas numeradas de Gn 4–12 somam 69, com âncoras verificadas. O documento [`REVISAO-4-12.md`](REVISAO-4-12.md) registra a auditoria de conteúdo, formas hebraicas discutidas, correções realizadas e verificações pendentes antes da publicação. Não há autorização para mesclar a PR ou publicar enquanto existir essa pendência.


## Rodada de Gênesis 13–20 (22/11/2026)

Foram adicionados oito arquivos, todos com `draft: true`, contendo comentários de expressões hebraicas, diálogo acadêmico com Doukhan/Andrews/Kidner, referências bíblicas e 55 notas numeradas. A auditoria estrutural independente confirmou 195 versículos cobertos e todas as âncoras de nota íntegros. O relatório [`REVISAO-13-20.md`](REVISAO-13-20.md) registra a metodologia e as verificações pendentes antes de publicação. A branch `main` continua intocada.


## Rodada de Gênesis 21–30 (22/11/2026)

Foram registrados dez arquivos novos `genesis-capitulo-21.md` a `genesis-capitulo-30.md`, todos com `draft: true`. Os capítulos abrangem 360 versículos organizados em 190 blocos de expressão hebraica, com 62 notas internas numeradas. Os metadados, títulos de seção, chamadas de nota e presença de links ARA foram checados diretamente na branch, sem lacunas estruturais. O relatório [`REVISAO-21-30.md`](REVISAO-21-30.md) explicita as decisões exegéticas e as verificações acadêmicas e de build pendentes. A branch principal não foi modificada.


## Rodada de Gênesis 31–50 (22/11/2026)

Os vinte capítulos finais foram acrescentados à mesma branch isolada, cada um com `draft: true`, comentários de expressões hebraicas, notas exegéticas, referências e discussão das alternativas relevantes. A auditoria estrutural verificou cobertura de 659 versículos, 222 blocos e 192 notas; corrigiu metadados e chamadas de Gn 31, o título de Gn 38 e a sobreposição de intervalos de Gn 35. O relatório [`REVISAO-31-50.md`](REVISAO-31-50.md) registra as verificações concluídas e as pendências filológicas e de compilação. A **primeira redação de Gênesis 1–50** está completa na branch, mas não foi autorizada para publicação, nem mesclada à `main`.
