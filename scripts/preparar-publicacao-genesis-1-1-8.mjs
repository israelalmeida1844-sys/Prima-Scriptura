/**
 * Prima Scriptura — Deriva resumo público enxuto dos oito JSONs exaustivos.
 * Não reescreve os dados fonte WLC/OSHB e mantém concordâncias integrais.
 * Evita carregar cerca de 106 mil registros na interface inicial.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';

const out='src/data/estrutura-hebraica/genesis-1-1-8-resumo.json';
const files='public/data/genesis-estruturado/';
const srcNotes='src/editorial/genesis/';
const publicNotes='public/notas/genesis/';
const expected={1:7,2:14,3:6,4:12,5:13,6:11,7:17,8:10};
const summary={source:'Westminster Leningrad Codex / OSHB v.2.2',state:'edição pública para avaliação filológica',verses:{}};
const totals={tokens:0,uniqueStrong:new Set(),referenceRows:0};
const fieldNames=['verseRef','versePt','translationPt','translationNotePt','lexemes','tokens','concordanceByStrong'];
for(let v=1;v<=8;v++){
 const prefix=files+'GEN.1.'+v;
 const data=JSON.parse(await readFile(prefix+'-estruturado-completo.json','utf8'));
 const audit=JSON.parse(await readFile(prefix+'-auditoria-de-fonte.json','utf8'));
 if(Object.keys(data).join('|')!==fieldNames.join('|'))throw Error('Formato incompatível: '+v);
 if(data.verseRef!=='GEN.1.'+v||data.versePt!=='Gn 1:'+v||data.tokens.length!==expected[v])
  throw Error('Conteúdo incompleto Gn 1:'+v);
 if(!data.translationPt||!data.translationNotePt)throw Error('Tradução em branco: '+v);
 if(v>1&&(!audit.allPortugueseExcerptsPresent||!audit.rawCodesVerified||
   !audit.consonantalMatches||audit.alignmentUnavailable.length||audit.alignmentWarnings.length))
  throw Error('Auditoria não aprovada: '+v);
 if(v===1&&(audit.alignmentUnavailableCount!==0||audit.alignmentWarningCount!==0))
  throw Error('Auditoria aprovada Gn 1:1 divergente');
 const ids=Object.keys(data.lexemes);
 if(ids.length!==Object.keys(data.concordanceByStrong).length)throw Error('Número de lemas incorreto');
 const concordances=[];
 for(const strong of ids){
  const lex=data.lexemes[strong],c=data.concordanceByStrong[strong];
  if(!lex||lex.strong!==strong||!lex.lemmaHe||!lex.lemmaTranslit||!c)throw Error('Lema não documentado '+strong);
  if(!Array.isArray(c.items)||c.items.length!==c.totalCount)throw Error('Concordância incompleta '+strong);
  if(Object.values(c.countsBySection).reduce((a,b)=>a+b,0)!==c.totalCount)
   throw Error('Distribuição canônica incorreta '+strong);
  const seen=new Set();
  for(const item of c.items){
   if(!item.ref||!item.refPt||!item.bookId||!item.bookPt||!item.sectionPt||
      !item.excerptHe||!item.excerptPt||item.excerptPt.startsWith('['))
    throw Error('Item de concordância incompleto '+strong);
   if(!['pentateuco','profetas','escritos'].includes(item.section))
    throw Error('Seção canônica inválida '+strong);
   if(seen.has(item.ref))throw Error('Versículo duplicado '+strong+' '+item.ref);
   seen.add(item.ref);
  }
  const tokenCount=audit.counts[strong]?.tokenCount;
  if(!Number.isInteger(tokenCount)||tokenCount<c.totalCount)
   throw Error('Frequência lexical inválida '+strong);
  concordances.push({strong,lemmaHe:lex.lemmaHe,lemmaTranslit:lex.lemmaTranslit,
    tokenCount,totalCount:c.totalCount,countsBySection:c.countsBySection});
  totals.uniqueStrong.add(strong);
  totals.referenceRows+=c.items.length;
 }
 for(const token of data.tokens){
  if(!data.lexemes[token.strong]||!token.morphology.rawCode||!token.syntax.role||
     !token.syntax.roleLabel||!token.syntax.clauseId||!token.sensesPt)
   throw Error('Anotação morfossintática insuficiente '+token.id);
  if(token.syntax.governedBy&&!data.tokens.some(x=>x.id===token.syntax.governedBy))
   throw Error('Governador inexistente '+token.id);
 }
 const notes=await readFile(srcNotes+'NOTAS-COMPLETAS-GENESIS-1-'+v+'.md','utf8');
 const pattern=v===1?/### 2\. Estrutura sintática\s*\n+([\s\S]*?)(?=\n### )/:
   /### Análise exegética e relações entre as orações\s*\n+([\s\S]*?)(?=\n### )/;
 const match=notes.match(pattern);
 if(!match)throw Error('Sem notas acadêmicas '+v);
 const overview=match[1].split(/\n\n/)[0].replace(/\s+/g,' ').trim();
 if(overview.length<80)throw Error('Análise breve incompleta '+v);
 const wordCount=data.tokens.length;
 summary.verses[v]={verseRef:data.verseRef,versePt:data.versePt,
   translationPt:data.translationPt,translationNotePt:data.translationNotePt,
   wordCount,lexemeCount:ids.length,
   totalReferenceRows:concordances.reduce((a,x)=>a+x.totalCount,0),
   overviewPt:overview,lexemes:data.lexemes,tokens:data.tokens,concordances};
 totals.tokens+=wordCount;
 let clean=notes.replaceAll('edição de rascunho','edição pública para avaliação');
 clean=clean.replace(/\*\*Nenhum material deste conjunto foi publicado;[^\n]+/g,
  '**Material publicado para consulta; a análise interpretativa permanece sujeita à revisão filológica.**');
 clean=clean.replace(/Arquivo gerado em [^\n]+/g,
  'Arquivo de estudo disponível na edição pública do Prima Scriptura.');
 clean=clean.replaceAll('sem publicação no site','com acesso público para avaliação');
 clean='> **Prima Scriptura — edição pública de consulta.** Texto e índices auditados; interpretações semânticas e sintáticas são revisáveis.\n\n'+clean;
 await mkdir(publicNotes,{recursive:true});
 await writeFile(publicNotes+'NOTAS-COMPLETAS-GENESIS-1-'+v+'.md',clean);
 console.log('VALIDADO Gn 1:'+v+': '+wordCount+' palavras; '+ids.length+
   ' lemas; '+summary.verses[v].totalReferenceRows+' referências.');
}
if(totals.tokens!==90||totals.uniqueStrong.size!==36)
 throw Error('Modelo de Gn 1:1–8 incompleto: '+totals.tokens+' tokens; '+totals.uniqueStrong.size+' Strong');
summary.metrics={tokens:totals.tokens,distinctStrong:totals.uniqueStrong.size,
 totalReferenceRowsAcrossVerses:totals.referenceRows,verseCount:8};
await mkdir(dirname(out),{recursive:true});
await writeFile(out,JSON.stringify(summary,null,2)+'\n');
const report=await readFile(srcNotes+'RELATORIO-ESTRUTURACAO-GENESIS-1-2-8.md','utf8');
await writeFile(publicNotes+'RELATORIO-ESTRUTURACAO-GENESIS-1-2-8.md',
 '> **Edição pública.** Este relatório preserva o histórico da elaboração em rascunho; a publicação foi autorizada depois. Acessível para estudo, com decisões interpretativas sujeitas a revisão.\n\n'+report);
console.log('ARQUIVOS PREPARADOS: 90 palavras, 36 Strong e '+totals.referenceRows+
 ' registros de referência; interface compacta: '+out);
