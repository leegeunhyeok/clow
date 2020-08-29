import { ClowEventType } from 'src/core/context';

interface ClowMessage {
  [key: string]: EventMessage;
}
type EventMessage = { [key in keyof typeof ClowEventType]?: string };

const MESSAGES: ClowMessage = {
  kr: {
    [ClowEventType.ALREADY_CONNECTED]: '이미 연결된 모듈입니다',
    [ClowEventType.NOT_CONNECTABLE]: '연결할 수 없습니다',
  },
  en: {
    [ClowEventType.ALREADY_CONNECTED]: 'Already connected with this module',
    [ClowEventType.NOT_CONNECTABLE]: 'This relation is not connectable',
  },
};

export const getMessageFromEvent = (eventType: ClowEventType, language: string = 'en'): string =>
  MESSAGES[language][eventType] || 'unknown';

export default MESSAGES;
