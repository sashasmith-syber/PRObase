import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PromptInput } from '../../components/PromptInput';
import { Mode } from '../../types';

describe('PromptInput component', () => {
  it('sends message on Enter', async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();
    const setActiveMode = vi.fn();
    const setAttachment = vi.fn();

    render(
      <PromptInput
        onSendMessage={onSendMessage}
        isLoading={false}
        activeMode={Mode.Professor}
        setActiveMode={setActiveMode}
        attachment={null}
        setAttachment={setAttachment}
      />
    );

    const textbox = screen.getByRole('textbox');
    await user.type(textbox, 'Hello{enter}');

    expect(onSendMessage).toHaveBeenCalledWith('Hello');
  });
});
