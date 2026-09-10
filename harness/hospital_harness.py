"""Hospital content/build checks. Python 3.11+, standard library only."""
import argparse
import copy
import hashlib
import html
import json
import re
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit

VERSION = '1.0.0'
SCOPE = ('condition', 'population', 'intervention', 'timing', 'outcome', 'measure')
DAYS = ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
DAY_KO = dict(zip(DAYS, ('월', '화', '수', '목', '금', '토', '일')))
ID = re.compile(r'^[a-z][a-z0-9-]*$')
TOKEN = re.compile(r'\{\{([^{}]+)\}\}')


def today():
    return datetime.now(timezone(timedelta(hours=9))).date()


def read(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))


def digest(project):
    data = copy.deepcopy(project)
    data.pop('reviews', None)
    return hashlib.sha256(json.dumps(data, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':')).encode()).hexdigest()


def issue(code, location, message, level='error'):
    return dict(code=code, location=location, message=message, level=level)


def web_url(value):
    try:
        u = urlsplit(value)
        return u.scheme == 'https' and bool(u.hostname) and not u.username and not u.password
    except (TypeError, ValueError):
        return False


def plain(value):
    return isinstance(value, str) and bool(value.strip()) and not re.search(r'<[^>]*|>','' + value)


def checked_date(value, as_of):
    try:
        return date.fromisoformat(value) <= as_of
    except (ValueError, TypeError):
        return False


def current_review(project, scope, as_of):
    role = 'operations' if scope == 'operations' else 'medical'
    for r in project['reviews']:
        if not isinstance(r, dict):
            continue
        try:
            dates_ok = date.fromisoformat(r['reviewed_at']) <= as_of <= date.fromisoformat(r['expires_at'])
        except (KeyError, TypeError, ValueError):
            dates_ok = False
        if (r.get('scope') == scope and r.get('role') == role and r.get('status') == 'approved'
                and r.get('digest') == digest(project) and plain(r.get('reviewer')) and dates_ok
                and r.get('evidence_checked') is True and plain(r.get('record'))):
            return r
    return None


def hours_text(hospital):
    lines = []
    for slot in hospital['hours']:
        days = '·'.join(DAY_KO[d] for d in slot['days'])
        lines.append(f"{days} {slot['opens']}~{slot['closes']}")
    return ' / '.join(lines) + ' / ' + hospital['holiday_note']


def facts(project):
    h = project['hospital']
    return {'hospital.name': h['name'], 'hospital.address': h['address'],
            'hospital.phone': h['phone'], 'hospital.hours': hours_text(h),
            'hospital.parking': h['parking'], 'hospital.intake': h['intake']}


def expand(text, project):
    values = facts(project)
    return TOKEN.sub(lambda m: values[m[1]], text)


