import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('reports/build-manifest.json', 'utf8'));
const url = (path: string) => `http://127.0.0.1:3000${manifest.basePath}${path}`;

test('category aliases, actual counts and an empty symptom category work', async ({ page }) => {
  await page.goto(url('/diseases/'));
  await page.getByLabel('어떤 질환이 궁금하신가요?').fill('심장혈관');
  await expect(page.locator('.result-card')).toHaveCount(20);
  await expect(page.locator('.result-count')).toContainText('20개');
  await page.getByRole('button', { name: '심장·혈관 20개', exact: true }).click();
  await expect(page.getByRole('button', { name: '심장·혈관 20개', exact: true })).toContainText(
    '20',
  );
  await expect(page.locator('.result-count')).toHaveText('심장·혈관 · “심장혈관” 검색 결과 20개');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.goto(url('/symptoms/'));
  await expect(page.locator('.filter-row button')).toHaveCount(8);
  await page.getByRole('button', { name: '신장 0개', exact: true }).click();
  await expect(page.locator('.result-card')).toHaveCount(0);
  await expect(page.locator('.result-count')).toHaveText('신장 · 0개');
  await expect(
    page.getByRole('heading', { name: '이 분야에 등록된 안내가 없습니다.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '전체 목록 보기' }).click();
  await expect(page.locator('.result-card')).toHaveCount(5);
});

test('site search includes the introductory definition of a disease', async ({ page }) => {
  await page.goto(url('/search/?q=높은%20혈압이%20지속되는'));
  await expect(page.locator('.result-card')).toHaveCount(1);
  await expect(page.locator('.result-card')).toContainText('고혈압이란 무엇인가요?');
});

test('new disease is accessible, uses the disease menu and has one complete footer on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url('/diseases/cardio/heart-failure/'));
  await expect(page.locator('.page-category')).toHaveText('질환백과');
  await expect(page.locator('.qa-list details')).toHaveCount(3);
  await expect(page.locator('.article-footer')).toHaveCount(1);
  await expect(page.locator('.medical-safety')).toHaveCount(1);
  await expect(page.locator('.heart-reservation')).toHaveCount(1);
  await expect(page.locator('.document-notice')).toHaveCount(0);
  await page.locator('.article-clinic summary').click();
  await expect(page.locator('.article-clinic')).toContainText('031-202-7555');
  await expect(page.locator('.article-clinic')).toContainText('지하주차장');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({ path: 'reports/cardio-heart-failure-mobile.png', fullPage: true });
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.medical-safety')).toBeVisible();
});

test('test availability and emergency articles preserve different result times', async ({
  page,
}) => {
  await page.goto(url('/services/heart/cardiac-markers/'));
  const rows = page.locator('#purpose tbody tr');
  await expect(rows).toHaveCount(6);
  await expect(rows.first()).toContainText('20분');
  for (let i = 1; i < 6; i++) await expect(rows.nth(i)).toContainText('다음 날');
  await expect(page.locator('#planned-test')).toContainText('향후 도입 예정');
  await page.goto(url('/services/examinations/#ambulatory-blood-pressure'));
  await expect(page.locator('#ambulatory-blood-pressure')).toContainText('CART BP Pro');
  await expect(page.locator('#ambulatory-blood-pressure')).toContainText('약 1시간');
  await page.goto(url('/diseases/cardio/acute-myocardial-infarction/'));
  await expect(page.locator('.urgent-note')).toContainText('즉시 119');
  await expect(page.locator('#summary')).not.toContainText('안정적인 경우');
});

test('visa safety and document panels match all five translated page languages', async ({
  page,
}) => {
  for (const language of ['en', 'zh-hans', 'th', 'ru', 'ne']) {
    await page.goto(url(`/${language}/checkups/visa/`));
    await expect(page.locator('.article-footer')).toHaveCount(1);
    await expect(page.locator('.medical-safety')).toContainText('119');
    await expect(page.locator('.document-notice')).toHaveCount(1);
    await expect(page.locator('.article-clinic')).toHaveCount(0);
    expect(await page.locator('.article-footer').innerText()).not.toMatch(/[가-힣]/);
  }
});
