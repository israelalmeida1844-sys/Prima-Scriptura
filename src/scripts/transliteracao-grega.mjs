/** Transliteração acadêmica: SBL e convenção editorial de iota subscrito explícito. */
export function transliterateGreek(input){
 const map={α:'a',β:'b',γ:'g',δ:'d',ε:'e',ζ:'z',η:'ē',θ:'th',ι:'i',κ:'k',λ:'l',μ:'m',ν:'n',ξ:'x',ο:'o',π:'p',ρ:'r',σ:'s',ς:'s',τ:'t',υ:'y',φ:'ph',χ:'ch',ψ:'ps',ω:'ō'};
 const words=String(input).normalize('NFD').match(/(?:[Α-Ωα-ω]\p{M}*)+/gu)||[];
 return words.map(word=>{
  const a=[...word.matchAll(/([Α-Ωα-ω])(\p{M}*)/gu)].map(([,base,marks])=>({base:base.toLowerCase(),upper:base!==base.toLowerCase(),marks}));
  const rough=x=>x?.marks.includes('\u0314');
  const dia=x=>x?.marks.includes('\u0308');
  const sub=x=>x?.marks.includes('\u0345');
  const vowel=x=>!!x&&'αεηιουω'.includes(x.base);
  const dip=(x,y)=>!!x&&!!y&&!dia(y)&&!sub(x)&&!sub(y)&&((y.base==='υ'&&'αεηο'.includes(x.base))||(y.base==='ι'&&'αεου'.includes(x.base)));
  const cap=(s,x)=>x.upper?s.charAt(0).toUpperCase()+s.slice(1):s;
  let out='';
  for(let i=0;i<a.length;i++){
   const x=a[i],y=a[i+1];let t=map[x.base]||'';
   if(dip(x,y)){
    t=(x.base==='υ'?'u':t)+(y.base==='υ'?'u':'i');
    if(i===0&&(rough(x)||rough(y))) t='h'+t;
    out+=cap(t,x);i++;continue;
   }
   if(x.base==='γ'&&y&&'γκξχ'.includes(y.base))t='n';
   if(x.base==='ρ'&&y?.base==='ρ'&&(rough(x)||rough(y))){out+=cap('rrh',x);i++;continue;}
   if(x.base==='ρ'&&rough(x))t='rh';
   else if(i===0&&vowel(x)&&rough(x))t='h'+t;
   if(sub(x))t+='i';
   out+=cap(t,x);
  }
  return out;
 }).join(' ');
}
