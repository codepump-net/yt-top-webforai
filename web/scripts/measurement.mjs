export function citationBelongsToSite(citation, site) {
  try {
    const candidate = new URL(citation);
    const expected = new URL(site);
    const prefix = expected.pathname.replace(/\/$/, '');
    return (
      candidate.origin === expected.origin &&
      (prefix === '' ||
        candidate.pathname === prefix ||
        candidate.pathname.startsWith(prefix + '/'))
    );
  } catch {
    return false;
  }
}
export function measureObservations(input, queries, site, aliases, originalSites = []) {
  if (!Array.isArray(input) || !Array.isArray(queries) || !aliases.length)
    throw new Error('Observation array, queries and aliases required');
  const ids = new Set(queries.map((q) => q.id));
  const seen = new Set();
  const groups = new Map();
  for (const row of input) {
    if (
      !ids.has(row.queryId) ||
      !['ok', 'error'].includes(row.status) ||
      !row.engine ||
      !row.period ||
      !row.language ||
      !row.runId
    )
      throw new Error('Invalid observation identity');
    const key = JSON.stringify([
      row.engine,
      row.period,
      row.language,
      row.model ?? null,
      row.region ?? null,
      row.searchMode ?? null,
      row.querySetVersion ?? null,
    ]);
    const unique = [key, row.queryId, row.runId].join('|');
    if (seen.has(unique)) throw new Error('Duplicate observation');
    seen.add(unique);
    if (
      row.status === 'ok' &&
      (typeof row.answer !== 'string' ||
        !row.answer.trim() ||
        !Array.isArray(row.citations) ||
        row.citations.some((c) => typeof c !== 'string'))
    )
      throw new Error('Successful observation requires answer and citation URLs');
    if (row.accurate !== undefined && (typeof row.accurate !== 'boolean' || !row.reviewer))
      throw new Error('Accuracy requires a human label and reviewer');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups].map(([key, rows]) => {
    const good = rows.filter((r) => r.status === 'ok');
    const labeled = good.filter((r) => typeof r.accurate === 'boolean' && r.reviewer);
    const [engine, period, language, model, region, searchMode, querySetVersion] = JSON.parse(key);
    const citedNew = (r) => r.citations.some((c) => citationBelongsToSite(c, site));
    const citedOriginal = (r) =>
      r.citations.some((c) => originalSites.some((s) => citationBelongsToSite(c, s)));
    const newCount = good.filter(citedNew).length;
    const originalCount = good.filter(citedOriginal).length;
    const eitherCount = good.filter((r) => citedNew(r) || citedOriginal(r)).length;
    return {
      engine,
      period,
      language,
      model,
      region,
      searchMode,
      querySetVersion,
      attempts: rows.length,
      validAnswers: good.length,
      errors: rows.length - good.length,
      queryCoverage: ids.size ? new Set(good.map((r) => r.queryId)).size / ids.size : null,
      newSiteCitedAnswers: newCount,
      originalSiteCitedAnswers: originalCount,
      eitherSiteCitedAnswers: eitherCount,
      citationRate: good.length ? newCount / good.length : null,
      originalSiteCitationRate: good.length ? originalCount / good.length : null,
      eitherSiteCitationRate: good.length ? eitherCount / good.length : null,
      brandMentionRate: good.length
        ? good.filter((r) =>
            aliases.some((a) => r.answer.toLocaleLowerCase().includes(a.toLocaleLowerCase())),
          ).length / good.length
        : null,
      humanLabeledAnswers: labeled.length,
      accuracyRate: labeled.length
        ? labeled.filter((r) => r.accurate).length / labeled.length
        : null,
    };
  });
}
