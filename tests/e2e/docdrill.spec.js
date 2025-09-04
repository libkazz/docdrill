// @ts-check
const { test, expect } = require('@playwright/test');

// Fixed test date that matches our test route
const TEST_PROBLEM = '2024-01-02';

test('設問の遷移で前の選択が残らない', async ({ page }) => {
  await page.goto(`/?q=${TEST_PROBLEM}`);
  // 設問1が見える
  await expect(page.getByRole('heading', { level: 2, name: /テスト用の設問 1/ })).toBeVisible();
  // A を選択して次へ（選択で自動遷移）
  await page.getByLabel('A. A-1').check();
  // 設問2に遷移している
  await expect(page.getByRole('heading', { level: 2, name: /テスト用の設問 2/ })).toBeVisible();
  // どの選択肢も選択されていない
  await expect(page.locator('input[type="radio"]:checked')).toHaveCount(0);
});

test('最終回答後に採点インジケーター表示→結果表示', async ({ page }) => {
  await page.goto(`/?q=${TEST_PROBLEM}`);
  // Q1: B を選ぶ
  await page.getByLabel('B. B-1').check();
  // Q2: D を選ぶ（最終回答）
  await expect(page.getByRole('heading', { level: 2, name: /テスト用の設問 2/ })).toBeVisible();
  await page.getByLabel('D. D-2').check();

  // 採点中インジケーターが出る
  await expect(page.getByText('採点中…')).toBeVisible();
  // 結果画面へ（1.5秒後に切替）
  await expect(page.getByRole('heading', { level: 1, name: '採点結果' })).toBeVisible({ timeout: 4000 });
});
