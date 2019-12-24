import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DATE_FORMAT1,
  DATE_FORMAT3,
  DATE_FORMAT4,
  DATE_FORMAT5,
  YEAR,
  MONTH_FORMAT
} from "./../utils/Constants";
import moment from "moment";

class DailyPloyDatePicker extends Component {
  constructor(props) {
    super(props);
    this.dayFormat = "dd MMMM, yyyy";
    this.weekFormat = "";
    this.monthlyFormat = "MMMM yyyy";
    this.state = {
      selectedDays: [],
      dateFrom: null,
      dateTo: "",
      weekNumber: "",
      displayWeek: ""
    };
  }

  componentDidMount = () => {
    this.handleWeekDayChange(new Date());
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.pickerType != this.props.pickerType) {
      if (this.props.pickerType == "0") {
        this.handleDateFrom(new Date());
      } else if (this.props.pickerType == "1") {
        this.handleWeekDayChange(new Date());
      }
    }
  };

  handleWeekDayChange = date => {
    const week = moment(date, "MM-DD-YYYY").week();
    const weekdays = this.getWeekDays(this.getWeekRange(date).from);
    const fm = "DD MMM";
    this.setState({
      selectedDays: weekdays,
      dateFrom: weekdays[0],
      dateTo: weekdays[weekdays.length - 1],
      weekNumber: week,
      displayWeek:
        moment(weekdays[0]).format(YEAR) +
        "  |  " +
        moment(weekdays[0]).format(DATE_FORMAT5) +
        " - " +
        moment(weekdays[6]).format(DATE_FORMAT5) +
        " (Week " +
        week +
        ")"
    });
    this.props.onSelectDate(this.props.schedulerData, date);
  };

  getWeekDays = weekStart => {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
      days.push(
        moment(weekStart)
          .add(i, "days")
          .toDate()
      );
    }
    return days;
  };

  getWeekRange = date => {
    return {
      from: moment(date)
        .startOf("week")
        .toDate(),
      to: moment(date)
        .endOf("week")
        .toDate()
    };
  };

  handleWeekClick = (days, weekNumber) => {
    const weekdays = this.getWeekDays(this.getWeekRange(days).from);
    this.setState({
      selectedDays: weekdays,
      dateFrom: weekdays[0],
      dateTo: weekdays[weekdays.length - 1],
      weekNumber: weekNumber,
      displayWeek:
        moment(weekdays[0]).format(MONTH_FORMAT) +
        " - " +
        moment(weekdays[6]).format(MONTH_FORMAT) +
        "(Week" +
        this.state.weekNumber +
        ")"
    });
    this.props.onSelectDate(this.props.schedulerData, weekdays[0]);
  };

  handleDateFrom = date => {
    var dateText =
      moment(date)
        .format("ddd")
        .toUpperCase() +
      " | " +
      moment(date).format(DATE_FORMAT4);
    this.setState({
      dateFrom: date,
      dateTo: date,
      displayWeek: "",
      displayWeek: dateText,
      selectedDays: [new Date(date)]
    });
    this.props.onSelectDate(this.props.schedulerData, date);
  };

  handleMonthlyDateFrom = date => {
    const output = moment(date, DATE_FORMAT1);
    var startDate = output.startOf("month").format(DATE_FORMAT1);
    var endDate = output.endOf("month").format(DATE_FORMAT1);
    var days = this.getMonthDates(startDate, endDate);
    this.setState({
      dateFrom: new Date(startDate),
      dateTo: new Date(endDate),
      selectedDays: days
    });
  };

  getMonthDates = (start, end) => {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var daysArr = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
      daysArr.push(currentDate);
      var date = moment(currentDate, DATE_FORMAT1)
        .add(1, "days")
        .format(DATE_FORMAT1);
      currentDate = new Date(date);
    }
    return daysArr;
  };

  setPreviousDate = () => {
    const dateFrom = this.state.dateFrom;
    const startOfDate = moment(dateFrom, DATE_FORMAT1).startOf("day");
    const endOfDate = moment(dateFrom, DATE_FORMAT1).endOf("day");
    if (this.props.pickerType == "0") {
      const prevDate = startOfDate.subtract(1, "days").format(DATE_FORMAT1);
      this.setState({
        dateFrom: new Date(prevDate),
        dateTo: new Date(prevDate),
        displayWeek:
          moment(prevDate)
            .format("ddd")
            .toUpperCase() +
          " | " +
          moment(prevDate).format(DATE_FORMAT4),
        selectedDays: [new Date(prevDate)]
      });
      this.props.onSelectDate(this.props.schedulerData, prevDate);
    } else if (this.props.pickerType == "1") {
      const format = "DD MMM";
      var weekDay = startOfDate.subtract(1, "days").format(DATE_FORMAT1);
      var weekDay = moment(weekDay, DATE_FORMAT1);
      var weekStart = weekDay.startOf("week").format(DATE_FORMAT1);
      var weekEnd = weekDay.endOf("week").format(DATE_FORMAT1);
      var weekNumber = weekDay.week();
      this.setState({
        dateFrom: new Date(weekStart),
        dateTo: new Date(weekEnd),
        weekNumber: weekNumber,
        selectedDays: this.getWeekDays(new Date(weekStart)),
        displayWeek:
          moment(weekStart).format(YEAR) +
          "  |  " +
          moment(weekStart).format(DATE_FORMAT5) +
          " - " +
          moment(weekEnd).format(DATE_FORMAT5) +
          " (Week " +
          weekNumber +
          ")"
      });
      this.props.onSelectDate(this.props.schedulerData, weekStart);
    } else if (this.props.pickerType == "2") {
      const output = startOfDate.subtract(1, "days").format(DATE_FORMAT1);
      var startDate = moment(output)
        .startOf("month")
        .format(DATE_FORMAT1);
      var endDate = moment(output)
        .endOf("month")
        .format(DATE_FORMAT1);
      var monthDays = this.getMonthDates(startDate, endDate);
      this.setState({
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate),
        selectedDays: monthDays
      });
      this.props.onSelectDate(this.props.schedulerData, startDate);
    }
  };

  setNextDate = () => {
    const dateFrom = this.state.dateFrom;
    const dateTo = this.state.dateTo;
    const startOfDate = moment(dateFrom, DATE_FORMAT1).startOf("day");
    const endOfDate = moment(dateTo, DATE_FORMAT1).startOf("day");
    if (this.props.pickerType == "0") {
      const nextDate = startOfDate.add(1, "days").format(DATE_FORMAT1);
      this.setState({
        dateFrom: new Date(nextDate),
        dateTo: new Date(nextDate),
        displayWeek:
          moment(nextDate)
            .format("ddd")
            .toUpperCase() +
          " | " +
          moment(nextDate).format(DATE_FORMAT4),
        selectedDays: [new Date(nextDate)]
      });
      this.props.onSelectDate(this.props.schedulerData, nextDate);
    } else if (this.props.pickerType == "1") {
      const format = "DD MMM";
      var weekDay = endOfDate.add(1, "days").format(DATE_FORMAT1);
      var weekDay = moment(weekDay, DATE_FORMAT1);
      var weekStart = weekDay.startOf("week").format(DATE_FORMAT1);
      var weekEnd = weekDay.endOf("week").format(DATE_FORMAT1);
      var weekNumber = weekDay.week();
      this.setState({
        dateFrom: new Date(weekStart),
        dateTo: new Date(weekEnd),
        weekNumber: weekNumber,
        selectedDays: this.getWeekDays(new Date(weekStart)),
        displayWeek:
          moment(weekStart).format(YEAR) +
          "  |  " +
          moment(weekStart).format(DATE_FORMAT5) +
          " - " +
          moment(weekEnd).format(DATE_FORMAT5) +
          " (Week " +
          weekNumber +
          ")"
      });
      this.props.onSelectDate(this.props.schedulerData, weekStart);
    } else if (this.props.pickerType == "2") {
      const output = endOfDate.add(1, "days").format(DATE_FORMAT1);
      var startDate = moment(output)
        .startOf("month")
        .format(DATE_FORMAT3);
      var endDate = moment(output)
        .endOf("month")
        .format(DATE_FORMAT1);
      var monthDays = this.getMonthDates(startDate, endDate);
      this.setState({
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate),
        selectedDays: monthDays
      });
      this.props.onSelectDate(this.props.schedulerData, startDate);
    }
  };
  previous = () => {
    return (
      <button onClick={this.setPreviousDate} className="arrow-button">
        <i className="fa fa-angle-left"></i>
      </button>
    );
  };

  next = () => {
    return (
      <button onClick={this.setNextDate} className="arrow-button">
        <i className="fa fa-angle-right"></i>
      </button>
    );
  };

  render() {
    if (this.props.pickerType == "0") {
      return (
        <>
          {this.previous()}
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleDateFrom}
            startDate={this.state.dateFrom}
            // dateFormat={this.dayFormat}
            value={this.state.displayWeek}
          />
          {this.next()}
        </>
      );
    } else if (this.props.pickerType == "1") {
      return (
        <>
          {this.previous()}
          <div className="week-hover-bg d-inline-block">
            <DatePicker
              showWeekNumbers
              onChange={this.handleWeekDayChange}
              startDate={this.state.selectedDays[0]}
              endDate={this.state.selectedDays[6]}
              onWeekSelect={this.handleWeekClick}
              value={this.state.displayWeek}
              selected={this.state.dateFrom}
            />
          </div>
          {this.next()}
        </>
      );
    } else if (this.props.pickerType == "2") {
      return (
        <>
          {this.previous()}
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleMonthlyDateFrom}
            dateFormat={this.monthlyFormat}
            selected={this.state.dateFrom}
            showMonthYearPicker
          />
          {this.next()}
        </>
      );
    } else {
      return "";
    }
  }
}

export default DailyPloyDatePicker;
