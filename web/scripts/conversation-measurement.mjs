import { citationBelongsToSite, measureObservations } from './measurement.mjs';

// Observations must come from the same real conversation, with the fixed prompts
// and all earlier turns retained. Missing turns and failed requests are explicit.
export function measureConversations(rows, scenarios, site, aliases, originalSites = []) {
  const queries = scenarios.flatMap((s) => s.turns.map((t) => ({ id: `${s.id}:${t.turn}` })));
  const normalized = rows.map((row) => {
    const scenario = scenarios.find((s) => s.id === row.scenarioId);
    const turn = scenario?.turns.find((t) => t.turn === row.turn);
    if (
      !turn ||
      row.language !== scenario.language ||
      row.prompt !== turn.prompt ||
      !row.conversationId ||
      row.historyMode !== 'same-thread'
    )
      throw new Error('Invalid conversation identity, prompt, or history');
    return { ...row, queryId: `${row.scenarioId}:${row.turn}`, runId: row.conversationId };
  });
  const metrics = measureObservations(normalized, queries, site, aliases, originalSites);
  const conditionFields = [
    'engine',
    'period',
    'language',
    'model',
    'region',
    'searchMode',
    'querySetVersion',
  ];
  const belongs = (row, group) => conditionFields.every((key) => (row[key] ?? null) === group[key]);
  const cited = (row) =>
    row.status === 'ok' &&
    row.citations.some((url) =>
      [site, ...originalSites].some((s) => citationBelongsToSite(url, s)),
    );
  const mentioned = (row) =>
    aliases.some((a) => row.answer.toLocaleLowerCase().includes(a.toLocaleLowerCase()));
  const rate = (matching, denominator) => (denominator ? matching / denominator : null);
  return metrics.map((metric) => {
    const group = normalized.filter((r) => belongs(r, metric));
    const conversations = new Map();
    for (const row of group) {
      const key = JSON.stringify([row.scenarioId, row.conversationId]);
      if (!conversations.has(key)) conversations.set(key, []);
      conversations.get(key).push(row);
    }
    let complete = 0,
      priorCitedTransitions = 0,
      retainedCitedTransitions = 0;
    for (const turns of conversations.values()) {
      turns.sort((a, b) => a.turn - b.turn);
      if (turns.some((r, i) => r.turn !== i + 1))
        throw new Error('Conversation history has missing turns');
      const scenario = scenarios.find((s) => s.id === turns[0].scenarioId);
      if (turns.length === scenario.turns.length && turns.every((r) => r.status === 'ok'))
        complete++;
      for (let i = 1; i < turns.length; i++) {
        if (cited(turns[i - 1]) && turns[i].status === 'ok') {
          priorCitedTransitions++;
          if (cited(turns[i])) retainedCitedTransitions++;
        }
      }
    }
    const valid = group.filter((r) => r.status === 'ok');
    const first = valid.filter((r) => r.turn === 1);
    const followups = valid.filter((r) => r.turn > 1);
    const unprompted = valid.filter(
      (r) =>
        !scenarios
          .find((s) => s.id === r.scenarioId)
          .turns.some((t) => t.turn <= r.turn && t.brandPrompted),
    );
    const eligibleQueries = scenarios
      .filter((s) => s.language === metric.language)
      .flatMap((s) => s.turns);
    return {
      ...metric,
      queryCoverage: rate(new Set(valid.map((r) => r.queryId)).size, eligibleQueries.length),
      conversations: conversations.size,
      completeConversations: complete,
      incompleteConversations: conversations.size - complete,
      firstTurnAnswers: first.length,
      followupAnswers: followups.length,
      firstTurnEitherSiteCitationRate: rate(first.filter(cited).length, first.length),
      followupEitherSiteCitationRate: rate(followups.filter(cited).length, followups.length),
      priorCitedTransitions,
      retainedCitedTransitions,
      continuedCitationRate: rate(retainedCitedTransitions, priorCitedTransitions),
      unpromptedAnswers: unprompted.length,
      unpromptedBrandMentionRate: rate(unprompted.filter(mentioned).length, unprompted.length),
    };
  });
}
