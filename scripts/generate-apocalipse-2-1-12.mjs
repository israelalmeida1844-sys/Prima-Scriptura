import fs from 'node:fs';
import path from 'node:path';
const root=process.env.MORPHGNT_DIR??'/tmp/prima-morphgnt', lemmaRoot=process.env.LEMMAS_DIR??'/tmp/prima-lemma-mappings';
const rows=fs.readFileSync(path.join(root,'87-Re-morphgnt.txt'),'utf8').split(/\r?\n/).filter(s=>/^2702(?:0[1-9]|1[0-2])\s/.test(s)).map(s=>s.trim().split(/\s+/));
const strong=new Map();let cur='';
for(const l of fs.readFileSync(path.join(lemmaRoot,'lexemes.yaml'),'utf8').split(/\r?\n/)){
 if(/^[^\s#].*:\s*$/.test(l))cur=l.slice(0,-1);
 else {const m=l.match(/^    strongs:\s*(\d+)/);if(m&&cur)strong.set(cur,'G'+m[1]);}
}
const dicText='ὁ|o; a; artigo;ἄγγελος|mensageiro; anjo;ἐν|em;Ἔφεσος|Éfeso;ἐκκλησία|assembleia; igreja;γράφω|escrever;ὅδε|isto; assim;λέγω|dizer;κρατέω|segurar firmemente;ἑπτά|sete;ἀστήρ|estrela;δεξιός|direita;αὐτός|dele; próprio;περιπατέω|andar;μέσος|meio;λυχνία|candelabro;χρυσοῦς|de ouro;οἶδα|conhecer;ἔργον|obra;σύ|tu; vós;καί|e;κόπος|trabalho fatigante;ὑπομονή|perseverança;ὅτι|que; porque;οὐ|não;δύναμαι|ser capaz;βαστάζω|suportar;κακός|mau;πειράζω|pôr à prova;ἑαυτοῦ|si mesmo;ἀπόστολος|apóstolo;εἰμί|ser; estar;εὑρίσκω|achar;ψευδής|falso;ἔχω|ter;διά|por causa de;ὄνομα|nome;ἐγώ|eu;κοπιάω|cansar-se;ἀλλά|mas;κατά|contra;ἀγάπη|amor;πρῶτος|primeiro;ἀφίημι|abandonar; deixar;μνημονεύω|lembrar-se;οὖν|portanto;πόθεν|de onde;πίπτω|cair;μετανοέω|arrepender-se;ποιέω|fazer;εἰ|se;δέ|porém;μή|não;ἔρχομαι|vir;κινέω|mover; remover;ἐκ|de;τόπος|lugar;ἐάν|se;οὗτος|este;μισέω|odiar;Νικολαΐτης|nicolaíta;ὅς|que;κἀγώ|eu também;οὖς|ouvido;ἀκούω|ouvir;τίς|que?; quem?;πνεῦμα|Espírito;νικάω|vencer;δίδωμι|dar;ἐσθίω|comer;ξύλον|árvore; madeira;ζωή|vida;παράδεισος|paraíso; jardim;θεός|Deus;Σμύρνα|Esmirna;ἔσχατος|último;γίνομαι|tornar-se;νεκρός|morto;ζάω|viver;θλῖψις|tribulação;πτωχεία|pobreza;πλούσιος|rico;βλασφημία|difamação; blasfêmia;Ἰουδαῖος|judeu;συναγωγή|sinagoga; reunião;Σατανᾶς|Satanás;μηδείς|nada; ninguém;φοβέομαι|temer;μέλλω|estar para;πάσχω|sofrer;ἰδού|eis;βάλλω|lançar;διάβολος|diabo;εἰς|para;φυλακή|prisão;ἵνα|para que;ἡμέρα|dia;δέκα|dez;πιστός|fiel;ἄχρι|até;θάνατος|morte;στέφανος|coroa de honra;ἀδικέω|prejudicar;δεύτερος|segundo;Πέργαμος|Pérgamo;ῥομφαία|espada longa;δίστομος|de dois gumes;ὀξύς|afiado';
const dictionary=new Map(dicText.split(';').map(s=>s.split('|')));
const texts=[
'Ao anjo da igreja em Éfeso escreve: Assim diz aquele que segura firmemente as sete estrelas em sua mão direita, aquele que anda entre os sete candelabros de ouro:',
'Conheço as tuas obras, o teu trabalho e a tua perseverança; não podes suportar os maus e puseste à prova aqueles que se dizem apóstolos, mas não são, e os achaste falsos.',
'Tens perseverança, suportaste por causa do meu nome e não te cansaste.',
'Tenho, porém, contra ti que abandonaste o teu primeiro amor.',
'Lembra-te, portanto, de onde caíste; arrepende-te e pratica as primeiras obras. Caso contrário, venho a ti e removerei o teu candelabro de seu lugar, se não te arrependeres.',
'Tens, porém, isto a teu favor: odeias as obras dos nicolaítas, que eu também odeio.',
'Quem tem ouvidos, ouça o que o Espírito diz às igrejas. Ao vencedor darei de comer da árvore da vida que está no paraíso de Deus.',
'Ao anjo da igreja em Esmirna escreve: Assim diz o Primeiro e o Último, que esteve morto e voltou a viver:',
'Conheço a tua tribulação e pobreza — mas és rico — e a difamação daqueles que se dizem judeus e não são, mas são sinagoga de Satanás.',
'Não temas o que estás para sofrer. Eis que o diabo lançará alguns de vós na prisão, para que sejais provados, e tereis tribulação por dez dias. Sê fiel até a morte, e dar-te-ei a coroa da vida.',
'Quem tem ouvidos, ouça o que o Espírito diz às igrejas. O vencedor de modo algum sofrerá dano da segunda morte.',
'Ao anjo da igreja em Pérgamo escreve: Assim diz aquele que tem a espada longa de dois gumes, afiada:'
];
const notes=[
'O SBLGNT lê Τῷ ἀγγέλῳ τῆς ἐν Ἐφέσῳ ἐκκλησίας, com τῆς no genitivo feminino singular. Outras tradições, incluindo o Textus Receptus, apresentam designação étnica da igreja. κρατῶν e περιπατῶν são particípios presentes ativos nominativos masculinos singulares.',
'οὐ δύνῃ βαστάσαι κακούς combina verbo deponente δύναμαι (presente médio/passivo indicativo 2ª pessoa singular) e infinitivo aoristo ativo βαστάσαι. A perícope discute o exame de reivindicações de apostolado.',
'O SBLGNT lê καὶ οὐ κεκοπίακες (perfeito ativo indicativo, 2ª pessoa singular) em contraste com a forma aorista ἐκοπίασας em tradições do Textus Receptus. A diferença entre perfeito e aoristo merece anotação sem harmonização.',
'ἀφῆκες é aoristo ativo indicativo, 2ª pessoa singular de ἀφίημι; τὴν ἀγάπην σου τὴν πρώτην caracteriza o amor inicial abandonado, em construção atributiva repetida.',
'πέπτωκας é perfeito ativo indicativo de πίπτω (queda com resultado presente). μετανοήσῃς é subjuntivo aoristo ativo em condição com ἐὰν μή.',
'Νικολαϊτῶν é genitivo plural do nome grupal Νικολαΐτης. Identificar diretamente os nicolaítas com os seguidores de Balaão (2:14–15) é inferência interpretativa e não identificação histórica comprovada pela etimologia.',
'τῷ νικῶντι δώσω αὐτῷ apresenta dativo topicalizado retomado pelo pronome dativo. A árvore da vida estabelece alusão ao Éden (Gn 2–3 na Septuaginta), sem reivindicar citação verbal idêntica.',
'ἔζησεν é aoristo ativo indicativo, 3ª pessoa singular, de ζάω; a morte precedente dá valor ingressivo à expressão «voltou a viver».',
'πτωχεία e πλούσιος εἶ compõem contraste entre pobreza material e riqueza de outra ordem. «Sinagoga de Satanás» é linguagem polêmica situada em tensões históricas particulares; não deve ser aplicada genericamente a judeus.',
'στέφανος, coroa de honra/vitória, difere lexicalmente de διάδημα, diadema; «dez dias» é expressão de provação cuja relação proposta com Dn 1:12–14 é interpretativa, sem impor cronologia.',
'οὐ μή + ἀδικηθῇ, aoristo passivo subjuntivo 3ª pessoa singular, expressa negação enfática prospectiva. A segunda morte é retomada em Ap 20:6,14; 21:8.',
'ὁ ἔχων é particípio presente ativo nominativo masculino singular; os adjetivos τὴν δίστομον e τὴν ὀξεῖαν, ambos acusativos femininos singulares, qualificam ῥομφαίαν e retomam Ap 1:16.'
];
const exe=[
['Cristo identifica-se como aquele que segura as estrelas e anda entre as igrejas.','O papel exato de «anjo» nas sete mensagens é discutido.'],
['A comunidade é elogiada por obras, perseverança e exame crítico dos falsos apóstolos.','Discernimento e fidelidade são apresentados em conjunto.'],
['O esforço perseverante é relacionado ao nome de Cristo.','O perfeito grego é preservado na análise de κεκοπίακες.'],
['O primeiro amor é apresentado como algo abandonado, apesar de outros elogios.','A memória do passado conduz à convocação à mudança.'],
['Arrependimento e obras retomadas constituem a resposta exigida.','A remoção do candelabro é imagem de juízo comunitário.'],
['Os nicolaítas são mencionados sem descrição histórica completa.','A relação com Balaão requer interpretação a partir do restante da carta.'],
['O convite a ouvir dirige a mensagem à totalidade das igrejas.','A promessa da árvore da vida faz eco ao Éden.'],
['O Cristo que morreu e voltou a viver dirige-se à igreja de Esmirna.','O título Primeiro e Último retoma Ap 1:17.'],
['A avaliação divina contrasta com pobreza externa.','A polêmica religiosa deve ser contextualizada, nunca generalizada contra um povo.'],
['O texto anuncia sofrimento e exige fidelidade.','A coroa da vida é promessa; o sentido temporal de dez dias é debatido.'],
['A segunda morte é distinta do sofrimento da morte física.','A negação οὐ μή é intensiva.'],
['A abertura da carta a Pérgamo destaca a espada de Cristo.','O símbolo já aparece na visão de Ap 1:16.']
];
const pos={'N-':'Substantivo','A-':'Adjetivo','V-':'Verbo','RA':'Artigo definido','RP':'Pronome pessoal','RR':'Pronome relativo','RD':'Pronome demonstrativo','RI':'Pronome interrogativo/indefinido','C-':'Conjunção','P-':'Preposição','D-':'Advérbio','X-':'Partícula','I-':'Interjeição'};
const cas={N:'nominativo',G:'genitivo',D:'dativo',A:'acusativo',V:'vocativo'},num={S:'singular',P:'plural'},gen={M:'masculino',F:'feminino',N:'neutro'};
const ten={P:'presente',I:'imperfeito',F:'futuro',A:'aoristo',X:'perfeito',Y:'mais-que-perfeito'},voi={A:'ativa',M:'média',P:'passiva'},mod={I:'indicativo',D:'imperativo',S:'subjuntivo',O:'optativo',N:'infinitivo',P:'particípio'};
const map={α:'a',β:'b',γ:'g',δ:'d',ε:'e',ζ:'z',η:'ē',θ:'th',ι:'i',κ:'k',λ:'l',μ:'m',ν:'n',ξ:'x',ο:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',φ:'ph',χ:'ch',ψ:'ps',ω:'ō'};
function translit(s){const c=[...s.normalize('NFD').matchAll(/([Α-Ωα-ω])([\u0300-\u036f]*)/g)].map(a=>({v:a[1].toLowerCase(),capital:a[1]!==a[1].toLowerCase(),marks:a[2]}));let out='';for(let i=0;i<c.length;i++){const x=c[i],pr=c[i-1],nx=c[i+1];let z=map[x.v]??'';if(x.v==='γ'&&nx&&'γκχξ'.includes(nx.v))z='n';if(x.v==='υ'&&pr&&'αεηο'.includes(pr.v)&&!x.marks.includes('\u0308'))z='u';if(x.marks.includes('\u0314')){if(i===1&&pr&&'αεηοωυ'.includes(pr.v))out='h'+out;else z='h'+z;}if(x.capital)z=z[0].toUpperCase()+z.slice(1);out+=z;}return out;}
function desc(p,c){if(p==='V-'){const base='Verbo no '+(ten[c[1]]??'tempo não especificado')+', voz '+(voi[c[2]]??'não especificada')+', '+(mod[c[3]]??'modo não especificado');return base+(c[3]==='P'?' '+[cas[c[4]],num[c[5]],gen[c[6]]].filter(Boolean).join(' '):c[3]==='N'?'':', '+c[0]+'ª pessoa '+(num[c[5]]??''));}return [pos[p]??'Classe não mapeada',cas[c[4]],num[c[5]],gen[c[6]]].filter(Boolean).join(' ');}
const existing=new Set();for(const file of ['apocalipse-1-1.json','apocalipse-1-2.json','apocalipse-1-3-8.json','apocalipse-1-9-20.json'])for(const id of Object.keys(JSON.parse(fs.readFileSync('src/data/lexico-grego/'+file,'utf8')).entries))existing.add(id);
const template=fs.readFileSync('src/components/TextoOriginalApocalipse1v20.astro','utf8');
const lex={version:'1.0.0',scope:'Apocalipse 2:1–12',source:'SBLGNT / MorphGNT 6.12 aaed91e5 / jtauber Greek lemma mappings',editorialStatus:'Rascunho; acepções preliminares dependem de revisão lexical independente',entries:{}};
const issues=[];let n=0;
for(let v=1;v<=12;v++){
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
 const obj={reference:'Apocalipse 2:'+v,book:'Apocalipse',chapter:2,verse:v,source:'SBL Greek New Testament (Holmes 2010) via MorphGNT 6.12',morphologySource:'MorphGNT 6.12; commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',translation:texts[v-1],translationNote:'Tradução editorial própria; distinguir glossas isoladas de construção sintática completa.',textualNotes:notes[v-1],exegeticalNotes:exe[v-1],words};
 const pathName='src/data/texto-original/apocalipse/apocalipse-2-'+v+'.ts';fs.writeFileSync(pathName,'/** Prima Scriptura · Ap 2:'+v+' · SBLGNT / MorphGNT 6.12 */\nexport const apocalipse2v'+v+' = '+JSON.stringify(obj,null,2)+' as const;\n');
 for(let i=0;i<words.length;i++){const w=words[i],st=w.strong;if(existing.has(st)||lex.entries[st])continue;lex.entries[st]={strong:st,lemma:w.lemma,lemmaTransliteration:w.lemmaTransliteration,partOfSpeech:w.partOfSpeech,senses:[{id:st+'-1',label:w.gloss,definition:w.meanings,examples:[{reference:'Apocalipse 2:'+v,greek:words.slice(Math.max(0,i-1),Math.min(words.length,i+2)).map(x=>x.greek).join(' '),translation:w.gloss,explanation:'Exemplo da ocorrência de '+w.lemma+' no contexto; nuance exegética depende da sintaxe.'}]}]};}
 let c=template.replaceAll('apocalipse1v20','apocalipse2v'+v).replaceAll('apocalipse-1-20','apocalipse-2-'+v).replaceAll('ap1-20-','ap2-'+v+'-').replaceAll('Apocalipse 1:20','Apocalipse 2:'+v).replaceAll('data-original-apocalipse-1-20','data-original-apocalipse-2-'+v).replace('<span class="verse-num-badge" aria-hidden="true">20</span>','<span class="verse-num-badge" aria-hidden="true">'+v+'</span>').replaceAll('apocalipse-1-9-20.json','apocalipse-2-1-12.json');
 fs.writeFileSync('src/components/TextoOriginalApocalipse2v'+v+'.astro',c);n+=words.length;
}
fs.writeFileSync('src/data/lexico-grego/apocalipse-2-1-12.json',JSON.stringify(lex,null,2)+'\n');
const audit={sourceCommit:'aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',verses:12,tokenCount:n,newLexemes:Object.keys(lex.entries).length,issues};
fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-2-1-12-auditoria.json',JSON.stringify(audit,null,2)+'\n');
if(issues.length)throw Error('Dados não mapeados: '+JSON.stringify(issues));console.log(JSON.stringify(audit,null,2));
