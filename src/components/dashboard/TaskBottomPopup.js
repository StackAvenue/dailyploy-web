import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Timer from './../dashboard/Timer'
import moment from 'moment'

class TaskBottomPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      runningTime: 0,
      showTimerMenu: false
    }
  }

  ToggleTimerDropDown = id => {
    this.setState({ showTimerMenu: !this.state.showTimerMenu })
  }

  returnTime = time => {
    return `${moment(time.start_time).format('HH.mm A')} - ${moment(
      time.end_time
    ).format('HH.mm A')}`
  }

  render() {
    return (
      <>
        <div className="d-inline-block task-b-popup">
          <span
            className="d-inline-block task-pause-btn pointer"
            onClick={() => this.props.stopOnGoingTask()}
          >
            <i className="fa fa-pause "></i>
          </span>
          <div className="d-inline-block task-title">
            <Timer
              startOn={this.props.event.startOn}
              isStart={this.props.event ? true : false}
              totalDuration={0}
            />
          </div>
          <div
            style={{ width: '122px' }}
            className="d-inline-block task-title title text-wraper"
          >
            {this.props.event.title}
          </div>
          <div
            className="d-inline-block color-code"
            style={{
              backgroundColor: `${
                this.props.event ? this.props.event.bgColor : '#ffffff'
              }`
            }}
          ></div>
          {this.props.event && this.props.event.timeTracked.length > 0 ? (
            <>
              <div
                style={{ float: 'none' }}
                className="d-inline-block timer-dropdown"
              >
                <input
                  style={{ width: '170px' }}
                  className="d-inline-block"
                  className={this.state.showTimerMenu ? 'border' : ''}
                  defaultValue={
                    this.props.event && this.props.event.timeTracked.length > 0
                      ? this.returnTime(this.props.event.timeTracked[0])
                      : ''
                  }
                  onClick={() => this.ToggleTimerDropDown()}
                  readOnly
                />
              </div>
              {this.state.showTimerMenu ? (
                <div style={{ right: 15, width: '170px' }} className="dropdown">
                  {this.props.event.timeTracked.map((time, idx) => {
                    if (idx !== 0) {
                      return (
                        <div className="border" key={time.id}>
                          {this.returnTime(time)}
                        </div>
                      )
                    }
                  })}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </>
    )
  }
}

export default withRouter(TaskBottomPopup)
