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
- [ ] Avançar pelos capítulos 2–50.
- [ ] Projetar interface hebraica e blocos interativos do site, somente após validar o padrão editorial.
- [ ] Solicitar aprovação editorial antes de qualquer alteração em `main` ou publicação.

**Importante:** repositório público significa que esta branch e seu rascunho podem ser vistos no GitHub mesmo sem publicação no site. O campo `draft: true` e o isolamento da branch impedem que estes arquivos entrem na publicação atual de `main`, mas não garantem sigilo no GitHub.
