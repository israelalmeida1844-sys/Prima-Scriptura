/**
 * Revisão editorial complementar, executada DEPOIS dos geradores.
 * Escopo: Apocalipse 2:1–29. Não altera texto grego, lemas, Strong,
 * códigos MorphGNT ou glosas já revisadas.
 * Dependências sintáticas são incluídas SOMENTE onde verificadas.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';

const checked = {
  1: {
    1:['Artigo dativo que determina ἀγγέλῳ, destinatário do imperativo γράψον.',2],
    2:['Destinatário expresso no dativo de γράψον; o referente de «anjo» exige discussão contextual.',7],
    3:['Artigo genitivo feminino singular de ἐκκλησίας; a locução ἐν Ἐφέσῳ intercala-se no sintagma.',6],
    4:['Preposição ἐν introduz o dativo locativo Ἐφέσῳ, que especifica a igreja.',5],
    5:['Topônimo no dativo regido por ἐν; indica a localização da igreja.',4],
    6:['Genitivo feminino singular que especifica o destinatário ἀγγέλῳ: anjo da igreja.',2],
    7:['Imperativo aoristo ativo, segunda pessoa singular: ordem dirigida a João para escrever.',null],
    8:['Acusativo neutro plural de ὅδε empregado na fórmula «estas coisas diz», não simples advérbio.',9],
    9:['Presente ativo indicativo, terceira pessoa singular, introduz a fala autorizada de Cristo.',null],
    10:['Artigo nominativo masculino singular que substantiva o particípio κρατῶν.',11],
    11:['Particípio presente ativo substantivado, nominativo masculino singular; sujeito de λέγει.',9],
    12:['Artigo acusativo masculino plural que determina ἀστέρας.',14],
    13:['Numeral indeclinável ἑπτά, determinando a quantidade de ἀστέρας.',14],
    14:['Objeto direto acusativo plural do particípio κρατῶν.',11],
    15:['Preposição ἐν que introduz a expressão locativa ἐν τῇ δεξιᾷ αὐτοῦ.',17],
    16:['Artigo dativo feminino singular que determina δεξιᾷ.',17],
    17:['Adjetivo substantivado no dativo feminino singular, regido por ἐν: «na [mão] direita».',15],
    18:['Genitivo possessivo de terceira pessoa, relacionado a δεξιᾷ.',17],
    19:['Artigo nominativo masculino singular que substantiva περιπατῶν.',20],
    20:['Particípio presente ativo substantivado; segundo título descritivo do sujeito de λέγει.',9],
    21:['Preposição ἐν que forma a locução espacial ἐν μέσῳ.',22],
    22:['Dativo de μέσος em locução com ἐν; seguido do genitivo τῶν ... λυχνιῶν.',21],
    23:['Artigo genitivo feminino plural que determina λυχνιῶν.',25],
    24:['Numeral indeclinável que quantifica λυχνιῶν.',25],
    25:['Genitivo feminino plural dependente da locução ἐν μέσῳ: entre os candelabros.',22],
    26:['Segundo artigo genitivo feminino plural, com χρυσῶν, em construção atributiva.',25],
    27:['Adjetivo genitivo feminino plural «de ouro», concordando com λυχνιῶν.',25]
  },
  29: {
    1:['Artigo nominativo masculino singular substantiva o particípio ἔχων.',2],
    2:['Particípio presente ativo substantivado: «aquele que tem», sujeito do imperativo ἀκουσάτω.',4],
    3:['Acusativo singular neutro de οὖς; objeto direto do particípio ἔχων.',2],
    4:['Imperativo aoristo ativo, terceira pessoa singular; núcleo da exortação.',null],
    5:['Pronome interrogativo neutro em interrogativa indireta: «o que» o Espírito diz.',8],
    6:['Artigo nominativo neutro singular que determina πνεῦμα.',7],
    7:['Sujeito nominativo neutro singular do verbo λέγει.',8],
    8:['Presente ativo indicativo, terceira pessoa singular; verbo da oração interrogativa indireta.',4],
    9:['Artigo dativo feminino plural que determina ἐκκλησίαις.',10],
    10:['Dativo feminino plural; destinatárias da comunicação, complemento de λέγει.',8]
  }
};
const seen = new Set();
let count = 0, elaborated=0;
for (let verse=1; verse<=29; verse++) {
  const path = 'src/data/texto-original/apocalipse/apocalipse-2-'+verse+'.ts';
  const source=fs.readFileSync(path,'utf8');
  const found=source.match(/=\s*(\{[\s\S]*\})\s*as const;/);
  assert.ok(found, 'Estrutura de dados não reconhecida: '+path);
  const obj=JSON.parse(found[1]);
  assert.equal(obj.verse,verse);
  for (let index=0;index<obj.words.length;index++) {
    const w=obj.words[index], token=index+1;
    assert.equal(w.id,'ap2-'+verse+'-'+token);
    count++;
    const match=checked[verse]?.[token];
    if (match) {
      const [explanation, governor]=match;
      w.explanation=explanation;
      w.syntax ??= {};
      if (governor!==null) w.syntax.governedBy='ap2-'+verse+'-'+governor;
      else w.syntax.governedBy=null;
      // Nomenclatura específica não altera a classificação morfológica.
      if (verse===1 && token===8) w.syntax.role='Objeto da fórmula introdutória';
      if (verse===1 && (token===13 || token===24)) w.syntax.role='Numeral modificador';
      if (verse===1 && token===17) w.syntax.role='Núcleo da locução preposicional';
      if (verse===1 && token===27) w.syntax.role='Modificador adjetival';
      if (verse===29 && token===5) w.syntax.role='Objeto interrogativo de λέγει';
      elaborated++;
      seen.add(w.id);
    } else if (/Consulte a tradução do período|a tradução integral e as notas documentam a construção/.test(w.explanation??'')) {
      // Evitar falsa afirmação de que uma relação sintática foi estabelecida.
      w.explanation=String(w.morphology).replace(/\.$/,'')+
        '. Glosa neste contexto: «'+w.gloss+'». '+String(w.syntax?.role??'Papel sintático ainda não classificado')+
        '. A dependência sintática precisa de análise particular; conferir notas do versículo.';
    }
  }
  const replacement=JSON.stringify(obj,null,2);
  fs.writeFileSync(path, source.replace(found[1],replacement));
}
assert.equal(elaborated,37,'Cobertura esperada dos dois versículos-modelo');
for(const verse of [1,29]){
  assert.equal(seen.size>=10,true);
}
console.log(JSON.stringify({scope:'Apocalipse 2:1–29',tokensProcessed:count,individualExplanationsReviewed:elaborated,method:'intervenção conservadora; demais dependências não presumidas'},null,2));
