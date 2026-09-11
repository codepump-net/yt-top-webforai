# Clinic content

`pages.json` contains 45 routes (44 patient/information/utility routes and a 404) with hospital information, questions, source links and related pages. `clinic.json` and `physicians.json` hold clinic identity and source-derived profiles. `assets.json` records hashes and provenance for the five optimized image files.

`case-links.json` links to 25 case articles on the original hospital site. Notices link to the original announcement board. This site runs alongside `yttop.co.kr`; it does not replace it. `page-intents.json` records the patient need for each public route and is consumed only by the internal build checks. Do not publish these internal records as hospital pages. See [the patient-content policy](../docs/patient-content-policy.ko.md) and [the page-by-page cleanup](../docs/content-audit-2026-09-11/README.md).

These are review drafts. `reviews.json` is deliberately empty because no medical or operational approvals have been supplied. `npm run build` creates a complete, noindex review site; `npm run build:release` refuses unreviewed or changed content. Never insert test approvals to make a release pass. Test fixtures exist only in unit-test memory.

The 32 questions in `measurement-queries.json` are an editorial evaluation set, not a measured list of frequent questions. The original 20 were extended by 12 research-derived items; Q03 maps to the existing palpitations item. No user Q&A text, patient image, medical record, API key or private reviewer document belongs in this public repository.

Blocks and questions support stable `id`, local `sourceIds`, and contextual `links` (`pageId`, optional `anchor`, `label`). Blocks can contain an accessible `table` (`caption`, `columns`, `rows`). Source IDs must exist on the same page; links and anchors must resolve. Source kinds distinguish hospital facts from medical references. An attached reference is not clinical approval. See [the improvement result](../docs/aeo-geo-improvement-results-2026-09-11/README.md).

`clinic.json` stores `addressParts` and time intervals. `web/src/lib/content-model.mjs` derives the display address, hours and JSON-LD from the same data. Manuscripts can reference `{{clinic.name}}`, `{{clinic.phone}}`, `{{clinic.address}}`, `{{clinic.subway}}`, and `{{clinic.hours.ID}}`. Both server rendering and build validation resolve these references before output. Do not copy contact values into prose. Saturday hours remain visible but are omitted from structured intervals while the break condition is unconfirmed; no coordinates have been invented.

Medical review records require `reviewerId` matching the actual reviewer's profile and name. No new review records were added. Approval digests use the resolved data returned by `loadContent()`, including the shared resolver in the renderer digest; do not hash only the raw clinic JSON.

See [the Korean handoff guide](../docs/development-handoff.ko.md) for editing, publishing, the review record schema and deployment.
