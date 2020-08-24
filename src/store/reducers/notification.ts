import { NotificationActions } from '../actions';
import * as types from '../actions/types';
import { LEVEL } from '../../components/Notification';

export interface NotificationState {
  timer: number;
  show: boolean;
  message: string;
  level?: LEVEL;
}

const initialState: NotificationState = {
  timer: -1,
  show: false,
  message: '',
  level: undefined,
};

const notificationReducer = (
  state = initialState,
  action: NotificationActions,
): NotificationState => {
  switch (action.type) {
    case types.REQUEST_NOTIFICATION:
      const { message, level } = action.payload;
      return {
        ...state,
        message,
        level,
      };

    case types.CLOSE_NOTIFICATION:
      return state;

    default:
      return state;
  }
};

export default notificationReducer;
