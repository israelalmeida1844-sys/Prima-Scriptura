# Prima Scriptura — Revisão acadêmica de Apocalipse 1–2
**Data:** 23 de novembro de 2026  
**Escopo:** Ap 1:1–2:29 (49 versículos)  
**Branch:** `rascunho/apocalipse`  
**Publicação:** não autorizada; preservar `main`.  
**Natureza:** revisão editorial de fontes e dados estruturados; homologação acadêmica integral ainda não declarada.

## 1. Fontes editoriais
- Texto grego principal: *SBL Greek New Testament*, Michael W. Holmes, 2010.
- Morfologia: MorphGNT 6.12, `morphgnt/sblgnt`, commit `aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d`.
- Strong: mapeamento `jtauber/greek-lemma-mappings`, `lexemes.yaml`, blob `a5cd101e445e51eb67fe05aceb06a14b991d41f2`.
- Introdução e aparato SBLGNT: https://www.sblgnt.com/about/introduction/
- Edição pública: https://github.com/Faithlife/SBLGNT/blob/master/data/sblgnt/xml/Rev.xml
- Ap 2 em edições cotejáveis: https://www.biblegateway.com/passage/?search=Revelation+2&version=SBLGNT%3BTR1550%3BWHNU

## 2. Cobertura e resultados verificáveis
- Capítulo 1: 20 versículos inspecionados; Ap 1:1 teve nota textual corrigida diretamente. Ap 1:2–20 dispõem de 19 notas complementares específicas no script `scripts/revisao-academica-apocalipse-1-2.mjs`.
- Capítulo 2: 29 versículos inspecionados; 29 notas complementares específicas no mesmo script. Exegese particularmente sensível em Ap 2:13, 2:20 e 2:27.
- Léxico de Ap 2: dos 118 verbetes examinados nos dois arquivos, 81 tinham exemplos com fórmula genérica. O script `scripts/revisao-lexico-contextual-apocalipse-2.mjs` substitui as 81 ocorrências por explicações contextuais específicas, preservando lemas, identificadores e formas.
- O script `scripts/revisao-editorial-apocalipse-2.mjs` estabelece relações sintáticas justificadas para 37 palavras de Ap 2:1 e 2:29; para os outros tokens, evita simular uma análise de dependências já validada.
- Os relatórios antigos de CI atestam alinhamento mecânico dos tokens e builds passados, não revisões semânticas ou análise textual exaustiva.

## 3. Registro das decisões filológicas mais importantes
1. **1:1:** excluída a alegação de unanimidade de códices sem colação demonstrada. O genitivo Ἰησοῦ Χριστοῦ exige interpretação contextual.
2. **1:4–5:** preservadas as incongruências nominativas; distinguido λύσαντι (libertou) de λούσαντι (lavou).
3. **1:11 e 1:15:** examinadas concordâncias formais incomuns, inclusive λεγούσης ligado a σάλπιγγος e πεπυρωμένης genitivo junto de καμίνῳ.
4. **1:20:** registrada ambiguidade nominativo/acusativo do neutro singular τὸ μυστήριον, em contraste com acusativo plural inequívoco τὰς ... λυχνίας.
5. **2:3–5:** preservados perfeito κεκοπίακες, estrutura atributiva τὴν ἀγάπην ... τὴν πρώτην e construção condicional ἐὰν μή.
6. **2:9–10:** contextualizada a polêmica do texto, sem generalização contra judeus; evitada atribuição arbitrária de cronologia aos dez dias.
7. **2:13:** preservado Ἀντιπᾶς nominativo em encadeamento com expressão temporal.
8. **2:17:** reconhecida a incerteza interpretativa do simbolismo da ψῆφος λευκή.
9. **2:20:** evidenciado o nominativo ἡ λέγουσα após acusativo τὴν γυναῖκα, em construção irregular, sem emenda artificial.
10. **2:24:** evitada identificação anacrônica das «profundezas de Satanás» com sistema gnóstico posterior não demonstrado.
11. **2:27:** preservado συντρίβεται singular com sujeito τὰ σκεύη neutro plural: tal concordância é admissível em grego.
12. **2:29:** sistematizada a análise de ὁ ἔχων, ἀκουσάτω e τί na exortação final.

## 4. Testes e regressão
O workflow `.github/workflows/homologacao-apocalipse.yml` foi expandido para:
- Executar revisões **após** os geradores, evitando perda das correções;
- Impedir ausência de 48 notas documentadas nos 48 arquivos JSON de versículo (1:2–2:29);
- Verificar integridade estrutural dos 49 versículos, incluindo 1:1 com representação TS distinta;
- Exigir substituição dos 81 exemplos lexicais genéricos mapeados;
- Persistir dados revisados de ambos os capítulos na branch de rascunho antes de compilar.

**Atenção:** a execução do novo CI ainda deve ser confirmada pelo status de GitHub Actions; não declarar sucesso com base somente na edição do workflow.

## 5. O que ainda impede o selo «revisão acadêmica integral»
- Colação independente, unidade por unidade, do aparato crítico SBLGNT e dos testemunhos manuscritos, com leituras e fontes verificáveis.
- Cotejo de cada acepção com léxicos acadêmicos especializados (BDAG, Louw–Nida e outros conforme licenças de acesso), não apenas glosas e dados Strong.
- Árvores sintáticas validadas para todos os tokens, em vez de classificações de papel e alguns vínculos.
- Revisão por especialista externo e testes visuais do resultado compilado em navegador após o último commit.
- Registro e correção de eventuais falhas da nova execução do workflow.

## 6. Parecer
**Revisão editorial complementar: registrada em código e notas para 49 versículos, com 81 verbetes genéricos de Ap 2 tratados no script.**  
**Homologação acadêmica integral: não concedida até cumprimento do item 5.**  
**Publicação: não publicar na `main` nem no Cloudflare Pages antes da aprovação editorial.**
