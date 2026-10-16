import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Conversation, Message, Role } from '../../types';
import { getHistory, saveHistory, saveHistoryDebounced } from '../../services/localStorageService';

describe('localStorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves history', () => {
    const message: Message = {
      id: 'm1',
      role: Role.User,
      content: 'Hello',
      timestamp: new Date(),
    };
    const conversation: Conversation = {
      id: 'c1',
      title: 'Test',
      timestamp: new Date().toISOString(),
      messages: [message],
    };

    saveHistory([conversation]);
    const loaded = getHistory();

    expect(loaded).toHaveLength(1);
    expect(loaded[0].id).toBe('c1');
    expect(loaded[0].messages[0].content).toBe('Hello');
    expect(loaded[0].messages[0].timestamp).toBeInstanceOf(Date);
  });

  it('debounces history saves', () => {
    vi.useFakeTimers();
    const conversation: Conversation = {
      id: 'c2',
      title: 'Debounced',
      timestamp: new Date().toISOString(),
      messages: [
        {
          id: 'm2',
          role: Role.User,
          content: 'Hi',
          timestamp: new Date(),
        },
      ],
    };

    saveHistoryDebounced([conversation]);
    expect(getHistory()).toHaveLength(0);

    vi.runAllTimers();
    expect(getHistory()).toHaveLength(1);
    vi.useRealTimers();
  });
});
