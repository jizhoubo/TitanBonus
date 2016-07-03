export const VOTE = 'VOTE';
export const SET_STATE = 'SET_STATE';

export function vote(ratios) {
	return {
		meta: {remote: true},
		type: VOTE,
		ratios
	};
}

export function setState(state) {
  return {
    type: SET_STATE,
    state
  };
}