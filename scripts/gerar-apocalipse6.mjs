#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const commit='aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d';
const source=path.join(process.env.MORPHGNT_DIR||'/tmp/prima-morphgnt','87-Re-morphgnt.txt');
const mapping=path.join(process.env.LEMMAS_DIR||'/tmp/prima-lemma-mappings','lexemes.yaml');
const rows=fs.readFileSync(source,'utf8').split(/\r?\n/).filter(s=>/^2706\d\d\s/.test(s)).map(s=>s.trim().split(/\s+/));
if(rows.length!==417 || rows.some(x=>x.length!==7))throw Error('Corpus grego inesperado: '+rows.length);
const lex=JSON.parse(fs.readFileSync('src/data/lexico-grego/apocalipse-5-1-14.json','utf8'));
const ids=new Map(Object.entries(lex.entries).map(([id,v])=>[v.lemma,id]));
const mapIds=new Map();let lemma='';
for(const line of fs.readFileSync(mapping,'utf8').split(/\r?\n/)){
 if(/^[^\s#].*:\s*$/.test(line))lemma=line.slice(0,-1);
 else{const m=line.match(/^    strongs:\s*(\d+)/);if(m&&lemma)mapIds.set(lemma,'G'+m[1]);}
}
const exceptions={'ἀλλήλων':'G240','τρεῖς':'G5140','ἕως':'G2193','ἐπάνω':'G1883','μεγιστάν':'G3175'};
const dictionary={
'ἵππος':'cavalo','τόξον':'arco','πυρρός':'vermelho-fogo','ἀλλήλων':'uns aos outros','μάχαιρα':'espada curta','μέλας':'negro','ζυγός':'balança; jugo','χοῖνιξ':'medida de cereal','σῖτος':'trigo','δηνάριον':'denário, moeda romana','τρεῖς':'três','κριθή':'cevada','ἔλαιον':'azeite','οἶνος':'vinho','χλωρός':'verde-pálido','ἐπάνω':'sobre','ἀκολουθέω':'seguir','λιμός':'fome','ὑπό':'sob; por','θηρίον':'fera','πέμπτος':'quinto','θυσιαστήριον':'altar','ψυχή':'vida; alma','κράζω':'clamar','ἕως':'até','πότε':'quando?','δεσπότης':'soberano','κρίνω':'julgar','ἐκδικέω':'fazer justiça','στολή':'veste longa','ἀναπαύω':'descansar','σύνδουλος':'conservo','ἕκτος':'sexto','σεισμός':'terremoto','σάκκος':'pano de saco','τρίχινος':'de crina','σελήνη':'lua','συκῆ':'figueira','ὄλυνθος':'figo temporão','ἄνεμος':'vento','σείω':'sacudir','ἀποχωρίζομαι':'separar-se','ἑλίσσω':'enrolar','ὄρος':'monte','μεγιστάν':'dignitário','χιλίαρχος':'comandante militar','ἐλεύθερος':'livre','σπήλαιον':'caverna','πέτρα':'rocha','ὀργή':'ira'
};
const lemmaGloss={'καί':'e','ὁ':'o/a','ὅτι':'porque','ἐπί':'sobre','αὐτός':'dele','ὅς':'que','ἐγώ':'eu','ἵνα':'para que','σύ':'tu','ἐν':'em','ἐκ':'de','ἀπό':'de','εἰς':'para','ὡς':'como','πᾶς':'todo','ἔρχομαι':'vir','δίδωμι':'dar','ὁράω':'ver','ἀκούω':'ouvir','λέγω':'dizer','ἔχω':'ter','γίνομαι':'acontecer','ἀνοίγω':'abrir','λαμβάνω':'receber','οὐ':'não','μή':'não','λευκός':'branco','ἀρνίον':'Cordeiro','σφραγίς':'selo','ἑπτά':'sete','δύναμαι':'poder','ἀδικέω':'prejudicar','θάνατος':'morte','γῆ':'terra','φωνή':'voz','μεγάς':'grande','τέσσαρες':'quatro','ἕκαστος':'cada um','εἰμί':'ser','ἡμέρα':'dia','νικάω':'vencer','θρόνος':'trono'};
const tokenGloss={
'Ἔρχου':'Vem!','ἤνοιξεν':'abriu','ἤνοιξε':'abriu','ἤκουσα':'ouvi','εἶδον':'vi','ἐξῆλθεν':'saiu','νικῶν':'vencendo','νικήσῃ':'vença','ἐδόθη':'foi dado','σφάξουσιν':'matem','ἀναπαύσονται':'descansem','πληρωθῶσιν':'se complete',
'ἵππος':'cavalo','λευκός':'branco','τόξον':'arco','στέφανος':'coroa','πυρρός':'vermelho','μάχαιρα':'espada curta','μέλας':'negro','ζυγὸν':'balança','Χοῖνιξ':'medida','χοίνικες':'medidas','σίτου':'trigo','δηναρίου':'denário','κριθῶν':'cevada','ἔλαιον':'azeite','οἶνον':'vinho','χλωρός':'esverdeado','ὁ':'o','ἡ':'a','τὸ':'o','τὴν':'a','τῆς':'da','τοῦ':'do','τῶν':'dos','τοῖς':'aos','τὰς':'as','οἱ':'os','τὰ':'os',
'ἐδόθη':'foi concedido','ἐξουσία':'autoridade','τέταρτον':'quarta parte','ψυχὰς':'vidas','ἐσφαγμένων':'imolados','ἔκραξαν':'clamaram','Ἕως':'Até','πότε':'quando?','ἐκδικεῖς':'fazes justiça','στολὴ':'veste','λευκή':'branca','σεισμὸς':'terremoto','ἥλιος':'sol','σελήνη':'lua','ἀστέρες':'estrelas','ὀλύνθους':'figos temporãos','ἀπεχωρίσθη':'retirou-se','ἑλισσόμενον':'enrolando-se','μεγιστᾶνες':'dignitários','χιλίαρχοι':'comandantes','ἐλεύθερος':'livre','σπήλαια':'cavernas','Πέσετε':'Caí!','κρύψατε':'escondei','ὀργῆς':'ira','σταθῆναι':'permanecer de pé','ἦλθεν':'chegou'
};
const translations=[
'E vi quando o Cordeiro abriu um dos sete selos; e ouvi um dos quatro seres viventes dizer, como voz de trovão: Vem!',
'E vi, e eis um cavalo branco! O cavaleiro tinha um arco; foi-lhe dada uma coroa, e saiu vencendo e para vencer.',
'Quando abriu o segundo selo, ouvi o segundo ser vivente dizer: Vem!',
'E saiu outro cavalo, vermelho-fogo. Ao cavaleiro foi concedido retirar a paz da terra, para que matassem uns aos outros; e foi-lhe dada uma grande espada.',
'Quando abriu o terceiro selo, ouvi o terceiro ser vivente dizer: Vem! E vi um cavalo negro, cujo cavaleiro tinha uma balança na mão.',
'E ouvi como uma voz no meio dos quatro seres viventes: Uma medida de trigo por um denário e três medidas de cevada por um denário! Não prejudiques o azeite nem o vinho.',
'Quando abriu o quarto selo, ouvi a voz do quarto ser vivente dizer: Vem!',
'E vi um cavalo esverdeado; o nome de quem o montava era Morte, e o Hades o seguia. Foi-lhes dada autoridade sobre a quarta parte da terra para matar por espada, fome, morte e feras.',
'Quando abriu o quinto selo, vi debaixo do altar as vidas dos que foram mortos por causa da palavra de Deus e do testemunho que mantinham.',
'E clamavam em alta voz: Até quando, ó Soberano santo e verdadeiro, não julgas e não fazes justiça pelo nosso sangue contra os habitantes da terra?',
'E foi dada a cada um deles uma veste branca; e lhes foi dito que descansassem ainda por breve tempo, até se completarem seus conservos e irmãos que seriam mortos como eles.',
'E vi quando abriu o sexto selo: houve um grande terremoto; o sol tornou-se negro como pano de saco de crina e a lua inteira tornou-se como sangue.',
'E as estrelas do céu caíram sobre a terra como a figueira lança os figos temporãos quando sacudida por vento forte.',
'E o céu se retirou como um rolo que se enrola; todo monte e ilha foram removidos de seus lugares.',
'Os reis da terra, os grandes, os comandantes, os ricos, os poderosos e todo escravo e livre esconderam-se nas cavernas e rochas dos montes.',
'E diziam aos montes e rochas: Caí sobre nós e escondei-nos da presença daquele que está sentado no trono e da ira do Cordeiro,',
'porque chegou o grande dia da ira deles, e quem pode subsistir?'];
const titles=['O primeiro selo e a convocação','O cavalo branco e o arco','O segundo selo e a convocação','O cavalo vermelho e a retirada da paz','O cavalo negro e a balança','Escassez, preços e alimentos','A convocação do quarto selo','O cavalo pálido, a Morte e o Hades','Os mártires sob o altar','O clamor de justiça: Até quando?','Vestes brancas e espera','Terremoto, sol e lua','A queda das estrelas','O céu como um rolo','O temor de toda a sociedade','A ira do Cordeiro','Quem poderá subsistir?'];
const exe=[
'O Cordeiro abre o selo; o chamado Ἔρχου introduz o primeiro cavaleiro. A destinação da ordem é interpretação sintática e contextual.',
'O arco e a coroa não identificam explicitamente o cavaleiro. A associação à cavalaria parta é hipótese histórica. A interpretação historicista adventista tradicional relaciona o cavalo à expansão inicial do evangelho; outras leituras enfatizam conquista ou engano.',
'A convocação pelo segundo ser vivente é paralela à do primeiro e deve preservar a leitura textual adotada.',
'A retirada da paz anuncia violência recíproca. μάχαιρα é arma cortante distinta, em muitos contextos, da ῥομφαία. A associação historicista a conflitos históricos é aplicação interpretativa.',
'ζυγός descreve um instrumento de pesagem que, associado à economia dos cereais, sugere escassez.',
'χοῖνιξ era medida de cereal; o denário pode funcionar como salário de um dia (Mt 20:2). A explicação por um édito de Domiciano sobre videiras é hipótese histórica debatida, não identificação afirmada pelo texto.',
'O quarto ser vivente convoca o último cavaleiro; os quatro primeiros selos compõem uma unidade literária.',
'χλωρός é verde ou amarelo-esverdeado; no contexto de Morte pode sugerir palidez cadavérica. A série de flagelos ecoa Ez 14:21 e a quarta parte delimita a autoridade.',
'As vidas dos mortos estão simbolicamente debaixo do altar, evocando o sangue sacrificial (Lv 4:7). A perspectiva adventista entende a cena de modo simbólico, não como prova independente de consciência desencarnada.',
'Ἕως πότε recupera a fórmula de apelo judicial do Antigo Testamento (Sl 79:5; Hc 1:2). δεσπότης exprime autoridade soberana.',
'As vestes brancas e o tempo de repouso indicam reconhecimento e espera. Não se deve converter a passagem em cálculo cronológico exato.',
'Os abalos cósmicos ecoam Is 13:10 e Jl 2:31. A leitura historicista adventista associa a esta sequência eventos como Lisboa (1755) e o Dia Escuro (1780), em diálogo com perspectivas escatológicas alternativas.',
'A figueira e seus figos temporãos formam comparação para a queda das estrelas. A associação à chuva de meteoros de 1833 é aplicação historicista, não tradução lexical.',
'A retirada do céu como rolo remete a Is 34:4; a linguagem é apocalíptica e não requer mecanismo astronômico literal.',
'A lista alcança elites políticas, militares e econômicas, e inclui escravos e livres; a universalidade impede sua redução a uma única classe.',
'Os pedidos às rochas ecoam Os 10:8 e Lc 23:30. A ira do Cordeiro une as imagens do sacrifício e do juízo.',
'O pronome αὐτῶν na edição-base é plural, ligando a ira ao entronizado e ao Cordeiro. A pergunta final prepara o selamento em Ap 7.'];
const syntax=[
'ὅτε introduz oração temporal; Ἔρχου é imperativo presente, segunda pessoa singular.',
'ἐδόθη é aoristo passivo; νικῶν é particípio presente e ἵνα νικήσῃ expressa finalidade com subjuntivo.',
'τὴν σφραγῖδα τὴν δευτέραν contém adjetivo em posição atributiva; λέγοντος é particípio genitivo.',
'ἐδόθη ... λαβεῖν combina concessão passiva e infinitivo; ἵνα ἀλλήλους σφάξουσιν usa futuro indicativo após ἵνα, sem correção silenciosa.',
'ἔχων é particípio presente ativo, nominativo singular masculino; ζυγόν é seu objeto.',
'χοῖνιξ designa medida de cereal e o genitivo δηναρίου o preço; μὴ ἀδικήσῃς é proibição com aoristo subjuntivo.',
'ἤκουσα rege a expressão de voz; λέγοντος relaciona-se ao ser vivente.',
'ὁ Θάνατος identifica o cavaleiro; ὁ ᾅδης é sujeito de ἠκολούθει; ἀποκτεῖναι é infinitivo de ação autorizada.',
'τὰς ψυχάς é objeto de εἶδον; διὰ + acusativo introduz causa e motivo.',
'ἔκραξαν é aoristo plural; Ἕως πότε introduz interrogação temporal; κρίνεις e ἐκδικεῖς são presentes.',
'ἐδόθη é passivo singular; ἑκάστῳ é dativo distributivo; ἵνα ἀναπαύσονται conserva futuro no corpus; ἕως πληρωθῶσιν usa subjuntivo passivo.',
'σεισμὸς μέγας é sujeito de ἐγένετο; σάκκος τρίχινος participa da comparação.',
'οἱ ἀστέρες é sujeito de ἔπεσαν; σειομένη é particípio presente passivo feminino referente à figueira.',
'ὁ οὐρανός é sujeito de ἀπεχωρίσθη; ἑλισσόμενον modifica βιβλίον.',
'Os grupos coordenados são sujeito de ἔκρυψαν; ἑαυτούς é pronome reflexivo.',
'Πέσετε e κρύψατε são imperativos aoristos de segunda pessoa plural.',
'ὅτι explica a fala anterior; τίς δύναται σταθῆναι encerra o capítulo com infinitivo dependente.'];
const textual=Array(17).fill('A nota não afirma ausência de variantes; nenhuma variante específica recebeu aqui identificação manuscrita independentemente colacionada.');
for(const i of [0,2,4,6])textual[i]='A edição MorphGNT/SBLGNT apresenta Ἔρχου («Vem!»), sem a expansão «e vê» encontrada na tradição do Textus Receptus. A formulação e o suporte manuscrito de cada versículo exigem confronto com o aparato antes de citar testemunhos individualmente.';
textual[3]='Em ἵνα ἀλλήλους σφάξουσιν a edição-base apresenta futuro indicativo após ἵνα. Conservar a leitura e assinalar a construção sintática incomum.';
textual[10]='ἵνα ἀναπαύσονται na edição-base apresenta futuro indicativo após ἵνα; evitar emendas silenciosas para subjuntivo.';
textual[16]='Em 6:17 a edição-base lê αὐτῶν («deles»); variantes e traduções podem registrar forma singular. O aparato completo precisa ser conferido antes da homologação.';
const latin={'α':'a','β':'b','γ':'g','δ':'d','ε':'e','ζ':'z','η':'ē','θ':'th','ι':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','φ':'ph','χ':'ch','ψ':'ps','ω':'ō'};
function translit(s){return [...s.normalize('NFD')].filter(c=>!/\p{M}/u.test(c)).map(c=>latin[c.toLowerCase()]||c).join('').replace(/[.,;··:⸀⸂⸃⸁]/gu,'')}
function short(p,c){if(p==='RA')return 'ART-'+c.slice(4,7).replaceAll('-','');if(p==='V-')return 'V-'+c.slice(1,4).replaceAll('-','')+(c[0]!=='-'?'-'+c[0]:'')+(c.slice(4,7).replaceAll('-','')?'-'+c.slice(4,7).replaceAll('-',''):'');return ({'N-':'N','A-':'ADJ','RP':'PRO','RR':'REL','C-':'CONJ','P-':'PREP','D-':'ADV'}[p]||p)+(c.slice(4,7).replaceAll('-','')?'-'+c.slice(4,7).replaceAll('-',''):'')}
const sourceLemmas=[...new Set(rows.map(x=>x[6]))];const newStrong=[];
for(const word of sourceLemmas){
 if(ids.has(word))continue;
 const strong=exceptions[word]||mapIds.get(word);if(!strong)throw Error('Falta Strong verificado: '+word);
 if(lex.entries[strong]&&lex.entries[strong].lemma!==word)throw Error('Colisão Strong '+strong+': '+word+' e '+lex.entries[strong].lemma);
 const def=dictionary[word];if(!def)throw Error('Falta definição de '+word);
 const first=rows.find(r=>r[6]===word),v=Number(first[0].slice(4,6)),form=first[3].replace(/[⸀⸂⸃⸁.,;··:]/gu,'');
 lex.entries[strong]={strong,lemma:word,lemmaTransliteration:translit(word),partOfSpeech:first[1],senses:[{id:strong+'-1',label:def,definition:'Sentido lexical no uso de Apocalipse 6: '+def+'. A extensão semântica do lema requer consulta comparativa a léxicos acadêmicos.',examples:[{reference:'Ap 6:'+v,greek:form,wordForm:form,translation:def,explanation:'Exemplo no contexto da visão dos selos.',source:'SBLGNT/MorphGNT 6.12'}]}]};
 ids.set(word,strong);newStrong.push(strong);
}
if(newStrong.length!==50)throw Error('Esperados 50 verbetes novos; encontrados '+newStrong.length);
const components=fs.readFileSync('src/components/TextoOriginalApocalipse5v1.astro','utf8');
let all=[];
for(let verse=1;verse<=17;verse++){
 const raw=rows.filter(x=>Number(x[0].slice(4,6))===verse);
 const words=raw.map((t,index)=>{
 const x=t[3],pun=(x.match(/[.,;··:]$/u)||[])[0],greek=x.replace(/[⸀⸂⸃⸁]/gu,'').replace(/[.,;··:]$/u,''),le=t[6],strong=ids.get(le),entry=lex.entries[strong],pos=t[1],code=t[2];
 const gloss=tokenGloss[greek]||lemmaGloss[le]||dictionary[le]||entry.senses?.[0]?.label?.split(';')[0]||le;
 return {id:'ap6-'+verse+'-'+(index+1),shortMorph:short(pos,code),greek,transliteration:translit(greek),gloss,strong,lemma:le,lemmaTransliteration:entry.lemmaTransliteration,partOfSpeech:entry.partOfSpeech,morphologyCode:code,morphology:'MorphGNT 6.12: '+pos+' '+code,meanings:entry.senses?.[0]?.definition||entry.senses?.[0]?.label||gloss,explanation:'A função da forma deve ser lida em conjunto com as observações sintáticas específicas do versículo.',occurrencesExamples:['Ap 6:'+verse],syntax:{role:pos==='V-'?'Forma verbal':pos==='RA'?'Determinante nominal':pos==='N-'?'Núcleo/complemento nominal':pos==='P-'?'Conector preposicional':'Elemento do período',clauseId:'AP.6.'+verse,governedBy:null},morphgntPos:pos,...(pun?{trailingPunctuation:pun}:{})};
 });
 const data={reference:'Apocalipse 6:'+verse,book:'Apocalipse',chapter:6,verse,source:'SBL Greek New Testament (SBLGNT) via MorphGNT 6.12',morphologySource:'MorphGNT 6.12; commit '+commit,translation:translations[verse-1],translationNote:'Tradução editorial contextual, não concatenação das glosas.',textualNotes:textual[verse-1],syntacticNotes:[syntax[verse-1]],exegeticalNotes:[exe[verse-1]],words};
 fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-6-'+verse+'.ts','/** Prima Scriptura · Apocalipse 6:'+verse+' · Edição de avaliação */\nexport const apocalipse6v'+verse+' = '+JSON.stringify(data,null,2)+';\n');
 let component=components.replaceAll('apocalipse5v1','apocalipse6v'+verse).replaceAll('apocalipse-5-1-14.json','apocalipse-6-1-17.json').replaceAll('apocalipse-5-1','apocalipse-6-'+verse).replaceAll('Apocalipse 5:1','Apocalipse 6:'+verse).replaceAll('data-original-apocalipse-5-1','data-original-apocalipse-6-'+verse).replace(/(<span class="verse-num-badge" aria-hidden="true">)1(<\/span>)/g,'$1'+verse+'$2');
 fs.writeFileSync('src/components/TextoOriginalApocalipse6v'+verse+'.astro',component);
 all.push({verse,tokens:words.length});
}
const target='src/data/lexico-grego/apocalipse-6-1-17.json';
lex.scope='Apocalipse 1:1–6:17; avaliação';lex.editorialStatus='Capítulo 6: 50 novos verbetes, sujeitos a revisão final de léxico e crítica textual.';
fs.writeFileSync(target,JSON.stringify(lex,null,2)+'\n');
const scriptPath='src/scripts/lexico-grego-apocalipse.ts',shared=fs.readFileSync(scriptPath,'utf8');
if(!shared.includes('apocalipse-5-1-14.json'))throw Error('Importação do léxico anterior não localizada');
fs.writeFileSync(scriptPath,shared.replaceAll('apocalipse-5-1-14.json','apocalipse-6-1-17.json'));
const dest='src/pages/comentarios/apocalipse/capitulo-6';fs.mkdirSync(dest,{recursive:true});
let reader=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-5/[versiculo].astro','utf8').replaceAll('TextoOriginalApocalipse5v','TextoOriginalApocalipse6v').replaceAll('capitulo-5','capitulo-6').replaceAll('Apocalipse 5','Apocalipse 6').replaceAll('CAPÍTULO 5','CAPÍTULO 6').replaceAll('capítulo 5','capítulo 6').replaceAll('length: 14','length: 17').replaceAll('length:14','length:17').replaceAll('number < 14','number < 17');
reader=reader.replace(/(import TextoOriginalApocalipse6v14[^\n]*\n)/,'$1'+[15,16,17].map(n=>'import TextoOriginalApocalipse6v'+n+" from '../../../../components/TextoOriginalApocalipse6v"+n+".astro';").join('\n')+'\n');
reader=reader.replace('TextoOriginalApocalipse6v14];','TextoOriginalApocalipse6v14, TextoOriginalApocalipse6v15, TextoOriginalApocalipse6v16, TextoOriginalApocalipse6v17];');
if(!reader.includes('TextoOriginalApocalipse6v17')||!reader.includes('length: 17'))throw Error('Rota dinâmica incorreta');
fs.writeFileSync(dest+'/[versiculo].astro',reader);
let hub=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-5/index.astro','utf8');
const cardData=titles.map((title,i)=>({number:i+1,title,description:exe[i]}));
const start=hub.indexOf('const availableVerses = '),stop=hub.indexOf('];',start);
if(start<0||stop<0)throw Error('Hub não encontrado');
hub=hub.slice(0,start)+'const availableVerses = '+JSON.stringify(cardData,null,2)+';'+hub.slice(stop+2);
hub=hub.replaceAll('capitulo-5','capitulo-6').replaceAll('Apocalipse 5','Apocalipse 6').replaceAll('APOCALIPSE 5:','APOCALIPSE 6:').replaceAll('5:1–14','6:1–17').replaceAll('5:1–11','6:1–17').replaceAll('14 de 14','17 de 17').replaceAll('CAPÍTULO 05','CAPÍTULO 06').replaceAll('capítulo 5','capítulo 6').replaceAll('Capítulo 5','Capítulo 6');
hub=hub.replace(/(<h1[^>]*>)[\s\S]*?(<\/h1>)/,'$1Apocalipse 6 — A Abertura dos Seis Selos e os Cavaleiros$2');
if(!hub.includes('APOCALIPSE 6:')||!hub.includes('17 de 17'))throw Error('Hub 6 inválido');
fs.writeFileSync(dest+'/index.astro',hub);
const mainPath='src/pages/comentarios/apocalipse/index.astro',main=fs.readFileSync(mainPath,'utf8');
const marker='      </div>\n\n      <div class="apocalipse-verse-grid"';
if(!main.includes(marker))throw Error('Índice de Apocalipse não tem marcador de inserção');
const card='<a class="apocalipse-chapter-card" href="/comentarios/apocalipse/capitulo-6/"><div><span class="apocalipse-label">CAPÍTULO 06 · EDIÇÃO INTERLINEAR EM RASCUNHO</span><h3>Os Seis Selos — Apocalipse 6</h3><p>17 versículos: os cavaleiros, os mártires, os sinais cósmicos e o dia da ira.</p></div><span class="apocalipse-link">Ver capítulo 6 →</span></a>';
fs.writeFileSync(mainPath,main.replace(marker,'      '+card+'\n'+marker).replaceAll('5:1–14','5:1–14 e 6:1–17').replaceAll('Capítulos 1–5 (2.247 palavras)','Capítulos 1–6 (2.664 palavras)').replaceAll('2.247 palavras gregas interlineares','2.664 palavras gregas interlineares'));
const report={sourceCommit:commit,chapter:6,verses:17,tokens:417,uniqueLemmas:sourceLemmas.length,newStrongCount:newStrong.length,newStrong,lexiconEntries:Object.keys(lex.entries).length,perVerse:all,editorialStatus:'Edição em rascunho. Aguardando conferência de aparato manuscrito, validação visual e revisão acadêmica final.'};
fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-6-1-17-auditoria.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
