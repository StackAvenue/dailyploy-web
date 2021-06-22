import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";
import {
  DATE_FORMAT2,
  PRIORITIES_MAP,
  DATE_FORMAT1,
  HRMIN,
  FULL_DATE,
} from "./../../../utils/Constants";
import { put, del } from "./../../../utils/API";
import DailyPloyToast from "./../../../components/DailyPloyToast";
import { convertUTCToLocalDate } from "./../../../utils/function";
import EditableSelect from "./../../EditableSelect";
import { toast } from "react-toastify";
import EditableTimeTrack from "./../../EditableTimeTrack";
import TimePicker from "rc-time-picker";
import ConfirmModal from "./../../ConfirmModal";
import ReportTimeTrackEditModal from "./ReportTimeTrackEditModal";
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../ErrorBoundary';

class ReportTableRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      editableLog: null,
      fromDateTime: null,
      toDateTime: null,
      fromTime: null,
      toTime: null,
      showConfirm: false,
      trackTimeError: null,
    };
  }

  calculateTime = (startDateTime, endDateTime) => {
    var sTime = moment(convertUTCToLocalDate(startDateTime)).format("HH:mm");
    var eTime = moment(convertUTCToLocalDate(endDateTime)).format("HH:mm");
    return sTime + "- " + eTime;
  };

  editTimeTrack = async () => {
    var startDate = new Date(this.state.fromDateTime.format(FULL_DATE));
    var endDate = new Date(this.state.toDateTime.format(FULL_DATE));
    if (startDate < endDate) {
      try {
        this.setState({ taskloader: true, trackTimeError: null });
        let trackedTime = {
          start_time: startDate,
          end_time: endDate,
        };
        const { data } = await put(
          trackedTime,
          `tasks/${this.state.editableLog.task_id}/edit_tracked_time/${this.state.editableLog.id}`
        );
        this.setState({
          taskloader: false,
          editable: false,
          editableLog: null,
          fromDateTime: null,
          toDateTime: null,
          fromTime: null,
          toTime: null,
        });
        this.props.timeTrackUpdate();
      } catch (e) {
        if (e.response.status == 400) {
          toast(
            <DailyPloyToast message={e.response.data.errors} status="error" />,
            {
              autoClose: 2000,
              position: toast.POSITION.TOP_CENTER,
              className: "text-titlize",
            }
          );
          this.setState({
            trackTimeError: e.response.data.errors,
            taskloader: false,
          });
        }
      }
    } else {
      this.setState({
        trackTimeError: "Please Select Valid End DateTime",
      });
    }
  };

  deleteTimeTrack = async () => {
    if (this.state.editableLog) {
      try {
        const { data } = await del(
          `tasks/${this.state.editableLog.task_id}/delete/${this.state.editableLog.id}`
        );
        this.props.timeTrackUpdate();
        this.setState({ showConfirm: false });
      } catch (e) {
        this.setState({ showConfirm: false });
      }
    }
  };

  handleEditLog = (log) => {
    let fromMoment = moment(log.start);
    let toMoment = moment(log.end);
    let timeFrom = fromMoment.format(HRMIN);
    let timeTo = toMoment.format(HRMIN);
    var fromDateTime = fromMoment.format("YYYY-MM-DD") + " " + timeFrom;
    fromDateTime = moment(fromDateTime);
    var toDateTime = toMoment.format("YYYY-MM-DD") + " " + timeTo;
    toDateTime = moment(toDateTime);
    this.setState({
      editable: true,
      editableLog: log,
      timeFrom: timeFrom,
      timeTo: timeTo,
      fromDateTime: fromDateTime,
      toDateTime: toDateTime,
    });
  };

  handleDeleteLog = (log) => {
    this.setState({
      editableLog: log,
      showConfirm: true,
    });
  };

  toggleEditableBox = () => {
    this.setState({
      editable: false,
      editableLog: null,
      timeFrom: null,
      timeTo: null,
      fromDateTime: null,
      toDateTime: null,
    });
  };

  handleTimeFrom = (value) => {
    var value = moment(value);
    this.setState({
      timeFrom: value != null ? value.format("HH:mm") : null,
      fromDateTime: value,
      timeTo:
        value != null && value.format("HH:mm") > this.state.timeTo
          ? null
          : this.state.timeTo,
    });
  };

  handleTimeTo = (value) => {
    var value = moment(value);
    this.setState({
      timeTo: value != null ? value.format("HH:mm") : null,
      toDateTime: value,
    });
  };

  renderLog = (task) => {
    let dateTimeTracks = task.date_formatted_time_tracks.find(
      (timeLog) => timeLog.date == this.props.date
    );
    var trackLogs = dateTimeTracks ? dateTimeTracks.time_tracks : [];
    trackLogs = trackLogs
      .filter((log) => log.status !== "running")
      .sort((a, b) => b.id - a.id)
      .map((time) => {
        return {
          id: time.id,
          name: `${moment(time.start_time).format("HH:mm A")} - ${moment(
            time.end_time
          ).format("HH:mm A")}`,
          start: time.start_time,
          end: time.end_time,
          task_id: time.task_id,
        };
      });
    let first = trackLogs[0];
    return (
      <div className="reports-track-logs">
        {trackLogs.length > 0 ? (
          <EditableTimeTrack
            options={trackLogs}
            value={first}
            action={true}
            handleEditLog={this.handleEditLog}
            handleDeleteLog={this.handleDeleteLog}
            saveInputEditable={() => {}}
            state={this.state}
          />
        ) : (
          // )
          <span>No tracked Time</span>
        )}
      </div>
    );
  };

  disabledHours = () => {
    var time = this.state.timeFrom;
    if (time) {
      var hr = time.split(":")[0];
      hr = Number(hr);
      var hoursArr = Array.from({ length: `${hr}` }, (v, k) => k);
      return hoursArr;
    }
    return [];
  };

  disabledMinutes = () => {
    var fTime = this.state.timeFrom;
    var tTime = this.state.timeTo;
    if (fTime && !tTime) {
      var min = fTime.split(":")[1];
      min = Number(min) + 1;
      var minArr = Array.from({ length: `${min}` }, (v, k) => k);
      return minArr;
    } else if (fTime && tTime && fTime.split(":")[0] === tTime.split(":")[0]) {
      var min = fTime.split(":")[1];
      min = Number(min) + 1;
      var minArr = Array.from({ length: `${min}` }, (v, k) => k);
      return minArr;
    }
    return [];
  };

  getDiffOfTwoDate = (startDateTime, endDateTime) => {
    let endTime = moment(endDateTime).format("HH:mm:ss");
    let startTime = moment(startDateTime).format("HH:mm:ss");
    if (endTime != "00:00:00") {
      var start =
        moment(this.props.date).format("YYYY-MM-DD") +
        " " +
        moment(startDateTime).format("HH:mm:ss");
      var end = moment(this.props.date).format("YYYY-MM-DD") + " " + endTime;
      let totalMilSeconds = new Date(end) - new Date(start);
      var totalSeconds = totalMilSeconds / 1000;
      return Number(totalSeconds);
    }
    return 0;
  };

  dateFormater = (totalSeconds) => {
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    return (
      ("0" + h).slice(`${h}`.length > 2 ? -3 : -2) +
      "H" +
      " " +
      ("0" + m).slice(-2) +
      "M"
    );
  };

  getTotalHours = (tasks) => {
    if (tasks !== undefined) {
      var totalSec = 0;
      tasks.map((task, idx) => {
        totalSec += task.duration;
        // totalSec += this.addTotalDuration(task.time_tracked);
      });
      return this.secondsToHours(totalSec);
    }
    return "0 H";
  };

  getTaskTotalDuration = (timeTracked) => {
    return this.addTotalDuration(timeTracked);
  };

  addTotalDuration = (timeTracked) => {
    return timeTracked
      .map((log) => log.duration)
      .flat()
      .reduce((a, b) => a + b, 0);
  };

  secondsToHours = (seconds) => {
    let totalSeconds = Number(seconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    return (
      ("0" + h).slice(`${h}`.length > 2 ? -3 : -2) +
      "H" +
      " " +
      ("0" + m).slice(-2) +
      "M"
    );
  };

  displayDate = (date) => {
    if (this.props.frequency !== "daily") {
      return moment(date).format(DATE_FORMAT2);
    }
    return "";
  };

  taskNotFound = () => {
    return (
      <tr className="manage-error-tr">
        <td>No Tasks for this day</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    );
  };

  showCategory = (priority) => {
    let priorities = PRIORITIES_MAP.get(priority);
    return (
      <>
        <span
          className="d-inline-block priority"
          style={{ backgroundColor: priorities.color_code }}
        ></span>
        <span className="d-inline-block">{priorities.label}</span>
      </>
    );
  };

  getEstimateTimeOfTask = (task) => {
    let start = moment(convertUTCToLocalDate(task.start_datetime)).format(
      DATE_FORMAT1
    );
    let end = moment(convertUTCToLocalDate(task.end_datetime)).format(
      DATE_FORMAT1
    );
    var startTime = moment(convertUTCToLocalDate(task.start_datetime)).format(
      "HH:mm:ss"
    );
    var endTime = moment(convertUTCToLocalDate(task.end_datetime)).format(
      "HH:mm:ss"
    );
    if (this.props.date == start && start == end) {
      return this.getDiffOfTwoDate(
        new Date(start + " " + startTime),
        new Date(end + " " + endTime)
      );
    } else {
      let dates = this.getMiddleDates(start, end);
      let datesMap = new Map();
      dates.map((date, idx) => {
        if (idx == 0 && date == start) {
          datesMap.set(date, {
            start: date + " " + startTime,
            end:
              date +
              " " +
              `${startTime == "00:00:00" ? "00:00:00" : "23:59:59"}`,
          });
        } else if (idx == dates.length - 1 && date == end) {
          datesMap.set(date, {
            start: date + " " + "00:00:00",
            end: date + " " + `${endTime != "00:00:00" ? endTime : "00:00:00"}`,
          });
        } else {
          datesMap.set(date, {
            start: date + " " + "00:00:00",
            end:
              date +
              " " +
              `${
                startTime == "00:00:00" && endTime == "00:00:00"
                  ? "00:00:00"
                  : "23:59:59"
              }`,
          });
        }
      });
      let dateMap = datesMap.get(this.props.date);
      return dateMap
        ? this.getDiffOfTwoDate(new Date(dateMap.start), new Date(dateMap.end))
        : 0;
    }
  };

  getMiddleDates = (start, end) => {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var daysArr = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
      daysArr.push(moment(currentDate).format(DATE_FORMAT1));
      var date = moment(currentDate, DATE_FORMAT1)
        .add(1, "days")
        .format(DATE_FORMAT1);
      currentDate = new Date(date);
    }
    return daysArr;
  };

  renderTableRow = (tasks) => {
    return tasks.map((task, index) => {
      return (
        <tr key={index} className="report-table-row">
          <td className="td-1">
            {task && task.status && task.status.name ? (
              <div>{task.status.name}</div>
            ) : null}
          </td>
          {this.props.isTimetrackMode ? (
            <td className="td-2" style={{ width: "290px" }}>
              {this.renderLog(task)}
            </td>
          ) : (
            <td className="td-2" style={{ width: "290px" }}>
              {this.dateFormater(task.duration)}
            </td>
          )}
          <td className="td-3 text-titlize">{task.name}</td>
          <td className="td-4 text-titlize">{task.project.name}</td>
          <td className="td-5 text-titlize">
            {task.category ? task.category.name : "---"}
          </td>
          <td className="td-6 text-titlize">
            {this.showCategory(task.priority)}
          </td>
          <td className="td-7">
            {/* {this.dateFormater(this.getEstimateTimeOfTask(task))} */}
            {task.estimation}
          </td>
          <td
            className="td-8"
            style={
              this.getEstimateTimeOfTask(task) < task.duration
                ? { color: "#964B00" }
                : { color: "#33a1ff" }
            }
          >
            {/* {this.dateFormater(this.getTaskTotalDuration(task.time_tracked))} */}
            {this.dateFormater(task.duration)}
          </td>
        </tr>
      );
    });
  };

  closeConfirmModal = () => {
    this.setState({
      showConfirm: false,
    });
  };

  render() {
    return (
      <>
        <tr className="report-table-date">
          <th>{this.displayDate(this.props.date)}</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th>{this.getTotalHours(this.props.tasks)}</th>
        </tr>
        {this.props.tasks.length !== 0
          ? this.renderTableRow(this.props.tasks)
          : this.taskNotFound()}
        {this.state.showConfirm ? (
          <ErrorBoundary>
            <ConfirmModal
              show={this.state.showConfirm}
              message="Do you want to delete the Tracked Time?"
              buttonText="delete"
              onClick={this.deleteTimeTrack}
              closeModal={this.closeConfirmModal}
            />
          </ErrorBoundary>
        ) : null}

        {this.state.editable ? (
          <ErrorBoundary>
            <ReportTimeTrackEditModal
              state={this.state}
              editTimeTrack={this.editTimeTrack}
              handleTimeFrom={this.handleTimeFrom}
              handleTimeTo={this.handleTimeTo}
              closeModal={this.toggleEditableBox}
            />
          </ErrorBoundary>
        ) : null}
      </>
    );
  }
}


ReportTableRow.propTypes = {
  frequency: PropTypes.string.isRequired,
  timeTrackUpdate: PropTypes.func.isRequired,
  isTimetrackMode: PropTypes.bool.isRequired
}

export default withRouter(ReportTableRow);
