# Prima Scriptura — Apocalipse 3:1–22
**Estado:** início do capítulo 3, edição acadêmica em rascunho. Não promover a `main`.

## Divisão das três cartas
- Sardes (3:1–6): vida aparente, vigilância, obras, vestes brancas e livro da vida.
- Filadélfia (3:7–13): chave de Davi, porta aberta, perseverança, hora da provação e novo nome.
- Laodiceia (3:14–22): o Amém, princípio da criação, mornidão, ouro e vestes, colírio, disciplina e promessa do trono.

## Protocolo de produção
1. Obter todas as unidades da edição MorphGNT 6.12/SBLGNT, identificador de referência 2703VV, respeitando a sequência grega e removendo apenas marcas não lexicais de aparato.
2. Conferir tokens, formas normalizadas, lema, classe e código morfológico com o arquivo `87-Re-morphgnt.txt` no commit `aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d`.
3. Vincular números Strong exclusivamente ao mapeamento identificado e verificar individualmente os casos ambíguos. Ausência ou multiplicidade de correspondência não é autorizacão para inventar número.
4. Produzir glosa contextual para cada palavra e uma tradução editorial independente da sequência das glosas; não reutilizar automaticamente a primeira acepção lexical.
5. Registrar dependências sintáticas justificadas e separar interpretação gramatical da intertextual e das aplicações denominacionais.
6. Gerar índices completos de concordância a partir dos 27 livros, com contagem de tokens e versículos separados.
7. Implementar interface existente (grego, transliteração, glossas, morfologia, ficha lexical, ocorrências), navegação e responsividade; testar compilação Astro.
8. Cotejar variantes em aparato especializado, sem afirmar unanimidade de manuscritos por inferência.
9. Publicar apenas após aprovação explícita. Edição permanece em `rascunho/apocalipse`.

## Primeiro versículo — Apocalipse 3:1 (estudo piloto)
### Tradução editorial preliminar
«Ao anjo da igreja em Sardes escreve: Estas coisas diz aquele que tem os sete espíritos de Deus e as sete estrelas: Conheço as tuas obras: tens nome de que estás vivo, mas estás morto.»

### Unidades de análise
- **Τάδε λέγει:** Τάδε é demonstrativo neutro plural em fórmula de proclamação, não advérbio simples.
- **ὁ ἔχων:** artigo + particípio presente ativo, descrição substantivada do locutor.
- **τὰ ἑπτὰ πνεύματα τοῦ θεοῦ:** sintagma nominal com numeral e genitivo; a identidade dos «sete espíritos» é problema interpretativo que deve ser estudado com Ap 1:4; 4:5; 5:6, não pressuposta a partir do número.
- **τοὺς ἑπτὰ ἀστέρας:** objeto coordenado na descrição do locutor, em conexão com Ap 1:16,20.
- **Οἶδά σου τὰ ἔργα:** verbo de perfeito com valor presente de conhecimento; distinção entre forma e uso temporal.
- **ὄνομα ἔχεις ὅτι ζῇς:** «tens nome/reputação de que vives»; o sentido de reputação deriva da construção, não de um significado invariável de ὄνομα.
- **καὶ νεκρὸς εἶ:** contraposição antitética «e estás morto».

### Questões críticas pendentes
- Cotejo em aparato textual dos termos de 3:1 e dos testemunhos correspondentes.
- Conferência de cada token conforme a edição base e atribuição Strong.
- Revisão de glosas, discussão do genitivo τοῦ θεοῦ e natureza da imagem dos sete espíritos.
- Confirmação das rotas e do funcionamento do interlinear, sem afirmar homologação antes dos testes.

## Rubrica editorial
Texto crítico: pendente de verificação token a token.  
Morfologia: pendente de validação automatizada.  
Semântica e sintaxe: estudo-piloto iniciado.  
Léxico e concordâncias: pendentes.  
Interface e build: pendentes.  
Publicação: proibida até aprovação.
