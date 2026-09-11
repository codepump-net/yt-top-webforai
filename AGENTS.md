# Project purpose

Build a patient-facing website for Yeongtong Top Internal Medicine (영통탑내과), operated alongside https://yttop.co.kr/. Patients and AI systems should encounter the same useful hospital information. This is not a public development report or a replacement/migration of the original site.

Before changing public pages, read `docs/patient-content-policy.ko.md`. Current route scope is `content/pages.json`; `content/page-intents.json` records each route's patient need. Historical 76-page plans and one-time importers are superseded by `docs/content-audit-2026-09-11/README.md`.

- Public content must help patients understand the hospital, clinicians, care, examinations, preparation, visiting, or site use. Do not add a page solely to demonstrate SEO/AEO/GEO work.
- Keep development status, crawling methodology, review workflows and research reports in internal documentation, outside `web/out/` and the rendered site. Do not restore `/content-policy/` or copied case/notice detail pages from historical plans.
- Keep useful clinical limitations, genuine sources and evidenced review attribution. Do not fabricate medical approval, facts, prices, question frequency or optimization results.
- Preserve the original announcement channel and case article links. Do not introduce blanket redirects or canonicals that assume replacement of `yttop.co.kr`.
- Run the relevant content and export checks after changes. Preserve existing UI fixes and the truthful production release validation. Keyword checks support editorial judgment; they do not replace it.
