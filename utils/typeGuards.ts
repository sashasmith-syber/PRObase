import { Conversation, Message, Role } from '../types';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

/**
 * @param value - Value to check.
 * @returns True if value is a valid attachment object.
 */
export const isAttachment = (value: unknown): value is Message['attachment'] => {
  if (!isRecord(value)) return false;
  return (
    typeof value.data === 'string' &&
    typeof value.mimeType === 'string' &&
    typeof value.name === 'string'
  );
};

/**
 * @param value - Value to check.
 * @returns True if value is a valid Message object.
 */
export const isMessage = (value: unknown): value is Message => {
  if (!isRecord(value)) return false;
  const role = value.role;
  const attachment = value.attachment;

  const isValidRole = typeof role === 'string' && Object.values(Role).includes(role as Role);
  const hasValidAttachment = attachment === undefined || isAttachment(attachment);

  return (
    typeof value.id === 'string' &&
    isValidRole &&
    typeof value.content === 'string' &&
    (typeof value.timestamp === 'string' || value.timestamp instanceof Date) &&
    hasValidAttachment
  );
};

/**
 * @param value - Value to check.
 * @returns True if value is a valid Conversation object.
 */
export const isConversation = (value: unknown): value is Conversation => {
  if (!isRecord(value)) return false;
  const messages = value.messages;

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.timestamp === 'string' &&
    Array.isArray(messages) &&
    messages.every(isMessage)
  );
};
