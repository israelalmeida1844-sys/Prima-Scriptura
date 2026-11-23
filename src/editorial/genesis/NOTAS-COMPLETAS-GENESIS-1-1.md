# PRIMA SCRIPTURA — GÊNESIS 1:1
## Texto Massorético, análise estrutural e concordâncias integrais

**Estado:** Gênesis 1:1 concluído como **pacote de dados e notas de estudo para avaliação**. Arquivo gerado em `rascunho/genesis`, sem modificação de `main`, sem atualização do site e sem avanço para o versículo 2.

### 1. Texto base

**Texto hebraico (WLC/OSHB, vocalização massorética sem sinais de cantilação):**

> בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃

**Transliteração:** *bərēʾšîṯ bārāʾ ʾĕlōhîm ʾēṯ haššāmayim wəʾēṯ hāʾāreṣ.*

**Tradução editorial independente:** «No princípio, Deus criou os céus e a terra.»

**Nota de tradução:** a leitura como oração principal é tradicional e possível. Alguns intérpretes propõem entender a expressão inicial como construto temporal subordinado («Quando Deus começou a criar...»); a classificação morfológica da OSHB para רֵאשִׁית (`Ncfsa`, feminino singular absoluto) não encerra essa discussão exegética. Não se deve derivar da morfologia isolada uma decisão dogmática acerca da idade do universo ou da duração dos acontecimentos narrados.

### 2. Estrutura sintática

A ordem hebraica observada é: **adjunto temporal — predicado verbal — sujeito — marcador do objeto — objeto direto — conjunção + marcador — segundo objeto direto**. A coordenação final combina duas entidades definidas e pode ser interpretada como expressão abrangente («céus e terra»), não como enumeração de todos os detalhes materiais da criação.

| Ordem | Forma hebraica | Strong | OSHB `rawCode` | Papel sintático |
|---|---|---|---|---|
| 1 | בְּרֵאשִׁית | H7225 | `HR/Ncfsa` | Adjunto temporal |
| 2 | בָּרָא | H1254 | `HVqp3ms` | Predicado verbal principal |
| 3 | אֱלֹהִים | H430 | `HNcmpa` | Sujeito |
| 4 | אֵת | H853 | `HTo` | Marcador do primeiro objeto |
| 5 | הַשָּׁמַיִם | H8064 | `HTd/Ncmpa` | Primeiro objeto direto |
| 6 | וְאֵת | H853 | `HC/To` | Conjunção + marcador do segundo objeto |
| 7 | הָאָרֶץ | H776 | `HTd/Ncbsa` | Segundo objeto direto |

**Critério de modelagem:** códigos morfológicos apresentados acima são os códigos **completos** de cada unidade, inclusive prefixos indicados por `/`. Um número Strong identifica o elemento lexical principal, e não obrigatoriamente todos os prefixos gráficos do token. Assim, as duas formas `אֵת` e `וְאֵת` compartilham H853; a conjunção de `וְאֵת` não é um segundo emprego de H853.

### 3. Comentário filológico das sete unidades

**בְּרֵאשִׁית — H7225.** O substantivo רֵאשִׁית designa «começo», «primeira parte» e, em contextos agrícolas, «primícias» (Êx 23:19). A preposição prefixada בְּ introduz a relação temporal. A ligação etimológica com רֹאשׁ («cabeça; posição principal») sustenta a base consonantal ראש, sem exigir que se postule aqui um verbo independente com o mesmo uso. Não confundir essa base lexical com prova suficiente de determinada estrutura sintática.

**בָּרָא — H1254.** Verbo Qal, perfeito, 3ª pessoa masculina singular. Descreve a ação criadora de Deus e determina a concordância singular do sujeito אֱלֹהִים. O verbo pode ser empregado figuradamente para pedir transformação interior (Sl 51:12 hebraico; nas traduções portuguesas, a numeração de alguns salmos varia). Em outro tronco verbal, pode ter valor de desbravar ou abrir passagem (Js 17:15); este último sentido não deve ser transferido automaticamente ao Qal de Gn 1:1.

