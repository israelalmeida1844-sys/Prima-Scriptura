/**
 * Revisão contextual de verbetes gregos essenciais de Apocalipse 2:13–29.
 * A seleção opera apenas em novas entradas; lemas existentes são
 * preservados nos dicionários dos capítulos anteriores.
 */
import fs from 'node:fs';
const file='src/data/lexico-grego/apocalipse-2-13-29.json';
const obj=JSON.parse(fs.readFileSync(file,'utf8'));
const notes={
G2362:['trono, assento de autoridade','θρόνος designa assento de soberania ou autoridade. Em Ap 2:13, a expressão «trono de Satanás» descreve simbolicamente o ambiente religioso-político de Pérgamo.','A identificação específica com o altar de Zeus ou o culto imperial é hipótese histórica, não equivalência lexical.'],
G3144:['testemunha; em contextos posteriores, mártir','μάρτυς significa testemunha. Em Ap 2:13, Antipas é chamado testemunha fiel e o texto registra sua morte, favorecendo a associação ao martírio.','Distinguir o sentido básico de testemunha da extensão semântica de mártir.'],
G4625:['armadilha; objeto de tropeço','σκάνδαλον indica armadilha ou obstáculo que leva à queda. Em Ap 2:14 designa a indução de Israel à idolatria e à imoralidade.','Não equiparar o termo à simples ofensa subjetiva do português contemporâneo.'],
G1494:['alimento sacrificado a ídolos','εἰδωλόθυτον qualifica alimento associado a sacrifícios pagãos. Em Ap 2:14, descreve prática vinculada ao ensino de Balaão.','O significado e a avaliação da prática dependem de seu cenário idolátrico, não apenas de dieta.'],
G4203:['praticar imoralidade sexual','πορνεύω denota relações sexuais ilícitas na ética judaico-cristã antiga; no Apocalipse pode ainda integrar imagens de infidelidade religiosa.','Distinguir dimensão moral e simbolismo profético sem reduzir o vocábulo a um único valor em todas as passagens.'],
G3131:['maná, alimento concedido por Deus','μάννα nomeia o alimento provido no deserto. Em Ap 2:17, o maná escondido constitui promessa ao vencedor.','A conexão com Êxodo é sólida; o referente escatológico preciso exige argumentação interpretativa.'],
G5586:['pedrinha, seixo, pedra usada como ficha','ψῆφος designa pequena pedra ou ficha utilizada em diferentes práticas antigas. Em Ap 2:17 aparece como pedra branca concedida ao vencedor.','Absolvição jurídica, entrada em banquete e hospitalidade são interpretações possíveis, não uma identificação arqueológica comprovada.'],
G2537:['novo, qualitativamente novo','καινός pode designar novidade de caráter, estado ou condição. Em Ap 2:17 modifica ὄνομα, o novo nome inscrito na pedra.','Evitar contrastar mecanicamente καινός com νέος sem avaliar contextos de uso.'],
G2764:['cerâmico, feito de barro cozido','κεραμικός descreve objetos de cerâmica. Em Ap 2:27 qualifica os vasos comparados à fragilidade diante do governo messiânico.','O contraste com a vara de ferro procede da imagem do Salmo 2.'],
G3510:['rim, órgão interno; em imagens, afetos íntimos','νεφρός designa os rins; em linguagem hebraica, os órgãos internos podem simbolizar as dimensões profundas da vida humana.','Em Ap 2:23 a coordenação com καρδίας descreve a capacidade divina de examinar o interior.'],
G2588:['coração; centro interior da pessoa','καρδία pode denotar coração físico ou o centro de pensamentos, desejos e decisões. Em Ap 2:23 participa da linguagem bíblica de conhecimento divino.','Não reduzir a expressão a sentimentos em oposição exclusiva à razão.'],
G901:['profundo; de grande profundidade','βαθύς significa profundo. Em Ap 2:24, τὰ βαθέα substantivado integra o título ou afirmação polêmica «profundezas de Satanás».','Não pressupor automaticamente a existência de movimento gnóstico desenvolvido.'],
G4464:['vara, bastão; cetro','ῥάβδος designa vara, cajado ou cetro, conforme contexto. Em Ap 2:27, a vara de ferro é imagem régia derivada do Salmo 2.','A dureza da vara é expressa pelo adjetivo σιδηρᾷ, não pelo substantivo isoladamente.'],
G4603:['de ferro','σιδηροῦς é adjetivo referente a ferro; em Ap 2:27 a forma σιδηρᾷ concorda com ῥάβδῳ no dativo singular feminino.','A força do símbolo é textual, não descrição literal de tecnologia militar.'],
G4407:['matutino, da manhã','πρωϊνός é adjetivo relacionado à manhã. Em Ap 2:28 qualifica ἀστέρα, estrela da manhã.','A identificação de Cristo em Ap 22:16 constitui paralelo interno interpretativo.'],
G4165:['apascentar; conduzir; governar','ποιμαίνω significa pastorear e, figuradamente, reger como pastor. Em Ap 2:27 é linguagem régia messiânica relacionada ao Salmo 2.','A forma ποιμανεῖ é futuro ativo indicativo de terceira pessoa singular.'],
G4937:['despedaçar, quebrar completamente','συντρίβω expressa romper ou despedaçar. Em Ap 2:27 a forma συντρίβεται é presente médio/passivo indicativo singular no MorphGNT.','Preservar a peculiaridade sintática da comparação em vez de reescrever o grego.'],
G922:['peso, fardo, carga','βάρος designa peso ou carga, inclusive em sentido figurado. Em Ap 2:24 Cristo afirma não impor outro fardo.','A possível evocação de At 15:28 é intertextual e não comprova dependência literária direta.'],
G493:['Antipas, nome próprio masculino','Ἀντιπᾶς é nome pessoal masculino. Em Ap 2:13 encontra-se no nominativo, seguido dos apostos ὁ μάρτυς μου, ὁ πιστός μου.','A construção mostra nominativo em lugar onde se poderia esperar relação genitiva; não alterar caso para harmonizar.'],
G2403:['Jezabel, nome próprio feminino','Ἰεζάβελ é o nome da rainha do relato dos Reis, usado em Ap 2:20 para caracterizar uma figura associada a falsa profecia e sedução.','A identificação como apelido tipológico é provável, mas não demonstrável de modo definitivo.'],
G2825:['leito, cama, lugar de repouso','κλίνη significa leito ou cama. Em Ap 2:22, torna-se imagem de julgamento, possivelmente com ironia em relação à infidelidade.','Não inferir uma doença concreta nem uma punição médica específica somente do substantivo.']
};
let changed=0,missing=[];
for(const [strong,[label,definition,explanation]] of Object.entries(notes)){
 const e=obj.entries[strong];if(!e){missing.push(strong);continue;}
 if(!Array.isArray(e.senses)||!e.senses[0])continue;
 e.senses[0].label=label;e.senses[0].definition=definition;
 for(const ex of e.senses[0].examples)ex.explanation=explanation;
 changed++;
}
obj.editorialStatus='Rascunho acadêmico: verbetes novos centrais revisados; ainda requer cotejo integral com léxicos críticos e aparato textual.';
fs.writeFileSync(file,JSON.stringify(obj,null,2)+'\n');
console.log(JSON.stringify({reviewed:changed,existingEntriesNotDuplicated:missing},null,2));
