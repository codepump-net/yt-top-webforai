import { expect, it } from 'vitest';
import { measureConversations } from '../../scripts/conversation-measurement.mjs';
const scenarios = [
  {
    id: 's',
    language: 'ko',
    turns: [
      { turn: 1, prompt: '증상 질문', brandPrompted: false },
      { turn: 2, prompt: '지역 질문', brandPrompted: false },
      { turn: 3, prompt: '병원 이름을 지정한 질문', brandPrompted: true },
    ],
  },
  { id: 'en', language: 'en', turns: [{ turn: 1, prompt: 'English question' }] },
];
const row = (turn, citations = [], extra = {}) => ({
  scenarioId: 's',
  conversationId: 'a',
  historyMode: 'same-thread',
  turn,
  prompt: scenarios[0].turns[turn - 1].prompt,
  engine: 'fixture',
  language: 'ko',
  period: '2026-09',
  status: 'ok',
  answer: 'Clinic',
  citations,
  ...extra,
});
const measure = (rows) =>
  measureConversations(
    rows,
    scenarios,
    'https://new.example/',
    ['Clinic'],
    ['https://old.example/'],
  );
it('separates first and later answers, original-site citations and prompted mentions', () => {
  const [m] = measure([row(1), row(2, ['https://new.example/']), row(3, ['https://old.example/'])]);
  expect(m).toMatchObject({
    completeConversations: 1,
    incompleteConversations: 0,
    firstTurnEitherSiteCitationRate: 0,
    followupEitherSiteCitationRate: 1,
    continuedCitationRate: 1,
    priorCitedTransitions: 1,
    unpromptedAnswers: 2,
    queryCoverage: 1,
    accuracyRate: null,
  });
});
it('keeps errors and incomplete conversations out of answer and retention denominators', () => {
  const [m] = measure([row(1, ['https://new.example/']), row(2, [], { status: 'error' })]);
  expect(m).toMatchObject({
    errors: 1,
    incompleteConversations: 1,
    completeConversations: 0,
    followupAnswers: 0,
    followupEitherSiteCitationRate: null,
    continuedCitationRate: null,
  });
});
it('rejects missing history, duplicate turns and changed prompts', () => {
  expect(() => measure([row(2)])).toThrow('missing turns');
  expect(() => measure([row(1), row(1)])).toThrow('Duplicate');
  expect(() => measure([row(1, [], { prompt: 'changed' })])).toThrow('prompt');
  expect(() => measure([row(1, [], { historyMode: 'fresh-thread' })])).toThrow('history');
});
