import fs from 'node:fs';
import path from 'node:path';
/* Ap 3:1–6: edição de trabalho SBLGNT/MorphGNT 6.12 */
const source=process.env.MORPHGNT_DIR||'/tmp/prima-morphgnt', mappings=process.env.LEMMAS_DIR||'/tmp/prima-lemma-mappings';
const rows=fs.readFileSync(path.join(source,'87-Re-morphgnt.txt'),'utf8').split(/\r?\n/).filter(x=>/^27030[1-6]\s/.test(x)).map(x=>x.trim().split(/\s+/));
const strongs=new Map();let lemma='';
for(const line of fs.readFileSync(path.join(mappings,'lexemes.yaml'),'utf8').split(/\r?\n/)){
 if(/^[^\s#].*:\s*$/.test(line))lemma=line.slice(0,-1);
 else {const m=line.match(/^    strongs:\s*(\d+)/);if(m&&lemma)strongs.set(lemma,'G'+m[1]);}
}
const prior={};for(const n of ['apocalipse-1-1','apocalipse-1-2','apocalipse-1-3-8','apocalipse-1-9-20','apocalipse-2-1-12','apocalipse-2-13-29'])Object.assign(prior,JSON.parse(fs.readFileSync('src/data/lexico-grego/'+n+'.json','utf8')).entries);
const oldByLemma=new Map(Object.values(prior).map(e=>[e.lemma,e]));
const translations=[
'Ao anjo da igreja em Sardes escreve: Assim diz aquele que tem os sete espíritos de Deus e as sete estrelas: Conheço tuas obras; tens reputação de estar vivo, mas estás morto.',
'Sê vigilante e fortalece o restante que estava para morrer, pois não achei completas as tuas obras diante do meu Deus.',
'Lembra-te, portanto, de como recebeste e ouviste; guarda-o e arrepende-te. Se não vigiares, virei como ladrão, e não saberás a que hora virei sobre ti.',
'Mas tens em Sardes alguns nomes que não contaminaram suas vestes; andarão comigo de branco, porque são dignos.',
'O vencedor será assim vestido com vestes brancas; não apagarei seu nome do livro da vida e confessarei seu nome diante de meu Pai e de seus anjos.',
'Quem tem ouvido, ouça o que o Espírito diz às igrejas.'];
const notes=[
'Τάδε: demonstrativo neutro plural na fórmula de proclamação; ὁ ἔχων: particípio substantivado. Οἶδα tem forma de perfeito com sentido presente. ὄνομα ἔχεις ὅτι ζῇς contrasta a reputação e νεκρὸς εἶ. Para os sete espíritos comparar Ap 1:4; 4:5; 5:6.',
'A ordem de vigilância inclui imperativo e particípio; verificar a construção sem reduzir obras ao conceito de mérito salvífico.',
'Distinguir como recebeste, ouviste, guardas e te arrependes. A imagem do ladrão enfatiza imprevisibilidade.',
'ὀλίγα ὀνόματα designa pessoas metonimicamente; vestes brancas devem ser estudadas no simbolismo de Apocalipse.',
'οὐ μή: negação enfática. Confissão de nome diante do Pai e anjos relaciona-se às promessas ao vencedor.',
'Particípio substantivado e imperativo aoristo, com exortação dirigida a todas as igrejas.'];
const gloss={ὅδε:'estas coisas',γρηγορέω:'vigia',στηρίζω:'fortalece',ἀποθνῄσκω:'morrer',μνημονεύω:'lembra-te',μολύνω:'contaminar',ἱμάτιον:'vestes',περιβάλλω:'vestir',ἐξαλείφω:'apagar',ὁμολογέω:'confessar',κλέπτης:'ladrão',Σάρδεις:'Sardes',ὄνομα:'nome',ἔργον:'obras',ζάω:'viver',νεκρός:'morto',ἄξιος:'digno',λευκός:'branco',πνεῦμα:'Espírito',ἄγγελος:'anjo',ἐκκλησία:'igreja'};
const chars={α:'a',β:'b',γ:'g',δ:'d',ε:'e',ζ:'z',η:'ē',θ:'th',ι:'i',κ:'k',λ:'l',μ:'m',ν:'n',ξ:'x',ο:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',φ:'ph',χ:'ch',ψ:'ps',ω:'ō'};
function tr(s){return [...s.normalize('NFD')].filter(c=>!/[̀-ͯ]/.test(c)).map(c=>{let x=chars[c.toLowerCase()]||'';return c!==c.toLowerCase()?x.charAt(0).toUpperCase()+x.slice(1):x}).join('');}
const pos={'N-':'Substantivo','A-':'Adjetivo','V-':'Verbo',RA:'Artigo definido',RP:'Pronome',RR:'Pronome relativo',RD:'Demonstrativo',RI:'Pronome', 'P-':'Preposição','C-':'Conjunção','D-':'Advérbio','X-':'Partícula'};
const ca={N:'nominativo',G:'genitivo',D:'dativo',A:'acusativo'},nu={S:'singular',P:'plural'},ge={M:'masculino',F:'feminino',N:'neutro'},te={P:'presente',I:'imperfeito',F:'futuro',A:'aoristo',X:'perfeito'},vo={A:'ativa',M:'média',P:'passiva'},mo={I:'indicativo',D:'imperativo',S:'subjuntivo',P:'particípio',N:'infinitivo'};
function morph(p,c){if(p==='V-')return 'Verbo '+(te[c[1]]||'tempo a revisar')+', voz '+(vo[c[2]]||'a revisar')+', '+(mo[c[3]]||'modo a revisar')+(c[3]==='P'?' '+[ca[c[4]],nu[c[5]],ge[c[6]]].filter(Boolean).join(' '):c[3]==='N'?'':', '+c[0]+'ª pessoa '+(nu[c[5]]||''));return (pos[p]||'classe a revisar')+' '+[ca[c[4]],nu[c[5]],ge[c[6]]].filter(Boolean).join(' ');}
const lex={version:'1.0',scope:'Apocalipse 3:1–6',source:'SBLGNT/MorphGNT 6.12',editorialStatus:'Rascunho filológico; sem aprovação lexical exaustiva.',entries:{...prior}};
const problems=[];let count=0;
for(let v=1;v<=6;v++){
 const tokens=rows.filter(x=>Number(x[0].slice(4,6))===v);if(!tokens.length)problems.push('Versículo '+v+' vazio');
 const words=tokens.map((t,i)=>{const [loc,p,c,surface,raw,norm,l]=t,id=strongs.get(l);if(!id)problems.push('Strong ausente '+l+' 3:'+v);const greek=surface.replace(/[⸀⸂⸃⸄⸅]/g,''),g=gloss[l]||oldByLemma.get(l)?.senses?.[0]?.label||l;const role=p==='V-'?(c[3]==='P'?'Particípio':'Predicado verbal'):p==='RA'?'Determinante nominal':p==='N-'?'Núcleo nominal':'Função a revisar';return {id:'ap3-'+v+'-'+(i+1),shortMorph:p+' '+c,greek,transliteration:tr(greek),gloss:g,strong:id||'PENDENTE',lemma:l,lemmaTransliteration:tr(l),partOfSpeech:pos[p]||'Em revisão',morphologyCode:c,morphology:morph(p,c),meanings:oldByLemma.get(l)?.senses?.[0]?.definition||g,explanation:morph(p,c)+'. '+role+'. Dependência sintática ainda em avaliação.',occurrencesExamples:['Ap 3:'+v],syntax:{role,clauseId:'AP.3.'+v+'.C1',governedBy:null},morphgntPos:p};});
 const obj={reference:'Apocalipse 3:'+v,book:'Apocalipse',chapter:3,verse:v,source:'SBLGNT/MorphGNT 6.12',morphologySource:'MorphGNT commit aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d',translation:translations[v-1],translationNote:'Tradução contextual distinta do interlinear.',textualNotes:notes[v-1],exegeticalNotes:[notes[v-1]],words};
 fs.mkdirSync('src/data/texto-original/apocalipse',{recursive:true});fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-3-'+v+'.ts','/** SBLGNT · Apocalipse 3:'+v+' · Rascunho */\nexport const apocalipse3v'+v+' = '+JSON.stringify(obj,null,2)+' as const;\n');
 for(let i=0;i<words.length;i++){const w=words[i];if(lex.entries[w.strong])continue;lex.entries[w.strong]={strong:w.strong,lemma:w.lemma,lemmaTransliteration:w.lemmaTransliteration,partOfSpeech:w.partOfSpeech,senses:[{id:w.strong+'-1',label:w.gloss,definition:'Acepção a cotejar em léxico crítico.',examples:[{reference:'Apocalipse 3:'+v,greek:words.slice(Math.max(0,i-1),i+2).map(z=>z.greek).join(' '),translation:w.gloss,explanation:'Glosa editorial preliminar.'}]}]};}
 count+=words.length;
}
if(problems.length)throw Error(JSON.stringify(problems));
fs.writeFileSync('src/data/lexico-grego/apocalipse-3-1-6.json',JSON.stringify(lex,null,2)+'\n');
const template=fs.readFileSync('src/components/TextoOriginalApocalipse2v29.astro','utf8');
for(let v=1;v<=6;v++)fs.writeFileSync('src/components/TextoOriginalApocalipse3v'+v+'.astro',template.replaceAll('apocalipse2v29','apocalipse3v'+v).replaceAll('apocalipse-2-29','apocalipse-3-'+v).replaceAll('Apocalipse 2:29','Apocalipse 3:'+v).replaceAll('data-original-apocalipse-2-29','data-original-apocalipse-3-'+v).replace('<span class="verse-num-badge" aria-hidden="true">29</span>','<span class="verse-num-badge" aria-hidden="true">'+v+'</span>').replaceAll('apocalipse-2-13-29.json','apocalipse-3-1-6.json'));
let route=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-2/[versiculo].astro','utf8');
const imports=Array.from({length:6},(_,i)=>"import TextoOriginalApocalipse3v"+(i+1)+" from '../../../../components/TextoOriginalApocalipse3v"+(i+1)+".astro';").join('\n');
route=route.replace(/import TextoOriginalApocalipse2v1[\s\S]*?import TextoOriginalApocalipse2v29 from [^\n]+\n/,imports+'\n').replace(/const components = \[[^\]]+\];/,'const components = ['+Array.from({length:6},(_,i)=>'TextoOriginalApocalipse3v'+(i+1)).join(', ')+'];').replaceAll('capitulo-2','capitulo-3').replaceAll('Apocalipse 2','Apocalipse 3').replace('length: 29','length: 6');
fs.mkdirSync('src/pages/comentarios/apocalipse/capitulo-3',{recursive:true});fs.writeFileSync('src/pages/comentarios/apocalipse/capitulo-3/[versiculo].astro',route);
let ch=fs.readFileSync('src/pages/comentarios/apocalipse/capitulo-2/index.astro','utf8');
const items=['Sardes: aparente vida','Desperta e fortalece','Lembra-te e arrepende-te','Vestes brancas','O livro da vida','Ouça o Espírito'].map((title,i)=>({number:i+1,title,description:'Texto grego · rascunho em avaliação.'}));
ch=ch.replace(/const availableVerses = \[[\s\S]*?\];/,'const availableVerses = '+JSON.stringify(items)+';').replaceAll('capitulo-2','capitulo-3').replaceAll('Apocalipse 2','Apocalipse 3').replaceAll('Capítulo 2','Capítulo 3').replaceAll('CAPÍTULO 02','CAPÍTULO 03').replaceAll('29 de 29','6 de 22').replaceAll('Éfeso, Esmirna, Pérgamo e Tiatira','Sardes').replaceAll('29 versículos','6 versículos').replaceAll('capítulo 2 completo','Sardes em rascunho');
fs.writeFileSync('src/pages/comentarios/apocalipse/capitulo-3/index.astro',ch);
fs.writeFileSync('src/data/texto-original/apocalipse/apocalipse-3-1-6-auditoria.json',JSON.stringify({scope:'Apocalipse 3:1–6',source:'MorphGNT 6.12',verses:6,tokens:count,problems,academicApproval:false},null,2)+'\n');
console.log(JSON.stringify({verses:6,tokens:count,lexiconEntries:Object.keys(lex.entries).length}));
