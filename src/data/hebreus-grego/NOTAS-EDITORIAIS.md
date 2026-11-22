# Texto original e interlinear — Hebreus

## Base textual
O texto grego dos 13 capítulos deriva diretamente do arquivo `79-Heb-morphgnt.txt` do MorphGNT 6.12, transcrição morfologicamente etiquetada da **SBL Greek New Testament (SBLGNT)** de Michael W. Holmes. Não se importam leituras de outras edições sem nota.

- Fonte: https://github.com/morphgnt/sblgnt/blob/master/79-Heb-morphgnt.txt
- SBLGNT © 2010 Society of Biblical Literature e Logos Bible Software, CC BY 4.0.
- Lematização e morfologia: James K. Tauber, ed., MorphGNT 6.12 (2017), CC BY-SA 3.0.

## Critérios editoriais
Os dados armazenam, nesta ordem: grafia grega pontuada, lema, categoria, análise morfológica de oito posições, glosa lexical portuguesa, transliteração latina simplificada.

As glosas portuguesas começaram como apoio lexical por reaproveitamento do léxico do projeto 1 João e correspondências de lemas de Hebreus. Em uma segunda rodada, foram preenchidas as lacunas, revistas flexões de verbos finitos, infinitivos, particípios, pronomes e várias escolhas de sentido no contexto. **Todos os 4.935 tokens possuem agora alguma glosa, mas isso não equivale a uma tradução interlinear integralmente validada por revisão filológica independente de cada forma.** A sequência de glosas pode conservar estruturas não idiomáticas em português e não deve ser apresentada como tradução fluente.

A transliteração utiliza um algoritmo de normalização simplificada, conservando vogais longas em `ē` e `ō`. Não constitui reconstrução fonética exata nem edição de pronúncia.

## Validação estrutural
13 capítulos; 303 versículos; 4.935 formas gregas. Os totais por capítulo são: 257, 312, 282, 290, 231, 300, 454, 274, 507, 550, 631, 472, 375. A verificação automatizada está em `scripts/validar-hebreus-grego.mjs`.

## Decisões lexicais e exegéticas da revisão
- **Hebreus 4:9, σαββατισμός:** “descanso sabático”; não dissolver a palavra apenas em “descanso” sem reconhecer a especificidade do termo.
- **Hebreus 7:25, ἐντυγχάνω:** “interceder; apresentar súplica”, aplicado ao ministério do Sumo Sacerdote.
- **Hebreus 2:17, ἱλάσκομαι:** “fazer expiação”; a glosa designa uma ação cultual e não resolve isoladamente debates sobre expiação e propiciação.
- **Hebreus 8:6; 9:15, διαθήκη:** “aliança”; em Hebreus 9:16–17 oferece-se “testamento; aliança”, devido à linguagem de morte e vigência jurídica. A interpretação desses versículos permanece discutida.
- **Hebreus 9:4, θυμιατήριον:** são possíveis os sentidos “incensário” e “altar do incenso”. Não apresentar uma única identificação como se houvesse unanimidade.
- **Hebreus 9:11–12 e 10:19–20:** cuidado com o uso cultual de “tabernáculo”, “santuário” e “lugares santos”, evitando antecipar uma interpretação espacial definitiva.
- **Hebreus 10:10, θέλημα:** “vontade” e nunca a glosa errada “será”.
- **Hebreus 11:1, ὑπόστασις:** “certeza; fundamento”; o termo também comporta discussões sobre “realidade”, “garantia” e “confiança”.
- **ὑπέρ:** preposição “em favor de; por”; em Hebreus 4:12, na construção comparativa, “mais do que”.
- **ζάω, τελειόω, καλέω e καθαρίζω:** flexões verbais corrigidas em vários versículos; as glosas passam a distinguir infinitivo, particípio, voz passiva e formas finitas mais claramente.

## Estado e limites
Os **13 capítulos, 303 versículos e 4.935 tokens gregos** possuem os seis campos completos, inclusive glosas não vazias. Os testes automatizados conferem estrutura e pontos lexicais críticos. Há ainda necessidade de auditoria humana completa de sintaxe, polissemia, concordância e equivalência de cada glosa. A fonte grega e os códigos morfológicos foram conservados, mas o texto-base não deve ser confundido com tradução portuguesa integral. A forma interlinear simplifica construções que dependem de uma oração inteira.
