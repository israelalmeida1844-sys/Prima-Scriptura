#!/usr/bin/env python3
"""Decode the source morphological tags, without changing or re-parsing the biblical text."""
import argparse, collections, json, pathlib, hashlib
from import_corpora import OT, NT
P=pathlib.Path
G_POS={"A-":"Adjetivo","C-":"Conjunção","D-":"Advérbio","I-":"Interjeição","N-":"Substantivo","P-":"Preposição","RA":"Artigo definido","RD":"Pronome demonstrativo","RI":"Pronome interrogativo ou indefinido","RP":"Pronome pessoal","RR":"Pronome relativo","V-":"Verbo","X-":"Partícula"}
G_FIELDS=[
 ("pessoa",{"1":"Primeira","2":"Segunda","3":"Terceira"}),
 ("tempo",{"P":"Presente","I":"Imperfeito","F":"Futuro","A":"Aoristo","X":"Perfeito","Y":"Mais-que-perfeito"}),
 ("voz",{"A":"Ativa","M":"Média","P":"Passiva"}),
 ("modo",{"I":"Indicativo","D":"Imperativo","S":"Subjuntivo","O":"Optativo","N":"Infinitivo","P":"Particípio"}),
 ("caso",{"N":"Nominativo","G":"Genitivo","D":"Dativo","A":"Acusativo","V":"Vocativo"}),
 ("numero",{"S":"Singular","P":"Plural"}),
 ("genero",{"M":"Masculino","F":"Feminino","N":"Neutro"}),
 ("grau",{"C":"Comparativo","S":"Superlativo"})]
H_STEMS=dict(zip("qNpPhHtoOrmMkKQlLfDjiucvwyz".replace(" ",""),"Qal Niphal Piel Pual Hiphil Hophal Hithpael Polel Polal Hithpolel Poel Poal Palel Pulal Qal-passivo Pilpel Polpal Hithpalpel Nithpael Pealal Pilel Hothpaal Tiphil Hishtaphel Nithpalel Nithpoel Hithpoel".split()))
A_STEMS={"q":"Peal","Q":"Peil","u":"Hithpeel","p":"Pael","P":"Ithpaal","M":"Hithpaal","a":"Aphel","h":"Haphel","s":"Saphel","e":"Shaphel","H":"Hophal","i":"Ithpeel","t":"Hishtaphel","v":"Ishtaphel","w":"Hithaphel","o":"Polel","z":"Ithpoel","r":"Hithpolel","f":"Hithpalpel","b":"Hephal","c":"Tiphel","m":"Poel","l":"Palpel","L":"Ithpalpel","O":"Ithpolel","G":"Ittaphal"}
V_TYPES={"p":"Perfeito (qatal)","q":"Perfeito sequencial (weqatal)","i":"Imperfeito (yiqtol)","w":"Imperfeito sequencial (wayyiqtol)","h":"Coortativo","j":"Jussivo","v":"Imperativo","r":"Particípio ativo","s":"Particípio passivo","a":"Infinitivo absoluto","c":"Infinitivo construto"}
CLASSES={"A":"Adjetivo","C":"Conjunção","D":"Advérbio","N":"Substantivo","P":"Pronome","R":"Preposição","S":"Sufixo","T":"Partícula","V":"Verbo"}
TYPES={"A":{"a":"Adjetivo","c":"Numeral cardinal","g":"Gentílico","o":"Numeral ordinal"},"N":{"c":"Comum","g":"Gentílico","p":"Nome próprio"},"P":{"d":"Demonstrativo","f":"Indefinido","i":"Interrogativo","p":"Pessoal","r":"Relativo"},"S":{"d":"He direcional","h":"He paragógico","n":"Nun paragógico","p":"Pronominal"},"T":{"a":"Afirmativa","d":"Artigo definido","e":"Exortativa","i":"Interrogativa","j":"Interjeição","m":"Demonstrativa","n":"Negativa","o":"Marcador de objeto direto","r":"Relativa"}}
PERSON=("pessoa",{"1":"Primeira","2":"Segunda","3":"Terceira"})
GENDER=("genero",{"b":"Ambos os gêneros","c":"Comum","f":"Feminino","m":"Masculino"})
NUMBER=("numero",{"d":"Dual","p":"Plural","s":"Singular"})
STATE=("estado",{"a":"Absoluto","c":"Construto","d":"Determinado (enfático)"})
LABELS={"classe":"Classe","tipo":"Tipo","pessoa":"Pessoa","tempo":"Tempo/formação verbal","voz":"Voz","modo":"Modo","caso":"Caso","numero":"Número","genero":"Gênero","grau":"Grau","tronco":"Tronco verbal","conjugacao":"Conjugação","estado":"Estado","artigo":"Artigo"}
def decode_slots(raw,slots):
    if len(raw)!=len(slots):raise ValueError("quantidade de campos inesperada: "+raw)
    out={}
    for c,(field,values) in zip(raw,slots):
        if c=="-":continue
        if c=="x":out[field]="Não especificado no código";continue
        if c not in values:raise ValueError("valor desconhecido "+field+"="+c)
        out[field]=values[c]
    return out
