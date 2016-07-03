import {Map, fromJS} from 'immutable';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { vote } from '../actions/index';
import ProgressBar from './progress_bar';

class VotePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
    	votes:[]
    };
    this.onButtonClick = this.onButtonClick.bind(this);
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
  	console.log("clientVotes", clientVotes);
  	this.setState({
  		votes: clientVotes
  	})
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

  onButtonClick() {
  	console.log("onButtonClick", this.state);
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
			<div className="row">        
        <div className="col-lg-12">
          <h1 className="page-header">Bonus Distribution <small>It's not that awkward</small></h1>
          <p>All of us have agreed that team decide how to distribute bonus, but since it may be qutie awkward and cause conflicts if one shows his / her distribution plan, we came up this procedure after discussion, trying to avoid conflicts</p>
          <p>We will have 5 rounds or 8 rounds, depending on number of people who agree on the result of 5th round</p>
        </div>
        <div className="col-lg-12">
          <h2 className="page-header">Make your choice</h2>
        </div>
      </div>
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
												}}>{(v.percents.map(i => parseInt(i, 10)).reduce((a, b) => a + b, 0)) / v.percents.length}%													
												</span>
												<div className="input-group col-sm-6" style={{'left': '25%'}}>
													<span className="input-group-btn">
														<button type="button" className="btn btn-danger">-</button>
													</span>
													<input 
														onChange={this.onInputChange.bind(this, v.name)}
														type="text" 
														value={this.state.votes[v.name]}
														placeholder="input 0~100"
														className="form-control input-number" 
														style={{'textAlign': 'center'}} />
													<span className="input-group-btn">
														<button type="button" className="btn btn-success">+</button>
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
					<button className="col-sm-12 btn btn-danger center-block" onClick={this.onButtonClick} >Submit</button>
				</div>
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