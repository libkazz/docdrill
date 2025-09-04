import { render, screen } from '@testing-library/react';
import ScreenPanel from '../../components/molecules/ScreenPanel.jsx';

test('loading 表示', () => {
  render(<ScreenPanel screen={{ type: 'loading', message: 'ロード' }} />);
  expect(screen.getByRole('heading', { level: 1, name: 'データ取得中…' })).toBeInTheDocument();
});

test('error 表示', () => {
  render(<ScreenPanel screen={{ type: 'error', message: '失敗' }} />);
  expect(screen.getByRole('heading', { level: 1, name: '読み込みエラー' })).toBeInTheDocument();
  expect(screen.getByText('失敗')).toBeInTheDocument();
});

test('empty 表示', () => {
  render(<ScreenPanel screen={{ type: 'empty', message: '空' }} />);
  expect(screen.getByRole('heading', { level: 1, name: '本日の確認テストはありません' })).toBeInTheDocument();
});

