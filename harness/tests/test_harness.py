import copy
import json
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import hospital_harness as hh


class HarnessTests(unittest.TestCase):
    def setUp(self):
        self.project = hh.read(ROOT/'examples/project.json')
        self.day = date(2026, 9, 11)

    def codes(self, mode='preview'):
        return {v['code'] for v in hh.validate(self.project, mode, self.day) if v['level'] == 'error'}

    def approved_fixture(self):
        self.project['demo'] = False
        self.project['hospital']['origin'] = 'https://clinic.unit.test'
        self.project['sources'][0]['url'] = 'https://source.unit.test/study'
        self.project['reviews'] = [
            {'scope': scope, 'role': role, 'reviewer': 'unit-test-only', 'status': 'approved',
             'reviewed_at': '2026-09-11', 'expires_at': '2026-10-11', 'digest': hh.digest(self.project),
             'evidence_checked': True, 'record': 'unit-test-record'}
            for scope, role in [('operations', 'operations'), ('evidence-example', 'medical')]]

    def test_preview_passes_but_cannot_release(self):
        self.assertEqual(set(), self.codes())
        self.assertTrue({'DEMO', 'REVIEW_REQUIRED'} <= self.codes('release'))

    def test_malformed_optional_containers_report_errors(self):
        self.project['articles'][0]['sections'] = None
        self.project['articles'][0]['images'] = None
        self.assertTrue({'SECTIONS', 'IMAGE'} <= self.codes())

    def test_changed_facts_invalidate_reviews(self):
        self.approved_fixture()
        self.assertEqual(set(), self.codes('release'))
        self.project['hospital']['address'] = 'Updated address'
        self.assertIn('REVIEW_REQUIRED', self.codes('release'))

    def test_expired_and_future_reviews_fail(self):
        self.approved_fixture()
        self.project['reviews'][0]['expires_at'] = '2026-09-10'
        self.assertIn('REVIEW_REQUIRED', self.codes('release'))
        self.project['reviews'][0]['expires_at'] = '2026-10-01'
        self.project['reviews'][0]['reviewed_at'] = '2026-09-12'
        self.assertIn('REVIEW_REQUIRED', self.codes('release'))

    def test_scope_timing_and_statistical_measure_drift(self):
        claim = self.project['articles'][1]['claims'][0]
        claim['scope']['timing'] = 'next day'
        claim['scope']['measure'] = 'relative risk'
        found = [v for v in hh.validate(self.project, as_of=self.day) if v['code'] == 'SCOPE_MISMATCH']
        self.assertEqual(2, len(found))

    def test_biography_copy_and_unknown_author(self):
        self.project['articles'][0]['author_bio'] = 'Other physician biography'
        self.project['articles'][0]['author_id'] = 'unknown'
        self.assertTrue({'BIO_COPY', 'AUTHOR_REF'} <= self.codes())

    def test_hours_overlap_and_literal_copy(self):
        self.project['hospital']['hours'].append(copy.deepcopy(self.project['hospital']['hours'][0]))
        self.project['articles'][0]['answer'] = 'Open until 22:00'
        self.assertTrue({'HOURS_OVERLAP', 'HOURS_LITERAL'} <= self.codes())

    def test_alt_markup_rejected(self):
        self.project['articles'][0]['images'] = [{'src': 'https://image.unit.test/a.png', 'alt': '<p style='}]
        self.assertIn('IMAGE', self.codes())

    def test_paths_cannot_escape_build(self):
        self.project['articles'][0]['id'] = '../../escape'
        self.assertIn('ID', self.codes())

    def test_unknown_fact_token(self):
        self.project['articles'][0]['answer'] = '{{hospital.wrong}}'
        self.assertIn('FACT_TOKEN', self.codes())

    def test_urgent_booking_is_blocked(self):
        a = self.project['articles'][1]
        a['risk'] = 'urgent'; a['cta'] = 'contact'
        self.assertIn('URGENT_CTA', self.codes())

    def test_unknown_evidence_and_duplicate_ids(self):
        self.project['articles'][1]['claims'][0]['source_id'] = 'missing'
        self.project['physicians'].append(copy.deepcopy(self.project['physicians'][0]))
        self.assertTrue({'SOURCE_REF', 'DUPLICATE_ID'} <= self.codes())

    def test_build_fact_propagation_stable_identity_noindex(self):
        with tempfile.TemporaryDirectory() as tmp:
            hh.build(self.project, tmp, as_of=self.day)
            files = list(Path(tmp).rglob('*.html'))
            self.assertEqual(5, len(files))
            for f in files:
                text = f.read_text(encoding='utf-8')
                self.assertIn(self.project['hospital']['address'], text)
                self.assertIn('noindex, nofollow', text)
                self.assertIn('https://hospital.example.invalid/#clinic', text)
            self.assertNotIn('<loc>', (Path(tmp)/'sitemap.xml').read_text())
            with self.assertRaises(ValueError):
                hh.build(self.project, tmp, as_of=self.day)

    def test_release_build_needs_review_and_emits_matching_profile_id(self):
        self.approved_fixture()
        with tempfile.TemporaryDirectory() as tmp:
            hh.build(self.project, tmp, mode='release', as_of=self.day)
            text = (Path(tmp)/'health/evidence-example/index.html').read_text(encoding='utf-8')
            self.assertIn('https://clinic.unit.test/doctors/sample-doctor/#person', text)
            self.assertIn('lastReviewed', text)
            self.assertNotIn('noindex', text)
            self.assertIn('<loc>', (Path(tmp)/'sitemap.xml').read_text())

    def test_metrics_errors_denominator_and_unknown_accuracy(self):
        data = hh.read(ROOT/'examples/observations.json')
        metrics = hh.summarize_observations(data)['metrics'][0]
        self.assertEqual(2, metrics['valid_answers'])
        self.assertEqual(1, metrics['errors'])
        self.assertEqual(.5, metrics['citation_rate'])
        self.assertEqual(2/3, metrics['query_coverage'])
        self.assertEqual(1, metrics['human_labeled_answers'])

    def test_citation_hostname_boundary_and_duplicate_observation(self):
        data = hh.read(ROOT/'examples/observations.json')
        data['observations'][0]['citations'] = ['https://hospital.example.invalid.attacker.test/']
        self.assertEqual(0, hh.summarize_observations(data)['metrics'][0]['citation_rate'])
        data['observations'].append(copy.deepcopy(data['observations'][0]))
        with self.assertRaises(ValueError):
            hh.summarize_observations(data)

    def test_real_snapshot_regressions(self):
        path = ROOT/'tests/fixtures/olympic-structure.json'
        result = hh.audit_snapshot(path)
        codes = {v['code'] for v in result['issues']}
        self.assertTrue({'ALT', 'ENTITY_ID', 'HTML_BUDGET', 'IMAGE_BUDGET'} <= codes)
        demo = ROOT/'tests/fixtures/thegungang-structure.json'
        result = hh.audit_snapshot(demo, 'demo')
        self.assertNotIn('NOINDEX', {v['code'] for v in result['issues']})


if __name__ == '__main__':
    unittest.main()
