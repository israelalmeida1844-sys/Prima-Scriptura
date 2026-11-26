type Entry = { lemma: string; senses: {label:string; definition:string}[] };
type EditorialFile = { entries?: Record<string, Entry>; definitions?: Record<string,string> };
const files=import.meta.glob<EditorialFile>(["../data/lexico-hebraico/*.json","../data/lexico-grego/*.json"],{eager:true,import:"default"});
export function GET(){
  const entries:Record<string,{lemma:string; definitions:string[]}>=Object.create(null);
  for(const file of Object.values(files)){
    for(const [id,entry] of Object.entries(file.entries ?? {})){
      if(!/^[HG]\d+$/.test(id) || !entry.lemma || !entry.senses?.length)continue;
      const definitions=entry.senses.filter(sense=>sense.definition).map(sense=>sense.definition);
      if(!definitions.length)continue;
      entries[id] ??= {lemma:entry.lemma,definitions};
    }
    for(const [lemma,definition] of Object.entries(file.definitions ?? {})){
      if(typeof definition==="string") entries["grc:"+lemma.normalize("NFC")]={lemma,definitions:[definition]};
    }
  }
  // Síntese do substantivo comum, a partir das acepções TBESH (STEP Bible, CC BY 4.0).
  entries.H1121 ??= {lemma:"בֵּן",definitions:["Filho ou descendente. Conforme o contexto, também pode indicar um membro de uma família ou de um grupo."]};
  return new Response(JSON.stringify(entries),{headers:{"Content-Type":"application/json; charset=utf-8"}});
}
