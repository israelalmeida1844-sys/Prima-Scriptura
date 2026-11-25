import json, pathlib, urllib.request, zipfile, hashlib, io, re
P=pathlib.Path("docs/catalogo-comentarios-9-1.json")
catalog=json.loads(P.read_text())
for s in catalog["sources"]:
    try:
        with urllib.request.urlopen(s["download"],timeout=90) as r:
            data=r.read(80*1024*1024+1)
        assert len(data)<80*1024*1024,"size limit"
        z=zipfile.ZipFile(io.BytesIO(data))
        assert z.testzip() is None,"CRC failure"
        assert all(not pathlib.PurePosixPath(n).is_absolute() and ".." not in pathlib.PurePosixPath(n).parts for n in z.namelist())
        conf=[n for n in z.namelist() if n.lower().endswith(".conf")]
        assert len(conf)==1
        raw=z.read(conf[0]).decode("utf-8-sig")
        fields=dict(line.split("=",1) for line in raw.splitlines() if "=" in line and not line.startswith("#"))
        assert re.search(r"^\["+re.escape(s["id"])+r"\]\s*$",raw,re.M|re.I)
        assert fields.get("DistributionLicense","").strip()=="Public Domain"
        assert fields.get("Version","").strip()==s["version"]
        assert fields.get("ModDrv") in ("RawCom","RawCom4","zCom","zCom4")
        assert not fields.get("CipherKey")
        payload=[n for n in z.namelist() if n.startswith("modules/") and not n.endswith("/") and z.getinfo(n).file_size>0]
        assert payload
        s.update(status="archive_and_license_verified",sha256=hashlib.sha256(data).hexdigest(),archive_bytes=len(data),config_sha256=hashlib.sha256(z.read(conf[0])).hexdigest(),driver=fields["ModDrv"],encoding=fields.get("Encoding","unspecified"),source_type=fields.get("SourceType","unspecified"),versification=fields.get("Versification","KJV default"),payload_files=[{"name":n,"bytes":z.getinfo(n).file_size} for n in payload])
        s.pop("error",None)
    except Exception as e:
        s.update(status="blocked_binary_validation",error=str(e))
    print(s["id"],s["status"],s.get("error",""),flush=True)
catalog["scope"]="ZIP CRC, configuration, module identity, version, public-domain declaration, driver, nonempty payload and SHA256. Not a verse-level completeness or textual fidelity audit."
P.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+"\n")
