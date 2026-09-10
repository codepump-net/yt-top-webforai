"""Validate planning coverage and links, never mark the application complete."""
import csv
import json
import re
from pathlib import Path
from xml.etree import ElementTree as ET

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
def loadcsv(p):
    with p.open(encoding='utf-8-sig',newline='') as f: return list(csv.DictReader(f))
pages=json.loads((HERE/'page-plans.json').read_text(encoding='utf-8'))
old=loadcsv(HERE/'legacy-url-map.csv')
source=json.loads((ROOT/'research/2026-09-11-yttop/data/page-inventory.json').read_text(encoding='utf-8-sig'))
services=loadcsv(ROOT/'research/2026-09-11-yttop/data/service-catalog.csv')
assets=loadcsv(HERE/'page-asset-candidates.csv')
ids={p['id'] for p in pages}; paths={p['path'] for p in pages}
urls={u for p in pages for u in p['source_urls']}
missing=[]
for file in HERE.glob('*.md'):
    for link in re.findall(r'\]\(([^)]+)\)',file.read_text(encoding='utf-8')):
        if link.startswith(('https://','http://','#')): continue
        target=link.split('#')[0]
        if target=='verification.json': continue
        if not (file.parent/target).exists(): missing.append(f'{file.name}: {target}')
xml=ET.parse(HERE/'planned-sitemap.xml')
locs=[e.text for e in xml.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
checks={
 'planned_pages_76':len(pages)==76,
 'ids_and_paths_unique':len(ids)==len(paths)==len(pages),
 'all_related_pages_exist':all(set(p['related_page_ids'])<=ids for p in pages),
 'all_19_services_covered':{s['url'] for s in services}<=urls,
 'all_145_source_urls_decided':{r['old_url'] for r in old}=={r['url'] for r in source} and len(old)==len(source),
 'retired_only_footer_49':[r['old_url'] for r in old if not r['new_path']]==['https://yttop.co.kr/49'],
 'migration_targets_exist':all(not r['new_path'] or r['new_path'] in paths for r in old),
 'all_25_cases_5_notices':sum(p['template']=='case-detail' for p in pages)==25 and sum(p['template']=='notice-detail' for p in pages)==5,
 'all_pages_have_individual_plan':all(p['intent'] and p['ordered_sections'] and p['question_outlines'] and p['special_review'] for p in pages),
 'all_source_documents_exist':all((ROOT/f).is_file() for p in pages for f in p['source_documents']),
 'all_candidate_assets_exist':all((ROOT/a['source_file']).is_file() and (ROOT/a['ocr_file']).is_file() for a in assets),
 'all_preferred_images_exist':all((ROOT/'research/2026-09-11-yttop/evidence'/f).is_file() for p in pages for f in p['visually_checked_preferred_images']),
 'sitemap_73_unique_correct_urls':len(locs)==len(set(locs))==73 and set(locs)=={'https://codepump-net.github.io/yt-top-webforai'+p['path'] for p in pages if p['sitemap_candidate']},
 'no_publication_approval_fabricated':all(p['publication_status']=='pending' and p['build_status']=='planned' for p in pages),
 'local_document_links_resolve':not missing,
 'workflow_blueprint_not_installed':not (ROOT/'.github/workflows/deploy-pages.yml').exists(),
}
result={'checked_at':'2026-09-11','scope':'Planning consistency only; no app build or deployment performed','checks':checks,'missing_links':missing,'all_passed':all(checks.values())}
(HERE/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))
raise SystemExit(0 if result['all_passed'] else 1)
