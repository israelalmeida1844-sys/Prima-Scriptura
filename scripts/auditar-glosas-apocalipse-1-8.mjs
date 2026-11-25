import fs from 'node:fs';
import assert from 'node:assert/strict';
const counts=[20,29,22,11,14,17,17,13],dir='src/data/texto-original/apocalipse',lexDir='src/data/lexico-grego';
const key=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/ς/g,'σ');
const map=new Map(Object.entries({
 'ἔργον':['obra','obras','f'],'ἀστήρ':['estrela','estrelas','f'],'πρεσβύτερος':['ancião','anciãos','m'],'ἱμάτιον':['veste','vestes','f'],'κεφαλή':['cabeça','cabeças','f'],'στέφανος':['coroa','coroas','f'],'σφραγίς':['selo','selos','m'],'λυχνία':['candelabro','candelabros','m'],'ἐκκλησία':['igreja','igrejas','f'],'ἄγγελος':['anjo','anjos','m'],'θρόνος':['trono','tronos','m'],'φωνή':['voz','vozes','f'],'μάρτυς':['testemunha','testemunhas','f'],'βιβλίον':['rolo','rolos','m'],'οὖς':['ouvido','ouvidos','m'],'σάλπιγξ':['trombeta','trombetas','f'],'ὀφθαλμός':['olho','olhos','m'],'χείρ':['mão','mãos','f'],'ἔθνος':['nação','nações','f'],'λαός':['povo','povos','m'],'γλῶσσα':['língua','línguas','f'],'φυλή':['tribo','tribos','f'],'ὕδωρ':['água','águas','f'],'ὄρος':['monte','montes','m'],'δένδρον':['árvore','árvores','f'],'ἵππος':['cavalo','cavalos','m'],'κέρας':['chifre','chifres','m'],'πνεῦμα':['espírito','espíritos','m'],'ζῷον':['ser vivente','seres viventes','m'],'ἡμέρα':['dia','dias','m'],'νύξ':['noite','noites','f'],'βασιλεύς':['rei','reis','m'],'δοῦλος':['servo','servos','m'],'ἱερεύς':['sacerdote','sacerdotes','m'],'ἁμαρτία':['pecado','pecados','m'],'νεφέλη':['nuvem','nuvens','f'],'λίθος':['pedra','pedras','f'],'στόμα':['boca','bocas','f'],'πρόσωπον':['rosto','rostos','m'],'ὄνομα':['nome','nomes','m'],'ψυχή':['alma','almas','f'],'βροντή':['trovão','trovões','m'],'λαμπάς':['tocha','tochas','f'],'ὄχλος':['multidão','multidões','f'],'θάλασσα':['mar','mares','m'],'γῆ':['terra','terras','f'],'θυσιαστήριον':['altar','altares','m'],'οὐρανός':['céu','céus','m'],'λόγος':['palavra','palavras','f']
}).map(([k,v])=>[key(k),v]));
const numeric=new Set(['εἷς','δύο','τρεῖς','τέσσαρες','πέντε','ἕξ','ἑπτά','ὀκτώ','ἐννέα','δέκα','δώδεκα','εἴκοσι','τεσσεράκοντα','ἑκατόν','χίλιοι','μυριάς','πρῶτος','δεύτερος','τρίτος','τέταρτος','πέμπτος','ἕκτος','ἕβδομος'].map(key));
const forms=new Map(Object.entries({'ποιήσω':'farei','γράψω':'escreverei','ἐξέλθῃ':'saia','καταβαίνουσα':'que desce','καθημένους':'sentados','κρατῶν':'que segura','περιπατῶν':'que anda','νικῶντι':'que vence','καινῆς':'nova','καινόν':'novo','δώσει':'dará','ἐξαλείψω':'apagarei','ὁμολογήσω':'confessarei','δώσω':'darei','ἔρχομαι':'venho','ἥξω':'virei','ἀποκτενῶ':'matarei','πολεμήσω':'guerrearei','ἐμέσαι':'vomitar','ἀνοῖξαι':'abrir','ἀκούσατε':'ouvi','ἀκουσάτω':'ouça','τηρήσω':'guardarei','ἠρνήσω':'negaste','ἐτήρησας':'guardaste','ἔχεις':'tens','ἐκάθισα':'sentei-me','ἐνίκησα':'venci'}).map(([k,v])=>[key(k),v]));
const prep=new Set(['P-']);
const report={scope:'Ap 1:1–8:13',verses:0,tokens:0,changes:[],exampleUpdates:0,remaining:[]};
const updated=new Map();
function change(w,field,value,reason){if(w[field]===value)return;report.changes.push({id:w.id,field,before:w[field],after:value,reason});w[field]=value}
function article(g,gender,num){let base=g.trim().toLowerCase().replace(/\s*\((?:genitivo|dativo|acusativo|nominativo)\)\s*$/i,'');let m=/^(o|a|os|as|do|da|dos|das|ao|à|aos|às)$/.test(base);if(!m)return base===g?g:base;let n=num==='P',f=gender==='f';if(/^d/.test(base))return f?(n?'das':'da'):(n?'dos':'do');if(/^(ao|à|aos|às)$/.test(base))return f?(n?'às':'à'):(n?'aos':'ao');return f?(n?'as':'a'):(n?'os':'o')}
const sourcePath='docs/revisao-contextual-apocalipse-2-8.json',source=JSON.parse(fs.readFileSync(sourcePath,'utf8'));
const correction='οὖς é acusativo singular de οὖς («ouvido»), objeto direto do particípio presente substantivado ἔχων; ἀκουσάτω é imperativo aoristo ativo de terceira pessoa singular.';
source.entries['3:22'].syntacticNotes=[correction,'τί introduz a pergunta indireta dependente de ἀκουσάτω; ταῖς ἐκκλησίαις identifica os destinatários da fala do Espírito.'];
fs.writeFileSync(sourcePath,JSON.stringify(source,null,2)+'\n');
for(let c=1;c<=8;c++)for(let v=1;v<=counts[c-1];v++){
 const p=dir+'/apocalipse-'+c+'-'+v+'.ts',s=fs.readFileSync(p,'utf8'),m=s.match(/=\s*(\{[\s\S]*\})\s*(?:as const)?\s*;\s*$/);assert(m,p);const o=JSON.parse(m[1]),ws=o.words;
 const preserved=ws.map(w=>[w.id,w.greek,w.lemma,w.strong,w.morphologyCode,w.morphgntPos,w.trailingPunctuation,w.transliteration]);
 if(c===3&&v===22)o.syntacticNotes=source.entries['3:22'].syntacticNotes;
 for(let i=0;i<ws.length;i++){
  const w=ws[i],prev=ws[i-1],next=ws[i+1],g=key(w.greek),l=key(w.lemma),code=w.morphologyCode||'',pos=w.morphgntPos||'',d=map.get(l);
  const old=w.gloss;
  if(d&&['N-','A-'].includes(pos)&&['S','P'].includes(code[5])&&[d[0],d[1]].includes(old.toLowerCase()))change(w,'gloss',d[code[5]==='P'?1:0],'número nominal e sentido contextual');
  if(w.strong==='G3775'&&g===key('οὖς'))change(w,'gloss','ouvido','acusativo singular');
  if(w.strong==='G975'&&/^(livro|livros)$/i.test(w.gloss))change(w,'gloss',code[5]==='P'?'rolos':'rolo','terminologia editorial βιβλίον');
  if(pos==='V-'&&forms.has(g)&&(/^(fazer|escrever|sair|descer|estar sentado|tinha|segura|anda|vence|dará \(oferecer\)|apagar|confessar|dar|vir|matar|guerrear|guardar|negar|sentar|vencer)$/.test(w.gloss)))change(w,'gloss',forms.get(g),'flexão verbal específica');
  if(pos==='V-'&&g===key('ἔχων')&&code[3]==='P'){
   if(prev?.morphgntPos==='RA')change(w,'gloss','que tem','particípio articular presente');
   else if(['tinha','tem','ter'].includes(w.gloss))change(w,'gloss','tendo','particípio presente');
  }
  if(w.strong==='G2537'&&/qualitativamente novo/.test(w.gloss))change(w,'gloss',code[6]==='F'?(code[5]==='P'?'novas':'nova'):(code[5]==='P'?'novos':'novo'),'glosa concisa com concordância');
  if(w.strong==='G846'&&code[4]==='A'&&/^(dele|dela|deles|delas|eles \/ os)$/.test(w.gloss)){
   const afterPrep=prev&&prep.has(prev.morphgntPos),plural=code[5]==='P',f=code[6]==='F';
   change(w,'gloss',afterPrep?(f?(plural?'elas':'ela'):(plural?'eles':'ele')):(f?(plural?'as':'a'):(plural?'os':'o')),'pronome acusativo, não genitivo');
  }
  if(l===key('φωνή')&&next&&key(next.lemma)===key('μέγας')&&code[4]===next.morphologyCode[4]&&code[5]===next.morphologyCode[5]){
   change(w,'gloss',code[5]==='P'?'vozes':'voz','expressão φωνὴ μεγάλη');
   change(next,'gloss',code[5]==='P'?'altas':'alta','expressão φωνὴ μεγάλη');
  }
  if(pos==='A-'&&w.partOfSpeech==='Adjetivo / numeral'&&!numeric.has(l))change(w,'partOfSpeech','Adjetivo','classe não numeral');
  if(pos==='C-'&&w.partOfSpeech==='Advérbio')change(w,'partOfSpeech','Conjunção','classe MorphGNT C-');
  if(pos==='RA'){
   let target=null;for(let k=i+1;k<Math.min(i+4,ws.length);k++){let x=ws[k];if(['A-','N-'].includes(x.morphgntPos)&&map.has(key(x.lemma))&&x.morphologyCode.slice(4,7)===code.slice(4,7)){target=map.get(key(x.lemma));break}if(['V-','P-','C-','RA','RP'].includes(x.morphgntPos))break}
   if(target)change(w,'gloss',article(w.gloss,target[2],code[5]),'concordância com gênero do substantivo português');
   else if(/\s*\((genitivo|dativo|acusativo|nominativo)\)\s*$/i.test(w.gloss))change(w,'gloss',w.gloss.replace(/\s*\((genitivo|dativo|acusativo|nominativo)\)\s*$/i,''),'retirar metadado da glosa');
  }
  if(c===4&&v===4&&g===key('λευκοῖς'))change(w,'gloss','brancas','concordância com vestes');
  if(c===8&&v===3&&g===key('δώσει'))change(w,'gloss','dará','futuro indicativo');
  if(c===8&&v===13&&g===key('τῶν')&&next?.greek.normalize('NFC')==='λοιπῶν')change(w,'gloss','dos','genitivo de sons restantes');
  assert(w.gloss.trim(),w.id);if(/[?.!,;·:]|\/|\([^)]*\)/.test(w.gloss))report.remaining.push({id:w.id,gloss:w.gloss,reason:'revisão semântica ou segmentação ainda necessária'});
 }
 assert.deepEqual(ws.map(w=>[w.id,w.greek,w.lemma,w.strong,w.morphologyCode,w.morphgntPos,w.trailingPunctuation,w.transliteration]),preserved,p);
 for(const w of ws){const k='Ap '+c+':'+v+'|'+w.strong+'|'+key(w.greek);if(!updated.has(k))updated.set(k,new Set());updated.get(k).add(w.gloss)}
 report.verses++;report.tokens+=ws.length;
 const after=s.replace(m[1],()=>JSON.stringify(o,null,2));if(after!==s)fs.writeFileSync(p,after);
}
for(const name of fs.readdirSync(lexDir).filter(x=>/^apocalipse-.*\.json$/.test(x))){
 const p=lexDir+'/'+name,o=JSON.parse(fs.readFileSync(p,'utf8'));let touched=false;
 for(const [id,e] of Object.entries(o.entries||{}))for(const sense of e.senses||[])for(const x of sense.examples||[]){
  if(!x.greek||/\s/.test(x.greek.trim())||!x.explanation?.startsWith('Forma em Ap '))continue;
  const a=updated.get(x.reference+'|'+id+'|'+key(x.greek));if(a?.size===1){const g=[...a][0];if(g!==x.translation){x.translation=g;touched=true;report.exampleUpdates++}}
 }
 if(touched)fs.writeFileSync(p,JSON.stringify(o,null,2)+'\n');
}
assert.equal(report.verses,143);assert.equal(report.tokens,3381);
fs.writeFileSync('docs/auditoria-final-glosas-apocalipse-1-8.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({verses:report.verses,tokens:report.tokens,changes:report.changes.length,examples:report.exampleUpdates,remaining:report.remaining.length}));
