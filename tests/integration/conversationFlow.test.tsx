import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../App';
import type { AiStreamChunk } from '../../types';

const mockStream = vi.hoisted(() => async function* (): AsyncGenerator<AiStreamChunk> {
  yield { text: 'Mock response' } as AiStreamChunk;
});

vi.mock('../../services/geminiService', () => ({
  getAiResponseStream: vi.fn().mockResolvedValue(mockStream()),
}));

describe('App conversation flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('sends a message and renders the response', async () => {
    const user = userEvent.setup();
    render(<App />);

    const textbox = screen.getByRole('textbox');
    await user.type(textbox, 'Hello{enter}');

    expect(await screen.findByText('Mock response')).toBeInTheDocument();
  });
});
