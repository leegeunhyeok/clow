import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import rootReducer from 'src/store/reducers';

const configureStore = () =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(createLogger(), ReduxThunk)));

export default configureStore;
