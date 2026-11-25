/** Complemento editorial cauteloso: notas linguísticas de Apocalipse 1–2.
 * Não substitui aparato crítico publicado nem constitui árvore sintática completa.
 * Usar somente depois dos geradores do workflow; preserva SBLGNT e MorphGNT.
 */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const notes={
  "1:2": "ἐμαρτύρησεν (aoristo) apresenta João como testemunha da palavra e do testemunho de Jesus; ὅσα εἶδεν resume o conteúdo visto, sem obrigar que cada visão seja descrita como percepção ocular comum.",
  "1:3": "μακάριος inicia uma bem-aventurança; ὁ ἀναγινώσκων singular distingue o leitor público dos ouvintes plurais. τηροῦντες acrescenta resposta obediente, não mera audição.",
  "1:4": "A sequência ἀπὸ ὁ ὢν ... mantém formas nominativas após ἀπό; isso deve ser apresentado como irregularidade sintática ou fórmula nominal fixa, não corrigido por declinação editorial. A identidade dos sete espíritos demanda exegese de Ap 3:1; 4:5; 5:6.",
  "1:5": "ὁ μάρτυς ... nominativo após ἀπὸ Ἰησοῦ Χριστοῦ apresenta aposições formalmente dissonantes. λύσαντι significa libertar; λούσαντι, lavar, pertence a outra tradição textual e não pode substituir o lema do texto crítico.",
  "1:6": "βασιλείαν (acusativo singular) e ἱερεῖς (acusativo plural) são predicativos do objeto ἡμᾶς sob ἐποίησεν; não converter o primeiro em βασιλεῖς, leitura distinta.",
  "1:7": "O futuro ὄψεται refere-se à visibilidade da vinda; οἵτινες ... ἐξεκέντησαν traz alusão a Zc 12:10. A relação de πᾶσαι αἱ φυλαὶ τῆς γῆς com Zacarias e o alcance de γῆ requerem avaliação contextual.",
  "1:8": "A forma ὁ παντοκράτωρ é título divino; ὁ ἦν constitui nominalização incomum de imperfeito, sem a regência ἀπό problemática de 1:4.",
  "1:9": "συγκοινωνός liga João a tribulação, reino e perseverança; o genitivo de Ἰησοῦ em μαρτυρίαν Ἰησοῦ admite discussão contextual, não solução automática.",
  "1:10": "ἐν πνεύματι pode indicar condição de experiência visionária; κυριακῇ modifica ἡμέρᾳ, mas não resolve por si só qual dia era referido historicamente.",
  "1:11": "λεγούσης concorda formalmente com σάλπιγγος em 1:10; o limite de versículo não interrompe a sintaxe. A lista dos sete destinatários requer preservação dos topônimos gregos e respectivos casos.",
  "1:12": "βλέπειν depende de ἐπέστρεψα; a metáfora sensorial de ver uma voz pertence ao texto e não deve ser apagada na análise literal.",
  "1:13": "ὅμοιον υἱὸν ἀνθρώπου ecoa Dn 7:13 sem necessariamente reproduzir todas as escolhas lexicais da LXX. A veste ποδήρη é longa; sua função sacerdotal é inferida por intertextualidade.",
  "1:14": "λευκαὶ no feminino plural concorda com τρίχες. A justaposição de imagens lembra Dn 7:9, porém não deve fundir as figuras sem argumento contextual.",
  "1:15": "χαλκολίβανον é termo metalúrgico raro de sentido disputado; há duas ocorrências neotestamentárias (1:15 e 2:18). πεπυρωμένης é genitivo feminino singular e não concorda regularmente com καμίνῳ, dativo.",
  "1:16": "ἔχων, particípio nominativo, apresenta uma construção descritiva; ῥομφαία ... ἐκπορευομένη é núcleo nominal e particípio nominativos. A espada que sai da boca é imagem visionária, não descrição de arma literal.",
  "1:17": "μή + φοβοῦ é proibição no imperativo presente; a relação entre primeiro/último e linguagem de Isaías é alusão teológica, não equivalência lexical.",
  "1:18": "ᾅδης refere-se à esfera dos mortos; a leitura dos termos não autoriza por si a identificação com tormento eterno. A imagem das chaves comunica autoridade.",
  "1:19": "As três relativas ἃ εἶδες, ἃ εἰσίν, ἃ μέλλει γίνεσθαι são sintaticamente paralelas, mas não prescrevem obrigatoriamente três seções cronológicas do livro.",
  "1:20": "τὸ μυστήριον pode ser nominativo ou acusativo quanto à forma; τὰς ... λυχνίας é acusativo. Preservar essa assimetria e discutir tópico pendente/anacoluto, sem reanálise categórica não demonstrada.",
  "2:1": "Τάδε é demonstrativo neutro plural na fórmula 'estas coisas diz'; ἐν μέσῳ rege o genitivo τῶν ... λυχνιῶν. κρατῶν e περιπατῶν funcionam como particípios substantivados que identificam Cristo.",
  "2:2": "οὐ δύνῃ βαστάσαι une verbo de possibilidade e infinitivo complementar; πειράζω caracteriza submeter alegações à prova. ψευδεῖς é predicativo do objeto αὐτούς.",
  "2:3": "κεκοπίακες é perfeito e não deve ser substituído por leitura aorista para harmonização. O contexto é perseverança por causa do nome de Cristo.",
  "2:4": "τὴν ἀγάπην ... τὴν πρώτην apresenta adjetivo em segunda posição atributiva. ἀφῆκες descreve abandono, não o sentido isolado 'perdoar' do lema ἀφίημι.",
  "2:5": "μνημόνευε é imperativo presente; μετανόησον e ποίησον são imperativos aoristos. A consequência da remoção da λυχνία depende da condição ἐὰν μὴ μετανοήσῃς.",
  "2:6": "Νικολαϊτῶν é genitivo plural de grupo. O texto não fornece etimologia segura nem biografia de seus participantes; correlações com Balaão exigem discussão de 2:14–15.",
  "2:7": "τῷ νικῶντι é particípio substantivado no dativo, retomado por αὐτῷ; φαγεῖν depende de δώσω. O ξύλον τῆς ζωῆς ecoa Gn 2–3 e Ap 22.",
  "2:8": "ὁ πρῶτος καὶ ὁ ἔσχατος estabelece título cristológico; ἔζησεν pode traduzir a retomada da vida após tornar-se morto, sem forçar valor semântico exclusivo do aoristo.",
  "2:9": "οἶδά σου τὴν θλῖψιν é construção com genitivo pronominal e objeto acusativo; a linguagem polêmica 'sinagoga de Satanás' deve ser contextualizada e jamais generalizada contra o povo judeu.",
  "2:10": "μηδὲν φοβοῦ exprime ordem de não temer; ἵνα πειρασθῆτε indica finalidade ou resultado pretendido da prova. Os dez dias não fixam cronologia histórica sem argumento externo.",
  "2:11": "οὐ μή seguido de subjuntivo aoristo passivo ἀδικηθῇ é negação enfática de dano futuro; segunda morte é expressão intratextual que deve ser analisada em Ap 20–21.",
  "2:12": "ὁ ἔχων está substantivado; τὴν δίστομον e τὴν ὀξεῖαν são modificadores adjetivais de ῥομφαίαν, não objetos independentes.",
  "2:13": "ὅπου ὁ θρόνος τοῦ Σατανᾶ contém elipse verbal compreensível no contexto. Ἀντιπᾶς permanece nominativo após expressão temporal, com aposição também nominativa; a irregularidade não deve ser normalizada.",
  "2:14": "Βαλαάμ é forma indeclinável, mas sua função depende de διδαχήν. Os infinitivos φαγεῖν e πορνεῦσαι especificam condutas induzidas pela armadilha.",
  "2:15": "A dupla sequência οὕτως ... ὁμοίως constrói comparação enfática. Não acrescentar as palavras de outras tradições ao corpo da leitura SBLGNT.",
  "2:16": "μετανόησον é dirigido à comunidade singular; πολεμήσω μετ’ αὐτῶν desloca o alvo do juízo ao grupo plural; esse contraste pronominal exige explicação.",
  "2:17": "τοῦ μάννα τοῦ κεκρυμμένου é genitivo partitivo; ψῆφος λευκή oferece simbolismo interpretativamente aberto. ὄνομα καινὸν γεγραμμένον associa qualidade e particípio perfeito ao nome.",
  "2:18": "ὁ υἱὸς τοῦ θεοῦ identifica o sujeito da mensagem; o dativo χαλκολιβάνῳ depende de ὅμοιοι. Evitar definir composição metalúrgica incerta como fato.",
  "2:19": "πλείονα, comparativo neutro plural, concorda com τὰ ἔργα; τῶν πρώτων é genitivo de comparação. A tradução pode suplementar 'sei', mas deve marcar que não há segundo Οἶδα expresso.",
  "2:20": "ἡ λέγουσα é nominativo feminino singular apesar do acusativo τὴν γυναῖκα Ἰεζάβελ; é construção sintaticamente irregular, frequentemente tratada como nominativo pendente/anacoluto. Não ajustar a forma para acusativo na transcrição. O nome Jezabel pode funcionar tipologicamente; identidade civil não demonstrada.",
  "2:21": "ἵνα μετανοήσῃ apresenta a finalidade do tempo concedido; οὐ θέλει μετανοῆσαι indica recusa. A referência à πορνεία deve permanecer contextual, sem reconstrução histórica inventada.",
  "2:22": "βάλλω ... εἰς κλίνην estabelece imagem judicial de leito, não diagnóstico de doença. τοὺς μοιχεύοντας é particípio presente substantivado no acusativo.",
  "2:23": "ἀποκτενῶ ἐν θανάτῳ é expressão enfática; νεφρούς e καρδίας representam o foro interior em linguagem antropológica bíblica. Aplicação histórica concreta requer evidências independentes.",
  "2:24": "τὰ βαθέα τοῦ Σατανᾶ não identifica automaticamente uma seita gnóstica posterior. οὐ βάλλω ... ἄλλο βάρος aproxima-se tematicamente de At 15:28, sem provar citação direta.",
  "2:25": "κρατήσατε é imperativo aoristo plural, diferente dos imperativos singulares dirigidos ao anjo/comunidade; ἄχρι οὗ ἂν ἥξω funciona como delimitação temporal da perseverança.",
  "2:26": "ὁ νικῶν e ὁ τηρῶν são particípios substantivados com sentido de perseverança; τὰ ἔργα μου é objeto de τηρῶν, não referência automática a mérito salvífico.",
  "2:27": "ποιμανεῖ é futuro de ποιμαίνω, 'pastorear/governar'; συντρίβεται é presente médio/passivo singular, apesar de τὰ σκεύη ser neutro plural, concordância verbal possível em grego. Não reescrever para plural nem impor exclusivamente 'despedaçará' ao sujeito do primeiro verbo.",
  "2:28": "εἴληφα é perfeito ativo de λαμβάνω; a referência ao Pai sustenta a imagem de autoridade recebida. A estrela matutina é interpretada à luz de Ap 22:16, sem apagar a dimensão prometida ao vencedor.",
  "2:29": "ὁ ἔχων é particípio substantivado, sujeito de ἀκουσάτω, imperativo aoristo terceira pessoa singular. τί introduz interrogativa indireta dependente de 'ouvir'; ταῖς ἐκκλησίαις é dativo destinatário de λέγει."
};
const marker='[Revisão acadêmica complementar] ';
let reviewed=0;
for (const [id,note] of Object.entries(notes)) {
 const [chapter,verse]=id.split(':').map(Number);
 const file=`src/data/texto-original/apocalipse/apocalipse-${chapter}-${verse}.ts`;
 const source=fs.readFileSync(file,'utf8');
 const match=source.match(/=\s*(\{[\s\S]*\})\s*as const;/);
 assert.ok(match,'Dados JSON esperados em '+file);
 const obj=JSON.parse(match[1]);
 assert.equal(obj.chapter,chapter);
 assert.equal(obj.verse,verse);
 const base=String(obj.textualNotes??'').split(marker)[0].trim();
 obj.textualNotes=base+'\n\n'+marker+note;
 fs.writeFileSync(file,source.replace(match[1],JSON.stringify(obj,null,2)));
 reviewed++;
}
assert.equal(reviewed,48);
console.log('Revisão complementar aplicada a '+reviewed+' versículos (Ap 1:2–2:29). Ap 1:1 revisado separadamente.');
