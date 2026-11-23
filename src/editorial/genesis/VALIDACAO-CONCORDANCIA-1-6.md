# Gênesis 1:6 — auditoria editorial e técnica (rascunho)

**Estado:** interlinear e concordâncias produzidos e validados tecnicamente, aguardando aprovação editorial; nenhuma atualização da branch `main` ou publicação do site.

## Texto massorético e segmentação

וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם׃

Tradução editorial: «E Deus disse: “Haja uma expansão no meio das águas, e que ela faça separação entre águas e águas.”»

A disposição interlinear tem **11 unidades hebraicas**, **8 lemas Strong distintos**, transliteração, glossa, morfologia, explicação lexical e análise contextual. Pontos sensíveis: `רָקִיעַ` pode ser vertido por «expansão» ou «firmamento», sem tomar a etimologia como prova suficiente da constituição material; `בְּתוֹךְ` contém prefixo בְּ e lema תָּוֶךְ em construto com הַמָּיִם; `וִיהִי` funciona como continuação volitiva da fala divina, distinguindo-se da fórmula narrativa de cumprimento; `מַבְדִּיל` é particípio Hifil, não forma narrativa finita; `לָמָיִם` contém preposição לְ e substantivo מַיִם **sem artigo definido**; a glossa contextual «e águas» preserva a construção correlativa בֵּין ... לְ, não uma conjunção explícita.

## Concordâncias OSHB v.2.2 (39 livros)

| Strong | Lema | Tokens | Versículos distintos | Estado |
|---|---|---:|---:|---|
| H559 | אָמַר | 5.318 | 4.337 | reutilizado |
| H430 | אֱלֹהִים | 2.600 | 2.246 | reutilizado |
| H1961 | הָיָה | 3.575 | 3.131 | reutilizado |
| H7549 | רָקִיעַ | 17 | 15 | novo |
| H8432 | תָּוֶךְ | 420 | 390 | novo |
| H4325 | מַיִם | 582 | 525 | reutilizado |
| H914 | בָּדַל | 42 | 40 | reutilizado |
| H996 | בֵּין | 410 | 248 | reutilizado |

As oito concordâncias locais estão em `public/data/concordancia-hebraica/HNNNN.json`: campo `complete: true`, metadados de fonte e licença, Gn 1:6 presente, contagens válidas, referências deduplicadas em ordem canônica. Os índices medem tokens etiquetados com cada Strong; `verseCount` refere-se a versículos distintos, não a total de tokens.

Fonte: Open Scriptures Hebrew Bible (OSHB), tag `v.2.2`, 39 livros; morfologia/lemas sob CC BY 4.0. Atribuição: Original work of the Open Scriptures Hebrew Bible available at https://github.com/openscriptures/morphhb

## Implementação e testes

- `src/data/texto-original/genesis-1-6.ts` — 11 unidades com notas linguísticas.
- `src/components/TextoOriginalGenesis1v6.astro` — interface idêntica ao padrão 1:4–5 corrigido.
- `src/pages/rascunhos/genesis-1-6.astro` — página de prévia isolada.
- `scripts/gerar-concordancia-genesis-1-1.mjs` — gerador com 2 novos lemas e verificação do versículo.
- `.github/workflows/auditar-genesis-1-6.yml` — geração de concordâncias, validação e build. **Execução 45093498844: aprovada**, incluindo o registro dos JSONs no rascunho: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45093498844
- `scripts/testar-genesis-1-1-6-browser.mjs` e seu workflow — interação de todos os seis versículos em navegador Chromium, em viewports 1440, 390 e 320 px. **Execução final 45093584498: aprovada**: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45093584498

**Limite:** a compilação e a automação de navegador não substituem a revisão humana final de decisões exegéticas e de renderização tipográfica noutros dispositivos. Nenhuma alteração foi mesclada em `main`; nenhuma publicação foi autorizada ou realizada.

## Revisão filológica complementar — Gênesis 1:6

**Correção identificada e aplicada ao arquivo de dados:** a análise anterior de `לָמָיִם` afirmava equivocadamente «artigo definido assimilado». A forma massorética traz a preposição לְ com a palavra `מַיִם`, mas **não um artigo definido**. Corrigidos morfologia, glossa, transliteração (`lāmāyim`, sem geminação do mem) e explicação, distinguindo tradução idiomática («entre águas e águas») da segmentação gramatical exata. Também foi explicitado o estado construto de `תָּוֶךְ` em `בְּתוֹךְ הַמָּיִם`, e a continuação volitiva em `וִיהִי`.

**Conferência externa do texto:** comparação da vocalização de Gn 1:6 com o WLC reproduzido em https://www.biblegateway.com/passage/?search=Genesis+1%3A6&version=WLC e com o texto hebraico da Sefaria em https://www.sefaria.org/Genesis.1.6 . A leitura `לָמָיִם` é preservada; não foi substituída por `לַמָּיִם`. A distinção entre análise de um lema e elementos prefixados continua expressa na documentação dos índices.

**Escopo:** texto, glossa e morfologia corrigidos no rascunho, sem alterar a lista de referências Strong; a validação em navegador previamente aprovada documenta a versão anterior à última correção textual, sendo necessário novo build após a correção para atestar a versão atual.

**Revalidação após correção:** workflow Chromium da branch de rascunho reexecutado na execução 45094160196: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45094160196 . O resultado deve ser conferido antes de classificar a revisão posterior como homologada.
