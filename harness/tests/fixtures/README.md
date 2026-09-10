# Structural regression fixtures

These fixtures preserve status, robots directives, canonical paths, observed byte/image counts and schema entity IDs from the two 2026-09-11 audits. Page bodies, biographies, image URLs and image files are omitted. Alt values are reduced to absent / empty / nonempty / markup; titles are represented by presence only.

`extract_structural_fixtures.py` is a one-time local importer. Tests read the committed fixtures, so CI does not need the private local `research/` directory. Findings remain structural observations of the saved snapshots, not claims about the current external sites.