def validate(project, mode='preview', as_of=None):
    as_of = as_of or today()
    issues = []
    def fail(code, loc, msg, level='error'):
        issues.append(issue(code, loc, msg, level))
    # Validate container shapes before following references.
    if not isinstance(project, dict):
        return [issue('CONTRACT', '$', 'Project must be an object.')]
    required = {'version': int, 'demo': bool, 'hospital': dict, 'physicians': list,
                'sources': list, 'articles': list, 'reviews': list}
    for key, typ in required.items():
        if type(project.get(key)) is not typ:
            fail('CONTRACT', key, f'Required {typ.__name__}.')
    if issues:
        return issues
    if project['version'] != 1:
        fail('CONTRACT_VERSION', 'version', 'Only version 1 is supported.')
    h = project['hospital']
    for key in ('name', 'origin', 'address', 'phone', 'holiday_note', 'parking', 'intake', 'verified_at'):
        if not plain(h.get(key)):
            fail('FACT_REQUIRED', 'hospital.' + key, 'Nonempty plain text required.')
    origin = h.get('origin', '')
    if not web_url(origin) or urlsplit(origin).path not in ('', '/') or urlsplit(origin).query or urlsplit(origin).fragment:
        fail('ORIGIN', 'hospital.origin', 'HTTPS origin without path/query/fragment required.')
    if not checked_date(h.get('verified_at'), as_of):
        fail('FACT_DATE', 'hospital.verified_at', 'Valid non-future verification date required.')
    if not re.fullmatch(r'[+0-9 ()-]{7,24}', h.get('phone', '')):
        fail('PHONE', 'hospital.phone', 'Expected a phone number, not a URL or markup.')
    slots = h.get('hours')
    day_slots = defaultdict(list)
    if not isinstance(slots, list) or not slots:
        fail('HOURS', 'hospital.hours', 'At least one opening interval required.')
    else:
        for n, s in enumerate(slots):
            loc = f'hospital.hours[{n}]'
            if not isinstance(s, dict) or not isinstance(s.get('days'), list) or not s['days']:
                fail('HOURS', loc, 'Object with day list required.'); continue
            valid = True
            for k in ('opens', 'closes'):
                if not re.fullmatch(r'(?:[01][0-9]|2[0-3]):[0-5][0-9]', str(s.get(k, ''))):
                    fail('HOURS', loc, 'Use 00:00..23:59; split overnight intervals explicitly.'); valid = False
            if valid and s['opens'] >= s['closes']:
                fail('HOURS', loc, 'Opening must precede closing; model breaks as separate intervals.'); valid = False
            for d in s['days']:
                if d not in DAYS:
                    fail('HOURS', loc, 'Unknown weekday.'); continue
                if valid:
                    day_slots[d].append((s['opens'], s['closes']))
        for d, intervals in day_slots.items():
            seq = sorted(intervals)
            if any(a[1] > b[0] for a, b in zip(seq, seq[1:])):
                fail('HOURS_OVERLAP', d, 'Overlapping/duplicate opening intervals.')
    indexes = {}
    for collection in ('physicians', 'sources', 'articles'):
        indexes[collection] = {}
        for n, obj in enumerate(project[collection]):
            if not isinstance(obj, dict) or not ID.fullmatch(str(obj.get('id', ''))):
                fail('ID', f'{collection}[{n}]', 'Lowercase safe ID required.'); continue
            if obj['id'] in indexes[collection]:
                fail('DUPLICATE_ID', collection, obj['id'])
            indexes[collection][obj['id']] = obj
    for p in indexes['physicians'].values():
        for k in ('name', 'specialty', 'bio'):
            if not plain(p.get(k)):
                fail('PHYSICIAN', p['id'], k + ' must be plain text.')
        for k in ('credentials', 'memberships'):
            if not isinstance(p.get(k), list) or any(not plain(v) for v in p.get(k, [])):
                fail('PHYSICIAN', p['id'], k + ' must be a list of plain strings.')
    for s in indexes['sources'].values():
        for k in ('title', 'publisher', 'design'):
            if not plain(s.get(k)):
                fail('SOURCE', s['id'], k + ' required.')
        if not web_url(s.get('url')):
            fail('SOURCE_URL', s['id'], 'HTTPS source URL required.')
        elif mode == 'release' and ('.invalid' in s['url'] or 'example.' in s['url']):
            fail('DEMO_SOURCE', s['id'], 'Replace synthetic source with a real verified source before release.')
        if not checked_date(s.get('checked_at'), as_of):
            fail('SOURCE_DATE', s['id'], 'Source check date required, not future.')
        if not isinstance(s.get('scope'), dict) or any(not plain(s.get('scope', {}).get(k)) for k in SCOPE):
            fail('SOURCE_SCOPE', s['id'], 'All six evidence scope fields required.')
    titles = set()
    for a in indexes['articles'].values():
        loc = a['id']
        for k in ('title', 'description', 'question', 'answer', 'limits'):
            if not plain(a.get(k)):
                fail('ARTICLE', loc, k + ' must be nonempty plain text.')
        if a.get('title') in titles:
            fail('DUPLICATE_TITLE', loc, 'Different pages need distinct purposes/titles.')
        titles.add(a.get('title'))
        if a.get('author_id') not in indexes['physicians']:
            fail('AUTHOR_REF', loc, 'Unknown author ID.')
        if 'author_bio' in a:
            fail('BIO_COPY', loc, 'Use physician reference; do not copy biography into article.')
        if a.get('risk') not in ('operational', 'medical', 'urgent'):
            fail('RISK', loc, 'risk must be operational, medical, or urgent.')
        if not checked_date(a.get('updated_at'), as_of):
            fail('ARTICLE_DATE', loc, 'Non-future update date required.')
        if a.get('risk') == 'urgent':
            if not plain(a.get('emergency_action')) or a.get('cta') != 'emergency':
                fail('URGENT_CTA', loc, 'Urgent pages require dedicated emergency action, not booking CTA.')
        elif a.get('cta') not in ('contact', 'none'):
            fail('CTA', loc, 'Nonurgent CTA must be contact or none.')
        if not isinstance(a.get('sections'), list) or any(not isinstance(s, dict) or not plain(s.get('heading')) or not plain(s.get('text')) for s in a.get('sections', [])):
            fail('SECTIONS', loc, 'Sections require heading and plain text.')
        if not isinstance(a.get('claims'), list):
            fail('CLAIMS', loc, 'claims list required.'); continue
        if a.get('risk') in ('medical', 'urgent') and not a['claims']:
            fail('CLAIMS', loc, 'Medical pages require traceable claims.')
        for n, c in enumerate(a['claims']):
            if not isinstance(c, dict) or not plain(c.get('text')):
                fail('CLAIM', loc, 'Claim text required.'); continue
            s = indexes['sources'].get(c.get('source_id'))
            if not s:
                fail('SOURCE_REF', loc, 'Unknown claim source.'); continue
            if not isinstance(c.get('scope'), dict):
                fail('CLAIM_SCOPE', loc, 'Claim scope required.'); continue
            for k in SCOPE:
                if c['scope'].get(k) != s.get('scope', {}).get(k):
                    fail('SCOPE_MISMATCH', f'{loc}.claims[{n}].{k}', 'Declared source/claim scope differs; revise claim or select supporting source.')
        # This catches literal operational data drift; semantic prose needs a human.
        sections = a.get('sections') if isinstance(a.get('sections'), list) else []
        for text in [a.get('answer', ''), a.get('limits', '')] + [s.get('text', '') for s in sections if isinstance(s, dict)]:
            if not isinstance(text, str):
                continue
            for token in TOKEN.findall(text):
                if token not in ('hospital.name', 'hospital.address', 'hospital.phone', 'hospital.hours', 'hospital.parking', 'hospital.intake'):
                    fail('FACT_TOKEN', loc, 'Unknown fact reference: ' + token)
            if re.search(r'\d{1,2}:\d{2}', text):
                fail('HOURS_LITERAL', loc, 'Use {{hospital.hours}} instead of copying times into prose.')
        images = a.get('images', [])
        if not isinstance(images, list):
            fail('IMAGE', loc, 'images must be a list.'); images = []
        for im in images:
            if not isinstance(im, dict) or not plain(im.get('alt')) or not web_url(im.get('src')):
                fail('IMAGE', loc, 'Image needs HTTPS src and clean nonempty alt.')
    if not indexes['physicians'] or not indexes['articles']:
        fail('EMPTY', '$', 'At least one physician and article required.')
    review_level = 'error' if mode == 'release' else 'warning'
    if project['demo'] or '.invalid' in origin or 'example.' in origin:
        fail('DEMO', '$', 'Fictional example cannot be released.', review_level)
    for scope in ['operations'] + [a['id'] for a in project['articles'] if isinstance(a, dict) and a.get('risk') in ('medical', 'urgent') and 'id' in a]:
        if not current_review(project, scope, as_of):
            fail('REVIEW_REQUIRED', scope, 'Current digest-bound review record missing, expired or stale.', review_level)
    return issues


