import fs from 'node:fs';
import path from 'node:path';
/* Ap 3:1–6: edição de trabalho SBLGNT/MorphGNT 6.12 */
const source=process.env.MORPHGNT_DIR||'/tmp/prima-morphgnt', mappings=process.env.LEMMAS_DIR||'/tmp/prima-lemma-mappings';
const rows=fs.readFileSync(path.join(source,'87-Re-morphgnt.txt'),'utf8').split(/\r?\n/).filter(x=>/^2703(?:0[1-9]|1[0-9]|2[0-2])\s/.test(x)).map(x=>x.trim().split(/\s+/));
const strongs=new Map();let lemma='';
for(const line of fs.readFileSync(path.join(mappings,'lexemes.yaml'),'utf8').split(/\r?\n/)){
 if(/^[^\s#].*:\s*$/.test(line))lemma=line.slice(0,-1);
 else {const m=line.match(/^    strongs:\s*(\d+)/);if(m&&lemma)strongs.set(lemma,'G'+m[1]);}
}
strongs.set('ζηλεύω','G2206'); // Equivalência editorial com ζηλόω: BLB MGNT, Ap 3:19.
const prior={};for(const n of ['apocalipse-1-1','apocalipse-1-2','apocalipse-1-3-8','apocalipse-1-9-20','apocalipse-2-1-12','apocalipse-2-13-29'])Object.assign(prior,JSON.parse(fs.readFileSync('src/data/lexico-grego/'+n+'.json','utf8')).entries);
const oldByLemma=new Map(Object.values(prior).map(e=>[e.lemma,e]));
const translations=[
  "Ao anjo da igreja em Sardes escreve: Assim diz aquele que tem os sete espíritos de Deus e as sete estrelas: Conheço tuas obras. Tens reputação de viver, mas estás morto.",
  "Sê vigilante e fortalece o que resta e estava prestes a morrer, pois não encontrei tuas obras completas diante de meu Deus.",
  "Lembra-te, portanto, de como recebeste e ouviste; guarda isso e arrepende-te. Se não vigiares, virei como ladrão, e de modo algum saberás em que hora virei sobre ti.",
  "Mas tens uns poucos em Sardes, pessoas que não contaminaram suas vestes; elas andarão comigo de branco, porque são dignas.",
  "Assim, o vencedor será vestido com vestes brancas; de modo algum apagarei seu nome do livro da vida e confessarei seu nome diante de meu Pai e diante de seus anjos.",
  "Quem tem ouvido, ouça o que o Espírito diz às igrejas.",
  "Ao anjo da igreja em Filadélfia escreve: Assim diz o Santo, o Verdadeiro, aquele que tem a chave de Davi, que abre e ninguém fechará, que fecha e ninguém abre:",
  "Conheço tuas obras. Eis que coloquei diante de ti uma porta aberta, que ninguém pode fechar, porque tens pouca força, guardaste minha palavra e não negaste meu nome.",
  "Eis que darei alguns da sinagoga de Satanás — daqueles que dizem ser judeus e não são, mas mentem. Farei que venham e se prostrem diante de teus pés, e reconheçam que eu te amei.",
  "Porque guardaste a palavra de minha perseverança, também eu te guardarei da hora da provação que está para vir sobre todo o mundo habitado, para pôr à prova os que habitam sobre a terra.",
  "Venho sem demora. Conserva o que tens, para que ninguém tome tua coroa.",
  "Ao vencedor farei coluna no templo do meu Deus, e ele jamais sairá de lá. Escreverei sobre ele o nome do meu Deus e o nome da cidade do meu Deus, a nova Jerusalém, que desce do céu da parte do meu Deus, e também meu novo nome.",
  "Quem tem ouvido, ouça o que o Espírito diz às igrejas.",
  "Ao anjo da igreja em Laodiceia escreve: Assim diz o Amém, a testemunha fiel e verdadeira, o princípio da criação de Deus:",
  "Conheço tuas obras: não és frio nem quente. Quem dera fosses frio ou quente!",
  "Assim, porque és morno e não és quente nem frio, estou para vomitar-te da minha boca.",
  "Porque dizes: Sou rico, enriqueci e não necessito de nada; e não sabes que és o infeliz, miserável, pobre, cego e nu,",
  "aconselho-te a comprar de mim ouro refinado pelo fogo, para te tornares rico, e vestes brancas para te vestires, para que não seja exposta a vergonha de tua nudez, e colírio para ungir teus olhos, a fim de que vejas.",
  "Eu repreendo e disciplino a todos quantos amo. Portanto, sê zeloso e arrepende-te.",
  "Eis que estou à porta e bato. Se alguém ouvir minha voz e abrir a porta, entrarei para estar com ele e cearei com ele, e ele comigo.",
  "Ao vencedor concederei sentar-se comigo em meu trono, assim como eu também venci e me sentei com meu Pai no trono dele.",
  "Quem tem ouvido, ouça o que o Espírito diz às igrejas."
];
const notes=[
  "Τάδε: acusativo neutro plural da fórmula de proclamação; ὁ ἔχων: particípio presente substantivado; Οἶδα: perfeito com valor presente; ὄνομα ἔχεις ὅτι ζῇς contrasta com νεκρὸς εἶ.\n\nExegese: Nome/reputação não é o sentido obrigatório de ὄνομα em todo contexto; a antítese aqui fundamenta a tradução. Os «sete espíritos» devem ser comparados com Ap 1:4; 4:5; 5:6.\n\nCrítica textual: Nenhuma das 22 unidades de variação comparadas pelo aparato SBLGNT está marcada em 3:1; isso NÃO prova ausência de variantes manuscritas. A alegação anterior de τὸ ὄνομα em TR necessita cotejo específico antes de ser publicada.",
  "γίνου γρηγορῶν combina imperativo e particípio: «torna-te vigilante/permanece vigilante». στήρισον é imperativo aoristo. τὰ λοιπά é neutro plural; ἔμελλον é plural imperfeito e ἀποθανεῖν infinitivo.\n\nExegese: A passagem exige distinguir «restante» de «outras pessoas» sem impor referente fechado. πεπληρωμένα é particípio perfeito passivo predicativo das obras, descrevendo sua insuficiência perante Deus.\n\nCrítica textual: SBLGNT: ἔμελλον ἀποθανεῖν (WH, Treg, NIV) contra ἔμελλες ἀποβάλλειν (RP); presença de τὰ em Treg/NIV/RP e ausência em WH. O aparato compara edições, não lista testemunhos individuais.",
  "πῶς refere-se a «como» ou ao modo de receber; εἴληφας é perfeito, ἤκουσας aoristo, τήρει imperativo presente, μετανόησον aoristo. οὐ μή com γνῷς indica negação enfática.\n\nExegese: A visita «como ladrão» comunica surpresa e necessidade de vigilância; não fixa data escatológica nem deve ser convertida automaticamente em invasão militar local.\n\nCrítica textual: SBLGNT ἥξω sem acréscimo ἐπί σε nessa posição (contra RP); γνῷς WH/NIV/RP contra γνώσῃ Treg. Distinguir a variante da segunda ocorrência de ἥξω ἐπὶ σέ.",
  "ὀλίγα ὀνόματα designa pessoas por metonímia. ἃ é relativo neutro plural, combinando formalmente com «nomes», embora o referente seja humano; οὐκ ἐμόλυναν é aoristo.\n\nExegese: A imagem das vestes brancas deve ser comparada com 3:5; 6:11; 7:9,13–14; 19:8. Não inferir impecabilidade absoluta a partir da metáfora.\n\nCrítica textual: SBLGNT ἔχεις ὀλίγα (WH/Treg/NIV), contra ordem ὀλίγα ἔχεις (RP).",
  "ὁ νικῶν é particípio presente substantivado. οὐ μὴ ἐξαλείψω exprime negação enfática; a forma ἐξαλείψω merece discussão morfológica pela identidade formal possível entre futuro indicativo e aoristo subjuntivo 1ª singular. ὁμολογήσω é futuro.\n\nExegese: A afirmação de que o nome não será apagado é promessa positiva. Não deduzir somente dela solução definitiva de controvérsias soteriológicas. «Livro da vida»: Ap 13:8; 17:8; 20:12,15; 21:27.\n\nCrítica textual: SBLGNT οὕτως (WH/Treg/NIV) em contraste com οὗτος (RP); não harmonizar adverbial e demonstrativo.",
  "ὁ ἔχων é sujeito do imperativo de terceira pessoa ἀκουσάτω; τί introduz interrogativa indireta («o que»), τὸ πνεῦμα é sujeito de λέγει; ταῖς ἐκκλησίαις dativo de destinatário.\n\nExegese: O plural «igrejas» generaliza a exortação, embora a mensagem local se dirija à comunidade de Sardes.\n\nCrítica textual: Não há unidade de variação registrada neste verso no aparato resumido consultado; não equivale a unanimidade manuscrita.",
  "ὁ ἅγιος, ὁ ἀληθινός e ὁ ἔχων são designações substantivadas coordenadas. τὴν κλεῖν Δαυίδ é objeto de ἔχων; ὁ ἀνοίγων e κλείων descrevem autoridade.\n\nExegese: A chave de Davi evoca Isaías 22:22; interpretar tipologicamente a autoridade de Cristo sem identificar automaticamente cada abertura com atividade missionária.\n\nCrítica textual: SBLGNT Δαυίδ sem artigo τοῦ (RP); καὶ κλείων em lugar de expansão RP; ἀνοίγει presente em contraste com ἀνοίξει futuro RP. Registar todas as três unidades.",
  "δέδωκα é perfeito ativo, «tenho colocado/dado». θύραν ἠνεῳγμένην é acusativo com particípio perfeito passivo modificador; relativa ἣν ... αὐτήν contém retomada pronominal. μικρὰν ἔχεις δύναμιν é construção de grau limitado.\n\nExegese: A porta aberta pode representar acesso ou oportunidade; definir precisamente depende do conjunto de imagens e da alusão de 3:7. Não converter a pouca força em pouca fé.\n\nCrítica textual: O aparato resumido do SBLGNT não sinaliza unidade de variação neste versículo.",
  "ἰδοὺ διδῶ introduz ação ou promessa presente. ποιήσω ... ἵνα ἥξουσιν ... apresenta verbo indicativo futuro depois de ἵνα, construção irregular que deve ser preservada no texto crítico. προσκυνέω exige exame semântico contextual.\n\nExegese: A linguagem polêmica refere-se a adversários do contexto, jamais autoriza hostilidade genérica contra judeus. Os ecos de Isaías 45:14; 49:23; 60:14 são pertinentes e demandam comparação.\n\nCrítica textual: SBLGNT διδῶ (WH/Treg/NIV) contra δίδωμι (RP); ἥξουσιν καὶ προσκυνήσουσιν (indicativos) contra ἥξωσιν καὶ προσκυνήσωσιν (subjuntivos) RP; ἐγώ presente no SBLGNT, ausente em RP.",
  "ἐτήρησας ... τηρήσω forma paralelismo lexical; ἐκ τῆς ὥρας marca separação da hora da provação, mas sua implicação escatológica não é decidida somente pela preposição. τῆς μελλούσης ἔρχεσθαι modifica ὥρας.\n\nExegese: A interpretação historicista adventista e leituras futuristas, preteristas ou idealistas devem distinguir argumentos contextuais e hipóteses de cumprimento. οἰκουμένη é mundo habitado, não necessariamente todo o planeta em acepção geográfica moderna.\n\nCrítica textual: Sem unidade assinalada no aparato SBLGNT resumido; citar edições críticas para discussões maiores.",
  "ἔρχομαι ταχύ é presente com advérbio de prontidão; κράτει é imperativo presente ativo 2ª singular; ἵνα μηδεὶς λάβῃ apresenta subjuntivo aoristo em cláusula de finalidade.\n\nExegese: στέφανος designa coroa de honra/vitória e não deve ser confundido com διάδημα; a exortação concentra-se na perseverança.\n\nCrítica textual: Nenhuma variante destacada no resumo do aparato consultado.",
  "ὁ νικῶν topicaliza o destinatário; ποιήσω αὐτὸν στῦλον contém objeto e predicativo. οὐ μὴ ἐξέλθῃ ἔτι é negação enfática; τῆς καινῆς Ἰερουσαλήμ qualifica a cidade. A repetição «meu Deus» estrutura a promessa.\n\nExegese: A coluna é metáfora de estabilidade e pertença. A Nova Jerusalém descendo de Deus deve ser estudada com Ap 21:2,10; não inferir um templo material eterno, pois Ap 21:22 informa ausência de templo na cidade.\n\nCrítica textual: SBLGNT ἡ καταβαίνουσα (particípio, WH/Treg/NIV), RP καταβαίνει (verbo finito).",
  "O mesmo padrão ὁ ἔχων ... ἀκουσάτω ... τί ... λέγει ... ταῖς ἐκκλησίαις mantém a responsabilidade de ouvir.\n\nExegese: A ordem das mensagens não permite restringir o refrão somente à comunidade nomeada.\n\nCrítica textual: Não há variante de aparato resumido marcada.",
  "ὁ Ἀμήν funciona como título; ὁ μάρτυς ὁ πιστός ... ἀληθινός retoma 1:5. ἡ ἀρχὴ τῆς κτίσεως τοῦ θεοῦ contém genitivo; ἀρχή abrange início, origem e primazia, com escolha exegética dependente do contexto.\n\nExegese: Não afirmar que o texto diz literalmente «primeira criatura» nem excluir a priori debates cristológicos históricos. Comparar Jo 1:1–3; Cl 1:15–18; Ap 21:6; 22:13 para avaliação intertextual.\n\nCrítica textual: SBLGNT καὶ ἀληθινός (Treg/NIV/RP) sem segundo artigo, WH acrescenta ὁ; aparatos mais amplos exigem colação específica.",
  "οὔτε ... οὔτε coordena dois qualificativos negados; ὄφελον introduz desejo contrafactual com ἦς («quem dera fosses»). ψυχρός e ζεστός são adjetivos predicativos.\n\nExegese: A reconstrução das águas regionais é hipótese histórico-arqueológica, não o significado lexical necessário das imagens. A lógica retórica é de desaprovação da mornidão.\n\nCrítica textual: Nenhuma unidade do aparato SBLGNT resumido marcada em 3:15.",
  "χλιαρός é predicativo de εἶ; μέλλω + ἐμέσαι (infinitivo aoristo) exprime ação anunciada como iminente, «estou para vomitar». Evitar transformar automaticamente o aspecto verbal em calendário.\n\nExegese: A imagem comunica rejeição da condição comunitária; não é descrição clínica de náusea. A série de temperaturas deve ser lida como metáfora contextual.\n\nCrítica textual: SBLGNT οὔτε ζεστός contra RP οὐ ζεστός, diferença na coordenação negativa.",
  "πεπλούτηκα é perfeito ativo com estado resultante: «enriqueci/estou enriquecido»; οὐδὲν χρείαν ἔχω é construção idiomática de falta de necessidade. σὺ εἶ ὁ ταλαίπωρος enfatiza contraste de perspectiva.\n\nExegese: A autopercepção de prosperidade contrasta com pobreza, cegueira e nudez espirituais. A análise deve diferenciar prosperidade material de julgamento teológico sem generalização simplista.\n\nCrítica textual: Presença do segundo ὅτι no SBLGNT (WH/Treg/NIV), ausente RP; οὐδὲν (ac.) contra οὐδενός (gen.) RP; acréscimo de ὁ antes de ἐλεεινός no RP.",
  "συμβουλεύω + infinitivo ἀγοράσαι rege a orientação; χρυσίον πεπυρωμένον é ouro refinado pelo fogo; κολλούριον ... ἐγχρῖσαι exprime aplicação do colírio. As cláusulas ἵνα definem finalidade.\n\nExegese: A interpretação de bens locais (riqueza bancária, indústria têxtil e medicina) requer comprovação arqueológica e histórica. Os símbolos são coerentes com a denúncia de 3:17.\n\nCrítica textual: SBLGNT παρ’ ἐμοῦ χρυσίον (contra inversão RP); ἐγχρῖσαι infinitivo (contra ἵνα ἐγχρίσῃ RP).",
  "φιλῶ é presente ativo: «amo»; ἐλέγχω «repreendo/exponho» e παιδεύω «educo/disciplino» são ações distintas. ζήλευε presente imperativo e μετανόησον aoristo imperativo articulam continuidade e decisão.\n\nExegese: A repreensão é contextualizada pelo amor declarado e não deve ser reduzida a condenação sem possibilidade de arrependimento. Comparar Pv 3:11–12 e Hb 12:5–6.\n\nCrítica textual: SBLGNT ζήλευε (WH/Treg/NIV) contra ζήλωσον (RP), distinção de aspecto imperativo.",
  "ἕστηκα é perfeito ativo de ἵστημι com sentido estativo: «estou de pé»; κρούω é presente: «bato». ἐάν ... ἀκούσῃ ... ἀνοίξῃ estabelece condição; δειπνήσω é futuro.\n\nExegese: O convite retórico à comunhão de mesa é dirigido inicialmente ao âmbito de uma comunidade cristã; a aplicação evangelística a indivíduos é possível, mas secundária em relação ao endereço literário.\n\nCrítica textual: SBLGNT inclui καὶ antes de εἰσελεύσομαι (NIV/RP), ausente em WH/Treg, conforme aparato comparativo.",
  "ὁ νικῶν substantiva o particípio. δώσω ... καθίσαι expressa concessão de sentar-se; ὡς κἀγὼ ἐνίκησα καὶ ἐκάθισα estabelece paralelo entre vitória do Cristo e promessa ao vencedor.\n\nExegese: O trono prometido pertence ao imaginário régio e escatológico de Apocalipse; estudar com 4–5 e 20–22. Não pressupor relação de igualdade ontológica com o Pai por causa da metáfora de participação.\n\nCrítica textual: Sem unidade destacada no aparato comparativo consultado.",
  "ὁ ἔχων: particípio substantivado; ἀκουσάτω: imperativo aoristo 3ª singular; τί: interrogativa indireta; ταῖς ἐκκλησίαις: dativo plural.\n\nExegese: Conclui o ciclo das sete cartas. A forma plural das igrejas estabelece alcance mais amplo das mensagens.\n\nCrítica textual: Não consta variante assinalada no aparato comparativo SBLGNT consultado."
];
const gloss={ὅδε:'estas coisas',γρηγορέω:'vigia',στηρίζω:'fortalece',ἀποθνῄσκω:'morrer',μνημονεύω:'lembra-te',μολύνω:'contaminar',ἱμάτιον:'vestes',περιβάλλω:'vestir',ἐξαλείφω:'apagar',ὁμολογέω:'confessar',κλέπτης:'ladrão',Σάρδεις:'Sardes',ὄνομα:'nome',ἔργον:'obras',ζάω:'viver',νεκρός:'morto',ἄξιος:'digno',λευκός:'branco',πνεῦμα:'Espírito',ἄγγελος:'anjo',ἐκκλησία:'igreja'};
Object.assign(gloss,{
  "γρηγορέω": "vigiar",
  "στηρίζω": "fortalecer",
  "ἀποθνῄσκω": "morrer",
  "πληρόω": "completar",
  "πῶς": "como",
  "κλέπτης": "ladrão",
  "ποῖος": "qual",
  "ὥρα": "hora",
  "μολύνω": "contaminar",
  "ἱμάτιον": "veste",
  "ἄξιος": "digno",
  "περιβάλλω": "vestir",
  "ἐξαλείφω": "apagar",
  "βίβλος": "livro",
  "ὁμολογέω": "confessar",
  "ἅγιος": "santo",
  "ἀληθινός": "verdadeiro",
  "Δαυίδ": "Davi",
  "ἀνοίγω": "abrir",
  "κλείω": "fechar",
  "θύρα": "porta",
  "μικρός": "pequeno",
  "ψεύδομαι": "mentir",
  "προσκυνέω": "prostrar-se",
  "πειρασμός": "provação",
  "οἰκουμένη": "mundo habitado",
  "ὅλος": "todo",
  "στῦλος": "coluna",
  "ναός": "santuário",
  "ἔξω": "fora",
  "ἐξέρχομαι": "sair",
  "ἔτι": "ainda",
  "πόλις": "cidade",
  "Ἰερουσαλήμ": "Jerusalém",
  "καταβαίνω": "descer",
  "οὐρανός": "céu",
  "ἀρχή": "princípio; origem",
  "κτίσις": "criação",
  "οὔτε": "nem",
  "ψυχρός": "frio",
  "ζεστός": "quente",
  "ὄφελον": "quem dera",
  "ἤ": "ou",
  "χλιαρός": "morno",
  "ἐμέω": "vomitar",
  "πλουτέω": "enriquecer",
  "χρεία": "necessidade",
  "ταλαίπωρος": "infeliz",
  "ἐλεεινός": "miserável",
  "πτωχός": "pobre",
  "τυφλός": "cego",
  "γυμνός": "nu",
  "συμβουλεύω": "aconselhar",
  "ἀγοράζω": "comprar",
  "χρυσίον": "ouro",
  "φανερόω": "manifestar",
  "αἰσχύνη": "vergonha",
  "γυμνότης": "nudez",
  "κολλούριον": "colírio",
  "ἐγχρίω": "ungir; aplicar",
  "φιλέω": "amar",
  "ἐλέγχω": "repreender",
  "παιδεύω": "disciplinar",
  "ζηλεύω": "ser zeloso",
  "ἵστημι": "estar de pé",
  "κρούω": "bater",
  "τις": "alguém",
  "εἰσέρχομαι": "entrar",
  "δειπνέω": "cear",
  "καθίζω": "sentar-se"
});
const chars={α:'a',β:'b',γ:'g',δ:'d',ε:'e',ζ:'z',η:'ē',θ:'th',ι:'i',κ:'k',λ:'l',μ:'m',ν:'n',ξ:'x',ο:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',φ:'ph',χ:'ch',ψ:'ps',ω:'ō'};
function tr(s){return [...s.normalize('NFD')].filter(c=>!/[̀-ͯ]/.test(c)).map(c=>{let x=chars[c.toLowerCase()]||'';return c!==c.toLowerCase()?x.charAt(0).toUpperCase()+x.slice(1):x}).join('');}
const pos={'N-':'Substantivo','A-':'Adjetivo','V-':'Verbo',RA:'Artigo definido',RP:'Pronome',RR:'Pronome relativo',RD:'Demonstrativo',RI:'Pronome', 'P-':'Preposição','C-':'Conjunção','D-':'Advérbio','X-':'Partícula'};
const ca={N:'nominativo',G:'genitivo',D:'dativo',A:'acusativo'},nu={S:'singular',P:'plural'},ge={M:'masculino',F:'feminino',N:'neutro'},te={P:'presente',I:'imperfeito',F:'futuro',A:'aoristo',X:'perfeito'},vo={A:'ativa',M:'média',P:'passiva'},mo={I:'indicativo',D:'imperativo',S:'subjuntivo',P:'particípio',N:'infinitivo'};
function morph(p,c){if(p==='V-')return 'Verbo '+(te[c[1]]||'tempo a revisar')+', voz '+(vo[c[2]]||'a revisar')+', '+(mo[c[3]]||'modo a revisar')+(c[3]==='P'?' '+[ca[c[4]],nu[c[5]],ge[c[6]]].filter(Boolean).join(' '):c[3]==='N'?'':', '+c[0]+'ª pessoa '+(nu[c[5]]||''));return (pos[p]||'classe a revisar')+' '+[ca[c[4]],nu[c[5]],ge[c[6]]].filter(Boolean).join(' ');}
const lex={version:'1.0',scope:'Apocalipse 3:1–22',source:'SBLGNT/MorphGNT 6.12',editorialStatus:'Rascunho filológico; sem aprovação lexical exaustiva.',entries:{...prior}};
const problems=[];let count=0;
for(let v=1;v<=22;v++){
 const tokens=rows.filter(x=>Number(x[0].slice(4,6))===v);if(!tokens.length)problems.push('Versículo '+v+' vazio');
 const words=tokens.map((t,i)=>{const [loc,p,c,surface,raw,norm,l]=t,id=strongs.get(l);if(!id)problems.push('Strong ausente '+l+' 3:'+v);const greek=surface.replace(/[⸀⸂⸃⸄⸅]/g,''),g=gloss[l]||oldByLemma.get(l)?.senses?.[0]?.label||l;const role=p==='V-'?(c[3]==='P'?'Particípio':'Predicado verbal'):p==='RA'?'Determinante nominal':p==='N-'?'Núcleo nominal':'Função a revisar';return {id:'ap3-'+v+'-'+(i+1),shortMorph:p+' '+c,greek,transliteration:tr(greek),gloss:g,strong:id||'PENDENTE',lemma:l,lemmaTransliteration:tr(l),partOfSpeech:pos[p]||'Em revisão',morphologyCode:c,morphology:morph(p,c),meanings:oldByLemma.get(l)?.senses?.[0]?.definition||g,explanation:'Forma «'+greek+'» do lema «'+l+'» (Strong '+(id||'PENDENTE')+'): '+morph(p,c)+'. Glosa contextual de apoio: «'+g+'». '+role+'. '+notes[v-1],occurrencesExamples:['Ap 3:'+v],syntax:{role,clauseId:'AP.3.'+v+'.C1',governedBy:null},morphgntPos:p};});
 const obj={reference:'Apocalipse 3:'+v,book:'Apocalipse',chapter:3,verse:v,source:'SBLGNT/MorphGNT 6.12',morphologySource:'MorphGNT commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',translation:translations[v-1],translationNote:'Tradução contextual distinta do interlinear.',textualNotes:notes[v-1],exegeticalNotes:[notes[v-1]],words};
 fs.mkdirSync('src/data/texto-original/apocalipse',{recursive:true});fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-3-'+v+'.ts','/** SBLGNT · Apocalipse 3:'+v+' · Rascunho */\nexport const apocalipse3v'+v+' = '+JSON.stringify(obj,null,2)+' as const;\n');
 for(let i=0;i<words.length;i++){const w=words[i];if(lex.entries[w.strong])continue;lex.entries[w.strong]={strong:w.strong,lemma:w.lemma,lemmaTransliteration:w.lemmaTransliteration,partOfSpeech:w.partOfSpeech,senses:[{id:w.strong+'-1',label:w.gloss,definition:'Acepção a cotejar em léxico crítico.',examples:[{reference:'Apocalipse 3:'+v,greek:words.slice(Math.max(0,i-1),i+2).map(z=>z.greek).join(' '),translation:w.gloss,explanation:'Glosa editorial preliminar.'}]}]};}
 count+=words.length;
}
if(problems.length)throw Error(JSON.stringify(problems)); if(count!==525)throw Error('Esperados 525 tokens no texto SBLGNT; encontrados '+count);
fs.writeFileSync('src/data/lexico-grego/apocalipse-3-1-22.json',JSON.stringify(lex,null,2)+'\n');
const template=fs.readFileSync('src/components/TextoOriginalApocalipse2v29.astro','utf8');
for(let v=1;v<=22;v++)fs.writeFileSync('src/components/TextoOriginalApocalipse3v'+v+'.astro',template.replaceAll('apocalipse2v29','apocalipse3v'+v).replaceAll('apocalipse-2-29','apocalipse-3-'+v).replaceAll('Apocalipse 2:29','Apocalipse 3:'+v).replaceAll('data-original-apocalipse-2-29','data-original-apocalipse-3-'+v).replace('<span class="verse-num-badge" aria-hidden="true">29</span>','<span class="verse-num-badge" aria-hidden="true">'+v+'</span>').replaceAll('apocalipse-2-13-29.json','apocalipse-3-1-22.json'));
let route=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-2/[versiculo].astro','utf8');
const imports=Array.from({length:22},(_,i)=>"import TextoOriginalApocalipse3v"+(i+1)+" from '../../../../components/TextoOriginalApocalipse3v"+(i+1)+".astro';").join('\n');
route=route.replace(/import TextoOriginalApocalipse2v1[\s\S]*?import TextoOriginalApocalipse2v29 from [^\n]+\n/,imports+'\n').replace(/const components = \[[^\]]+\];/,'const components = ['+Array.from({length:22},(_,i)=>'TextoOriginalApocalipse3v'+(i+1)).join(', ')+'];').replaceAll('capitulo-2','capitulo-3').replaceAll('Apocalipse 2','Apocalipse 3').replace('length: 29','length: 22').replaceAll('length:29','length:22').replaceAll('number < 29','number < 22').replaceAll('capítulo 2','capítulo 3').replaceAll('number < 22','number < 22').replaceAll('Conclusão do capítulo 2 · Capítulo 3 em breve','Conclusão de Apocalipse 3');
fs.mkdirSync('src/pages/comentarios/apocalipse/capitulo-3',{recursive:true});fs.writeFileSync('src/pages/comentarios/apocalipse/capitulo-3/[versiculo].astro',route);
let ch=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-2/index.astro','utf8');
const items=[
  "Apocalipse 3:1",
  "Apocalipse 3:2",
  "Apocalipse 3:3",
  "Apocalipse 3:4",
  "Apocalipse 3:5",
  "Apocalipse 3:6",
  "Apocalipse 3:7",
  "Apocalipse 3:8",
  "Apocalipse 3:9",
  "Apocalipse 3:10",
  "Apocalipse 3:11",
  "Apocalipse 3:12",
  "Apocalipse 3:13",
  "Apocalipse 3:14",
  "Apocalipse 3:15",
  "Apocalipse 3:16",
  "Apocalipse 3:17",
  "Apocalipse 3:18",
  "Apocalipse 3:19",
  "Apocalipse 3:20",
  "Apocalipse 3:21",
  "Apocalipse 3:22"
].map((title,i)=>({number:i+1,title,description:'Texto grego · rascunho em avaliação.'}));
ch=ch.replace(/const availableVerses = \[[\s\S]*?\];/,'const availableVerses = '+JSON.stringify(items)+';').replaceAll('capitulo-2','capitulo-3').replaceAll('Apocalipse 2','Apocalipse 3').replaceAll('Capítulo 2','Capítulo 3').replaceAll('CAPÍTULO 02','CAPÍTULO 03').replaceAll('22 de 22','22 de 22').replaceAll('Éfeso, Esmirna, Pérgamo e Tiatira','Sardes, Filadélfia e Laodiceia').replaceAll('22 versículos','22 versículos').replaceAll('capítulo 2 completo','Sardes, Filadélfia e Laodiceia em rascunho').replaceAll('APOCALIPSE 1:', 'APOCALIPSE 3:');
fs.writeFileSync('src/pages/comentarios/apocalipse/capitulo-3/index.astro',ch);
fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-3-1-22-auditoria.json',JSON.stringify({scope:'Apocalipse 3:1–22',source:'MorphGNT 6.12',verses:22,tokens:count,problems,academicApproval:false},null,2)+'\n');
console.log(JSON.stringify({verses:22,tokens:count,lexiconEntries:Object.keys(lex.entries).length}));
