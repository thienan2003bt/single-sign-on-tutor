import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducer/rootReducer';
import { injectStore } from '../services/axios';

const store = createStore(rootReducer, applyMiddleware(thunk));
injectStore(store);
export default store;