def physician_node(p, origin):
    return {'@type': 'Person', '@id': origin + '/doctors/' + p['id'] + '/#person',
            'url': origin + '/doctors/' + p['id'] + '/', 'name': p['name'],
            'description': p['bio'], 'worksFor': {'@id': origin + '/#clinic'},
            'hasCredential': [{'@type': 'EducationalOccupationalCredential', 'name': v} for v in p['credentials']],
            'memberOf': [{'@type': 'Organization', 'name': v} for v in p['memberships']]}


def build(project, destination, mode='preview', as_of=None):
    as_of = as_of or today()
    problems = validate(project, mode, as_of)
    if any(i['level'] == 'error' for i in problems):
        raise ValueError('Build blocked. Run validate and fix errors first.')
    dest = Path(destination)
    if dest.exists() and any(dest.iterdir()):
        raise ValueError('Output directory must be new or empty; use a new run directory.')
    h = project['hospital']; origin = h['origin'].rstrip('/')
    clinic = {'@type': 'MedicalClinic', '@id': origin + '/#clinic', 'name': h['name'],
              'url': origin + '/', 'telephone': h['phone'],
              'address': {'@type': 'PostalAddress', 'streetAddress': h['address'], 'addressCountry': 'KR'},
              'openingHoursSpecification': [{'@type': 'OpeningHoursSpecification', 'dayOfWeek': s['days'], 'opens': s['opens'], 'closes': s['closes']} for s in h['hours']]}
    dest.mkdir(parents=True, exist_ok=True)
    e = html.escape
    generated = []
    def page(route, title, description, content, nodes):
        url = origin + route
        payload = json.dumps({'@context': 'https://schema.org', '@graph': [clinic] + nodes}, ensure_ascii=False).replace('<', '\\u003c')
        banner = '<aside>제작 검증용 미리보기 · 의료 정보 검수 전</aside>' if mode == 'preview' else ''
        robots = 'noindex, nofollow' if mode == 'preview' else 'index, follow'
        footer = f'<footer><p>{e(h["name"])} · {e(h["address"])}</p><p>{e(hours_text(h))}</p><p>{e(h["intake"])} · {e(h["parking"])}</p><a href="tel:{e(h["phone"], quote=True)}">{e(h["phone"])}</a></footer>'
        doc = f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)}</title><meta name="description" content="{e(description, quote=True)}"><meta name="robots" content="{robots}"><link rel="canonical" href="{e(url, quote=True)}"><meta property="og:title" content="{e(title, quote=True)}"><meta property="og:url" content="{e(url, quote=True)}"><script type="application/ld+json">{payload}</script><style>body{{font:18px/1.8 system-ui,sans-serif;color:#182f38;max-width:880px;margin:auto;padding:24px}}a{{color:#006c71}}nav,aside,footer{{padding:18px;background:#eef6f5}}h1{{line-height:1.35}}section{{margin:32px 0}}img{{max-width:100%;height:auto}}.answer{{border-left:4px solid #087f8c;padding:18px;background:#f4f9f9}}.urgent{{border:2px solid #a83932;padding:20px}}small{{color:#52606a}}</style></head><body>{banner}<nav><a href="/">{e(h['name'])}</a> · <a href="/visit/">진료·방문 안내</a></nav><main><h1>{e(title)}</h1>{content}</main>{footer}</body></html>'''
        folder = dest / route.strip('/')
        folder.mkdir(parents=True, exist_ok=True)
        (folder / 'index.html').write_text(doc, encoding='utf-8')
        generated.append(url)
    links = ''.join(f'<li><a href="/health/{a["id"]}/">{e(a["title"])}</a></li>' for a in project['articles'])
    doctors = ''.join(f'<li><a href="/doctors/{p["id"]}/">{e(p["name"])} · {e(p["specialty"])}</a></li>' for p in project['physicians'])
    page('/', h['name'], h['name'] + ' 진료·의료진·방문 안내', f'<section><h2>진료 안내</h2><p>{e(hours_text(h))}</p><p>{e(h["intake"])}</p></section><section><h2>의료진</h2><ul>{doctors}</ul></section><section><h2>건강·이용 정보</h2><ul>{links}</ul></section>', [])
    page('/visit/', '진료·방문 안내', h['name'] + ' 위치와 진료시간', f'<p>{e(h["address"])}</p><p>{e(hours_text(h))}</p><p>{e(h["parking"])}</p><p>{e(h["intake"])}</p><p>운영정보 확인일: {e(h["verified_at"])}</p>', [])
    for p in project['physicians']:
        node = physician_node(p, origin)
        profile = f'<p>{e(p["specialty"])}</p><p>{e(p["bio"])}</p><h2>자격</h2><ul>'+''.join(f'<li>{e(v)}</li>' for v in p['credentials'])+'</ul>'
        profile += '<h2>학회·단체 소속</h2><ul>'+''.join(f'<li>{e(v)}</li>' for v in p['memberships'])+'</ul>'
        page('/doctors/' + p['id'] + '/', p['name'] + ' 의료진', p['specialty'], profile, [node, {'@type': 'ProfilePage', 'mainEntity': {'@id': node['@id']}}])
    source_map = {s['id']: s for s in project['sources']}
    for a in project['articles']:
        p = next(p for p in project['physicians'] if p['id'] == a['author_id'])
        person = physician_node(p, origin); url = origin + '/health/' + a['id'] + '/'
        content = f'<p><a href="/doctors/{p["id"]}/">{e(p["name"])}</a> · 수정 {e(a["updated_at"])}</p>'
        if a['risk'] == 'urgent':
            content += '<section class="urgent"><h2>먼저 확인할 행동</h2><p>' + e(a['emergency_action']) + '</p></section>'
        content += '<section class="answer"><h2>'+e(a['question'])+'</h2><p>'+e(expand(a['answer'], project))+'</p></section>'
        for s in a['sections']:
            content += '<section><h2>'+e(s['heading'])+'</h2><p>'+e(expand(s['text'], project))+'</p></section>'
        for im in a.get('images', []):
            content += f'<img loading="lazy" src="{e(im["src"], quote=True)}" alt="{e(im["alt"], quote=True)}">'
        citations = []
        for c in a['claims']:
            s = source_map[c['source_id']]; citations.append(s['url'])
            content += '<section><p>'+e(c['text'])+'</p><p><a href="'+e(s['url'], quote=True)+'">'+e(s['title'])+'</a></p><small>'+e(s['publisher']+' · '+s['design']+' · 대상: '+s['scope']['population']+' · 적용 시점: '+s['scope']['timing']+' · 지표: '+s['scope']['measure'])+'</small></section>'
        content += '<section><h2>적용 범위와 한계</h2><p>'+e(expand(a['limits'], project))+'</p></section>'
        if a['cta'] == 'contact':
            content += '<a href="/visit/">진료·방문 조건 확인</a>'
        # Reviewed date is emitted only when a current recorded review exists.
        node = {'@type': 'MedicalWebPage' if a['risk'] != 'operational' else 'WebPage', '@id': url, 'url': url, 'name': a['title']}
        review = current_review(project, a['id'], as_of)
        if mode == 'release' and review:
            node['lastReviewed'] = review['reviewed_at']
            content += '<p>의료 검토: '+e(review['reviewer'])+' · '+e(review['reviewed_at'])+'</p>'
        article = {'@type': 'Article', 'headline': a['title'], 'dateModified': a['updated_at'], 'author': {'@id': person['@id']}, 'publisher': {'@id': clinic['@id']}, 'mainEntityOfPage': {'@id': url}, 'citation': list(dict.fromkeys(citations))}
        page('/health/' + a['id'] + '/', a['title'], a['description'], content, [person, node, article])
    robots = 'User-agent: *\nDisallow: /\n' if mode == 'preview' else 'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n'
    (dest/'robots.txt').write_text(robots, encoding='utf-8')
    urls = generated if mode == 'release' else []
    (dest/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+e(u)+'</loc></url>' for u in urls)+'</urlset>', encoding='utf-8')
    (dest/'build-manifest.json').write_text(json.dumps({'version': VERSION, 'mode': mode, 'digest': digest(project), 'generated_urls': generated, 'deployed': False}, indent=2), encoding='utf-8')
    return {'pages': len(generated), 'mode': mode, 'directory': str(dest), 'deployed': False}


def audit_snapshot(path, environment='production'):
    """Read saved audit.cjs snapshots. No network, no inference of clinical truth."""
    rows = read(path); found = []
    if not isinstance(rows, list) or not rows:
        raise ValueError('Nonempty audit snapshot array required.')
    for row in rows:
        u = row.get('url', '?'); raw = row.get('raw')
        if row.get('status') != 200:
            found.append(issue('HTTP', u, 'Non-200 or failed collection.'))
        if not raw:
            continue
        headers = {k.lower(): v for k, v in row.get('headers', {}).items()}
        controls = ' '.join([headers.get('x-robots-tag', '')] + [m.get('content', '') for m in raw.get('meta', []) if m.get('name', '').lower() in ('robots', 'googlebot')]).lower()
        if environment == 'production' and ('noindex' in controls or 'none' in controls.split()):
            found.append(issue('NOINDEX', u, 'Production sample requests exclusion.'))
        if environment == 'demo' and 'noindex' not in controls:
            found.append(issue('DEMO_INDEX', u, 'Demo HTML lacks observed noindex.', 'warning'))
        if not raw.get('title') or not raw.get('canonical'):
            found.append(issue('META', u, 'Title or canonical missing.'))
        for im in raw.get('images', []):
            if im.get('alt') is None or '<' in (im.get('alt') or ''):
                found.append(issue('ALT', u, 'Missing alt or markup fragment in alt.'))
        if row.get('bytes', 0) > 300000:
            found.append(issue('HTML_BUDGET', u, 'Uncompressed HTML exceeds local 300KB warning budget; measure actual performance.', 'warning'))
        if len(raw.get('images', [])) > 40:
            found.append(issue('IMAGE_BUDGET', u, 'More than local 40 img warning budget; inspect lazy loading and duplication.', 'warning'))
        for j in raw.get('jsonld', []):
            if not isinstance(j, dict):
                found.append(issue('JSONLD', u, 'JSON-LD parse failure.')); continue
            for n in j.get('@graph', [j]):
                if n.get('@type') in ('Person', 'MedicalClinic') and n.get('@id', '').startswith(u.rstrip('/') + '#') and urlsplit(u).path.strip('/'):
                    found.append(issue('ENTITY_ID', u, 'Page-scoped entity ID; compare with canonical physician/clinic identity.', 'warning'))
        if row.get('brokenImages'):
            found.append(issue('BROKEN_IMAGE', u, 'Broken rendered images observed.'))
    return {'scope': 'saved-snapshot-structural-only', 'environment': environment, 'pages_observed': len(rows), 'issues': found,
            'not_checked': ['clinical truth', 'biography attribution', 'live index status', 'live performance', 'actual AI citations']}


def summarize_observations(data):
    """Exact-host citations; errors excluded, coverage reported separately."""
    if not isinstance(data, dict) or not isinstance(data.get('queries'), list) or not isinstance(data.get('observations'), list):
        raise ValueError('queries and observations arrays required.')
    queries = {q['id'] for q in data['queries']}
    if not queries or len(queries) != len(data['queries']):
        raise ValueError('Unique nonempty query set required.')
    host = urlsplit(data['origin']).hostname
    if not host or not data.get('brand_aliases'):
        raise ValueError('Origin and brand aliases required.')
    groups = defaultdict(list); seen = set()
    for r in data['observations']:
        if r['query_id'] not in queries or r['status'] not in ('ok', 'error'):
            raise ValueError('Unknown query or observation status.')
        key = (r['engine'], r['language'], r['period'], r['query_id'], r['run_id'])
        if key in seen:
            raise ValueError('Duplicate observation; do not double-count retries.')
        seen.add(key)
        if r['status'] == 'ok' and (not isinstance(r.get('answer'), str) or not r['answer'].strip() or not isinstance(r.get('citations'), list)):
            raise ValueError('Successful observations need answer text and citation list.')
        groups[key[:3]].append(r)
    result = []
    for key, rows in groups.items():
        ok = [r for r in rows if r['status'] == 'ok']; n = len(ok)
        cited = sum(any(urlsplit(u).hostname == host for u in r['citations'] if isinstance(u, str)) for r in ok)
        mentioned = sum(any(alias.casefold() in r['answer'].casefold() for alias in data['brand_aliases']) for r in ok)
        labeled = [r for r in ok if isinstance(r.get('factual_accuracy'), bool) and r.get('reviewer')]
        result.append({'engine': key[0], 'language': key[1], 'period': key[2], 'attempts': len(rows), 'valid_answers': n,
                       'errors': len(rows)-n, 'query_coverage': len({r['query_id'] for r in ok}) / len(queries),
                       'citation_rate': cited/n if n else None, 'mention_rate': mentioned/n if n else None,
                       'human_labeled_answers': len(labeled), 'accuracy_rate_labeled_only': sum(r['factual_accuracy'] for r in labeled)/len(labeled) if labeled else None})
    return {'metrics': result, 'note': 'Observational sample only, not causal lift. Missing/error answers are not non-citations. Labels are supplied by reviewers.'}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    sub = p.add_subparsers(dest='command', required=True)
    for name in ('validate', 'digest', 'build'):
        s = sub.add_parser(name); s.add_argument('--project', required=True)
        s.add_argument('--mode', choices=['preview', 'release'], default='preview')
        s.add_argument('--as-of', type=date.fromisoformat)
        if name == 'build':
            s.add_argument('--out', required=True)
        else:
            s.add_argument('--report')
    s = sub.add_parser('audit'); s.add_argument('--snapshot', required=True); s.add_argument('--environment', choices=['production', 'demo'], default='production'); s.add_argument('--report')
    s = sub.add_parser('measure'); s.add_argument('--input', required=True); s.add_argument('--report')
    args = p.parse_args(); code = 0
    try:
        if args.command in ('validate', 'digest', 'build'):
            data = read(args.project)
            if args.command == 'digest':
                result = {'digest': digest(data), 'note': 'Not an approval or signature.'}
            elif args.command == 'build':
                result = build(data, args.out, args.mode, args.as_of)
            else:
                issues = validate(data, args.mode, args.as_of)
                code = int(any(i['level'] == 'error' for i in issues))
                result = {'mode': args.mode, 'digest': digest(data), 'errors': sum(i['level']=='error' for i in issues), 'issues': issues, 'release_ready': args.mode == 'release' and code == 0}
        elif args.command == 'audit':
            result = audit_snapshot(args.snapshot, args.environment)
            code = int(any(i['level'] == 'error' for i in result['issues']))
        else:
            result = summarize_observations(read(args.input))
    except (ValueError, TypeError, KeyError, OSError) as exc:
        result = {'error': str(exc)}; code = 2
    text = json.dumps(result, ensure_ascii=False, indent=2)
    if getattr(args, 'report', None):
        target = Path(args.report); target.parent.mkdir(parents=True, exist_ok=True); target.write_text(text, encoding='utf-8')
    print(text)
    return code


if __name__ == '__main__':
    raise SystemExit(main())
