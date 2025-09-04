import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OptionItem from '../../components/molecules/OptionItem.jsx';

test('ラジオ選択が onSelect を呼ぶ', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();
  render(
    <OptionItem
      groupName="choice-Q1"
      option={{ key: 'A', text: 'A-1' }}
      onSelect={onSelect}
    />
  );
  await user.click(screen.getByLabelText('A. A-1'));
  expect(onSelect).toHaveBeenCalledWith('A');
});

