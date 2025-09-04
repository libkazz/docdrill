import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuestionPanel from '../../components/molecules/QuestionPanel.jsx';

const q = {
  id: 'Q1',
  question: 'サンプル設問',
  options: [
    { key: 'A', text: 'A-1' },
    { key: 'B', text: 'B-1' },
  ],
};

test('設問と選択肢が表示され、選択でハンドラが呼ばれる', async () => {
  const user = userEvent.setup();
  const onAnswer = jest.fn();
  render(<QuestionPanel q={q} onAnswer={onAnswer} />);
  expect(screen.getByRole('heading', { level: 2, name: /Q1. サンプル設問/ })).toBeInTheDocument();
  await user.click(screen.getByLabelText('A. A-1'));
  expect(onAnswer).toHaveBeenCalledWith('A');
});

