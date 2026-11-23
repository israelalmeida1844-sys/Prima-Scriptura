import fs from 'node:fs';
import path from 'node:path';
const root=process.env.MORPHGNT_DIR??'/tmp/prima-morphgnt', lemmaRoot=process.env.LEMMAS_DIR??'/tmp/prima-lemma-mappings';
const rows=fs.readFileSync(path.join(root,'87-Re-morphgnt.txt'),'utf8').split(/\r?\n/).filter(s=>/^2702(?:1[3-9]|2[0-9])\s/.test(s)).map(s=>s.trim().split(/\s+/));
const strong=new Map();let cur='';
for(const l of fs.readFileSync(path.join(lemmaRoot,'lexemes.yaml'),'utf8').split(/\r?\n/)){
 if(/^[^\s#].*:\s*$/.test(l))cur=l.slice(0,-1);
 else {const m=l.match(/^    strongs:\s*(\d+)/);if(m&&cur)strong.set(cur,'G'+m[1]);}
}
const dicText='ὁ|o; a; artigo;ἄγγελος|mensageiro; anjo;ἐν|em;Ἔφεσος|Éfeso;ἐκκλησία|assembleia; igreja;γράφω|escrever;ὅδε|isto; assim;λέγω|dizer;κρατέω|segurar firmemente;ἑπτά|sete;ἀστήρ|estrela;δεξιός|direita;αὐτός|dele; próprio;περιπατέω|andar;μέσος|meio;λυχνία|candelabro;χρυσοῦς|de ouro;οἶδα|conhecer;ἔργον|obra;σύ|tu; vós;καί|e;κόπος|trabalho fatigante;ὑπομονή|perseverança;ὅτι|que; porque;οὐ|não;δύναμαι|ser capaz;βαστάζω|suportar;κακός|mau;πειράζω|pôr à prova;ἑαυτοῦ|si mesmo;ἀπόστολος|apóstolo;εἰμί|ser; estar;εὑρίσκω|achar;ψευδής|falso;ἔχω|ter;διά|por causa de;ὄνομα|nome;ἐγώ|eu;κοπιάω|cansar-se;ἀλλά|mas;κατά|contra;ἀγάπη|amor;πρῶτος|primeiro;ἀφίημι|abandonar; deixar;μνημονεύω|lembrar-se;οὖν|portanto;πόθεν|de onde;πίπτω|cair;μετανοέω|arrepender-se;ποιέω|fazer;εἰ|se;δέ|porém;μή|não;ἔρχομαι|vir;κινέω|mover; remover;ἐκ|de;τόπος|lugar;ἐάν|se;οὗτος|este;μισέω|odiar;Νικολαΐτης|nicolaíta;ὅς|que;κἀγώ|eu também;οὖς|ouvido;ἀκούω|ouvir;τίς|que?; quem?;πνεῦμα|Espírito;νικάω|vencer;δίδωμι|dar;ἐσθίω|comer;ξύλον|árvore; madeira;ζωή|vida;παράδεισος|paraíso; jardim;θεός|Deus;Σμύρνα|Esmirna;ἔσχατος|último;γίνομαι|tornar-se;νεκρός|morto;ζάω|viver;θλῖψις|tribulação;πτωχεία|pobreza;πλούσιος|rico;βλασφημία|difamação; blasfêmia;Ἰουδαῖος|judeu;συναγωγή|sinagoga; reunião;Σατανᾶς|Satanás;μηδείς|nada; ninguém;φοβέομαι|temer;μέλλω|estar para;πάσχω|sofrer;ἰδού|eis;βάλλω|lançar;διάβολος|diabo;εἰς|para;φυλακή|prisão;ἵνα|para que;ἡμέρα|dia;δέκα|dez;πιστός|fiel;ἄχρι|até;θάνατος|morte;στέφανος|coroa de honra;ἀδικέω|prejudicar;δεύτερος|segundo;Πέργαμος|Pérgamo;ῥομφαία|espada longa;δίστομος|de dois gumes;ὀξύς|afiado';
const dictionary=new Map((dicText+';ποῦ|onde;κατοικέω|habitar; residir;ὅπου|onde;θρόνος|trono;ἀρνέομαι|negar; recusar;πίστις|fé; fidelidade;Ἀντιπᾶς|Antipas;μάρτυς|testemunha; mártir;ἀποκτείνω|matar; executar;παρά|junto de; entre;ὀλίγος|pouco; pequeno;ἐκεῖ|ali;διδαχή|ensino; doutrina;Βαλαάμ|Balaão;διδάσκω|ensinar;Βαλάκ|Balaque;σκάνδαλον|armadilha; tropeço;ἐνώπιον|diante de;υἱός|filho;Ἰσραήλ|Israel;εἰδωλόθυτον|alimento sacrificado a ídolos;πορνεύω|praticar imoralidade sexual;οὕτω(ς)|assim; desse modo;ὁμοίως|igualmente; da mesma maneira;ταχύ|rapidamente; em breve;πολεμέω|guerrear; combater;μετά|com; depois de;στόμα|boca;μάννα|maná;κρύπτω|esconder;ψῆφος|pedrinha; pedra de votação;λευκός|branco;ἐπί|sobre;καινός|novo; sem uso anterior;οὐδείς|ninguém;λαμβάνω|receber;Θυάτειρα|Tiatira;ὀφθαλμός|olho;ὡς|como;φλόξ|chama;πῦρ|fogo;πούς|pé;ὅμοιος|semelhante;χαλκολίβανον|metal brilhante de identificação incerta;διακονία|serviço; ministério;πολύς|muito; numeroso;γυνή|mulher; esposa;Ἰεζάβελ|Jezabel;προφῆτις|profetisa;πλανάω|enganar; desviar;ἐμός|meu;δοῦλος|servo; escravo;χρόνος|tempo;θέλω|querer; desejar;πορνεία|imoralidade sexual;κλίνη|leito; cama;μοιχεύω|adulterar;μέγας|grande;τέκνον|filho; descendente;γινώσκω|conhecer;πᾶς|todo;ἐραυνάω|investigar; sondar;νεφρός|rim; órgão interno;καρδία|coração;ἕκαστος|cada um;λοιπός|restante; outro;ὅσος|todos quantos;ὅστις|os quais;βαθύς|profundo;ἄλλος|outro;βάρος|peso; fardo;πλήν|contudo; somente;ἄν|partícula modal;ἥκω|chegar; vir;τηρέω|guardar; observar;τέλος|fim; cumprimento;ἐξουσία|autoridade; poder;ἔθνος|nação; povo;ποιμαίνω|apascentar; pastorear; governar;ῥάβδος|vara; cetro;σιδηροῦς|de ferro;σκεῦος|vaso; utensílio;κεραμικός|de cerâmica; barro cozido;συντρίβω|despedaçar; quebrar;πατήρ|pai;πρωϊνός|matutino; da manhã').split(';').map(s=>s.split('|')));
const texts=[
  "Sei onde habitas, onde está o trono de Satanás. Entretanto, conservas meu nome e não negaste minha fé, mesmo nos dias de Antipas, minha testemunha fiel, que foi morto entre vós, onde Satanás habita.",
  "Tenho, porém, algumas coisas contra ti: tens aí os que seguem o ensino de Balaão, que ensinava Balaque a colocar tropeço diante dos filhos de Israel, para comerem alimentos sacrificados a ídolos e praticarem imoralidade sexual.",
  "Assim também tens os que seguem o ensino dos nicolaítas, da mesma maneira.",
  "Arrepende-te, portanto! Do contrário, venho a ti sem demora e lutarei contra eles com a espada da minha boca.",
  "Quem tem ouvidos, ouça o que o Espírito diz às igrejas. Ao vencedor darei do maná escondido; também lhe darei uma pedrinha branca e, sobre a pedrinha, um nome novo escrito, que ninguém conhece, exceto quem o recebe.",
  "E ao anjo da igreja em Tiatira escreve: Assim diz o Filho de Deus, aquele que tem olhos como chama de fogo, e cujos pés são semelhantes a metal brilhante:",
  "Conheço tuas obras, teu amor, tua fé, teu serviço e tua perseverança, e sei que tuas últimas obras são mais numerosas que as primeiras.",
  "Tenho, porém, contra ti que toleras a mulher Jezabel, que se declara profetisa, ensina e desvia meus servos para que pratiquem imoralidade sexual e comam alimentos sacrificados aos ídolos.",
  "Dei-lhe tempo para arrepender-se, mas ela não quer arrepender-se de sua imoralidade sexual.",
  "Eis que a lanço em um leito, e aos que adulteram com ela, em grande tribulação, se não se arrependerem das obras dela.",
  "E matarei seus filhos com morte; todas as igrejas saberão que eu sou aquele que sonda rins e corações, e darei a cada um de vós segundo as vossas obras.",
  "A vós, porém, digo, aos demais de Tiatira, a todos os que não seguem esse ensino e que não conheceram as chamadas profundezas de Satanás: não vos imponho outro fardo.",
  "Contudo, conservai o que tendes até que eu venha.",
  "Ao vencedor, aquele que guardar até o fim as minhas obras, darei autoridade sobre as nações,",
  "e ele as pastoreará com cetro de ferro, como são despedaçados os vasos de cerâmica,",
  "assim como eu também recebi de meu Pai; e lhe darei a estrela da manhã.",
  "Quem tem ouvidos, ouça o que o Espírito diz às igrejas."
];
const notes=[
  "ὅπου ὁ θρόνος τοῦ Σατανᾶ descreve Pérgamo polemicamente; associações ao altar de Zeus ou ao culto imperial são hipóteses históricas concorrentes, não referências explicitadas no grego. Ἀντιπᾶς, ὁ μάρτυς μου, ὁ πιστός μου está no nominativo com aposições nominativas, embora o encadeamento após ἐν ταῖς ἡμέραις seja sintaticamente abrupto; não converter o nome para genitivo.",
  "διδαχὴν Βαλαάμ retoma Balaão (Nm 25:1–2; 31:16). σκάνδαλον denota armadilha ou ocasião de tropeço; φαγεῖν e πορνεῦσαι são infinitivos aoristos ativos que explicam a transgressão induzida. A forma de Βαλαάμ é indeclinável no uso grego.",
  "O SBLGNT conclui com ὁμοίως, advérbio 'igualmente', sem a adição ὃ μισῶ de edições do Textus Receptus. A formulação crítica mantém a comparação entre o ensino dos nicolaítas e o de Balaão; a tradução deve evitar ampliar o texto.",
  "μετανόησον é imperativo aoristo ativo, segunda pessoa singular. πολεμήσω está no futuro ativo indicativo, primeira pessoa singular; a guerra é contra os grupos indicados no contexto, representada pela espada que procede da boca de Cristo (1:16; 2:12).",
  "Três elementos articulam a promessa ao vencedor: τοῦ μάννα τοῦ κεκρυμμένου (genitivo partitivo do maná escondido); ψῆφον λευκήν (pedrinha branca, possivelmente sinal de absolvição, admissão ou identificação; interpretação incerta); ὄνομα καινὸν γεγραμμένον (novo nome escrito). Não apresentar um único simbolismo histórico como certeza textual.",
  "ὁ υἱὸς τοῦ θεοῦ é título cristológico explícito singular nesta formulação no Apocalipse. O texto apresenta ὡς φλόγα πυρός (como chama de fogo), e χαλκολιβάνῳ, termo metalúrgico raro que também ocorre em 1:15; não é hapax do Novo Testamento.",
  "πλείονα é comparativo acusativo neutro plural, relacionado a τὰ ἔργα, e τῶν πρώτων oferece o padrão comparativo genitivo; amor, fé, serviço e perseverança são qualidades elogiadas.",
  "ἀφεῖς é presente ativo indicativo de ἀφίημι, segunda pessoa singular na análise MorphGNT; o sentido contextual é 'toleras/permitas'. O nome Ἰεζάβελ evoca a rainha de 1Rs 16–21 e 2Rs 9, mas não prova que a pessoa citada seja chamada literalmente Jezabel; pode ser pseudônimo tipológico.",
  "ἔδωκα é aoristo ativo indicativo, primeira pessoa singular. A sequência ἵνα μετανοήσῃ e οὐ θέλει μετανοῆσαι distingue oportunidade concedida e recusa persistente.",
  "βάλλω αὐτὴν εἰς κλίνην: 'lanço-a em um leito'. O leito pode funcionar ironicamente como imagem de enfermidade/juízo contraposta ao adultério; o texto não identifica clinicamente qualquer doença. ἐὰν μή introduz condicional de arrependimento.",
  "ὁ ἐραυνῶν νεφροὺς καὶ καρδίας: 'aquele que sonda rins e corações'. A linguagem hebraica de interioridade e juízo ecoa Jr 11:20; 17:10 e Sl 7:9, sem exigir identidade verbal absoluta entre versões. ἀποκτενῶ ἐν θανάτῳ expressa sanção judicial em formulação enfática.",
  "τὰ βαθέα τοῦ Σατανᾶ, ὡς λέγουσιν: 'as profundezas de Satanás, como dizem'. Atribuir a frase a um sistema gnóstico historicamente constituído é anacrônico sem evidência específica. βάρος ('fardo') pode evocar At 15:28, mas o eco é intertextual possível, não citação formal.",
  "κρατήσατε é imperativo aoristo ativo, segunda pessoa plural. A expressão ἄχρι οὗ ἂν ἥξω relaciona a perseverança à chegada de Cristo.",
  "ὁ νικῶν e ὁ τηρῶν são particípios presentes ativos substantivados; ἄχρι τέλους estabelece continuidade até o fim. ἐξουσίαν ἐπὶ τῶν ἐθνῶν prepara a aplicação messiânica do Salmo 2.",
  "ποιμανεῖ, futuro ativo indicativo, terceira pessoa singular de ποιμαίνω, pode ter sentido de pastorear e governar. ἐν ῥάβδῳ σιδηρᾷ e vasos de barro evocam Sl 2:8–9. A forma συντρίβεται é presente médio/passivo indicativo singular; preservar a sua configuração real e discutir a combinação sintática, sem adaptar à forma esperada.",
  "τὸν ἀστέρα τὸν πρωϊνόν promete a estrela da manhã; Ap 22:16 identifica Jesus com a estrela resplandecente da manhã. Nm 24:17 é um possível antecedente messiânico. A promessa é escatológica; sua natureza exata merece interpretação contextual.",
  "Refrão conclusivo do ciclo da carta a Tiatira: ὁ ἔχων οὖς ἀκουσάτω τί τὸ πνεῦμα λέγει ταῖς ἐκκλησίαις. ἀκουσάτω é imperativo aoristo ativo de terceira pessoa singular."
];
const exe=[
  [
    "Pérgamo: fidelidade comunitária em ambiente de conflito religioso; o trono de Satanás é linguagem simbólica cujo referente histórico permanece debatido.",
    "Antipas recebe título de testemunha fiel; a construção gramatical é abrupta, e uma biografia histórica independente não deve ser inventada."
  ],
  [
    "A figura de Balaão funciona como modelo narrativo de indução à idolatria e imoralidade.",
    "O escândalo representa tropeço espiritual diante de Israel, com ecos do Pentateuco."
  ],
  [
    "Os nicolaítas são apresentados por proximidade com o modelo de Balaão, sem identificação histórica indiscutível.",
    "A leitura ὁμοίως deve ser mantida sem interpolação do TR."
  ],
  [
    "O chamado ao arrependimento antecede a ameaça de julgamento.",
    "A espada da boca é linguagem de conflito e autoridade, não incentivo a violência humana."
  ],
  [
    "O maná escondido, a pedra branca e o nome novo formam uma promessa composta.",
    "As interpretações judiciais e sociais para a pedra são propostas, não fatos demonstrados."
  ],
  [
    "A imagem de Cristo com olhos como fogo e pés brilhantes fundamenta a avaliação de Tiatira.",
    "O título Filho de Deus liga a carta à cristologia do Apocalipse."
  ],
  [
    "O elogio destaca progresso nas obras, em contraste com a acusação que segue.",
    "Fé e serviço coexistem com o problema de tolerância ao ensino descrito."
  ],
  [
    "Jezabel funciona como figura de ensino enganoso e sedução idólatra.",
    "A conexão com a rainha do Antigo Testamento é literária e teológica; sua historicidade local não é confirmada pelo nome."
  ],
  [
    "A oferta de tempo para arrependimento antecede a sentença.",
    "O texto distingue a oportunidade oferecida da resistência da personagem."
  ],
  [
    "O leito funciona como imagem de julgamento e possível ironia retórica.",
    "A responsabilidade dos participantes é tratada juntamente com a condição de arrependimento."
  ],
  [
    "O julgamento afirma o conhecimento divino da interioridade e das obras.",
    "Rins e coração representam dimensões da vida interior em linguagem semítica."
  ],
  [
    "Os demais em Tiatira são distinguidos do grupo identificado com o ensino desviado.",
    "A expressão profundezas de Satanás não demonstra por si um movimento gnóstico organizado."
  ],
  [
    "A fidelidade exigida é manter o que já foi recebido.",
    "A esperança da chegada de Cristo é fundamento da perseverança."
  ],
  [
    "A autoridade prometida ao vencedor participa da linguagem régia e messiânica.",
    "A obediência perseverante e as obras de Cristo aparecem ligadas."
  ],
  [
    "O governo com cetro de ferro dialoga diretamente com o Salmo 2.",
    "A metáfora de pastoreio e a imagem de vasos quebrados devem ser examinadas conjuntamente."
  ],
  [
    "A estrela da manhã constitui promessa de proximidade com o Cristo exaltado.",
    "Apocalipse 22:16 fornece um paralelo intratextual importante."
  ],
  [
    "A conclusão universaliza a exortação: todas as igrejas devem ouvir a mensagem do Espírito.",
    "O refrão encerra formalmente a comunicação a Tiatira."
  ]
];
const pos={'N-':'Substantivo','A-':'Adjetivo','V-':'Verbo','RA':'Artigo definido','RP':'Pronome pessoal','RR':'Pronome relativo','RD':'Pronome demonstrativo','RI':'Pronome interrogativo/indefinido','C-':'Conjunção','P-':'Preposição','D-':'Advérbio','X-':'Partícula','I-':'Interjeição'};
const cas={N:'nominativo',G:'genitivo',D:'dativo',A:'acusativo',V:'vocativo'},num={S:'singular',P:'plural'},gen={M:'masculino',F:'feminino',N:'neutro'};
const ten={P:'presente',I:'imperfeito',F:'futuro',A:'aoristo',X:'perfeito',Y:'mais-que-perfeito'},voi={A:'ativa',M:'média',P:'passiva'},mod={I:'indicativo',D:'imperativo',S:'subjuntivo',O:'optativo',N:'infinitivo',P:'particípio'};
const map={α:'a',β:'b',γ:'g',δ:'d',ε:'e',ζ:'z',η:'ē',θ:'th',ι:'i',κ:'k',λ:'l',μ:'m',ν:'n',ξ:'x',ο:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',φ:'ph',χ:'ch',ψ:'ps',ω:'ō'};
function translit(s){const c=[...s.normalize('NFD').matchAll(/([Α-Ωα-ω])([\u0300-\u036f]*)/g)].map(a=>({v:a[1].toLowerCase(),capital:a[1]!==a[1].toLowerCase(),marks:a[2]}));let out='';for(let i=0;i<c.length;i++){const x=c[i],pr=c[i-1],nx=c[i+1];let z=map[x.v]??'';if(x.v==='γ'&&nx&&'γκχξ'.includes(nx.v))z='n';if(x.v==='υ'&&pr&&'αεηο'.includes(pr.v)&&!x.marks.includes('\u0308'))z='u';if(x.marks.includes('\u0314')){if(i===1&&pr&&'αεηοωυ'.includes(pr.v))out='h'+out;else z='h'+z;}if(x.capital)z=z[0].toUpperCase()+z.slice(1);out+=z;}return out;}
function desc(p,c){if(p==='V-'){const base='Verbo no '+(ten[c[1]]??'tempo não especificado')+', voz '+(voi[c[2]]??'não especificada')+', '+(mod[c[3]]??'modo não especificado');return base+(c[3]==='P'?' '+[cas[c[4]],num[c[5]],gen[c[6]]].filter(Boolean).join(' '):c[3]==='N'?'':', '+c[0]+'ª pessoa '+(num[c[5]]??''));}return [pos[p]??'Classe não mapeada',cas[c[4]],num[c[5]],gen[c[6]]].filter(Boolean).join(' ');}
const existing=new Set();for(const file of ['apocalipse-1-1.json','apocalipse-1-2.json','apocalipse-1-3-8.json','apocalipse-1-9-20.json','apocalipse-2-1-12.json'])for(const id of Object.keys(JSON.parse(fs.readFileSync('src/data/lexico-grego/'+file,'utf8')).entries))existing.add(id);
const template=fs.readFileSync('src/components/TextoOriginalApocalipse2v12.astro','utf8');
const lex={version:'1.0.0',scope:'Apocalipse 2:13–29',source:'SBLGNT / MorphGNT 6.12 aaed91e5 / jtauber Greek lemma mappings',editorialStatus:'Rascunho; acepções preliminares dependem de revisão lexical independente',entries:{}};
const issues=[];let n=0;
for(let v=13;v<=29;v++){
 const tokens=rows.filter(x=>Number(x[0].slice(4,6))===v);
 const words=tokens.map((t,i)=>{
  const [loc,p,c,surface,raw,norm,lemma]=t;const st=strong.get(lemma),meaning=dictionary.get(lemma);if(!st||!meaning)issues.push({v,lemma,st,meaning});
  const greek=surface.replace(/[⸀⸂⸃⸄⸅]/g,''),gloss=(meaning??'a revisar').split(';')[0].trim();
  const short=p==='V-'?('V-'+c.slice(1,4)+(c[3]==='P'?'-'+c.slice(4,7):c[3]==='N'?'':'-'+c[0]+c[5])):(({'N-':'N','A-':'Adj','RA':'Art','RP':'PPro','RR':'Rel','RD':'Dem','RI':'Ind'}[p]??p.replace('-',''))+'-'+(c==='--------'?'':c.slice(4,7)));
  const role=p==='V-'?(c[3]==='P'?'Particípio em construção sintática':c[3]==='N'?'Infinitivo integrante da construção':'Núcleo verbal'):p==='RA'?'Determinante nominal':p==='N-'?'Núcleo nominal':p==='P-'?'Introduz complemento preposicional':p==='C-'?'Conector da oração':'Elemento discursivo';
  return {id:'ap2-'+v+'-'+(i+1),shortMorph:short,greek,transliteration:translit(greek),gloss,strong:st,lemma,lemmaTransliteration:translit(lemma),partOfSpeech:pos[p]??'Classificação em revisão',morphologyCode:c,morphology:desc(p,c),meanings:meaning??'em revisão',explanation:desc(p,c)+'. '+role+'. A glosa de apoio «'+gloss+'» requer interpretação no contexto.',occurrencesExamples:['Ap 2:'+v],syntax:{role,clauseId:'AP.2.'+v+'.C1',governedBy:null},morphgntPos:p};
 });
 const override={1:{'Τῷ':'Ao','τῆς':'da','κρατῶν':'segura','περιπατῶν':'anda'},2:{'Οἶδα':'conheço','δύνῃ':'podes','βαστάσαι':'suportar','ἐπείρασας':'puseste à prova','εὗρες':'achaste'},3:{'κεκοπίακες':'te cansaste','ἐβάστασας':'suportaste'},4:{'ἀφῆκες.':'abandonaste'},5:{'πέπτωκας,':'caíste','μετανόησον':'arrepende-te','κινήσω':'removerei'},7:{'αὐτῷ':'a ele','νικῶντι':'vence','φαγεῖν':'comer'},8:{'ἔζησεν·':'reviveu'},9:{'πλούσιος':'rico','εἶ,':'és'},10:{'φοβοῦ':'temas','γίνου':'sê','ἕξετε':'tereis','πάσχειν.':'sofrer'},11:{'ἀδικηθῇ':'sofrerá dano'},12:{'ἔχων':'tem','ὀξεῖαν·':'afiada'}};
 for(const w of words){if(override[v]?.[w.greek])w.gloss=override[v][w.greek];if(w.lemma==='ὁ'){const a={'τῆς':'da','τῷ':'ao','τοῦ':'do','τῶν':'dos/das','ταῖς':'às','τὴν':'a','τὰς':'as','τοὺς':'os'};if(a[w.greek])w.gloss=a[w.greek];}if(w.lemma==='ἑπτά')w.meanings='sete: numeral indeclinável; caso anotado conforme o contexto';}
 if(v===7)for(const w of words){if(w.greek==='αὐτῷ')w.syntax.role='Retomada pronominal do dativo τῷ νικῶντι';if(w.lemma==='νικάω')w.syntax.role='Particípio articular dativo singular masculino, tópico da promessa';}
 if(v===11)for(const w of words)if(w.lemma==='ἀδικέω')w.syntax.role='Subjuntivo aoristo passivo 3ª pessoa singular após οὐ μή';
 const obj={reference:'Apocalipse 2:'+v,book:'Apocalipse',chapter:2,verse:v,source:'SBL Greek New Testament (Holmes 2010) via MorphGNT 6.12',morphologySource:'MorphGNT 6.12; commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',translation:texts[v-13],translationNote:'Tradução editorial própria; distinguir glossas isoladas de construção sintática completa.',textualNotes:notes[v-13],exegeticalNotes:exe[v-13],words};
 const pathName='src/data/texto-original/apocalipse/apocalipse-2-'+v+'.ts';fs.writeFileSync(pathName,'/** Prima Scriptura · Ap 2:'+v+' · SBLGNT / MorphGNT 6.12 */\nexport const apocalipse2v'+v+' = '+JSON.stringify(obj,null,2)+' as const;\n');
 for(let i=0;i<words.length;i++){const w=words[i],st=w.strong;if(existing.has(st)||lex.entries[st])continue;lex.entries[st]={strong:st,lemma:w.lemma,lemmaTransliteration:w.lemmaTransliteration,partOfSpeech:w.partOfSpeech,senses:[{id:st+'-1',label:w.gloss,definition:w.meanings,examples:[{reference:'Apocalipse 2:'+v,greek:words.slice(Math.max(0,i-1),Math.min(words.length,i+2)).map(x=>x.greek).join(' '),translation:w.gloss,explanation:'Exemplo da ocorrência de '+w.lemma+' no contexto; nuance exegética depende da sintaxe.'}]}]};}
 let c=template.replaceAll('apocalipse2v12','apocalipse2v'+v).replaceAll('apocalipse-2-12','apocalipse-2-'+v).replaceAll('ap2-12-','ap2-'+v+'-').replaceAll('Apocalipse 2:12','Apocalipse 2:'+v).replaceAll('data-original-apocalipse-2-12','data-original-apocalipse-2-'+v).replace('<span class="verse-num-badge" aria-hidden="true">12</span>','<span class="verse-num-badge" aria-hidden="true">'+v+'</span>').replaceAll('apocalipse-2-1-12.json','apocalipse-2-13-29.json');
 fs.writeFileSync('src/components/TextoOriginalApocalipse2v'+v+'.astro',c);n+=words.length;
}
fs.writeFileSync('src/data/lexico-grego/apocalipse-2-13-29.json',JSON.stringify(lex,null,2)+'\n');
const audit={sourceCommit:'aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',verses:17,tokenCount:n,newLexemes:Object.keys(lex.entries).length,issues};
fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-2-13-29-auditoria.json',JSON.stringify(audit,null,2)+'\n');
if(issues.length)throw Error('Dados não mapeados: '+JSON.stringify(issues));console.log(JSON.stringify(audit,null,2));
