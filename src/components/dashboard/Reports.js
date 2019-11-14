import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet } from "../../utils/API";
import { DATE_FORMAT1, MONTH_FORMAT } from "./../../utils/Constants";
import moment from "moment";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import ReportTable from "./Reports/ReportTable";
import DatePicker from "react-datepicker";
import "../../assets/css/reports.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-tabs/style/react-tabs.css";
// import from"../../LoggedInLayout"

class Reports extends Component {
  constructor(props) {
    super(props);
    this.calenderArr = ["daily", "weekly", "monthly"];
    this.now = moment()
      .hour(0)
      .minute(0);
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      dateFrom: new Date(),
      dateTo: new Date(),
      isLogedInUserEmailArr: [],
      projects: [],
      userId: "",
      userRole: "",
      users: [],
      resources: [],
      events: [],
      daily: true,
      weekly: false,
      monthly: false,
      selectedDays: [new Date()],
      hoverRange: undefined,
      weekNumber: "",
      displayWeek: "",
      searchOptions: [],
      worksapceUsers: "",
      worksapceUser: [],
      searchUserDetail: "",
      searchProjectIds: [],
      taskDetails: {},
      message: "My Daily Report",
    };
  }

  returnFrequency = () => {
    if (this.state.daily) {
      return "daily";
    } else if (this.state.monthly) {
      return "monthly";
    } else if (this.state.weekly) {
      return "weekly";
    }
  };

  fetchProjectName = () => {
    var project = this.state.projects.filter(
      project => project.id === this.props.searchProjectIds[0],
    );
    return project.length > 0 ? project[0].name : "";
  };

  displayMessage = () => {
    var role = this.state.userRole;
    var frequency = this.textTitlize(this.returnFrequency());
    if (
      role == "admin" &&
      this.props.searchProjectIds.length !== 0 &&
      this.props.searchUserDetail == ""
    ) {
      return (
        "Showing " +
        `${frequency}` +
        " Report for " +
        `${this.fetchProjectName()}`
      );
    } else if (
      role === "member" ||
      (role == "admin" && this.props.searchUserDetail === "")
    ) {
      return "My " + `${frequency}` + " Report";
    } else if (role == "admin" && this.props.searchUserDetail !== "") {
      return (
        "Showing " +
        `${frequency}` +
        " Report for " +
        this.textTitlize(this.props.searchUserDetail.value) +
        "(" +
        `${this.props.searchUserDetail.email}` +
        ")"
      );
    }
  };

  textTitlize = text => {
    return text.replace(/(?:^|\s)\S/g, function(a) {
      return a.toUpperCase();
    });
  };

  calenderButtonHandle = e => {
    const name = e.target.name;
    const newCalenderArr = this.calenderArr.filter(item => item !== name);
    this.setState({ [name]: true });
    var self = this;
    newCalenderArr.map(item => {
      self.setState({ [item]: false });
    });
    if (name == "daily") {
      self.setState({ selectedDays: [new Date()] });
    }
    if (name == "monthly") {
      this.handleMonthlyDateFrom(new Date());
    }
    if (name == "weekly") {
      this.handleDayChange(new Date());
    }
  };

  handleDayChange = date => {
    const week = moment(date, "MM-DD-YYYY").week();
    const weekdays = this.getWeekDays(this.getWeekRange(date).from);
    const fm = "DD MMM";
    this.setState({
      selectedDays: weekdays,
      dateFrom: weekdays[0],
      dateTo: weekdays[weekdays.length - 1],
      weekNumber: week,
      displayWeek:
        moment(weekdays[0]).format(fm) +
        " - " +
        moment(weekdays[6]).format(fm) +
        " (Week " +
        week +
        ")",
    });
  };

  getWeekDays = weekStart => {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
      days.push(
        moment(weekStart)
          .add(i, "days")
          .toDate(),
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
        .toDate(),
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
        ")",
    });
  };

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  async componentDidMount() {
    try {
      const { data } = await get("logged_in_user");
      var loggedInData = data;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
    } catch (e) {
      console.log("err", e);
    }

    //get workspace Id
    this.getWorkspaceParams();

    // worksapce project Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`,
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`,
      );
      var userArr = data.members.map(user => user.email);
      var worksapceUsers = data.members;
      var worksapceUser = data.members.filter(
        user => user.email === loggedInData.email,
      );
      var emailArr = data.members
        .filter(user => user.email !== loggedInData.email)
        .map(user => user.email);
    } catch (e) {
      console.log("users Error", e);
    }

    // MIS report listing
    var searchData = {
      start_date: moment(this.state.dateFrom).format(DATE_FORMAT1),
      user_id: loggedInData.id,
      frequency: "daily",
      project_ids: JSON.stringify(this.props.searchProjectIds),
    };

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/reports`,
        searchData,
      );
      var details = this.makeDatesHash(data.reports);
      var taskDetails = details.taskReports;
      var totalTime = details.totalTime;
    } catch (e) {}

    this.setState({
      userId: loggedInData.id,
      userName: loggedInData.name,
      userEmail: loggedInData.email,
      workspaces: workspacesData,
      projects: projectsData,
      users: userArr,
      isLogedInUserEmailArr: emailArr,
      worksapceUsers: worksapceUsers,
      worksapceUser: worksapceUser,
      taskDetails: taskDetails,
      userRole: worksapceUser[0].role,
      totalTime: totalTime,
    });

    this.createUserProjectList();

    this.props.handleSearchFilterResult(this.handleSearchFilterResult);
  }

  checkProject = () => {
    console.log(
      this.props.searchProjectIds,
      this.props.searchUserDetail,
      this.state.userRole,
    );
    return (
      this.props.searchProjectIds.length > 0 &&
      this.state.userRole === "admin" &&
      this.props.searchUserDetail.length == 0
    );
  };

  async componentDidUpdate(prevProps, prevState) {
    var taskDetails = [];
    if (this.state.daily !== prevState.daily) {
      var message = this.displayMessage();
      this.setState({ message: message });
    }
    if (
      prevState.dateFrom !== this.state.dateFrom ||
      prevState.dateTo !== this.state.dateTo ||
      prevProps.searchProjectIds !== this.props.searchProjectIds ||
      prevProps.searchUserDetail !== this.props.searchUserDetail
    ) {
      var searchData = {
        start_date: moment(this.state.dateFrom).format(DATE_FORMAT1),
        user_id: this.props.searchUserDetail
          ? this.props.searchUserDetail.member_id
          : this.state.userId,
        frequency: this.returnFrequency(),
        project_ids: JSON.stringify(this.props.searchProjectIds),
      };

      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/reports`,
          searchData,
        );
        var details = this.makeDatesHash(data.reports);
        var taskDetails = details.taskReports;
        var totalTime = details.totalTime;
      } catch (e) {}
      var message = this.displayMessage();

      this.setState({
        taskDetails: taskDetails,
        message: message,
        totalTime: totalTime,
      });
    }
  }

  makeDatesHash = reports => {
    var taskReports = {};
    var totalSecond = 0;
    {
      reports.map((report, i) => {
        taskReports[report.date] = report.tasks;
        totalSecond += this.calculateTotalSecond(report.tasks);
      });
    }
    var hours = (totalSecond / (1000 * 60 * 60)).toFixed(1);
    return { taskReports: taskReports, totalTime: hours };
  };

  calculateTotalSecond = tasks => {
    var totalSec = 0;
    tasks.map((task, idx) => {
      totalSec += Math.abs(
        new Date(task.start_datetime) - new Date(task.end_datetime),
      );
    });
    return totalSec;
  };

  // handleSearchFilterResult = data => {
  //   var searchUserDetail = "";
  //   var projectIds = [];
  //   {
  //     data.map((item, i) => {
  //       if (item.type === "member") {
  //         searchUserDetail = item;
  //       } else if (item.type === "project") {
  //         projectIds.push(item.project_id);
  //       }
  //     });
  //   }
  //   this.setState({
  //     searchProjectIds: projectIds,
  //     searchUserDetail: searchUserDetail,
  //   });
  // };

  createUserProjectList = () => {
    var searchOptions = [];
    if (this.state.projects) {
      {
        this.state.projects.map((project, index) => {
          searchOptions.push({
            value: project.name,
            project_id: project.id,
            type: "project",
            id: (index += 1),
          });
        });
      }
    }

    var index = searchOptions.length;
    if (this.state.userRole === "admin" && this.state.worksapceUsers) {
      var otherMembers = this.state.worksapceUsers.filter(
        user => user.email !== this.state.userEmail,
      );
      {
        otherMembers.map((member, idx) => {
          searchOptions.push({
            value: member.name,
            id: (index += 1),
            member_id: member.id,
            email: member.email,
            type: "member",
            role: member.role,
          });
        });
      }
    }
    this.setState({ searchOptions: searchOptions });
    this.props.setSearchOptions(searchOptions);
  };

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    this.setState({ sort: value });
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[1];
    if (routeName === "reports") {
      return "reportsTrue";
    } else {
      return false;
    }
  };

  handleDateFrom = date => {
    this.setState({ dateFrom: date, selectedDays: [new Date(date)] });
  };

  handleMonthlyDateFrom = date => {
    const output = moment(date, DATE_FORMAT1);
    var startDate = output.startOf("month").format(DATE_FORMAT1);
    var endDate = output.endOf("month").format(DATE_FORMAT1);
    var days = this.getMonthDates(startDate, endDate);
    this.setState({
      dateFrom: new Date(startDate),
      dateTo: new Date(endDate),
      selectedDays: days,
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
    if (this.state.daily) {
      const prevDate = startOfDate.subtract(1, "days").format(DATE_FORMAT1);
      this.setState({
        dateFrom: new Date(prevDate),
        dateTo: new Date(prevDate),
        selectedDays: [new Date(prevDate)],
      });
    } else if (this.state.weekly) {
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
          moment(weekStart).format(format) +
          " - " +
          moment(weekEnd).format(format) +
          " (Week " +
          weekNumber +
          ")",
      });
    } else if (this.state.monthly) {
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
        selectedDays: monthDays,
      });
    }
  };

  setNextDate = () => {
    const dateFrom = this.state.dateFrom;
    const dateTo = this.state.dateTo;
    const startOfDate = moment(dateFrom, DATE_FORMAT1).startOf("day");
    const endOfDate = moment(dateTo, DATE_FORMAT1).startOf("day");
    if (this.state.daily) {
      const nextDate = startOfDate.add(1, "days").format(DATE_FORMAT1);
      this.setState({
        dateFrom: new Date(nextDate),
        dateTo: new Date(nextDate),
        selectedDays: [new Date(nextDate)],
      });
    } else if (this.state.weekly) {
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
          moment(weekStart).format(format) +
          " - " +
          moment(weekEnd).format(format) +
          " (Week " +
          weekNumber +
          ")",
      });
    } else if (this.state.monthly) {
      const output = endOfDate.add(1, "days").format(DATE_FORMAT1);
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
        selectedDays: monthDays,
      });
    }
  };

  render() {
    console.log("props", this.props);
    const Daily = props => {
      return (
        <>
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleDateFrom}
            startDate={this.state.dateFrom}
            dateFormat="dd MMMM, yyyy"
          />
        </>
      );
    };

    const Monthly = props => {
      return (
        <>
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleMonthlyDateFrom}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
          />
        </>
      );
    };

    const Weekly = props => {
      return (
        <>
          <DatePicker
            showWeekNumbers
            onChange={this.handleDayChange}
            startDate={this.state.selectedDays[0]}
            endDate={this.state.selectedDays[6]}
            onWeekSelect={this.handleWeekClick}
            value={this.state.displayWeek}
            showWeekNumbers
          />
        </>
      );
    };

    return (
      <>
        {/* <div className="dashboard-main no-padding">
          <Header
            logout={this.logout}
            workspaces={this.state.workspaces}
            workspaceId={this.state.workspaceId}
            searchOptions={this.state.searchOptions}
            role={this.state.userRole}
            handleSearchFilterResult={this.handleSearchFilterResult}
          /> */}
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          state={this.state}
        />
        <div className="analysis-box row no-margin">
          <div className="col-md-12 no-padding analysis-top">
            <div className="reports-container col-sm-offset-2">
              <div className="reports-btns ">
                <div className="SelectedWeekExample">
                  <button
                    onClick={this.setPreviousDate}
                    className="arrow-button">
                    <i className="fa fa-angle-left"></i>
                  </button>
                  {this.state.daily ? <Daily /> : null}
                  {this.state.weekly ? <Weekly /> : null}
                  {this.state.monthly ? <Monthly /> : null}
                  <button onClick={this.setNextDate} className="arrow-button">
                    <i className="fa fa-angle-right"></i>
                  </button>
                </div>
                <div className="report-caleneder-btn">
                  <button
                    name="daily"
                    onClick={this.calenderButtonHandle}
                    className={this.state.daily ? "active" : ""}>
                    Daily
                  </button>
                  <button
                    name="weekly"
                    className={this.state.weekly ? "active" : ""}
                    onClick={this.calenderButtonHandle}>
                    Weekly
                  </button>
                  <button
                    name="monthly"
                    onClick={this.calenderButtonHandle}
                    className={this.state.monthly ? "active" : ""}>
                    {" "}
                    Monthly
                  </button>
                </div>
                <div className="report-download">
                  <button
                    className="btn btn-sm btn-default"
                    onClick={this.showTaskModal}>
                    <i className="fas fa-download right-left-space-5"></i>
                    Download
                  </button>
                </div>
              </div>

              <ReportTable
                taskDetails={this.state.taskDetails}
                state={this.state}
                frequency={this.returnFrequency()}
              />
            </div>
          </div>
        </div>
        {/* </div> */}
      </>
    );
  }
}

export default withRouter(Reports);
