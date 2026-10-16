import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Message } from '../../components/Message';
import { Message as MessageType, Role } from '../../types';

describe('Message component', () => {
  it('renders plain text content', () => {
    const message: MessageType = {
      id: 'm1',
      role: Role.User,
      content: 'Hello world',
      timestamp: new Date(),
    };

    render(<Message message={message} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders code block content', () => {
    const message: MessageType = {
      id: 'm2',
      role: Role.Model,
      content: '```js\nconsole.log("hi")\n```',
      timestamp: new Date(),
    };

    render(<Message message={message} />);
    expect(screen.getByText(/console\.log/)).toBeInTheDocument();
  });
});
