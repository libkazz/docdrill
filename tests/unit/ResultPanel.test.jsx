import { render, screen } from '@testing-library/react';
import ResultPanel from '../../components/organisms/ResultPanel.jsx';

const questions = [
  { id: 'Q1', question: 'Q1 問題', options: [{ key:'A', text:'A1' }, { key:'B', text:'B1' }], correct_option: 'A', rationale_correct: 'ok', rationale_distractors: { B: 'ng' } },
  { id: 'Q2', question: 'Q2 問題', options: [{ key:'A', text:'A2' }, { key:'B', text:'B2' }], correct_option: 'B', rationale_correct: 'ok2', rationale_distractors: { A: 'ng2' } },
];
const answers = [ { id:'Q1', answer:'A' }, { id:'Q2', answer:'B' } ];

test('結果サマリーと解説が表示される', () => {
  render(<ResultPanel questions={questions} answers={answers} />);
  expect(screen.getByRole('heading', { level: 1, name: '採点結果' })).toBeInTheDocument();
  // スコアの大型表示（100点）と正答数が見える
  expect(screen.getByText('100')).toBeInTheDocument();
  expect(screen.getByText('点')).toBeInTheDocument();
  expect(screen.getByText('正答数 2 / 2')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: '解説' })).toBeInTheDocument();
  // 全問正解の場合は不正解の明細がない旨を表示
  expect(screen.getByText('不正解の設問はありません')).toBeInTheDocument();
});
