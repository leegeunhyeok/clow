import { Dispatch } from 'redux';
import * as types from './types';
import axios from 'axios';

interface StartEngineAction {
  type: typeof types.START_ENGINE;
  payload: boolean;
}

export type EngineActions = StartEngineAction;

const startEngineAction = (success: boolean): StartEngineAction => ({
  type: types.START_ENGINE,
  payload: success,
});

export const excuteFromServer = (data: any) => (dispatch: Dispatch) =>
  axios
    .post('/engine/start', data)
    .then((response) => {
      dispatch(startEngineAction(response.status === 200));
    })
    .catch((error) => {
      throw error;
    });
