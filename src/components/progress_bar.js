import React, { Component } from 'react';

export default class ProgressBar extends Component {
	render() {
		const spanPercent = (100 * this.props.current / this.props.total) + '%';
		const spanText = `${this.props.current} / ${this.props.total}`
		const spanStyle = {
        width: spanPercent
     };

		return (
			<div>
				<span style={{float: 'left', width: '100px'}}>{this.props.title}: </span>
				<div className="progress">
					<div className={"Progress-bar " + this.getClassFromColor(this.props.color)} style={spanStyle}>{spanText}</div>
				</div>				
			</div>	
				
		);
	}
	getClassFromColor(color) {
		switch (color){
			case 'red':
				return "progress-bar-danger";
			case 'green':
				return "progress-bar-success";
			default:
				return "progress-bar-success";
		}
	}
}
