# Prima Scriptura — Revisão acadêmica de Apocalipse 1:9–20
**Data:** 2026-11-23  
**Branch:** `rascunho/apocalipse`  
**Status:** texto e morfologia auditados; revisão semântica final condicionada a cotejo lexicográfico e revisão especializada do conjunto de verbetes.

## 1. Fontes e método
- Texto crítico e morfologia: MorphGNT 6.12, `morphgnt/sblgnt`, commit `aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d`, arquivo `87-Re-morphgnt.txt`.
- Mapeamento de lemas para Strong: `jtauber/greek-lemma-mappings`, `lexemes.yaml`, blob `a5cd101e445e51eb67fe05aceb06a14b991d41f2`.
- Texto crítico publicado: https://www.biblegateway.com/passage/?search=Revelation+1&version=SBLGNT
- Exemplos históricos de variantes do Textus Receptus: https://biblehub.com/texts/revelation/1-18.htm
- Testes estruturais: `scripts/auditar-filologia-apocalipse.mjs` e `.github/workflows/homologacao-apocalipse.yml`.

## 2. Escopo auditado
Doze versículos (Ap 1:9–20), 276 tokens, 113 lemas distintos; 80 novos verbetes e 80 novos índices canônicos, incluindo o total de 137.554 tokens dos 27 livros do NT no corpus.

## 3. Correções filológicas e editoriais
1. **Ap 1:9:** glosa de ὑμῶν alterada para «de vocês» e apresentação da coordenação de θλῖψις, βασιλεία e ὑπομονή; documentação da forma SBLGNT e da ampliação do TR.
2. **Ap 1:10:** adjetivo κυριακῇ vinculado formalmente a ἡμέρᾳ; a identificação histórica do «dia do Senhor» não decorre somente da morfologia.
3. **Ap 1:11:** λεγούσης é genitivo feminino singular concordando formalmente com σάλπιγγος em 1:10, não com φωνὴν, que está no acusativo. A omissão da expansão do TR foi preservada.
4. **Ap 1:12:** βλέπειν é infinitivo dependente de ἐπέστρεψα (finalidade); glosa corrigida de «vês» para «ver».
5. **Ap 1:13:** ποδήρη é forma acusativa do adjetivo substantivado ποδήρης, «veste comprida até os pés»; interpretação sacerdotal/régia é intertextual.
6. **Ap 1:14:** clarificação da concordância feminina plural de λευκαὶ com τρίχες; nota sobre Daniel 7:9.
7. **Ap 1:15:** χαλκολίβανον ocorre duas vezes no NT (Ap 1:15; 2:18), portanto não é hapax legomenon; πεπυρωμένης conserva genitivo feminino singular sem concordância regular com καμίνῳ dativo feminino singular.
8. **Ap 1:16:** descrição da espada como símbolo em contexto e particípios relacionados às estruturas nominativas.
9. **Ap 1:17:** forma deponente do imperativo φοβοῦ; correção da glosa αὐτόν «a ele».
10. **Ap 1:18:** ἔχω traduzido «tenho» e distinção de ᾅδης de termos para tormento; atenção à variação de ordem em determinadas edições do TR (não é uniforme em toda edição do TR).
11. **Ap 1:19:** εἶδες «viste», εἰσὶν «são», γίνεσθαι «acontecer»; relação de μέλλει com infinitivo.
12. **Ap 1:20:** τὸ μυστήριον é nominativo segundo MorphGNT, mas sua forma neutra admite igualmente acusativo; τὰς ἑπτὰ λυχνίας é acusativo seguro. A assimetria exige análise de topicalização, anacoluto e relações sintáticas alternativas, sem uniformização artificial dos casos.

## 4. Limites desta homologação
- A comparação automática de tokens, lemas, código morfológico e Strong confirma integridade da transcrição e do mapeamento; não prova a qualidade de cada tradução e nota semântica.
- Sete verbetes de especial relevância foram revisados individualmente nesta rodada (G4791, G2960, G4158, G5474, G4501, G86, G3466). Os demais verbetes lexicais, ainda de definição concisa, demandam cotejo especializado com léxicos e gramáticas críticos antes da chancela editorial definitiva.
- A transliteração usa convenções simplificadas e pode exigir uniformização editorial com um padrão acadêmico formal.
- A anotação sintática por cláusulas ainda é parcial; identificadores genéricos e relações de dependência não são uma análise de árvore sintática integral.
- Marcas de aparato crítico do SBLGNT não aparecem na superfície do interlinear; as variações pertinentes são discutidas nas notas.
- O build Astro não substitui teste visual em navegador ou confirmação de publicação Cloudflare Pages.

## 5. Resultado editorial
**Integridade textual e morfológica: homologação automatizada**, sujeita à saída de CI.  
**Revisão acadêmica completa de semântica, sintaxe e aparato crítico: pendente de chancela especializada**, sem declarar conclusão que os testes não comprovam.  
**Publicação:** manter somente em `rascunho/apocalipse`, sem promover `main`.
