import { render, screen } from '@testing-library/react';
import ScoringIndicator from '../../components/molecules/ScoringIndicator.jsx';

test('採点中の表示が出る', () => {
  render(<ScoringIndicator />);
  expect(screen.getByText('採点中…')).toBeInTheDocument();
});

