import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet } from "../../utils/API";
import moment from "moment";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import ReportTable from "./Reports/ReportTable";
import DatePicker from "react-datepicker";
import "../../assets/css/reports.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-tabs/style/react-tabs.css";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.format = "YYYY-MM-DD"
    this.calenderArr = ['daily', 'weekly', 'monthly']
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
      worksapceUsers: '',
      worksapceUser: [],
      searchUserDetail: "",
      searchProjectIds: [],
      taskDetails: {},
      message: "My Daily Report",
    };
  }

  returnFrequency = () => {
    if (this.state.daily) {
      return "daily"
    } else if (this.state.monthly) {
      return "monthly"
    } else if (this.state.weekly) {
      return "weekly"
    }
  }

  fetchProjectName = () => {
    var project = this.state.projects.filter(project => project.id === this.state.searchProjectIds[0])
    return project[0].name
  }

  displayMessage = () => {
    var role = this.state.userRole
    var frequency = this.returnFrequency()
    if (role == 'admin' && this.state.searchProjectIds.length !== 0 && this.state.searchUserDetail == "") {
      return "Showing " + `${frequency}` + " Report for " + `${this.fetchProjectName()}`
    } else if (role === "member" || (role == "admin" && this.state.searchUserDetail === "")) {
      return "My " + `${frequency}` + " Report"
    } else if (role == 'admin' && this.state.searchUserDetail !== "") {
      return "Showing " + `${frequency}` + " Report for " + `${this.state.searchUserDetail.value}` + "(" + `${this.state.searchUserDetail.email}` + ")"
    }
  }

  calenderButtonHandle = (e) => {
    const name = e.target.name
    const newCalenderArr = this.calenderArr.filter(item => item !== name)
    this.setState({ [name]: true })
    var self = this;
    newCalenderArr.map(item => {
      self.setState({ [item]: false })
    })
    if (name == 'daily') {
      self.setState({ selectedDays: [new Date()] })
    }
    if (name == 'monthly') {
      this.handleMonthlyDateFrom(new Date())
    }
    if (name == 'weekly') {
      this.handleDayChange(new Date())
    }
  }

  handleDayChange = date => {
    const week = moment(date, "MM-DD-YYYY").week();
    const weekdays = this.getWeekDays(this.getWeekRange(date).from)
    const fm = 'DD MMM'
    this.setState({
      selectedDays: weekdays,
      dateFrom: weekdays[0],
      dateTo: weekdays[weekdays.length - 1],
      weekNumber: week,
      displayWeek: moment(weekdays[0]).format(fm) + " - " + moment(weekdays[6]).format(fm) + " (Week " + week + ")"
    });
  };

  getWeekDays = (weekStart) => {
    const days = [weekStart];
    for (let i = 1; i < 7; i += 1) {
      days.push(
        moment(weekStart)
          .add(i, 'days')
          .toDate()
      );
    }
    return days;
  }

  getWeekRange = (date) => {
    return {
      from: moment(date)
        .startOf('week')
        .toDate(),
      to: moment(date)
        .endOf('week')
        .toDate(),
    };
  }

  handleWeekClick = (days, weekNumber) => {
    const weekdays = this.getWeekDays(this.getWeekRange(days).from)
    const format = 'DD MMM'
    this.setState({
      selectedDays: weekdays,
      dateFrom: weekdays[0],
      dateTo: weekdays[weekdays.length - 1],
      weekNumber: weekNumber,
      displayWeek: moment(weekdays[0]).format(format) + " - " + moment(weekdays[6]).format(format) + "(Week" + this.state.weekNumber + ")"
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
        `workspaces/${this.state.workspaceId}/projects`
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var userArr = data.members.map(user => user.email);
      var worksapceUsers = data.members
      var worksapceUser = data.members.filter(user => user.email === loggedInData.email)
      var emailArr = data.members
        .filter(user => user.email !== loggedInData.email)
        .map(user => user.email);
    } catch (e) {
      console.log("users Error", e);
    }

    // MIS report listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/reports`,
        { frequency: 'daily', user_id: loggedInData.id, start_date: moment(this.state.dateFrom).format('YYYY-MM-DD') }
      );
      // var taskDetails = data.reports
      var taskDetails = this.makeDatesHash(data.reports)
    } catch (e) {

    }

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
      userRole: worksapceUser[0].role
    });

    this.createUserProjectList();
  }


  checkProject = () => {
    console.log(this.state.searchProjectIds, this.state.searchUserDetail, this.state.userRole)
    return this.state.searchProjectIds.length > 0 && this.state.userRole === 'admin' && this.state.searchUserDetail.length == 0
  }

  async componentDidUpdate(prevProps, prevState) {
    var taskDetails = []
    if (prevState.dateFrom !== this.state.dateFrom
      || prevState.dateTo !== this.state.dateTo
      || prevState.searchProjectIds !== this.state.searchProjectIds
      || prevState.searchUserDetail !== this.state.searchUserDetail
    ) {
      var searchData = {
        start_date: moment(this.state.dateFrom).format('YYYY-MM-DD'),
        user_id: this.state.searchUserDetail ? this.state.searchUserDetail.member_id : this.state.userId,
        frequency: this.returnFrequency(),
        project_ids: this.state.searchProjectIds
      }

      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/reports`, searchData
        );
        var taskDetails = this.makeDatesHash(data.reports)
      } catch (e) {
      }
      var message = this.displayMessage()

      this.setState({ taskDetails: taskDetails, message: message })
    }
  }

  makeDatesHash = (reports) => {
    var taskReports = {}
    {
      reports.map((report, i) => {
        taskReports[report.date] = report.tasks
      })
    }
    return taskReports
  }


  handleSearchFilterResult = (data) => {
    var searchUserDetail = ""
    var projectIds = []
    {
      data.map((item, i) => {
        if (item.type === "member") {
          searchUserDetail = item
        }
        else if (item.type === "project") {
          projectIds.push(item.project_id)
        }
      })
    }
    this.setState({ searchProjectIds: projectIds, searchUserDetail: searchUserDetail })
  }

  createUserProjectList = () => {
    var searchOptions = []
    if (this.state.projects) {
      {
        this.state.projects.map((project, index) => {
          searchOptions.push({
            value: project.name,
            project_id: project.id,
            type: "project",
            id: index += 1
          })
        })
      }
    }

    var index = searchOptions.length
    if (this.state.userRole === 'admin' && this.state.worksapceUsers) {
      var otherMembers = this.state.worksapceUsers.filter(user => user.email !== this.state.userEmail)
      {
        otherMembers.map((member, idx) => {
          searchOptions.push({
            value: member.name,
            id: index += 1,
            member_id: member.id,
            email: member.email,
            type: 'member',
            role: member.role
          })
        })
      }
    }
    this.setState({ searchOptions: searchOptions })
  }

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
    const output = moment(date, this.format);
    var startDate = output.startOf('month').format(this.format)
    var endDate = output.endOf('month').format(this.format)
    var days = this.getMonthDates(startDate, endDate)
    this.setState({
      dateFrom: new Date(startDate),
      dateTo: new Date(endDate),
      selectedDays: days
    })
  }

  getMonthDates = (start, end) => {
    var startDate = new Date(start)
    var endDate = new Date(end)
    var daysArr = new Array();
    var currentDate = startDate;
    while (currentDate <= endDate) {
      daysArr.push(currentDate);
      var date = moment(currentDate, this.format).add(1, 'days').format(this.format)
      currentDate = new Date(date)
    }
    return daysArr;
  }


  setPreviousDate = () => {
    const dateFrom = this.state.dateFrom
    const startOfDate = moment(dateFrom, this.format).startOf('day')
    const endOfDate = moment(dateFrom, this.format).endOf('day')
    if (this.state.daily) {
      const prevDate = startOfDate.subtract(1, 'days').format(this.format)
      this.setState({
        dateFrom: new Date(prevDate),
        dateTo: new Date(prevDate),
        selectedDays: [new Date(prevDate)]
      })
    } else if (this.state.weekly) {
      const format = 'DD MMM'
      var weekDay = startOfDate.subtract(1, 'days').format(this.format)
      var weekDay = moment(weekDay, this.format)
      var weekStart = weekDay.startOf('week').format(this.format)
      var weekEnd = weekDay.endOf('week').format(this.format)
      var weekNumber = weekDay.week()
      this.setState({
        dateFrom: new Date(weekStart),
        dateTo: new Date(weekEnd),
        weekNumber: weekNumber,
        selectedDays: this.getWeekDays(new Date(weekStart)),
        displayWeek: moment(weekStart).format(format) + " - " + moment(weekEnd).format(format) + " (Week " + weekNumber + ")"
      })
    } else if (this.state.monthly) {
      const output = startOfDate.subtract(1, 'days').format(this.format)
      var startDate = moment(output).startOf('month').format(this.format)
      var endDate = moment(output).endOf('month').format(this.format)
      var monthDays = this.getMonthDates(startDate, endDate);
      this.setState({
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate),
        selectedDays: monthDays
      })
    }
  }

  setNextDate = () => {
    const dateFrom = this.state.dateFrom
    const dateTo = this.state.dateTo
    const startOfDate = moment(dateFrom, this.format).startOf('day')
    const endOfDate = moment(dateTo, this.format).startOf('day')
    if (this.state.daily) {
      const nextDate = startOfDate.add(1, 'days').format(this.format)
      this.setState({
        dateFrom: new Date(nextDate),
        dateTo: new Date(nextDate),
        selectedDays: [new Date(nextDate)]
      })
    } else if (this.state.weekly) {
      const format = 'DD MMM'
      var weekDay = endOfDate.add(1, 'days').format(this.format)
      var weekDay = moment(weekDay, this.format)
      var weekStart = weekDay.startOf('week').format(this.format)
      var weekEnd = weekDay.endOf('week').format(this.format)
      var weekNumber = weekDay.week()
      this.setState({
        dateFrom: new Date(weekStart),
        dateTo: new Date(weekEnd),
        weekNumber: weekNumber,
        selectedDays: this.getWeekDays(new Date(weekStart)),
        displayWeek: moment(weekStart).format(format) + " - " + moment(weekEnd).format(format) + " (Week " + weekNumber + ")"
      })
    } else if (this.state.monthly) {
      const output = endOfDate.add(1, 'days').format(this.format)
      var startDate = moment(output).startOf('month').format(this.format)
      var endDate = moment(output).endOf('month').format(this.format)
      var monthDays = this.getMonthDates(startDate, endDate)
      this.setState({
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate),
        selectedDays: monthDays
      })
    }
  }

  render() {

    const Daily = (props) => {
      return (
        <>
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleDateFrom}
            startDate={this.state.dateFrom}
            dateFormat="dd MMMM, yyyy"
          />
        </>
      )
    }

    const Monthly = (props) => {
      return (
        <>
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleMonthlyDateFrom}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
          />
        </>

      )
    }

    const Weekly = (props) => {
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
      )
    }

    return (
      <>
        <div className="row no-margin">
          <Sidebar workspaces={this.state.workspaces} />
          <div className="dashboard-main no-padding">
            <Header
              logout={this.logout}
              workspaces={this.state.workspaces}
              workspaceId={this.state.workspaceId}
              searchOptions={this.state.searchOptions}
              role={this.state.userRole}
              handleSearchFilterResult={this.handleSearchFilterResult}
            />
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
                      <button
                        onClick={this.setNextDate}
                        className="arrow-button">
                        <i className="fa fa-angle-right"></i>
                      </button>
                    </div>
                    <div className="report-caleneder-btn">
                      <button
                        name="daily"
                        onClick={this.calenderButtonHandle}
                        className={this.state.daily ? 'active' : ''}
                      >Daily
                      </button>
                      <button
                        name="weekly"
                        className={this.state.weekly ? 'active' : ''}
                        onClick={this.calenderButtonHandle}
                      >Weekly
                      </button>
                      <button
                        name="monthly"
                        onClick={this.calenderButtonHandle}
                        className={this.state.monthly ? 'active' : ''}
                      > Monthly
                      </button>
                    </div>
                    <div className="report-download">
                      <button
                        className="btn btn-sm btn-default"
                        onClick={this.showTaskModal}>
                        <i className="fas fa-download right-left-space-5"></i>Download
                      </button>
                    </div>
                  </div>

                  <ReportTable taskDetails={this.state.taskDetails} state={this.state} frequency={this.returnFrequency()} />
                </div>

              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}


export default withRouter(Reports);