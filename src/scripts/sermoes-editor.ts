import { books, names } from "../data/livros";
import { addCitation, loadSermons, newSermon, saveSermon, sections, type Sermon } from "../data/sermoes";

const find = <T extends HTMLElement>(id:string) => document.querySelector<T>("#"+id)!;
const form=find<HTMLFormElement>("sermon-form");
const library=find("sermon-list");
const status=find("sermon-status");
const filter=find<HTMLSelectElement>("sermon-filter");
const search=find<HTMLInputElement>("sermon-search");
const reader=find<HTMLAnchorElement>("sermon-reader");
const pulpit=find<HTMLDialogElement>("pulpit");
const strongLinks=find("sermon-strong");
const fields=["title","subtitle","format","stage","book","chapter","start","end","series","date","minutes","strong"] as const;
const readField=(name:string)=>form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const title=(draft:Sermon)=>draft.title.trim() || "Esboço sem título";
const bookName=(draft:Sermon)=>names[books.indexOf(draft.book)] || draft.book;
const reference=(draft:Sermon)=>bookName(draft)+" "+draft.chapter+":"+draft.start+(draft.end && draft.end!==draft.start?"–"+draft.end:"");
const normalize=(value:string)=>value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/\p{M}/gu,"");
const activeUrl=new URL(location.href);
let drafts:Sermon[]=[];
try { drafts=loadSermons(); } catch { status.textContent="O armazenamento local está indisponível."; }
let active=drafts.find(draft=>draft.id===activeUrl.searchParams.get("esboco")) ?? drafts[0];

