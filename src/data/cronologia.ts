type Marco = {
  id: string;
  titulo: string;
  periodo: string;
  data: string;
  certeza: "Sem data" | "Hipotética" | "Aproximada" | "Documentada";
  livro: string;
  ref: string;
  passagem: string;
  nota: string;
  pessoas: string[];
  fonte?: string;
};

export const marcos: Marco[] = [
  {id:"criacao",titulo:"Criação",periodo:"Origens",data:"Sem data histórica",certeza:"Sem data",livro:"Gen",ref:"1:1",passagem:"Gênesis 1–2",nota:"O relato abre a sequência narrativa. A passagem não fornece uma data em calendário absoluto.",pessoas:[]},
  {id:"diluvio",titulo:"Dilúvio",periodo:"Origens",data:"Sem data histórica",certeza:"Sem data",livro:"Gen",ref:"6:9",passagem:"Gênesis 6–9",nota:"A genealogia e a narrativa estabelecem a sequência literária.",pessoas:["Noé","Sem","Cam","Jafé"]},
  {id:"patriarcas",titulo:"Chamado de Abraão",periodo:"Patriarcas",data:"Início do II milênio a.C. (proposta)",certeza:"Hipotética",livro:"Gen",ref:"12:1",passagem:"Gênesis 12–36",nota:"Contextualização tradicional proposta para o ciclo patriarcal. O relato não oferece um sincronismo externo conclusivo.",pessoas:["Abraão","Sara","Isaque","Rebeca","Jacó","Esaú"]},
  {id:"jose",titulo:"José e a família de Jacó no Egito",periodo:"Patriarcas",data:"Sem data histórica",certeza:"Sem data",livro:"Gen",ref:"46:1",passagem:"Gênesis 37–50",nota:"A passagem descreve a migração da família e introduz a narrativa do Êxodo.",pessoas:["José","Jacó"]},
  {id:"exodo",titulo:"Saída do Egito",periodo:"Êxodo e assentamento",data:"Século XV ou XIII a.C. (propostas)",certeza:"Hipotética",livro:"Exod",ref:"12:31",passagem:"Êxodo 12–14",nota:"As propostas usam critérios distintos, entre eles a leitura de 1 Reis 6:1 e as associações com o período raméssida.",pessoas:["Moisés","Arão","Miriã"]},
  {id:"assentamento",titulo:"Travessia do Jordão",periodo:"Êxodo e assentamento",data:"Sem data histórica",certeza:"Sem data",livro:"Josh",ref:"3:1",passagem:"Josué 3–4",nota:"O episódio é situado na sequência bíblica após a morte de Moisés.",pessoas:["Josué"]},
  {id:"juizes",titulo:"Período dos juízes",periodo:"Juízes",data:"Sem data absoluta para o início",certeza:"Sem data",livro:"Judg",ref:"2:16",passagem:"Juízes 2–16",nota:"Os períodos de atuação regional e os intervalos narrativos não constituem por si uma cronologia absoluta.",pessoas:["Débora","Gideão","Sansão"]},
  {id:"saul",titulo:"Saul é ungido rei",periodo:"Monarquia unida",data:"Século XI a.C. (estimativa)",certeza:"Aproximada",livro:"1Sam",ref:"10:1",passagem:"1 Samuel 9–10",nota:"O século indica o período convencional atribuído ao início da monarquia.",pessoas:["Saul","Samuel"]},
  {id:"davi",titulo:"Davi conquista Jerusalém",periodo:"Monarquia unida",data:"c. 1000 a.C.",certeza:"Aproximada",livro:"2Sam",ref:"5:6",passagem:"2 Samuel 5:6–10",nota:"A estimativa situa o episódio no começo do reinado de Davi sobre Israel.",pessoas:["Davi"]},
  {id:"templo",titulo:"Construção do primeiro templo",periodo:"Monarquia unida",data:"Século X a.C.",certeza:"Aproximada",livro:"1Kgs",ref:"6:1",passagem:"1 Reis 6–8",nota:"A referência bíblica situa o início da obra no quarto ano de Salomão.",pessoas:["Salomão"]},
  {id:"divisao",titulo:"Divisão dos reinos",periodo:"Reinos divididos",data:"c. 930 a.C.",certeza:"Aproximada",livro:"1Kgs",ref:"12:16",passagem:"1 Reis 12",nota:"Jeroboão assume o reino do norte e Roboão permanece em Judá.",pessoas:["Jeroboão","Roboão"]},
  {id:"samaria",titulo:"Queda de Samaria",periodo:"Reinos divididos",data:"722/721 a.C.",certeza:"Documentada",livro:"2Kgs",ref:"17:6",passagem:"2 Reis 17:1–6",nota:"A conquista assíria é atestada. A atribuição das fases finais do cerco e a conversão dos anos régios exigem distinção entre fontes.",pessoas:["Oseias","Salmaneser V","Sargão II"],fonte:"https://www.britannica.com/place/Samaria-historical-region-Middle-East"},
  {id:"jerusalem",titulo:"Destruição de Jerusalém",periodo:"Exílio e retorno",data:"587/586 a.C.",certeza:"Aproximada",livro:"2Kgs",ref:"25:8",passagem:"2 Reis 25:8–12",nota:"A data deriva da conversão do ano régio de Nabucodonosor. Há propostas com diferença de um ano.",pessoas:["Nabucodonosor II","Zedequias"]},
  {id:"babilonia",titulo:"Conquista persa da Babilônia",periodo:"Exílio e retorno",data:"539 a.C.",certeza:"Documentada",livro:"Dan",ref:"5:30",passagem:"Daniel 5:30–31",nota:"A data absoluta diz respeito à conquista de Babilônia por Ciro. O cilindro de Ciro documenta o contexto da conquista e a política régia.",pessoas:["Ciro","Belsazar"],fonte:"https://www.britishmuseum.org/collection/object/W_1880-0617-1941"},
  {id:"retorno",titulo:"Retorno e reconstrução do templo",periodo:"Exílio e retorno",data:"c. 538–516 a.C.",certeza:"Aproximada",livro:"Ezra",ref:"1:1",passagem:"Esdras 1–6",nota:"O texto liga o retorno ao primeiro ano de Ciro e a conclusão da obra ao sexto ano de Dario.",pessoas:["Ciro","Zorobabel","Dario I"]},
  {id:"muros",titulo:"Reconstrução dos muros de Jerusalém",periodo:"Exílio e retorno",data:"c. 445/444 a.C.",certeza:"Aproximada",livro:"Neh",ref:"2:1",passagem:"Neemias 2–6",nota:"A referência se situa no vigésimo ano de Artaxerxes.",pessoas:["Neemias","Artaxerxes I"]},
];

