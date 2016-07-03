import makeStore from './store';
import {startServer} from './server';

export const store = makeStore();

const io = startServer(store);

store.dispatch({
  type: 'SET_ENTRIES',
  entries: require('./entries.json')
});