function append(parent:HTMLElement, tag:string, text:string) {
  const element=document.createElement(tag);
  element.textContent=text;
  parent.append(element);
  return element;
}
function save(draft:Sermon) {
  try {
    saveSermon(draft);
    drafts=loadSermons();
    status.textContent="Salvo neste navegador.";
  } catch {
    drafts=[draft,...drafts.filter(item=>item.id!==draft.id)];
    status.textContent="O navegador não conseguiu salvar este esboço.";
  }
}
function list() {
  library.replaceChildren();
  const query=normalize(search.value.trim());
  const matches=drafts.filter(draft=>(!filter.value || draft.format===filter.value)&&normalize([title(draft),draft.subtitle,draft.series,reference(draft),...Object.values(draft.content)].join(" ")).includes(query));
  for(const draft of matches) {
    const button=document.createElement("button");
    button.type="button";
    button.className="ps-control";
    button.setAttribute("aria-pressed",String(active?.id===draft.id));
    append(button,"strong",title(draft));
    append(button,"span",draft.format+" · "+draft.stage+" · "+reference(draft));
    button.onclick=()=>{ active=draft; display(); find<HTMLInputElement>("sermon-form").querySelector<HTMLInputElement>('input[name="title"]')?.focus(); };
    library.append(button);
  }
  if(!matches.length) append(library,"p",drafts.length?"Nenhum esboço encontrado.":"Nenhum esboço salvo.");
}
function citations() {
  const container=find("sermon-citations");
  container.replaceChildren();
  if(!active?.citations.length) append(container,"p","Nenhuma citação inserida.");
  for(const item of active?.citations ?? []) {
    const article=append(container,"article","");
    const link=document.createElement("a");
    link.href="/biblia/?"+new URLSearchParams({livro:item.book,ref:item.sourceRef || item.ref,esboco:active.id});
    link.textContent=item.name+" "+(item.sourceRef || item.ref)+" · Bíblia Livre";
    article.append(link);
    append(article,"p",item.text);
    const button=document.createElement("button");
    button.type="button";
    button.className="ps-control";
    button.textContent="Remover citação";
    button.onclick=()=>{
      active.citations=active.citations.filter(quote=>quote!==item);
      save(active);
      citations();
    };
    article.append(button);
  }
}
function summary() {
  if(!active)return;
  reader.href="/biblia/?"+new URLSearchParams({livro:active.book,ref:active.chapter+":"+active.start,esboco:active.id});
  const words=Object.values(active.content).join(" ").match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  find("sermon-words").textContent=words+" palavras no esboço · "+Math.ceil(words/130)+" min de leitura estimada";
  strongLinks.replaceChildren();
  for(const id of new Set(active.strong?.toUpperCase().match(/\b[GH]\d+\b/g) || [])){
    const link=document.createElement("a");
    link.href="/interlinear-experimental/?"+new URLSearchParams({modo:"strong",termo:id,esboco:active.id})+"#busca";
    link.textContent=id+" ↗";
    strongLinks.append(link);
  }
}
function display() {
  form.hidden=!active;
  find("sermon-empty").hidden=Boolean(active);
  for(const id of ["sermon-copy","sermon-export","sermon-pulpit","sermon-outline"])find<HTMLButtonElement>(id).disabled=!active;
  if(active){
    for(const name of fields) readField(name).value=active[name] ?? "";
    for(const [id] of sections) readField(id).value=active.content[id] ?? "";
    activeUrl.searchParams.set("esboco",active.id);
    history.replaceState(null,"",activeUrl);
    summary();
    citations();
  }
  list();
}
form.onsubmit=event=>event.preventDefault();
form.addEventListener("input",event=>{
  if(!active)return;
  const target=event.target as HTMLInputElement;
  if(sections.some(([id])=>id===target.name)) active.content[target.name]=target.value;
  else if(fields.some(name=>name===target.name)) Object.assign(active,{[target.name]:target.value});
  else return;
  save(active);
  summary();
  list();
});
search.oninput=list;
filter.onchange=list;
function create(draft:Sermon){
  active=draft;
  save(draft);
  display();
  readField("title").focus();
}
find("sermon-new").onclick=()=>create(newSermon());
find("sermon-duplicate").onclick=()=>{if(active) create({...structuredClone(active),id:crypto.randomUUID(),title:title(active)+" (cópia)",stage:"Rascunho"});};
find("sermon-outline").onclick=event=>{
  const links=find("outline-links");
  links.hidden=!links.hidden;
  (event.currentTarget as HTMLButtonElement).setAttribute("aria-expanded",String(!links.hidden));
};
find<HTMLButtonElement>("sermon-quote").onclick=async event=>{
  if(!active || !form.reportValidity())return;
  const draft=active;
  const {book,chapter,start,end}=draft;
  if(end && Number(end)<Number(start)){status.textContent="O versículo final deve ser igual ou posterior ao inicial.";return;}
  const button=event.currentTarget as HTMLButtonElement;
  button.disabled=true;
  try{
    const response=await fetch("/interlinear-enrichment/portugues/"+encodeURIComponent(book)+".json");
    if(!response.ok)throw new Error();
    const chapterText:Record<string,string>=await response.json();
    if(active!==draft || book!==draft.book || chapter!==draft.chapter || start!==draft.start || end!==draft.end)return;
    if(!chapterText[chapter+":"+start] || !chapterText[chapter+":"+(end || start)]){
      status.textContent="Confira o capítulo e os versículos na Bíblia Livre.";
      return;
    }
    let count=0;
    for(const [ref,text] of Object.entries(chapterText)){
      const [c,v]=ref.split(":");
      if(c===chapter && Number(v)>=Number(start) && Number(v)<=Number(end || start) && addCitation(draft,{book,name:bookName(draft),ref,sourceRef:ref,text}))count++;
    }
    if(count){save(draft);citations();}
    else status.textContent="Esta perícope já está nas citações.";
  }catch{status.textContent="Não foi possível consultar a Bíblia Livre.";}
  finally{button.disabled=false;}
};
function markdown(draft:Sermon){
  const metadata=[reference(draft),draft.format,draft.stage,draft.series,draft.date,draft.minutes && draft.minutes+" min"].filter(Boolean).join(" · ");
  const body=sections.filter(([id])=>draft.content[id]?.trim()).map(([id,label])=>"## "+label+"\n\n"+draft.content[id]);
  const quotes=draft.citations.map(item=>"> "+item.text.replaceAll("\n","\n> ")+"\n\n— "+item.name+" "+(item.sourceRef || item.ref)+" (Bíblia Livre)");
  return ["# "+title(draft),draft.subtitle,metadata,...body,quotes.length?"## Citações bíblicas\n\n"+quotes.join("\n\n"):"",draft.strong?.trim()?"## Índices Strong\n\n"+draft.strong:""].filter(Boolean).join("\n\n")+"\n";
}
find("sermon-copy").onclick=async()=>{
  if(!active)return;
  try{await navigator.clipboard.writeText(markdown(active)); status.textContent="Esboço copiado.";}
  catch{status.textContent="A cópia não foi autorizada pelo navegador. Use Baixar Markdown.";}
};
find("sermon-export").onclick=()=>{
  if(!active)return;
  const url=URL.createObjectURL(new Blob([markdown(active)],{type:"text/markdown;charset=utf-8"}));
  const link=document.createElement("a");
  link.href=url;
  link.download=(normalize(title(active)).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"sermao")+".md";
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};
find("sermon-pulpit").onclick=()=>{
  if(!active)return;
  find("pulpit-title").textContent=title(active);
  const body=find("pulpit-content");
  body.replaceChildren();
  if(active.subtitle)append(body,"p",active.subtitle);
  append(body,"p",reference(active));
  for(const [id,label] of sections){
    const text=active.content[id]?.trim();
    if(text){ append(body,"h3",label); append(body,"p",text); }
  }
  if(active.citations.length)append(body,"h3","Citações bíblicas");
  for(const item of active.citations)append(body,"p",item.name+" "+(item.sourceRef||item.ref)+" · "+item.text);
  pulpit.showModal();
};
display();
