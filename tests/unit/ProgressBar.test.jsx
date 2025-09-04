import { render, screen } from '@testing-library/react';
import ProgressBar from '../../components/molecules/ProgressBar.jsx';

test('現在/合計が表示される', () => {
  render(<ProgressBar current={2} total={5} />);
  expect(screen.getByText('2 / 5')).toBeInTheDocument();
});

