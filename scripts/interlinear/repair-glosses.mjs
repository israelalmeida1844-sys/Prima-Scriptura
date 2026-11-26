import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const rules = {
  "πεινάω": { fome: {
    "3PAI-S--":"tem fome", "3AAS-S--":"tenha fome", "-PAPNPM-":"tendo fome",
    "3AAI-S--":"teve fome", "3AAI-P--":"tiveram fome", "1AAI-S--":"tive fome",
    "-PAPASM-":"com fome", "-PAN----":"ter fome", "3FAI-P--":"terão fome",
  }},
  "διψάω": { sede: {
    "3FAI-S--":"terá sede", "1PAS-S--":"tenha sede", "3PAS-S--":"tenha sede",
    "1PAI-S--":"tenho sede", "-PAPNPM-":"tendo sede", "1AAI-S--":"tive sede",
    "-PAPASM-":"com sede", "3FAI-P--":"terão sede", "-PAPNSM-":"tendo sede",
  }},
  "εὐχαριστέω": { graças: {
    "-AAPNSM-":"tendo dado graças", "2PAI-S--":"dás graças", "-PAN----":"dar graças",
    "-PAPNPM-":"dando graças", "-AAPGSM-":"tendo dado graças", "1PAI-S--":"dou graças",
    "3PAI-S--":"dá graças",
  }},
  "προσέχω": { atenção: {
    "-PAN----":"prestar atenção", "-PAPNPM-":"prestando atenção", "3IAI-P--":"prestavam atenção",
  }},
  "σπλαγχνίζομαι": { compaixão: {
    "3API-S--":"teve compaixão", "1PMI-S--":"tenho compaixão", "-APPNSM-":"tendo compaixão",
  }},
  "παρρησιάζομαι": { ousadia: {
    "-PMPNSM-":"falando com ousadia", "-AMPNPM-":"tendo falado com ousadia", "1AMS-S--":"fale com ousadia",
  }},
};

// Versículos em que a expressão precisa de revisão contextual ou o alinhamento deslocou glosas vizinhas.
const verses = {
  "Deut 13:9": { 11:["2550","compaixão","terás compaixão"] },
  "Ps 63:2": { 4:["6770","sede","tem sede"] },
  "Ps 90:13": { 4:["c/5162","compaixão","tem compaixão"] },
  "Ps 94:7": { 5:["995","atenção","presta atenção"] },
  "Ps 102:18": { 0:["6437","atenção","deu atenção"] },
  "Ps 106:7": { 3:["7919 a","atenção","deram atenção"] },
  "Isa 13:18": { 6:["7355","compaixão","terão compaixão"] },
  "Isa 44:12": { 11:["7456","fome","tem fome"] },
  "Isa 49:13": { 12:["7355","compaixão","terá compaixão"] },
  "Isa 51:19": { 4:["5110","compaixão","terá compaixão"] },
  "Jonah 2:9": { 0:["8104","atenção","dão atenção"] },
  "John 12:33": { 3:["σημαίνω","indicando","dando a entender"] },
  "John 18:32": { 8:["σημαίνω","dando","dando a entender"] },
  "John 21:19": { 3:["σημαίνω","indicando","dando a entender"] },
  "Acts 11:28": { 7:["σημαίνω","declarou","deu a conhecer"] },
  "Acts 25:27": {
    0:["ἄλογος","irracionais","sem razão"], 5:["δέσμιος","razoável","um preso"],
    11:["αἰτία","informar","acusações"], 12:["σημαίνω","as-acusações","dar a conhecer"],
  },
  "Rev 1:1": {
    18:["σημαίνω","indicando","deu a conhecer por sinais"],
    19:["ἀποστέλλω","enviou","tendo enviado"],
  },
  "Luke 22:17": { 3:["εὐχαριστέω","Deus","tendo dado graças"] },
  "Matt 4:2": { 7:["ὕστερος","teve","depois"] },
};

const exact = value => value.trim().toLowerCase().normalize("NFC");
const flexible = value => exact(value).normalize("NFD").replace(/\p{M}/gu,"").replace(/\s+/gu," ").trim();
const compare = (a,b) => a[0]-b[0] || a[1]-b[1] || a[2]-b[2];

export async function repairGlosses(directory) {
  const read = async path => JSON.parse(await readFile(resolve(directory,path),"utf8"));
  const write = (path,data) => writeFile(resolve(directory,path),JSON.stringify(data)+"\n");
  const meta=await read("interlinear-search/manifest.json");
  const shards=new Map();
  const originalShards=new Set(meta.shards);
  const reviewed=new Set();
  let count=0;
  async function changeIndex(kind,term,location,add){
    const key=kind==="exato"?exact(term):flexible(term);
    const hash=createHash("sha256").update(key).digest("hex").slice(0,2);
    const name="glosa/"+kind+"/"+hash;
    const path="interlinear-search/index/"+name+".json";
    if(!shards.has(name))shards.set(name,originalShards.has(name)?await read(path):{});
    const shard=shards.get(name);
    const original=Object.hasOwn(shard,key)?shard[key]:[];
    const rows=original.filter(item=>compare(item,location)!==0);
    if(add)rows.push(location);
    if(rows.length)Object.defineProperty(shard,key,{value:rows.sort(compare),writable:true,enumerable:true,configurable:true});
    else delete shard[key];
  }
  for(const [b,book] of meta.books.entries()){
    const source=await read("interlinear-corpus/"+book+".json");
    const glosses=await read("interlinear-gloss-review/"+book+".json");
    const table=await read("interlinear-search/books/"+book+".json");
    let changed=false;
    for(const [v,ref] of table.refs.entries()){
      const inspection=verses[book+" "+ref] || {};
      for(const [i,word] of source[ref].entries()){
        const entry=glosses[ref].words[i];
        const selected=inspection[i];
        const before=entry.gloss_pt;
        if(selected && (selected[0]!==word.lemma || selected[1]!==before))throw Error("Glosa de origem mudou em "+book+" "+ref+" palavra "+i);
        const alternatives=rules[word.lemma];
        const after=selected?.[2] || alternatives?.[before]?.[word.morph];
        if(!after || after===before)continue;
        if(selected)reviewed.add(book+" "+ref+" "+i);
        if(table.rows[v][i][3]!==before)throw Error("Índice dessincronizado em "+book+" "+ref+" palavra "+i);
        entry.gloss_source={...entry.gloss_source,original_gloss:before,evidence:"Revisão contextual ou recomposição por lema e morfologia"};
        entry.gloss_pt=after;
        entry.gloss_status="corrigida_pontualmente";
        table.rows[v][i][3]=after;
        for(const kind of ["exato","flexivel"]){
          await changeIndex(kind,before,[b,v,i],false);
          await changeIndex(kind,after,[b,v,i],true);
        }
        changed=true;
        count++;
      }
    }
    if(changed){
      await write("interlinear-gloss-review/"+book+".json",glosses);
      await write("interlinear-search/books/"+book+".json",table);
    }
  }
  if(reviewed.size!==Object.values(verses).reduce((sum,items)=>sum+Object.keys(items).length,0))throw Error("Revisões contextuais não encontradas");
  for(const [name,data] of shards)await write("interlinear-search/index/"+name+".json",data);
  meta.shards=[...new Set([...meta.shards,...shards.keys()])].sort();
  await write("interlinear-search/manifest.json",meta);
  return {count,books:meta.books.length};
}