def greek(pos,raw):
    if pos not in G_POS:raise ValueError("classe grega desconhecida "+str(pos))
    if not isinstance(raw,str) or len(raw)!=8:raise ValueError("código grego inválido "+str(raw))
    if "x" in raw:raise ValueError("marcador grego não documentado "+raw)
    fields={"classe":G_POS[pos],**decode_slots(raw,G_FIELDS)}
    return [{"codigo":pos+" "+raw,"campos":fields}]
def semitic_part(raw,lang):
    if not raw or raw[0] not in CLASSES:raise ValueError("classe semítica desconhecida "+raw)
    cls=raw[0];tail=raw[1:];f={"classe":CLASSES[cls]}
    if cls in "CD":
        if tail:raise ValueError("campos adicionais "+raw)
    elif cls=="R":
        if tail=="d":f["artigo"]="Definido implícito na preposição"
        elif tail:raise ValueError("preposição desconhecida "+raw)
    elif cls=="V":
        if len(tail)<2:raise ValueError("verbo incompleto "+raw)
        stems=H_STEMS if lang=="H" else A_STEMS
        if tail[0] not in stems or tail[1] not in V_TYPES:raise ValueError("tronco ou conjugação desconhecido "+raw)
        f["tronco"]=stems[tail[0]]
        f["conjugacao"]=V_TYPES[tail[1]]
        if lang=="A": # avoid transferring Hebrew conjugation names to Aramaic.
            f["conjugacao"]=f["conjugacao"].split(" (")[0]
        slots=[] if tail[1] in "ac" else [GENDER,NUMBER,STATE] if tail[1] in "rs" else [PERSON,GENDER,NUMBER]
        f.update(decode_slots(tail[2:],slots))
    else:
        if not tail or tail[0] not in TYPES[cls]:raise ValueError("tipo desconhecido "+raw)
        typ=tail[0];f["tipo"]=TYPES[cls][typ]
        slots=[GENDER,NUMBER,STATE] if cls=="A" or (cls=="N" and typ!="p") else [PERSON,GENDER,NUMBER] if cls=="P" or (cls=="S" and typ=="p") else []
        f.update(decode_slots(tail[1:],slots))
    return {"codigo":raw,"campos":f}
def decode(lang,pos,raw):
    try:
        if lang=="grc":parts=greek(pos,raw)
        else:
            if not isinstance(raw,str) or not raw or raw[0] not in "HA":raise ValueError("idioma ou código ausente")
            parts=[semitic_part(p,raw[0]) for p in raw[1:].split("/")]
        return {"idioma":lang,"codigo_original":raw,"pos_original":pos,"status":"decodificado","partes":parts,"descricao":" / ".join("; ".join(LABELS[k]+": "+v for k,v in p["campos"].items()) for p in parts)}
    except ValueError as e:
        return {"idioma":lang,"codigo_original":raw,"pos_original":pos,"status":"pendente","motivo":str(e),"partes":[],"descricao":None}
def selftest():
    assert len(H_STEMS)==27 and H_STEMS["q"]=="Qal" and H_STEMS["N"]=="Niphal" and H_STEMS["Q"]=="Qal-passivo" and H_STEMS["z"]=="Hithpoel"
    g=decode("grc","V-","3IAI-S--")["partes"][0]["campos"]
    assert g["tempo"]=="Imperfeito" and g["pessoa"]=="Terceira" and g["voz"]=="Ativa"
    assert decode("grc","N-","----VSM-")["partes"][0]["campos"]["caso"]=="Vocativo"
    h=decode("hbo",None,"HVqp3ms")["partes"][0]["campos"]
    assert h["tronco"]=="Qal" and h["conjugacao"]=="Perfeito (qatal)" and h["genero"]=="Masculino"
    assert decode("hbo",None,"HRd/Ncbsa")["partes"][0]["campos"]["artigo"].startswith("Definido")
    assert decode("hbo",None,"HC/Vqw3ms")["partes"][1]["campos"]["conjugacao"].startswith("Imperfeito sequencial")
    assert decode("hbo",None,"HNcmsc/Sp3ms")["partes"][1]["campos"]["tipo"]=="Pronominal"
    assert decode("arc",None,"AVqp3ms")["partes"][0]["campos"]["tronco"]=="Peal"
    assert decode("hbo",None,"HV?i3ms")["status"]=="pendente"
    assert decode("grc","N-","----NSMZ")["status"]=="pendente"
