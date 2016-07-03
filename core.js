import {List, Map, fromJS, toMap} from 'immutable';


export const MAX_ROUND = 5;


// intialize state
export function setEntries(state, entries) {
	const initVotes = entries.reduce((arr, entry) => {
		return arr.concat({name: entry.name, photo: entry.photo, percents:[20, 20, 20, 20, 20]})
	}, []);

	const initRunningVotes = getInitRunningVotes();

	const initState = fromJS({
		round: 1, 
		totalRounds: 5,
		voted: 0,
		roundFinish: false,
		votes: initVotes,
		voters: entries.length,
		runningVotes: initRunningVotes
	});
	return initState;
}

// accept vote from user
export function vote(state, ratios) {
	const newVoted = state.get('voted') + 1;
	const currentRunningVotes = state.get('runningVotes').toJS();
	ratios.forEach(ratio => {
		currentRunningVotes.find(c => c.name === ratio.name).percents.push(ratio.percent);
	});
	if (!currentRunningVotes.some(votes => votes.percents.length < 5)) {
		console.log("round finish", currentRunningVotes);
		return state.set('roundFinish', true)
								.set('round', state.get('round') + 1)
								.set('voted', 0)
								.set('votes', fromJS(currentRunningVotes))
								.set('runningVotes', fromJS(getInitRunningVotes()));
	}	
	return state.set('roundFinish', false)
							.set('voted', newVoted)							
							.set('runningVotes', fromJS(currentRunningVotes));
}

function getInitRunningVotes() {	
	return require('./entries.json').reduce((arr, entry) => {
		return arr.concat({name: entry.name, photo: entry.photo, percents:[]})
	}, []);	
}

export function getClientStateFromServerState(serverState) {
	const clientState = {
		round: serverState.round,
		totalRounds: serverState.totalRounds,
		roundFinish: serverState.roundFinish,
		voted: serverState.voted,
		voters: serverState.voters,
		votes: serverState.votes.map(votes => {
			return {
				name: votes.name, percents: votes.percents.sort(), photo: votes.photo
			}
		})
	};
	return clientState;
}