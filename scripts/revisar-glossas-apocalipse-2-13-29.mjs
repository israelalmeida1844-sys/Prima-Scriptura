/**
 * Correções contextuais nas glosas do interlinear de Apocalipse 2:13–29.
 * O lema e os códigos morfológicos continuam exclusivamente do MorphGNT.
 * Glosas são apoios de leitura, não substitutos de análise sintática.
 */
import fs from 'node:fs';
const surface={
'Οἶδα':'conheço','κρατεῖς':'conservas','ὄνομά':'nome','ἠρνήσω':'negaste','πίστιν':'fé','ἀπεκτάνθη':'foi morto','κατοικεῖς,':'habitas','κατοικεῖ.':'habita',
'ἔχω':'tenho','ἔχεις':'tens','κρατοῦντας':'os que seguem','διδαχὴν':'ensino','ἐδίδασκεν':'ensinava','βαλεῖν':'colocar','σκάνδαλον':'tropeço','φαγεῖν':'comer','πορνεῦσαι·':'praticar imoralidade sexual',
'οὕτως':'assim','ὁμοίως.':'da mesma maneira','μετανόησον':'arrepende-te','ἔρχομαί':'venho','πολεμήσω':'lutarei','ταχύ,':'sem demora',
'ἔχων':'tem','ἀκουσάτω':'ouça','λέγει':'diz','νικῶντι':'vence','δώσω':'darei','κεκρυμμένου,':'escondido','ψῆφον':'pedrinha','λευκήν,':'branca','καινὸν':'novo','γεγραμμένον':'escrito','λαμβάνων.':'recebe','οἶδεν':'conhece',
'ἀγγέλῳ':'anjo','γράψον·':'escreve','Τάδε':'assim','Θυατείροις':'Tiatira','υἱὸς':'Filho','ὀφθαλμοὺς':'olhos','φλόγα':'chama','πόδες':'pés','ὅμοιοι':'semelhantes','χαλκολιβάνῳ·':'metal brilhante',
'ἔργα,':'obras','ἀγάπην':'amor','πίστιν':'fé','διακονίαν':'serviço','ὑπομονήν':'perseverança','πλείονα':'mais numerosas','πρώτων.':'primeiras',
'ἀφεῖς':'toleras','γυναῖκα':'mulher','λέγουσα':'que diz','ἑαυτὴν':'a si mesma','προφῆτιν,':'profetisa','διδάσκει':'ensina','πλανᾷ':'desvia','δούλους':'servos','εἰδωλόθυτα.':'comida sacrificada a ídolos',
'ἔδωκα':'dei','χρόνον':'tempo','μετανοήσῃ,':'se arrependa','θέλει':'quer','μετανοῆσαι':'arrepender-se',
'βάλλω':'lanço','κλίνην,':'leito','μοιχεύοντας':'os que adulteram','θλῖψιν':'tribulação','μετανοήσωσιν':'se arrependam',
'τέκνα':'filhos','ἀποκτενῶ':'matarei','γνώσονται':'saberão','πᾶσαι':'todas','ἐραυνῶν':'sonda','νεφροὺς':'rins','καρδίας,':'corações','ἑκάστῳ':'a cada um',
'ὑμῖν':'a vós','λοιποῖς':'demais','ἔχουσιν':'têm','ἔγνωσαν':'conheceram','βαθέα':'profundezas','λέγουσιν,':'dizem','βάρος·':'fardo',
'πλὴν':'contudo','ἔχετε':'tendes','κρατήσατε':'conservai','ἥξω.':'venha',
'νικῶν':'vence','τηρῶν':'guarda','τέλους':'fim','ἐξουσίαν':'autoridade','ἐθνῶν,':'nações',
'ποιμανεῖ':'pastoreará','ῥάβδῳ':'cetro','σιδηρᾷ':'de ferro','σκεύη':'vasos','κεραμικὰ':'de cerâmica','συντρίβεται,':'são despedaçados',
'εἴληφα':'recebi','πατρός':'Pai','ἀστέρα':'estrela','πρωϊνόν.':'da manhã'
};
const scoped={
13:{'μου,':'meu','ὑμῖν,':'entre vós','ὃς':'que','ὅπου':'onde'},
14:{'σοῦ':'ti','ἐκεί':'ali','κρατοῦντας':'os que seguem','Βαλὰκ':'Balaque','ὃς':'que','ἐνώπιον':'diante de','υἱῶν':'filhos','εἰδωλόθυτα':'alimentos sacrificados a ídolos'},
15:{'Νικολαϊτῶν':'nicolaítas','σὺ':'tu'},
17:{'ψῆφον':'pedrinha','μάννα':'maná','ὄνομα':'nome','οὐδεὶς':'ninguém','αὐτῷ':'a ele'},
18:{'ὁ':'o','Θυατείροις':'Tiatira','φλόγα':'chama'},
19:{'τὰ':'as','ἔργα':'obras','σου':'tuas','τὰ':'as','ἔσχατα':'últimas','πλείονα':'mais numerosas'},
20:{'Ἰεζάβελ,':'Jezabel','ἡ':'a que','ἐμοὺς':'meus','φαγεῖν':'comer','πορνεῦσαι':'praticar imoralidade'},
21:{'αὐτῇ':'a ela','αὐτῆς.':'dela'},
22:{'αὐτὴν':'a ela','μετ’':'com','αὐτῆς':'dela','μεγάλην,':'grande'},
23:{'ἐγώ':'eu','εἰμι':'sou','ὑμῖν':'a vós','ὑμῶν.':'de vós'},
24:{'ὑμῖν':'a vós','Θυατείροις,':'Tiatira','οἵτινες':'os quais','οὐκ':'não','ἄλλο':'outro'},
25:{'ὃ':'o que','ἄχρι':'até'},
26:{'ὁ':'aquele que','αὐτῷ':'a ele','τέλους':'fim'},
27:{'αὐτοὺς':'as','τὰ':'os','συντρίβεται,':'são despedaçados'},
28:{'παρὰ':'de','πατρός':'Pai','αὐτῷ':'a ele'},
29:{'ἔχων':'tem','οὖς':'ouvidos','τί':'o que','ἀκουσάτω':'ouça','ἐκκλησίαις.':'igrejas'}
};
const arts={'ὁ':'o','ἡ':'a','οἱ':'os','αἱ':'as','τῷ':'ao','τῇ':'na/à','τῆς':'da','τοῦ':'do','τῶν':'dos/das','τοῖς':'aos','ταῖς':'às','τοὺς':'os','τὰς':'as','τὸν':'o','τὴν':'a','τὰ':'as','τὸ':'o'};
let reviewed=0;
for(let v=13;v<=29;v++){
 const f='src/data/texto-original/apocalipse/apocalipse-2-'+v+'.ts';
 const src=fs.readFileSync(f,'utf8'),m=src.match(/=\s*(\{[\s\S]*\})\s*as const;/);
 if(!m)throw Error('Arquivo de dados inválido: '+f);
 const obj=JSON.parse(m[1]);
 for(const w of obj.words){
   const newGloss=scoped[v]?.[w.greek]??surface[w.greek]??(w.lemma==='ὁ'?arts[w.greek]:undefined);
   if(newGloss){w.gloss=newGloss;reviewed++;}
   if(w.lemma==='σύ'&&w.morphologyCode.slice(4,6)==='GS')w.gloss='teu/de ti';
   if(w.lemma==='σύ'&&w.morphologyCode.slice(4,6)==='GP')w.gloss='de vós';
   if(w.lemma==='ἐγώ'&&w.morphologyCode.slice(4,6)==='GS')w.gloss='meu/de mim';
   if(w.lemma==='αὐτός'&&w.morphologyCode.slice(4,6)==='GS')w.gloss='dele/dela';
   if(w.lemma==='εἰμί'&&w.greek.startsWith('εἰσ'))w.gloss='são';
   if(w.lemma==='δίδωμι'&&w.greek.startsWith('δώσω'))w.gloss='darei';
   if(w.lemma==='γινώσκω'&&w.greek.startsWith('γνώσ'))w.gloss='saberão';
   if(w.lemma==='λέγω'&&w.greek==='λέγει')w.gloss='diz';
   if(w.lemma==='νικάω')w.gloss='vence';
   if(w.lemma==='ἀκούω'&&w.greek==='ἀκουσάτω')w.gloss='ouça';
   if(w.lemma==='ἑπτά')w.meanings='sete; numeral cardinal indeclinável (caso atribuído pelo contexto)';
   w.explanation=w.morphology+'. '+w.syntax.role+'. Glosa contextual «'+w.gloss+'»; a tradução integral e as notas documentam a construção.';
 }
 if(v===13){
  const antipas=obj.words.find(w=>w.lemma==='Ἀντιπᾶς');if(antipas)antipas.syntax.role='Nome próprio nominativo em construção de retomada após expressão temporal; estrutura sintaticamente abrupta';
 }
 if(v===17){
  for(const w of obj.words)if(w.lemma==='ψῆφος')w.explanation='Substantivo feminino acusativo singular (ψῆφον). Sinal material cuja interpretação como absolvição, ingresso ou hospitalidade é hipótese histórica, não equivalência lexical única.';
 }
 if(v===20){
  const f=obj.words.find(w=>w.greek==='ἀφεῖς');if(f)f.syntax.role='Núcleo verbal presente ativo indicativo, segunda pessoa singular; governa τὴν γυναῖκα Ἰεζάβελ';
 }
 if(v===27){
  const f=obj.words.find(w=>w.lemma==='συντρίβω');if(f)f.syntax.role='Presente médio/passivo indicativo, terceira pessoa singular; mantém-se a forma da edição crítica';
 }
 fs.writeFileSync(f,src.replace(m[1],JSON.stringify(obj,null,2)));
}
console.log('Glosas contextualizadas em Ap 2:13–29. Operações de revisão: '+reviewed);
