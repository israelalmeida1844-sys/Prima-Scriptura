import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root='src/data/texto-original/apocalipse/';
const verses={1:20,2:29,3:22,4:11};
let punct=0,changedViews=0;
const exegetical={
3:'A primeira bem-aventurança associa leitura pública, audição comunitária e observância. O texto não equipara mera informação à fidelidade prática: os ouvintes também são chamados a guardar o que está escrito (Ap 1:3; 22:7).',
4:'A saudação apresenta graça e paz e uma fórmula solene acerca daquele que é, era e vem. A identidade dos «sete espíritos» deve ser examinada pela conexão intratextual com Ap 3:1; 4:5 e 5:6; não se deve reduzir antecipadamente a expressão a uma só hipótese sem argumentação.',
5:'Os títulos «testemunha fiel», «primogênito dentre os mortos» e «soberano dos reis da terra» formam a apresentação cristológica. A leitura λύσαντι («libertou») orienta a imagem de libertação pelo sangue sem eliminar o debate textual com λούσαντι («lavou»).',
6:'A imagem de «reino» e «sacerdotes» retoma a linguagem de Êxodo 19:6. O plural ἱερεῖς descreve a função sacerdotal dos destinatários, enquanto βασιλείαν apresenta sua condição coletiva; a redação não deve ser harmonizada com a variante «reis e sacerdotes».',
7:'O anúncio reúne elementos de Daniel 7:13 e Zacarias 12:10–14: a vinda nas nuvens, sua visibilidade e a reação das tribos. A extensão de «tribos da terra» e o sentido de «lamentar» exigem leitura da rede de alusões, não somente glosas isoladas.',
8:'O oráculo identifica o Senhor Deus como Alfa e Ômega e Todo-Poderoso. A fórmula «aquele que é, que era e que vem» deve ser interpretada em conjunto com 1:4, sem pressupor que todas as ocorrências do título em Apocalipse tenham automaticamente o mesmo locutor.'
};
const sourceFile=(c,v)=>root+'apocalipse-'+c+'-'+v+'.ts';
for(const [cs,max] of Object.entries(verses))for(let v=1;v<=max;v++){
 const c=Number(cs),p=sourceFile(c,v),text=fs.readFileSync(p,'utf8'),l=text.indexOf('{'),r=text.lastIndexOf('}')+1;
 let obj;try{obj=JSON.parse(text.slice(l,r));}catch{obj=vm.runInNewContext('('+text.slice(l,r)+')',{}, {timeout:1000});}
 obj.words.forEach(w=>{
   const match=String(w.greek).match(/([.,;··:!?—]+)$/u);
   if(!match)return;
   if(w.trailingPunctuation)throw Error('Pontuação duplicada: '+w.id);
   w.trailingPunctuation=match[1];
   w.greek=w.greek.slice(0,-match[1].length);
   assert.ok(w.greek,'Forma grega vazia: '+w.id);
   punct++;
 });
 if(c===1&&exegetical[v]&&!obj.exegeticalNotes.includes(exegetical[v]))obj.exegeticalNotes.push(exegetical[v]);
 if(c===1&&v===8){
   obj.textualNotes='Comparação de edições (não substitui a colação dos manuscritos): o SBLGNT não contém a expressão ἀρχὴ καὶ τέλος («princípio e fim») em Ap 1:8; ela ocorre no Textus Receptus. A redação adotada no interlinear conserva a leitura SBLGNT. Para ponderar o apoio manuscrito, consultar o aparato crítico.';
 }
 fs.writeFileSync(p,text.slice(0,l)+JSON.stringify(obj,null,2)+text.slice(r));
 const component='src/components/TextoOriginalApocalipse'+c+'v'+v+'.astro';
 let astro=fs.readFileSync(component,'utf8');
 const old='>{word.greek.replace(/[,.;··:!?]+$/u, \'\')}</span><span class="greek-punctuation" aria-hidden="true">{word.greek.match(/[,.;··:!?]+$/u)?.[0] ?? \'\'}</span>';
 const newValue='>{word.greek}</span><span class="greek-punctuation" aria-hidden="true">{\'trailingPunctuation\' in word ? word.trailingPunctuation : \'\'}</span>';
 if(astro.includes(old)){astro=astro.replace(old,newValue);changedViews++;}
 else assert.ok(astro.includes(newValue),'Token-punctuation JSX não encontrado: '+component);
 fs.writeFileSync(component,astro);
}
const stylePath='src/styles/apocalipse-lexicon.css';
let style=fs.readFileSync(stylePath,'utf8');
if(!style.includes('.greek-punctuation { pointer-events: none; }'))style+='\n.greek-punctuation { pointer-events: none; }\n';
fs.writeFileSync(stylePath,style);
const report='.github/reports/apocalipse-1-4-revisao-editorial.json';
const obj=JSON.parse(fs.readFileSync(report,'utf8'));obj.punctuationMoved=punct;obj.punctuationModel='Os sinais finais são armazenados em trailingPunctuation; a forma grega clicável contém apenas o token lexical.';obj.additionalExegeticalNotes='Apocalipse 1:3–8 revistos editorialmente';
fs.writeFileSync(report,JSON.stringify(obj,null,2)+'\n');
console.log(JSON.stringify({punctuationMoved:punct,componentsUpdated:changedViews}));
