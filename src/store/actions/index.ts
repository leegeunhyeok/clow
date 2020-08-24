import { ThunkAction } from 'redux-thunk';
import { NotificationModel } from '../models';
import * as types from './types';
import { RootState } from '../reducers';

export interface RequestNotificationAction {
  type: typeof types.REQUEST_NOTIFICATION;
  payload: NotificationModel;
}

export interface CloseNotificationAction {
  type: typeof types.CLOSE_NOTIFICATION;
}

export type NotificationActions = RequestNotificationAction | CloseNotificationAction;

const requestNotification = (notification: NotificationModel): RequestNotificationAction => ({
  type: types.REQUEST_NOTIFICATION,
  payload: notification,
});

const closeNotification = (): CloseNotificationAction => ({
  type: types.CLOSE_NOTIFICATION,
});

export const reqeustNotification = () => (dispatch) => {
  // TODO
};
