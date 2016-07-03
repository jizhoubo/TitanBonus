import {Map, fromJS} from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Notification } from 'react-notification';
import { vote } from '../actions/index';
import ProgressBar from './progress_bar';
import Introduction from './introduction';

class VotePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
    	votes:[],
    	voted: false,
    	showingNotification: false
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
  }

  componentWillReceiveProps(props) {
  	// update component's state from new redux state
  	const serverVotes = props.votes.toJS();
  	const clientVotes = serverVotes.reduce((arr, vote) => {
			  			return arr.concat({
			  				name: vote.name,
			  				percent: this.state.votes.some(v => v.name === vote.name) ? this.state.votes.find(v => v.name === vote.name).percent : 0
			  			})
			  		}, []);
  	this.setState({
  		votes: clientVotes
  	})
  	if (props.voted === 0) {
  		this.setState({
  			voted: false
  		});
  	}
  }

  onInputChange(name, event) {
  	const newPercent = event.target.value;
  	const newVotes = this.state.votes
  										.filter(vote => vote.name !== name)
  										.concat({name: name, percent: newPercent});
  	this.setState({
  		votes: newVotes
  	});
  }

  onMinusButtonClick(name) {
  	const currentPercent = parseInt(this.state.votes.find(v => v.name === name).percent, 10);
  	const newPercent = currentPercent - 1 >= 0 ? currentPercent - 1 : currentPercent;  	
  	const newVotes = this.state.votes
  										.filter(vote => vote.name !== name)
  										.concat({name: name, percent: newPercent});
  	this.setState({
  		votes: newVotes
  	});
  }

  onPlusButtonClick(name) {
  	const currentPercent = parseInt(this.state.votes.find(v => v.name === name).percent, 10);
  	const newPercent = currentPercent + 1 <= 100 ? currentPercent + 1 : currentPercent;
  	const newVotes = this.state.votes
  										.filter(vote => vote.name !== name)
  										.concat({name: name, percent: newPercent});
  	this.setState({
  		votes: newVotes
  	});
  }

  onSubmitButtonClick() {
  	const sum = this.state.votes.reduce((s, vote) => s + parseInt(vote.percent), 0);
  	if (sum !== 100) {
  		this.setState({
  			showingNotification: true
  		})
  		return;
  	}
  	this.setState({
  		voted: true
  	});
  	this.props.vote(this.state.votes);
  }

	render() {
		if (!this.props.votes) {
			return (
				<div>Loading...</div>
			);
		}
		return (
			<div>			
				<Introduction />
				<div className="row">
					<ProgressBar title="Round" current={this.props.round} total={this.props.totalRounds} color={'red'} />
					<ProgressBar title="# of Voted " current={this.props.voted} total={this.props.voters} color={'green'} />
					{this.props.votes.toJS().map(v => {
						return (
							<div key={v.name} className="col-lg-4 col-sm-6">
								<div className="thumbnail" style={{'border': "none"}} >
									<img style={{'borderRadius': '50%', 'width':'200px', 'height':'200px'}} src={v.photo} />
										<div className="caption">
											<h3 style={{'textAlign': "center", 'fontSize': '24px'}}>{v.name}</h3>
											<div style={{'textAlign': "center"}} >
												{v.percents.map((percent, index) => {
													return (
														<span key={index} className="badge" style={
															percent <= 5 ? {'backgroundColor': '#777'} 
																					: percent <= 10 ? {'backgroundColor': '#f0ad4e'}
																					: percent <= 20 ? {'backgroundColor': '#5cb85c'}
																					: {'backgroundColor': '#d9534f'}}>{percent}%</span>
													)
												})}
												<span className="badge" style={{
													'backgroundColor': '#337ab7',
													'borderRadius': '50%',
													'fontSize': '20px',
													'width': '50px',
													'height': '50px',
													'lineHeight': '48px',
													'marginBottom': '25px'
												}}>{Math.round((v.percents.map(i => parseInt(i, 10)).reduce((a, b) => a + b, 0)) / v.percents.length)}%													
												</span>
												<div className="input-group col-sm-6" style={{'left': '25%'}}>
													<span className="input-group-btn" onClick={this.onMinusButtonClick.bind(this,v.name)}>
														<button className="btn btn-danger">-</button>
													</span>
													<input 
														onChange={this.onInputChange.bind(this, v.name)}
														type="text" 
														value={this.state.votes.find(x => x.name === v.name).percent}
														placeholder="input 0~100"
														className="form-control input-number" 
														style={{'textAlign': 'center'}} />
													<span className="input-group-btn">
														<button onClick={this.onPlusButtonClick.bind(this,v.name)} className="btn btn-success">+</button>
													</span>
												</div>
											</div>
										</div>	
								</div>																	
							</div>
						)
					})}
				</div>
				<div className="input-group col-sm-10 center-block" style={{}}>
					<button 
						className="col-sm-12 btn btn-danger center-block" 
						onClick={this.onSubmitButtonClick} 
						disabled={this.state.voted} 
					>Submit</button>
				</div>
				<Notification
				  isActive={this.state.showingNotification}
				  message="All percent distribution must sum up to 100!"
				  action="close"
				  onClick={this.setState.bind(this,{'showingNotification': false})}
				/>
				<hr />
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ vote }, dispatch);
}

function mapStateToProps (state) {
	return {
		votes: state.get('votes'),
		voted: state.get('voted'),
		voters: state.get('voters'),
		round: state.get('round'),
		totalRounds: state.get('totalRounds')
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(VotePage);