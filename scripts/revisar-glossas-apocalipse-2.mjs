/** Revisão contextual da camada de glosas: Apocalipse 2:1–12.
 * Executar após gerar o corpus; preserva lema, grego, morfologia e Strong.
 * Não converte glosas em tradução contínua.
 */
import fs from 'node:fs';
const perVerse={
1:{'ἀγγέλῳ':'anjo','ἐκκλησίας':'igreja','γράψον·':'escreve','Τάδε':'assim','λέγει':'diz','ἀστέρας':'estrelas','τῇ':'na','λυχνιῶν':'candelabros'},
2:{'τὰ':'as','ἔργα':'obras','σου,':'tuas','τὸν':'o','κόπον':'trabalho','ὑπομονήν':'perseverança','κακούς,':'maus','λέγοντας':'que dizem','ἑαυτοὺς':'a si mesmos','ἀποστόλους,':'apóstolos','εἰσίν,':'são','αὐτοὺς':'a eles','ψευδεῖς·':'falsos'},
3:{'ἔχεις,':'tens','μου,':'meu','κεκοπίακες.':'te cansaste'},
4:{'ἔχω':'tenho','σοῦ':'ti','σου':'teu','πρώτην':'primeiro'},
5:{'μνημόνευε':'lembra-te','τὰ':'as','πρῶτα':'primeiras','ἔργα':'obras','ποίησον·':'pratica','ἔρχομαί':'venho','σοι,':'a ti','λυχνίαν':'candelabro','σου':'teu','αὐτῆς,':'dele','μετανοήσῃς.':'te arrependas'},
6:{'τοῦτο':'isto','ἔχεις':'tens','μισεῖς':'odeias','τὰ':'as','ἔργα':'obras','Νικολαϊτῶν,':'nicolaítas','μισῶ.':'odeio'},
7:{'ἔχων':'tem','οὖς':'ouvidos','ἀκουσάτω':'ouça','τί':'o que','λέγει':'diz','ἐκκλησίαις.':'igrejas','δώσω':'darei','ἐστιν':'está'},
8:{'ἀγγέλῳ':'anjo','ἐκκλησίας':'igreja','γράψον·':'escreve','Τάδε':'assim','λέγει':'diz','ἐγένετο':'esteve'},
9:{'Οἶδά':'conheço','σου':'tua','λεγόντων':'que dizem','Ἰουδαίους':'judeus','εἶναι':'ser','ἑαυτούς,':'a si mesmos','εἰσίν,':'são'},
10:{'μηδὲν':'nada','μέλλεις':'estás para','μέλλει':'está para','ὑμῶν':'de vós','πειρασθῆτε,':'sejais provados','ἡμερῶν':'dias','δώσω':'darei','σοι':'a ti','στέφανον':'coroa'},
11:{'ἔχων':'tem','οὖς':'ouvidos','ἀκουσάτω':'ouça','τί':'o que','λέγει':'diz','ἐκκλησίαις.':'igrejas','νικῶν':'vence','οὐ':'não','μὴ':'de modo algum','δευτέρου.':'segunda'},
12:{'ἀγγέλῳ':'anjo','ἐκκλησίας':'igreja','γράψον·':'escreve','Τάδε':'assim','λέγει':'diz'}
};
const genericArt={'Τῷ':'Ao','τῷ':'ao','τῆς':'da','τοῦ':'do','τῶν':'dos/das','ταῖς':'às','τὴν':'a','τὰς':'as','τοὺς':'os','τὰ':'as','τῇ':'na','τὸν':'o','τὸ':'o','ὁ':'o','ἡ':'a','οἱ':'os','αἱ':'as'};
let amended=0;
for(let v=1;v<=12;v++){
 const file='src/data/texto-original/apocalipse/apocalipse-2-'+v+'.ts';
 const source=fs.readFileSync(file,'utf8');
 const m=source.match(/=\s*(\{[\s\S]*\})\s*as const;/);
 if(!m)throw new Error('Dados não reconhecidos: '+file);
 const obj=JSON.parse(m[1]);
 for(const w of obj.words){
  const value=perVerse[v]?.[w.greek]??(w.lemma==='ὁ'?genericArt[w.greek]:undefined);
  if(value&&w.gloss!==value){w.gloss=value;amended++;}
  if(w.lemma==='σύ'){
    if(w.morphologyCode.includes('GS'))w.gloss=(v===9?'tua':'teu/de ti');
    if(w.morphologyCode.includes('GP'))w.gloss='de vós';
    if(w.morphologyCode.includes('DS'))w.gloss='a ti';
  }
  if(w.lemma==='οἶδα')w.gloss='conheço';
  if(w.lemma==='δίδωμι'&&w.greek==='δώσω')w.gloss='darei';
  if(w.lemma==='λέγω'&&w.greek==='λέγει')w.gloss='diz';
  if(w.lemma==='γράφω'&&w.greek==='γράψον·')w.gloss='escreve';
  if(w.lemma==='ἐκκλησία')w.gloss=w.morphologyCode.includes('P')?'igrejas':'igreja';
  if(v===7&&w.greek==='τῷ'&&w.id==='ap2-7-23')w.gloss='no';
  if(w.lemma==='ἑπτά')w.meanings='numeral cardinal indeclinável; a marcação de caso na anotação é contextual';
  if(w.explanation.includes('A glosa de apoio')||w.explanation.includes('A glosa de apoio')){
    w.explanation=w.morphology+'. '+w.syntax.role+'. Glosa contextual «'+w.gloss+'». Consulte a tradução do período e as notas para as relações sintáticas.';
  }
 }
 if(v===2)obj.translationNote='O presente δύνῃ rege o infinitivo aoristo βαστάσαι; a tradução distingue perseverança da recusa em suportar agentes maus.';
 if(v===7)obj.translationNote='A construção de dativo τῷ νικῶντι ... αὐτῷ foi vertida com retomada do beneficiário; a árvore da vida remete à promessa escatológica.';
 if(v===11)obj.translationNote='οὐ μή com aoristo passivo subjuntivo equivale a «de modo algum sofrerá dano», não a duas negações que se anulam.';
 fs.writeFileSync(file,source.replace(m[1],JSON.stringify(obj,null,2)));
}
console.log('Ap 2:1–12: glosas contextualizadas e revisadas; alterações pontuais: '+amended);
