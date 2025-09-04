import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DocDrill from '../../components/DocDrill.js';

// Mock next/navigation useSearchParams
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('?q=2024-01-02')
}));

beforeEach(() => {
  process.env.NEXT_PUBLIC_DATA_BASE_URL = '/tests';
  global.fetch = jest.fn(async (url) => {
    if (String(url).endsWith('/2024-01-02.json')) {
      return {
        ok: true,
        json: async () => ([
          { id:'Q1', question:'テスト用の設問 1 — 正しいものを選んでください', options:{A:'A-1', B:'B-1'}, correct_option:'B' }
        ])
      };
    }
    return { ok: false };
  });
});

afterEach(() => {
  jest.useRealTimers();
});

test('ロード後に設問が表示され、回答後は採点→結果が表示', async () => {
  render(<DocDrill />);

  // 設問表示（実タイマーで待機）
  await waitFor(() => expect(screen.getByRole('heading', { level: 2, name: /テスト用の設問 1/ })).toBeInTheDocument());

  // ここからフェイクタイマーで採点フローを進める
  jest.useFakeTimers();
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

  // 回答（最終問題）
  await user.click(screen.getByLabelText('B. B-1'));
  // 25ms 後に採点インジケーター
  act(() => { jest.advanceTimersByTime(30); });
  expect(screen.getByText('採点中…')).toBeInTheDocument();

  // 1.5秒後に結果へ
  act(() => { jest.advanceTimersByTime(1500); });
  await waitFor(() => expect(screen.getByRole('heading', { level: 1, name: '採点結果' })).toBeInTheDocument());
});
