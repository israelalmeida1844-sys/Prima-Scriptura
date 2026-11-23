# Gênesis 1:1–3 — relatório de padronização do interlinear (rascunho)

**Estado:** padronização executada exclusivamente na branch `rascunho/genesis`; aguardando aprovação humana.

Padronização de interface segundo Gn 1:4–5: Times New Roman em componentes, controles, rótulos e textos; ficha lexical com grid responsivo que impede sobreposição da etiqueta Transliteração; cartões empilhados em telas estreitas; faixa de palavras com rolagem horizontal interna e sem transbordamento lateral da página. Estados de carregamento, erro e índice incompleto são diferenciados; seleção de palavra e fechamento do painel invalidam renderizações antigas. A concordância é carregada de JSON estático local por lema Strong.

**Testes em navegador real:** GitHub Actions **45093584498**, Chromium e Playwright: compilação Astro concluída; visualização e interações dos seis interlineares de Gênesis 1:1–6, nas larguras 1440, 390 e 320 px; cliques em todas as unidades; controles de hebraico, transliteração, glosas e tradução; consulta de concordâncias e recolhimento; detecção geométrica de sobreposição entre rótulo e valor; detecção de rolagem horizontal do documento; erros JavaScript; alteração entre as traduções de Gn 1:2; cenários de índice incompleto e ausente. **Execução final aprovada**. Relatório: https://github.com/israelalmeida1844-sys/Prima-Scriptura/actions/runs/45093584498 .

**Limites:** aprovação automatizada não substitui revisão humana da exegese nem avaliação estética em todos os sistemas/fontes; a rolagem interna das palavras hebraicas é intencional. Sem merge ou publicação do site.


**Cobertura:** Gênesis 1:1 (7 unidades), 1:2 (14 unidades), 1:3 (6 unidades). Foram preservadas as notas exegéticas e as escolhas de tradução originais; a variante «vento de Deus» em 1:2 permanece funcional. Foi removida de 1:3 a seleção incorreta de «vento de Deus», que pertencia somente a 1:2 e chamava propriedade inexistente. Foram aproveitados os índices de concordância já completos da OSHB v.2.2. Nenhum JSON já existente foi modificado pela padronização tipográfica.
