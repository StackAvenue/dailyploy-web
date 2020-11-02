import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Timer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			runningTime: 0
		};
	}

	componentDidMount = () => {
		this.handleReset();
		this.handleClick();
	};

	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.startOn !== this.props.startOn) {
			//this.handleReset();
			this.handleClick();
		}
	};

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	handleClick = () => {
		if (this.props.isStart && this.props.startOn !== '') {
			var startOn = this.props.startOn;
			const startTime = startOn;
			this.timer = setInterval(() => {
				this.setState({ runningTime: Date.now() - startTime });
			});
		} else {
			this.handleReset();
		}
	};

	handleReset = () => {
		clearInterval(this.timer);
		this.setState({ runningTime: this.state.runningTime });
	};

	formattedSeconds = (ms, totalDuration) => {
		var totalSeconds = ms / 1000;
		var totalSeconds = totalSeconds + totalDuration;
		var h = Math.floor(totalSeconds / 3600);
		var m = Math.floor((totalSeconds % 3600) / 60);
		var s = Math.floor((totalSeconds % 3600) % 60);
		var time = this.props.calculateTime(this.props.event);
		if (h === 0 && m === 0 && s === 0 && time === " ") {
			return (" - ");
		}
		else
			if(h === 0 && m===0 && s > 0 && time === " ") {
				return ((s + "s").slice(-7))
			}
			else
			if (h === 0 && m === 0 && s ===0 && time !== " ") {
				return (" ")
			}
			else
				if (h > 0 && m > 0 && time === " ") {
					if (m > 10) {
						return ((h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " " + (m + "m").slice(-7));
					} else
						if (m < 10) {
							return ((h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " " + ("0" + m + "m").slice(-7));
						}
				} else
					if (h > 0 && m === 0 && time === " ") {
						return ((h + "h").slice(`${h}`.length > 2 ? -3 : -3));

					} else
						if (h === 0 && m > 0 && time === " ") {
							if (m > 10) {
								return ((m + "m").slice(-7));
							} else
								if (m < 10) {
									return (("0" + m + "m").slice(-7));
								}
								else
								if (m < 1) {
									return ((s + "sec").slice(-7));
								}
						} else

							if (h > 0 && m > 0 && time !== " ") {
								if (m > 10) {
									return ((h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " " + (m + "m").slice(-7));
								} else
									if (m < 10) {
										return ((h + "h").slice(`${h}`.length > 2 ? -3 : -3) + " " + ("0" + m + "m").slice(-7));
									}
							} else
								if (h > 0 && m === 0 && time !== " ") {
									return ((h + "h").slice(`${h}`.length > 2 ? -3 : -3));

								} else
									if (h === 0 && m > 0 && time !== " ") {
										if (m > 10) {
											return ((m + "m").slice(-7));
										} else
											if (m < 10) {
												return (("0" + m + "m").slice(-7));
											}
									} else {
										return (" ")
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