def write(p,obj):
    p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(obj,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
def main():
    selftest()
    p=argparse.ArgumentParser()
    for k in ("base","out","report","details"):p.add_argument("--"+k,type=P,required=True)
    a=p.parse_args();manifest=json.loads((a.base/"manifest.json").read_text());assert set(manifest)==set(OT+NT)
    totals=collections.Counter();books={};catalog={};frequencies=collections.Counter();unknown=collections.Counter();samples={}
    for book in OT+NT:
        raw=(a.base/(book+".json")).read_bytes();data=json.loads(raw);counts=collections.Counter();pending={}
        for ref,words in data.items():
            counts["verses"]+=1
            for i,w in enumerate(words):
                morph=w.get("morph");pos=w.get("pos") if book in NT else None
                lang="grc" if book in NT else "arc" if (morph or "").startswith("A") else "hbo" if (morph or "").startswith("H") else "und"
                key=(pos+" "+morph) if pos and morph else (morph or "")
                if key not in catalog:catalog[key]=decode(lang,pos,morph)
                r=catalog[key];assert r["idioma"]==lang
                counts["tokens"]+=1;counts[lang]+=1;frequencies[key]+=1
                if r["status"]=="decodificado":
                    counts["decoded"]+=1;counts[lang+"_decoded"]+=1
                    counts["components"]+=len(r["partes"])
                    if lang!="grc" and len(r["partes"])!=len(w["text"].split("/")):
                        counts["segmentation_mismatch"]+=1
                        pending.setdefault(ref,[]).append({"token":i,"codigo":key,"motivo":"Número de componentes difere da segmentação gráfica"})
                    if any(v=="Não especificado no código" for part in r["partes"] for v in part["campos"].values()):counts["explicit_unspecified"]+=1
                else:
                    counts["pending"]+=1;unknown[key]+=1;pending.setdefault(ref,[]).append({"token":i,"codigo":key,"motivo":r["motivo"]})
                if lang not in samples and r["status"]=="decodificado":samples[lang]={"book":book,"ref":ref,"word":w["text"],"code":key,"description":r["descricao"]}
        assert counts["tokens"]==manifest[book]["tokens"] and counts["verses"]==manifest[book]["verses"]
        totals.update(counts);books[book]={**counts,"base_sha256":hashlib.sha256(raw).hexdigest()}
        write(a.details/(book+".json"),pending)
    assert totals["tokens"]==443061 and totals["grc"]==137554 and totals["hbo"]==300679 and totals["arc"]==4828
    assert totals["decoded"]+totals["pending"]==totals["tokens"]
    write(a.out/"catalogo.json",catalog)
    write(a.report,{"stage":5,"status":"automatic_code_decoding","books":66,"totals":dict(totals),"distinct_codes":len(catalog),"decoded_codes":sum(x["status"]=="decodificado" for x in catalog.values()),"unresolved_codes":dict(unknown),"code_frequencies":dict(frequencies),"books_detail":books,"examples":samples,"sources":{"MorphGNT":"https://github.com/morphgnt/sblgnt/blob/aaed91e57c8e4a8dc9a2383e129ca5e75fe6393d/README.md","OSHB":"https://github.com/openscriptures/morphhb/blob/db6c5c9b46b8f39346f10915ddb1a70dcd429901/parsing/HebrewMorphologyCodes.html"},"scope":"Portuguese decoding of existing source codes, not independent grammatical re-analysis. Undefined categories remain unspecified; no inferred syntactic role, contextual aspect or verbal time. Primary corpus only; Qere and other variants not decoded separately."})
    print(json.dumps({"totals":dict(totals),"codes":len(catalog),"unknown":dict(unknown)},ensure_ascii=False))
if __name__=="__main__":main()
