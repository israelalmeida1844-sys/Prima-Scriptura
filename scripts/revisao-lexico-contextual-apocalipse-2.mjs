/** Revisão filológica de verbetes anteriormente genéricos de Apocalipse 2.
 * Preserva os identificadores Strong, lemas e exemplos; não altera o texto grego.
 * Definições dizem o que a forma faz neste contexto, sem alegar exaustividade lexical.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const explanations={
  "G3592": "O demonstrativo neutro plural Τάδε introduz solenemente o oráculo: «estas coisas diz». Não é advérbio por classe morfológica.",
  "G1492": "Οἶδα é forma de perfeito com sentido presente de conhecimento: «conheço». Não inferir necessariamente aquisição recente de informação.",
  "G2041": "ἔργα, plural de ἔργον, designa ações/obras efetivas da comunidade, avaliadas no contexto da mensagem de Cristo.",
  "G3754": "ὅτι pode introduzir conteúdo ou causa; em Ap 2:2 marca uma proposição subordinada ao conhecimento expresso por Οἶδα.",
  "G3756": "οὐ é negação objetiva do predicado verbal; em οὐ δύνῃ nega a possibilidade de tolerar os maus.",
  "G1410": "δύνῃ é forma presente médio/passiva de δύναμαι, verbo de sentido modal; βαστάσαι é seu infinitivo complementar.",
  "G2556": "κακούς, adjetivo acusativo plural substantivado, designa pessoas qualificadas como más; não qualifica diretamente as obras.",
  "G3985": "ἐπείρασας é aoristo ativo indicativo: submeteste a exame os que reivindicavam ser apóstolos, não tentaste induzi-los ao mal.",
  "G1438": "ἑαυτούς é reflexivo acusativo plural correferente ao sujeito de λέγοντας: eles se apresentam a si mesmos como apóstolos.",
  "G652": "ἀποστόλους ocorre como predicativo acusativo de ἑαυτούς; o texto examina uma reivindicação de autoridade apostólica.",
  "G2147": "εὗρες está no aoristo ativo indicativo: o resultado da prova é reconhecer aqueles indivíduos como ψευδεῖς.",
  "G3686": "ὄνομα designa nome e, neste contexto, compromisso com a identidade e autoridade de Cristo, conforme a frase διὰ τὸ ὄνομά μου.",
  "G235": "ἀλλά introduz contraste com o elogio antecedente; em Ap 2:4 inicia a censura dirigida à igreja.",
  "G2596": "κατά com genitivo em ἔχω κατὰ σοῦ expressa oposição ou queixa «tenho contra ti»; não localidade.",
  "G26": "ἀγάπη denota amor; τὴν πρώτην especifica o amor anterior abandonado, sem definir sozinho todos os seus objetos.",
  "G4159": "πόθεν é advérbio interrogativo de origem «de onde»; com πέπτωκας caracteriza figuradamente a condição da qual a igreja caiu.",
  "G1487": "εἰ introduz condição; εἰ δὲ μή formula a alternativa negativa «caso contrário». Não equiparar mecanicamente a ἐάν.",
  "G2795": "κινήσω é futuro ativo de κινέω: moverei/removerei o candelabro de seu lugar; a imagem é julgamento da comunidade.",
  "G5117": "τόπος no genitivo τοῦ τόπου refere-se ao lugar ocupado pelo candelabro, complemento de ἐκ.",
  "G1437": "ἐάν introduz oração condicional prospectiva; com μή e subjuntivo μετανοήσῃς: «se não te arrependeres».",
  "G3404": "μισεῖς é presente ativo: a igreja rejeita as práticas dos nicolaítas; objeto expresso é τὰ ἔργα, não as pessoas.",
  "G2504": "κἀγώ contrai καὶ ἐγώ («e eu também»), ligando a posição de Cristo à rejeição das obras mencionadas.",
  "G3775": "οὖς é acusativo singular de «ouvido» em fórmula idiomática: quem tem ouvido deve ouvir; evitar pluralização automática da forma grega.",
  "G5101": "τί introduz uma interrogativa indireta «o que» o Espírito comunica; não é substantivo lexical autônomo.",
  "G2068": "φαγεῖν é infinitivo aoristo ativo de ἐσθίω e complementa δώσω; o alimento prometido provém da árvore da vida.",
  "G2222": "ζωή está em genitivo, τῆς ζωῆς, qualificando a árvore; a expressão ecoa o Éden e a promessa escatológica.",
  "G4145": "πλούσιος εἶ predica riqueza da comunidade apesar de πτωχεία; riqueza é caracterizada pelo contraste teológico do versículo.",
  "G2453": "Ἰουδαίους é acusativo plural como predicativo de ἑαυτούς; trata-se de controvérsia local, não de definição depreciativa do judaísmo.",
  "G4864": "συναγωγή significa reunião/assembleia e pode denotar comunidade judaica; a expressão polêmica exige leitura histórica localizada.",
  "G4567": "Σατανᾶς é designação pessoal do adversário; o genitivo τοῦ Σατανᾶ qualifica polemicamente a assembleia mencionada.",
  "G3367": "μηδέν é acusativo neutro singular de μηδείς com sentido adverbial: «não temas coisa alguma», objeto de φοβοῦ.",
  "G3958": "πάσχειν é infinitivo presente dependente de μέλλεις, projetando sofrimento futuro sem especificar todas as circunstâncias.",
  "G906": "βάλλειν é infinitivo presente dependente de μέλλει; com εἰς φυλακήν indica lançar na prisão.",
  "G1228": "διάβολος ocorre com artigo como sujeito de μέλλει βάλλειν; corresponde ao acusador/adversário na representação do texto.",
  "G5438": "φυλακή é acusativo de direção após εἰς; neste contexto significa prisão/confinamento, não «vigília».",
  "G2443": "ἵνα com subjuntivo πειρασθῆτε indica finalidade da provação: «para que sejais postos à prova».",
  "G1176": "δέκα é numeral indeclinável determinando ἡμερῶν no genitivo plural; a expressão não fixa cronologia histórica por si.",
  "G891": "ἄχρι com genitivo θανάτου marca limite ou extensão «até a morte»; a fidelidade é exigida mesmo diante da morte.",
  "G4226": "ποῦ introduz pergunta indireta de lugar dependente de Οἶδα: «sei onde habitas».",
  "G2730": "κατοικεῖς é presente ativo segunda pessoa singular, verbo de habitar/residir; localiza a comunidade no ambiente descrito.",
  "G3699": "ὅπου introduz oração relativa locativa «onde»; associa a localidade à imagem do trono de Satanás.",
  "G720": "ἠρνήσω é aoristo médio segunda pessoa singular de ἀρνέομαι; com negação expressa fidelidade sem renúncia à fé.",
  "G4102": "πίστις pode significar fé ou fidelidade conforme o contexto; τὴν πίστιν μου admite discussão entre confiança em Cristo e lealdade a ele.",
  "G615": "ἀπεκτάνθη é aoristo passivo: Antipas «foi morto», sem que o verbo identifique os responsáveis históricos.",
  "G3844": "παρά com dativo ὑμῖν indica proximidade/localidade «entre vós», não movimento de origem.",
  "G3641": "ὀλίγα é adjetivo neutro plural substantivado, objeto de ἔχω: «algumas coisas» contra a comunidade.",
  "G1563": "ἐκεῖ é advérbio de localização e retoma Pérgamo, onde há seguidores da doutrina descrita.",
  "G1322": "διδαχήν é acusativo singular, objeto de κρατοῦντας: aderir ao ensino de Balaão. Não confundir ensino com pessoa.",
  "G903": "Βαλαάμ é nome próprio indeclinável no texto grego; o genitivo sem marca formal especifica a doutrina vinculada a ele.",
  "G1321": "ἐδίδασκεν é imperfeito ativo «ensinava», cuja ação tem como objeto a instrução de Balaque.",
  "G904": "Βαλὰκ é nome próprio indeclinável, dativo por função sintática sob o artigo τῷ; destinatário do ensinamento.",
  "G2474": "Ἰσραήλ é nome próprio indeclinável; genitivo por função em τῶν υἱῶν Ἰσραήλ, filhos de Israel.",
  "G3779": "οὕτως é advérbio de modo; vincula os seguidores dos nicolaítas à comparação anterior.",
  "G3668": "ὁμοίως é advérbio «da mesma maneira», reforçando a comparação e não exigindo palavras adicionais do Textus Receptus.",
  "G5035": "ταχύ funciona adverbialmente «sem demora/rapidamente» com a vinda anunciada; a precisão temporal não está fixada.",
  "G4170": "πολεμήσω é futuro ativo primeira pessoa singular: o sujeito Cristo combaterá os destinatários plurais αὐτῶν.",
  "G2928": "κεκρυμμένου é particípio perfeito médio/passivo genitivo singular, atributivo de μάννα, alimento «escondido».",
  "G3762": "οὐδείς é pronome negativo «ninguém» e sujeito de οἶδεν, salvo a exceção εἰ μή.",
  "G2983": "λαμβάνων é particípio presente ativo substantivado, sujeito da exceção «aquele que recebe» a pedrinha/nome.",
  "G1248": "διακονία designa serviço/ministério; no acusativo é item do elogio às qualidades de Tiatira.",
  "G1135": "γυνή indica mulher ou esposa; τὴν γυναῖκα introduz a personagem Jezabel como objeto de ἀφεῖς.",
  "G4398": "προφῆτιν é acusativo feminino singular, predicativo de ἑαυτήν após λέγουσα: «dizendo-se profetisa».",
  "G4105": "πλανᾷ é presente ativo terceira pessoa singular: desvia/engana os servos, associado ao ensino condenado.",
  "G1699": "ἐμούς é possessivo acusativo masculino plural concordando com δούλους: «meus servos», na perspectiva do locutor.",
  "G5550": "χρόνον é acusativo singular, objeto de ἔδωκα: período concedido para arrependimento, não medida cronológica especificada.",
  "G2309": "θέλει é presente ativo terceira pessoa singular: recusa expressa por οὐ θέλει μετανοῆσαι, não incapacidade.",
  "G4202": "πορνεία designa imoralidade sexual; contexto de idolatria pode envolver linguagem figurada, mas isso demanda argumento.",
  "G3431": "μοιχεύοντας é particípio presente ativo acusativo plural substantivado, referente aos que adulteram com ela.",
  "G5043": "τέκνα, neutro plural de τέκνον, pode indicar filhos/descendentes ou seguidores em uso figurado; contexto é necessário.",
  "G1097": "γνώσονται é futuro médio de γινώσκω: «saberão/conhecerão», relacionado ao reconhecimento do juízo divino.",
  "G2045": "ἐραυνῶν é particípio presente ativo substantivado: «aquele que sonda» a interioridade representada por rins e corações.",
  "G1538": "ἑκάστῳ é dativo singular distributivo «a cada um», combinando-se com ὑμῖν na promessa de retribuição individual.",
  "G3062": "λοιποῖς é adjetivo substantivado dativo plural: «aos restantes», distinto do grupo criticado.",
  "G243": "ἄλλο é adjetivo acusativo neutro singular que modifica βάρος: «outro fardo».",
  "G4133": "πλήν atua como partícula adversativa/restritiva: «contudo/somente», introduzindo a exortação seguinte.",
  "G302": "ἄν é partícula modal combinada com ἄχρι οὗ e subjuntivo ἥξω na delimitação futura «até que eu venha».",
  "G2240": "ἥξω é aoristo subjuntivo primeira pessoa singular de ἥκω em ἄχρι οὗ ἄν, projetando a chegada de Cristo.",
  "G5056": "τέλους é genitivo singular após ἄχρι: «até o fim», limite da perseverança ordenada.",
  "G1849": "ἐξουσίαν é acusativo singular, objeto de δώσω; significa autoridade delegada sobre as nações.",
  "G1484": "ἐθνῶν é genitivo plural de ἔθνος após ἐπί, denotando os povos/nações sob a autoridade prometida.",
  "G4632": "σκεύη é neutro plural de σκεῦος, vasos/objetos; é sujeito de συντρίβεται, forma verbal singular permitida com neutro plural."
};
const files=['src/data/lexico-grego/apocalipse-2-1-12.json','src/data/lexico-grego/apocalipse-2-13-29.json'];
let updated=0;
for(const file of files){
 const data=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const [strong,entry] of Object.entries(data.entries)){
  const comment=explanations[strong];
  if(!comment)continue;
  for(const sense of entry.senses??[]){
   const generic=(sense.examples??[]).some(ex=>/Exemplo da ocorrência|nuance exegética depende da sintaxe/.test(ex.explanation??''));
   if(!generic)continue;
   sense.definition=comment;
   for(const ex of sense.examples??[])if(/Exemplo da ocorrência|nuance exegética depende da sintaxe/.test(ex.explanation??''))ex.explanation=comment;
   updated++;
  }
 }
 data.editorialStatus='Revisão contextual complementar de exemplos anteriormente genéricos; definição lexical exaustiva e aparato crítico especializado ainda sujeitos a cotejo acadêmico.';
 fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
}
assert.equal(updated,81,'O catálogo de verbetes genéricos mudou; reauditar antes de prosseguir');
for(const file of files){
 const data=JSON.parse(fs.readFileSync(file,'utf8'));
 const left=Object.values(data.entries).flatMap(e=>e.senses??[]).flatMap(s=>s.examples??[]).filter(x=>/Exemplo da ocorrência|nuance exegética depende da sintaxe/.test(x.explanation??''));
 assert.equal(left.length,0,'Há exemplos genéricos não tratados: '+file);
}
console.log('81 verbetes com explicações individualizadas e nenhuma explicação-modelo restante nos dois léxicos de Apocalipse 2.');
