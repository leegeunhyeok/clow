import { LEVEL } from '../../components/Notification';

export interface NotificationModel {
  message: string;
  level?: LEVEL;
}