export const genealogias = [
  {nome:"De Adão a Noé", pessoas:"Adão → Sete → Enos → Cainã → Maalalel → Jarede → Enoque → Matusalém → Lameque → Noé", livro:"Gen", ref:"5:1", passagem:"Gênesis 5"},
  {nome:"De Abraão às tribos", pessoas:"Abraão → Isaque → Jacó (Israel) → os doze filhos de Jacó", livro:"Gen", ref:"35:22", passagem:"Gênesis 35:22–26"},
  {nome:"De Boaz a Davi", pessoas:"Boaz → Obede → Jessé → Davi", livro:"Ruth", ref:"4:21", passagem:"Rute 4:18–22"},
];

export const sincronismos = [
  {israel:"Jeroboão I", juda:"Roboão", livro:"1Kgs",ref:"12:20",passagem:"1 Reis 12:20–24"},
  {israel:"Nadabe", juda:"Asa (2º ano)", livro:"1Kgs",ref:"15:25",passagem:"1 Reis 15:25"},
  {israel:"Acabe", juda:"Asa (38º ano)", livro:"1Kgs",ref:"16:29",passagem:"1 Reis 16:29"},
  {israel:"Jorão", juda:"Josafá (18º ano)", livro:"2Kgs",ref:"3:1",passagem:"2 Reis 3:1"},
  {israel:"Jeú (7º ano)", juda:"Joás", livro:"2Kgs",ref:"12:1",passagem:"2 Reis 12:1"},
  {israel:"Oseias (3º ano)", juda:"Ezequias", livro:"2Kgs",ref:"18:1",passagem:"2 Reis 18:1"},
];
