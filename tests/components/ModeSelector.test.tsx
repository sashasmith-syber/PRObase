import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ModeSelector } from '../../components/ModeSelector';
import { Mode } from '../../types';

describe('ModeSelector component', () => {
  it('calls onModeChange when a mode is selected', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();

    render(<ModeSelector activeMode={Mode.Professor} onModeChange={onModeChange} />);

    const button = screen.getByRole('button', { name: /coder/i });
    await user.click(button);

    expect(onModeChange).toHaveBeenCalledWith(Mode.Coder);
  });
});
