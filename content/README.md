# Clinic content

`pages.json` contains 76 planned routes with original editorial summaries, questions, source links and related pages. `clinic.json` and `physicians.json` hold clinic identity and source-derived profiles. `assets.json` records hashes and provenance for the five optimized image files.

These are review drafts. `reviews.json` is deliberately empty because no medical or operational approvals have been supplied. `npm run build` creates a complete, noindex review site; `npm run build:release` refuses unreviewed or changed content. Never insert test approvals to make a release pass. Test fixtures exist only in unit-test memory.

The 20 questions in `measurement-queries.json` are an editorial evaluation set, not a measured list of frequent questions. No user Q&A text, patient image, medical record, API key or private reviewer document belongs in this public repository.

See [the Korean handoff guide](../docs/development-handoff.ko.md) for editing, publishing, the review record schema and deployment.
