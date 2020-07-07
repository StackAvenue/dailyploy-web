import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			runningTime: 0
		};
		this.handleReset();
		this.handleClick();
	}

	componentDidMount = () => {
		// this.handleReset();
		// this.handleClick();
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.startOn !== this.props.startOn) {
			this.handleReset();
			this.handleClick();
		}
	};

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	handleClick = () => {
		if (this.props.isStart && this.props.startOn !== '') {
			var startOn = this.props.startOn;
			const startTime = startOn - this.state.runningTime;
			this.timer = setInterval(() => {
				this.setState({ runningTime: Date.now() - startTime });
			});
		} else {
			this.handleReset();
		}
	};

	handleReset = () => {
		clearInterval(this.timer);
		this.setState({ runningTime: 0 });
	};

	formattedSeconds = (ms, totalDuration) => {
		var totalSeconds = ms / 1000;
		var totalSeconds = totalSeconds + totalDuration;
		var h = Math.floor(totalSeconds / 3600);
		var m = Math.floor((totalSeconds % 3600) / 60);
		var s = Math.floor((totalSeconds % 3600) % 60);
		var time = this.props.calculateTime(this.props.event);
		if (h === 0 && m === 0 && time === ' ') {
			return 'No Estimate';
		} else if (h === 0 && m === 0 && time !== ' ') {
			return ' ';
		} else if (h > 0 && m > 0 && time === ' ') {
			if (m > 10) {
				return 'Logged ' + (h + 'h').slice(`${h}`.length > 2 ? -3 : -3) + ' ' + (m + 'min').slice(-7);
			} else if (m < 10) {
				return 'Logged ' + (h + 'h').slice(`${h}`.length > 2 ? -3 : -3) + ' ' + ('0' + m + 'min').slice(-7);
			}
		} else if (h > 0 && m === 0 && time === ' ') {
			return 'Logged ' + (h + 'h').slice(`${h}`.length > 2 ? -3 : -3);
		} else if (h === 0 && m > 0 && time === ' ') {
			if (m > 10) {
				return 'Logged ' + (m + 'min').slice(-7);
			} else if (m < 10) {
				return 'Logged ' + ('0' + m + 'min').slice(-7);
			}
		} else if (h > 0 && m > 0 && time !== ' ') {
			if (m > 10) {
				return 'Logged ' + (h + 'h').slice(`${h}`.length > 2 ? -3 : -3) + ' ' + (m + 'min').slice(-7) + ' of ';
			} else if (m < 10) {
				return (
					'Logged ' +
					(h + 'h').slice(`${h}`.length > 2 ? -3 : -3) +
					' ' +
					('0' + m + 'min').slice(-7) +
					' of '
				);
			}
		} else if (h > 0 && m === 0 && time !== ' ') {
			return 'Logged ' + (h + 'h').slice(`${h}`.length > 2 ? -3 : -3) + ' of ';
		} else if (h === 0 && m > 0 && time !== ' ') {
			if (m > 10) {
				return 'Logged ' + (m + 'min').slice(-7) + ' of ';
			} else if (m < 10) {
				return 'Logged ' + ('0' + m + 'min').slice(-7) + ' of ';
			}
		} else {
			return 'NA';
		}
	};

	render() {

		return (
			<>
				{this.formattedSeconds(this.state.runningTime, this.props.totalDuration)}
			</>
		)
	}
}

export default withRouter(Timer);
