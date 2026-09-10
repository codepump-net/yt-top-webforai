"""Keep structural regression evidence reproducible without publishing raw crawls."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[2]
target = root / 'harness/tests/fixtures'
target.mkdir(exist_ok=True)
for source, name in [('2026-09-11-olympicpark365', 'olympic-structure'), ('2026-09-11-thegungang365', 'thegungang-structure')]:
    rows = json.loads((root / 'research' / source / 'evidence/audit.json').read_text(encoding='utf-8'))
    trimmed = []
    for row in rows:
        raw = row.get('raw')
        result = {k:row[k] for k in ['url','status','bytes'] if k in row}
        result['headers'] = {k:v for k,v in row.get('headers',{}).items() if k.lower() == 'x-robots-tag'}
        result['brokenImages'] = bool(row.get('brokenImages'))
        if raw:
            nodes = [n for j in raw.get('jsonld',[]) if isinstance(j,dict) for n in j.get('@graph',[j])]
            result['raw'] = {
                'title': bool(raw.get('title')),
                'canonical': raw.get('canonical'),
                'meta': [m for m in raw.get('meta',[]) if m.get('name','').lower() in ['robots','googlebot']],
                'images': [{'alt':None if i.get('alt') is None else '<markup omitted>' if '<' in i['alt'] else '' if i['alt']=='' else 'nonempty text'} for i in raw.get('images',[])],
                'jsonld': [{'@graph':[{k:n[k] for k in ['@type','@id'] if k in n} for n in nodes]}],
            }
        trimmed.append(result)
    (target / (name+'.json')).write_text(json.dumps(trimmed,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Minimal structural fixtures extracted; article text and raw images excluded.')
