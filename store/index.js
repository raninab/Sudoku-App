import boardReducer from './reducers/boardReducer';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(boardReducer, applyMiddleware(thunk));

export default store;


