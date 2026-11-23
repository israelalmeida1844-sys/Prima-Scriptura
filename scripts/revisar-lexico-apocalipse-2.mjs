/**
 * Revisão de sentidos-chave em Ap 2:1–12.
 * Não substitui aparato acadêmico de BDAG/LSJ: mantém status de rascunho.
 */
import fs from 'node:fs';
const file='src/data/lexico-grego/apocalipse-2-1-12.json';
const data=JSON.parse(fs.readFileSync(file,'utf8'));
const edits={
G2902:['segurar firmemente, manter sob controle','κρατέω designa agarrar, segurar com firmeza ou manter sob domínio. Em Ap 2:1, o particípio presente κρατῶν descreve aquele que mantém as estrelas em sua mão direita.','Particípio presente ativo; a permanência da ação é relevante à caracterização do locutor.'],
G4043:['andar, caminhar continuamente','περιπατέω pode denotar caminhada concreta ou conduta. Em Ap 2:1, ὁ περιπατῶν é imagem de presença ativa entre os sete candelabros.','A ideia de vigilância decorre da imagem em contexto, não de sentido lexical obrigatório.'],
G941:['suportar, carregar, tolerar','βαστάζω expressa carregar peso ou suportar/tolerar. Em Ap 2:2, o infinitivo aoristo βαστάσαι completa οὐ δύνῃ.','Distinguir o infinitivo de sua função após δύναμαι.'],
G2873:['trabalho custoso, fadiga','κόπος envolve esforço intenso e trabalho fatigante. O elogio a Éfeso não é apenas por atividade, mas por seu custo e perseverança.','Não equivale automaticamente a «mérito salvífico».'],
G2872:['trabalhar até cansar, fatigar-se','κοπιάω refere-se a esforço exaustivo. Em 2:3 a forma κεκοπίακες é perfeito ativo indicativo (SBLGNT), negado por οὐ.','O perfeito apresenta relevância do resultado; não confundir com o aoristo alternativo do TR.'],
G5571:['falso, enganoso','ψευδής caracteriza o que é falso ou mentiroso. Em 2:2 o acusativo plural ψευδεῖς é predicativo dos pretensos apóstolos submetidos à prova.','A falsidade é atribuída aos indivíduos examinados, não a toda reivindicação de apostolado.'],
G863:['deixar, abandonar, permitir, perdoar','ἀφίημι pode expressar deixar ir, liberar, abandonar ou perdoar, dependendo da construção. Em 2:4 o aoristo ἀφῆκες indica abandono do primeiro amor.','Não transportar o sentido «perdoar» para a glosa específica de 2:4.'],
G3421:['lembrar-se, manter na memória','μνημονεύω exige recordar ativamente. Em 2:5 a forma imperativa presente convoca reflexão continuada sobre o ponto de queda.','A forma verbal é imperativa; não apenas uma constatação de lembrança.'],
G3340:['arrepender-se, mudar de orientação','μετανοέω indica reconsideração/mudança de mente e direção. Em 2:5 articula lembrança e prática das primeiras obras.','Não reduzir o termo a emoção momentânea ou atribuir-lhe por si uma doutrina completa.'],
G3531:['nicolaíta, integrante dos nicolaítas','Νικολαΐτης designa membro do grupo mencionado em Ap 2:6 e 2:15. A derivação nominal é relacionada a Νικόλαος; a origem e identidade histórica não são seguras.','A associação com Balaão (2:14–15) não equivale a comprovação etimológica.'],
G3528:['vencer, conquistar, prevalecer','νικάω descreve vitória ou superação. Nas mensagens às igrejas, o particípio articular substantivado identifica aquele que vence e recebe promessa escatológica.','Em 2:7, o dativo τῷ νικῶντι é retomado pelo pronome αὐτῷ.'],
G3586:['madeira, árvore, lenho','ξύλον pode significar madeira, objeto de madeira ou árvore. Em Ap 2:7 a expressão ξύλον τῆς ζωῆς designa a árvore da vida, retomando o Éden.','Não pressupor que o lema sempre signifique árvore, como em outros contextos neotestamentários.'],
G3857:['jardim, paraíso','παράδεισος denota jardim ou paraíso. Em 2:7 integra a promessa escatológica e dialoga com o jardim primordial.','A forma παραδείσῳ está no dativo após ἐν; «paraíso» é tradução contextual.'],
G4432:['pobreza, privação material','πτωχεία nomeia condição de pobreza e carência. Em 2:9 contrasta com πλούσιος εἶ para estabelecer avaliação espiritual diferente das condições materiais.','Não inferir automaticamente uma riqueza monetária prometida à comunidade.'],
G988:['blasfêmia, difamação, fala injuriosa','βλασφημία pode significar blasfêmia ou calúnia/difamação, de acordo com o referente. Em 2:9 a acusação hostil feita contra a igreja favorece «difamação».','A expressão polêmica precisa ser situada no conflito local do primeiro século.'],
G4735:['coroa, grinalda de honra','στέφανος denota coroa ou grinalda de honra, vitória ou reconhecimento; sua distinção lexical de διάδημα é pertinente, sem absolutizá-la.','Em 2:10 é ligado ao genitivo τῆς ζωῆς: «coroa da vida».'],
G91:['fazer injustiça, prejudicar, causar dano','ἀδικέω é agir injustamente ou causar dano. Em 2:11, a forma ἀδικηθῇ é aoristo passivo subjuntivo após οὐ μή, negação enfática prospectiva.','A glosa contextual é «não sofrerá dano», e não «não cometerá injustiça».'],
G1208:['segundo, de segunda ordem','δεύτερος expressa posição ordinal. Em Ap 2:11 qualifica θανάτου, formando a expressão «segunda morte».','A escatologia dessa morte depende do conjunto de Apocalipse (20:6,14; 21:8).']
};
let updated=0;
for(const [strong,[label,definition,explanation]] of Object.entries(edits)){
 const e=data.entries[strong];if(!e)continue;
 e.senses[0].label=label;e.senses[0].definition=definition;
 for(const example of e.senses[0].examples)example.explanation=explanation;
 updated++;
}
data.editorialStatus='Verbetes centrais revisados contextualmente; os demais significados permanecem em rascunho até cotejo lexical especializado.';
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
console.log('Verbetes críticos revisados:',updated);
