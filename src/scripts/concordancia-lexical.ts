export type Occurrence={book:string; reference:string; index:number; word:string; gloss:string|null};
const colors=["#315bd4","#bd343e","#a76b00","#007a6a","#7954ae","#b04278","#2676a3","#687793"];
const namespace="http://www.w3.org/2000/svg";
const pageSize=25;

function add<K extends keyof HTMLElementTagNameMap>(parent:HTMLElement,tag:K,value:string){
  const element=document.createElement(tag);
  element.textContent=value;
  parent.append(element);
  return element;
}

export function renderConcordance(parent:HTMLElement, rows:Occurrence[], lemma:string, label:string, names:Record<string,string>, navigate:(row:Occurrence)=>void){
  parent.replaceChildren();
  add(parent,"h3","Concordância completa");
  add(parent,"p",rows.length.toLocaleString("pt-BR")+" ocorrências · "+label);
  if(!rows.length)return;
  const missing="Sem glosa";
  const glossOf=(row:Occurrence)=>row.gloss?.replaceAll("-"," ") || missing;
  const counts=new Map<string,number>();
  for(const row of rows){
    const gloss=glossOf(row);
    counts.set(gloss,(counts.get(gloss) ?? 0)+1);
  }
  const sorted=[...counts].sort((a,b)=>b[1]-a[1] || a[0].localeCompare(b[0],"pt-BR"));
  const visible=sorted.length>8 ? sorted.slice(0,7) : sorted;
  const remainder=new Set(sorted.slice(visible.length).map(([gloss])=>gloss));
  const other="group:other";
  const groups=remainder.size?[...visible,[other,rows.length-visible.reduce((sum,[,count])=>sum+count,0)] as const]:visible;
  add(parent,"h4","Glosas em português");
  const layout=add(parent,"div","");
  layout.className="lex-chart-layout";
  const chart=add(layout,"div","");
  chart.className="lex-chart";
  const svg=document.createElementNS(namespace,"svg");
  svg.setAttribute("viewBox","0 0 200 200");
  svg.setAttribute("aria-hidden","true");
  chart.append(svg);
  const center=add(chart,"div","");
  center.className="lex-chart-center";
  add(center,"bdi",lemma);
  add(center,"small",rows.length.toLocaleString("pt-BR"));
  const legend=add(layout,"div","");
  legend.className="lex-chart-legend";
  const filterLabel=add(parent,"label","Filtrar por glosa ");
  const select=add(filterLabel,"select","");
  select.add(new Option("Todas as glosas",""));
  if(remainder.size)select.add(new Option("Outras glosas",other));
  for(const [gloss,count] of sorted)select.add(new Option(gloss+" ("+count+")",gloss));
  const results=add(parent,"div","");
  results.className="lex-occurrences";
  const status=add(parent,"p","");
  status.setAttribute("role","status");
  const controls=add(parent,"div","");
  const prev=add(controls,"button","Anterior");
  const next=add(controls,"button","Próxima");
  prev.type=next.type="button";
  let page=0;
  const buttons:HTMLButtonElement[]=[];
  function refresh(){
    const value=select.value;
    const filtered=value?rows.filter(row=>value===other?remainder.has(glossOf(row)):glossOf(row)===value):rows;
    const start=page*pageSize;
    for(const [index,button] of buttons.entries())button.setAttribute("aria-pressed",String(value===groups[index][0]));
    results.replaceChildren();
    for(const row of filtered.slice(start,start+pageSize)){
      const entry=add(results,"div","");
      const link=add(entry,"a",(names[row.book] || row.book)+" "+row.reference);
      link.href="/interlinear-experimental/?"+new URLSearchParams({livro:row.book,ref:row.reference,palavra:String(row.index)});
      link.onclick=event=>{
        if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        event.preventDefault();
        navigate(row);
      };
      add(entry,"span",row.word+" · "+glossOf(row)).dir="auto";
    }
    status.textContent=(start+1)+"–"+Math.min(start+pageSize,filtered.length)+" de "+filtered.length.toLocaleString("pt-BR")+" ocorrências";
    prev.disabled=page===0;
    next.disabled=start+pageSize>=filtered.length;
  }
  function choose(value:string){select.value=select.value===value?"":value;page=0;refresh();}
  let offset=0;
  const circumference=2*Math.PI*79;
  for(const [index,[gloss,count]] of groups.entries()){
    const span=count/rows.length*circumference;
    const arc=document.createElementNS(namespace,"circle");
    for(const [key,value] of Object.entries({cx:"100",cy:"100",r:"79",fill:"none",stroke:colors[index],"stroke-width":"28","stroke-dasharray":span+" "+circumference,"stroke-dashoffset":String(-offset),transform:"rotate(-90 100 100)"}))arc.setAttribute(key,value);
    arc.addEventListener("click",()=>choose(gloss));
    svg.append(arc);
    offset+=span;
    const button=add(legend,"button","");
    button.type="button";
    const swatch=add(button,"i","");
    swatch.style.backgroundColor=colors[index];
    add(button,"span",gloss===other?"Outras glosas":gloss);
    add(button,"strong",count.toLocaleString("pt-BR"));
    button.onclick=()=>choose(gloss);
    buttons.push(button);
  }
  select.onchange=()=>{page=0;refresh();};
  prev.onclick=()=>{page--;refresh();results.scrollIntoView({block:"nearest"});};
  next.onclick=()=>{page++;refresh();results.scrollIntoView({block:"nearest"});};
  refresh();
}
