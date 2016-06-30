import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();
export const MAX_ROUND = 5;



export function setEntries (state, entries) {
	return state.set('entries', List(entries))
}