**אֱלֹהִים — H430.** Substantivo de forma nominal masculina plural, utilizado aqui para referir-se ao Deus único, com verbo singular. A forma plural, sem outros dados contextuais, não demonstra pluralidade de sujeitos da ação nem constitui uma prova gramatical isolada da doutrina da Trindade. Em Êx 20:3, a construção «outros deuses» evidencia uso plural referente a divindades.

**אֵת — H853.** Partícula indicadora de objeto direto definido, sem equivalente lexical independente no português do versículo. Aponta para הַשָּׁמַיִם. Sua distribuição no corpus é muito frequente, de modo que a concordância deverá distinguir **tokens** da palavra e **versículos** que contêm pelo menos uma ocorrência.

**הַשָּׁמַיִם — H8064.** Substantivo de forma plural precedido pelo artigo definido הַ, cujo daguexe consonantal deve ser preservado na forma vocalizada. O sentido em Gn 1:1 integra a expressão «céus e terra»; em Gn 1:8, שָׁמַיִם é o nome atribuído à expansão. A relação entre essas passagens não implica identidade absoluta de todos os usos de «céu» na Bíblia.

**וְאֵת — H853.** Conjunção וְ («e») acrescida da mesma partícula אֵת, coordenando o segundo objeto direto. O `rawCode` composto da OSHB é `HC/To`, não `HTo` isoladamente. A distinção entre componente conjuntivo e marcador de objeto é essencial para interlineares rigorosos.

**הָאָרֶץ — H776.** O lema אֶרֶץ possui usos como «terra», «território» e «solo». Aqui integra a expressão abrangente «os céus e a terra». Embora a OSHB classifique a forma como `Ncbsa` («substantivo comum singular absoluto»), o uso hebraico do substantivo é normalmente feminino. Não atribuir ao lema uma raiz verbal triliteral segura apenas a partir da grafia de três consoantes; por isso o campo etimológico permanece vazio no JSON.

### 4. Arquitetura da concordância integral

**Arquivo principal:** `src/editorial/genesis/GEN.1.1-estruturado-completo.json`.

O JSON é autocontido e segue a estrutura exata requisitada: `verseRef`, `versePt`, `translationPt`, `translationNotePt`, `lexemes`, `tokens`, `concordanceByStrong`. **A lista `items` não é uma amostra**: contém cada referência distinta do índice OSHB para os seis lemas. O arquivo possui **11.708 itens** no conjunto das seis concordâncias, podendo o mesmo versículo aparecer em índices distintos por conter diversos lemas. Cada item inclui `ref` OSIS, referência portuguesa, livro, seção da Bíblia Hebraica e excertos em hebraico e português.

| Strong | Lema | Tokens no corpus | Versículos `totalCount` | Pentateuco | Profetas | Escritos |
|---|---|---:|---:|---:|---:|---:|
| H7225 | רֵאשִׁית | 51 | 49 | 17 | 16 | 16 |
| H1254 | בָּרָא | 54 | 46 | 11 | 28 | 7 |
| H430 | אֱלֹהִים | 2600 | 2246 | 683 | 784 | 779 |
| H853 | אֵת | 10979 | 6782 | 2492 | 3224 | 1066 |
| H8064 | שָׁמַיִם | 421 | 395 | 92 | 145 | 158 |
| H776 | אֶרֶץ | 2505 | 2190 | 705 | 1038 | 447 |

`totalCount` representa o número de **versículos distintos**, correspondente à soma de `countsBySection`, porque cada item representa uma referência versicular. O número de tokens pode ser maior. As três seções seguem a organização do **Tanakh**: Pentateuco/Torá, Profetas/Nevi'im e Escritos/Ketuvim. Daniel pertence aos Escritos; Josué, Samuel e Reis aos Profetas. Essa classificação não coincide com a ordem genérica de algumas Bíblias cristãs.

### 5. Excertos bíblicos e diferenças de numeração

