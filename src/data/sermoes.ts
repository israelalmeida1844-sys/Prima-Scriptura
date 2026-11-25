export const formats = ["Expositivo", "Estudo", "Textual", "Temático"] as const;
export const stages = ["Rascunho", "Em revisão", "Pronto"] as const;
export const sections = [
  ["proposicao", "Proposição central", "Resuma a ideia principal da passagem em uma frase."],
  ["introducao", "Introdução", "Apresente a pergunta ou situação que conduz ao texto."],
  ["contexto", "Contexto", "Registre o contexto literário, histórico e canônico."],
  ["exegese", "Exegese", "Anote observações sobre o texto e sua interpretação."],
  ["desenvolvimento", "Desenvolvimento", "Organize os pontos da exposição."],
  ["ilustracoes", "Ilustrações", "Registre exemplos que esclarecem os pontos."],
  ["aplicacao", "Aplicações", "Formule implicações concretas da passagem."],
  ["conclusao", "Conclusão", "Retome a proposição e encerre a exposição."],
] as const;

export type Citation = { book:string; name:string; ref:string; sourceRef:string|null; text:string };
export type Sermon = {
  id:string; title:string; subtitle:string; format:typeof formats[number]; stage:typeof stages[number];
  book:string; chapter:string; start:string; end:string; series:string; date:string; minutes:string;
  updated:number; strong?:string; content:Record<string,string>; citations:Citation[];
};
const key = "prima-scriptura-sermons-v2";
const legacy = "prima-scriptura-sermon-v1";
export function newSermon(passage?:Citation):Sermon {
  const [chapter,start] = passage?.sourceRef?.split(":") ?? ["1","1"];
  return {
    id:crypto.randomUUID(), title:passage ? "Sermão expositivo · "+passage.name+" "+passage.sourceRef : "",
    subtitle:"", format:"Expositivo", stage:"Rascunho", book:passage?.book ?? "Gen",
    chapter, start, end:"", series:"", date:"", minutes:"35", updated:Date.now(), strong:"", content:{},
    citations:passage ? [passage] : [],
  };
}

export function addCitation(sermon:Sermon, citation:Citation) {
  if (sermon.citations.some(item => item.book===citation.book && item.sourceRef===citation.sourceRef)) return false;
  sermon.citations.push(citation);
  return true;
}

export function loadSermons():Sermon[] {
  const saved=localStorage.getItem(key);
  if(saved) return JSON.parse(saved);
  const previous:unknown=JSON.parse(localStorage.getItem(legacy) || "[]");
  if(!Array.isArray(previous) || !previous.length) return [];
  const draft=newSermon();
  draft.title="Passagens do esboço anterior";
  for(const item of previous) {
    if(item && typeof item.book==="string" && typeof item.name==="string" && typeof item.text==="string" && typeof item.sourceRef==="string") addCitation(draft,item);
  }
  if(!draft.citations.length) return [];
  saveSermon(draft,[]);
  return [draft];
}

export function saveSermon(sermon:Sermon, existing=loadSermons()) {
  sermon.updated=Date.now();
  localStorage.setItem(key,JSON.stringify([sermon,...existing.filter(item=>item.id!==sermon.id)]));
}