- **Hebraico:** fragmentos extraídos das palavras de cada versículo no corpus WLC/OSHB v2.2; não são retroversões de português. Os sinais de cantilação foram omitidos e as vogais massoréticas preservadas.
- **Português:** o campo `excerptPt` contém o texto português da **Almeida 1911**, em domínio público, com sua ortografia histórica original. Por segurança, foi conservado o versículo inteiro quando não é possível garantir correspondência palavra a palavra com o trecho hebraico. Portanto, `excerptPt` não deve ser rotulado como «tradução editorial própria», exceto nos cinco títulos de salmos explicitados a seguir.
- **Alinhamento de versificação:** 830 referências dos seis índices exigiram conversão de numeração massorética (MT) para a numeração inglesa tradicional da tradução portuguesa. A correspondência foi feita pela tabela STEPBible TVTMS, não por subtrações arbitrárias de números de versículos. A referência `ref` e `refPt` **preservam a numeração do índice WLC**, enquanto o texto `excerptPt` usa o versículo de Almeida 1911 que corresponde à passagem.
- **Títulos de salmos:** cinco itens, Sl 18:1, 34:1, 56:1, 59:1 e 60:2, são versículos/títulos no Texto Massorético, mas não têm versículo português numerado correspondente. Para esses itens, `excerptPt` apresenta **tradução editorial própria do texto hebraico**, não uma passagem inventada da Almeida 1911. O fato está registrado em `GEN.1.1-auditoria-de-fonte.json`.
- **Auditoria final:** 11.708 itens, **zero referências sem tradução portuguesa identificada**, zero avisos pendentes de numeração, 830 conversões por tabela especializada e cinco títulos com tradução editorial documentada.

**Cautela metodológica:** as traduções portuguesas são de uma tradição textual cristã histórica e não constituem uma tradução palavra a palavra da OSHB. Assim, a sua apresentação ao lado de um excerto hebraico **não prova alinhamento lexical preciso**; para pesquisa de morfologia deve prevalecer o hebraico original.

### 6. Fontes, versões e licenças

1. **Westminster Leningrad Codex (WLC):** consoantes e vocalização hebraica, domínio público, distribuído no corpus Open Scriptures Hebrew Bible.
2. **Open Scriptures Hebrew Bible (OSHB):** corpus **v.2.2**, índice Strong e morfologia, CC BY 4.0, https://github.com/openscriptures/morphhb ; atribuição: *Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb*.
3. **Almeida Revista e Corrigida de 1911:** texto histórico em português de domínio público, conjunto `ALM1911` do repositório https://github.com/damarals/biblias , revisão pinada no gerador pelo commit `bae7ba00cb44729a72b3c1ee20db62da274ff765`. O emprego desta edição não implica equivalência textual com a Almeida Revista e Atualizada.
4. **STEPBible TVTMS (MT→English):** dados de versificação fornecidos por STEP Bible (www.STEPBible.org), obra original da Tyndale House, Cambridge, licença CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ . Tabela derivada do repositório https://github.com/metaxiamultimedia/scriptures-js-source-stepbible-versification , pinada no commit `f426b7253623731ce788c8ce7abcd1d8f95c1f70`. Modificação aplicada: leitura seletiva MT→English para alinhar referências da OSHB à numeração da Almeida 1911.

### 7. Testes e situação editorial

**Validação automática final:** GitHub Actions 45103743944: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45103743944 — **sucesso**.

Foram verificadas:
- As sete palavras e seus respectivos códigos morfológicos OSHB completos.
- Os seis lemas Strong, sem duplicação no dicionário lexical.
- A exatidão de `items.length === totalCount` e das contagens por seção.
- A ordem e o conteúdo das 11.708 referências conforme os índices completos já existentes.
- A presença de `excerptHe` e `excerptPt` em todas as referências.
- A ausência de excertos-placeholder e de conversões pendentes de numeração.
- A preservação do rascunho, sem publicação no site.

**Próxima etapa do projeto:** somente revisar e aprovar Gênesis 1:1. **Não começar a conversão de Gn 1:2–8** antes de validação editorial da arquitetura e dos exemplos escolhidos.
