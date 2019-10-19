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
    // this.format = "h:mm a";
    this.format = "MM-DD-YYYY"
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
      users: [],
      resources: [],
      events: [],
      daily: true,
      weekly: false,
      monthly: false,
      selectedDays: [],
      hoverRange: undefined,
      weekNumber: "",
      displayWeek: "",
      taskDetails: [
        {
          "date": "2019-10-06",
          "tasks": [
            {
              "comments": "Test Comments",
              "start_time": "2019-10-20T11:00:00Z",
              "end_time": "2019-10-20T11:00:00Z",
              "id": 2,
              "task_name": "MIS Reports",
              "project_name": "Dailyploy",
              "categary": "normal",
              "user": {
                "id": 1,
                "name": "Arpit Jain",
              },
              "project_details": {
                "color_code": "#ff6900",
                "description": null,
                "name": "Dailyploy",
                "start_date": "2019-10-06",
                "end_date": "2019-10-16",
                "id": 1,
                "members": [
                  {
                    "email": "ravindra@stack-avenue.com",
                    "id": 1,
                    "name": "ravi",
                  },
                  {
                    "email": "arpit@stack-avenue.com",
                    "id": 2,
                    "name": "arpit",
                  }
                ],
              },
            }
          ]
        },
        {
          "date": "2019-10-06",
          "tasks": [
            {
              "comments": "Test Comments",
              "start_time": "2019-10-20T11:00:00Z",
              "end_time": "2019-10-20T11:00:00Z",
              "id": 2,
              "task_name": "MIS Reports",
              "project_name": "Dailyploy",
              "categary": "normal",
              "user": {
                "id": 1,
                "name": "Arpit Jain",
              },
              "project_details": {
                "color_code": "#ff6900",
                "description": null,
                "name": "Dailyploy",
                "start_date": "2019-10-06",
                "end_date": "2019-10-16",
                "id": 1,
                "members": [
                  {
                    "email": "ravindra@stack-avenue.com",
                    "id": 1,
                    "name": "ravi",
                  },
                  {
                    "email": "arpit@stack-avenue.com",
                    "id": 2,
                    "name": "arpit",
                  }
                ],
              },
            },
            {
              "comments": "Test Comments",
              "start_time": "2019-10-20T11:00:00Z",
              "end_time": "2019-10-20T11:00:00Z",
              "id": 2,
              "task_name": "MIS Reports",
              "project_name": "Dailyploy",
              "categary": "normal",
              "user": {
                "id": 1,
                "name": "Arpit Jain",
              },
              "project_details": {
                "color_code": "#ff6900",
                "description": null,
                "name": "Dailyploy",
                "start_date": "2019-10-06",
                "end_date": "2019-10-16",
                "id": 1,
                "members": [
                  {
                    "email": "ravindra@stack-avenue.com",
                    "id": 1,
                    "name": "ravi",
                  },
                  {
                    "email": "arpit@stack-avenue.com",
                    "id": 2,
                    "name": "arpit",
                  }
                ],
              },
            },
          ]
        },
      ]
    };
  }

  calenderButtonHandle = (e) => {
    const name = e.target.name
    const newCalenderArr = this.calenderArr.filter(item => item !== name)
    this.setState({ [name]: true })
    var self = this;
    newCalenderArr.map(item => {
      self.setState({ [item]: false })
    })
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

  handleDayEnter = date => {
    console.log("handleDayEnter", date)
    console.log("handleDayEnter", this.getWeekRange(date))
    this.setState({
      hoverRange: this.getWeekRange(date),
    });
    console.log(this.state.hoverRange)
  };

  handleDayLeave = () => {
    this.setState({
      hoverRange: undefined,
    });
  };

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
      var emailArr = data.members
        .filter(user => user.email !== loggedInData.email)
        .map(user => user.email);
    } catch (e) {
      console.log("users Error", e);
    }

    // MIS report listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/reports`
      );
      console.log(data)
      var projectsData = data.projects;
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
    });
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    console.log("selected value ", value);
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
    this.setState({ dateFrom: date });
  };

  handleMonthlyDateFrom = date => {
    const output = moment(date);
    var endDate = output.endOf('month').format(this.format)
    this.setState({
      dateFrom: date,
      dateTo: new Date(endDate)
    })
  }

  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  setPreviousDate = () => {
    const dateFrom = this.state.dateFrom
    const startOfDate = moment(dateFrom, this.format).startOf('day')
    const endOfDate = moment(dateFrom, this.format).endOf('day')
    if (this.state.daily) {
      const prevDate = startOfDate.subtract(1, 'days').format(this.format)
      this.setState({
        dateFrom: new Date(prevDate),
        dateTo: new Date(endOfDate)
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
      this.setState({
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate)
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
      this.setState({ dateFrom: new Date(nextDate) })
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
      this.setState({
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate)
      })
    }
  }

  render() {

    const Daily = (props) => {
      return (
        <>
          <button onClick={this.setPreviousDate} className="arrow-button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleDateFrom}
            startDate={this.state.dateFrom}
            dateFormat="dd MMMM, yyyy"
          />
          <button onClick={this.setNextDate} className="arrow-button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>
        </>
      )
    }

    const Monthly = (props) => {
      return (
        <>
          <button onClick={this.setPreviousDate} className="arrow-button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>
          <DatePicker
            selected={this.state.dateFrom}
            onChange={this.handleMonthlyDateFrom}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
          />
          <button onClick={this.setNextDate} className="arrow-button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>
        </>
      )
    }

    const Weekly = (props) => {
      return (
        <>
          <div className="SelectedWeekExample">
            <button onClick={this.setPreviousDate} className="arrow-button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>
            <DatePicker
              showWeekNumbers
              onChange={this.handleDayChange}
              startDate={this.state.selectedDays[0]}
              endDate={this.state.selectedDays[6]}
              onWeekSelect={this.handleWeekClick}
              value={this.state.displayWeek}
              showWeekNumbers
            />
            <button onClick={this.setNextDate} className="arrow-button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>
          </div>
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
                  <div className="reports-btns pull-right">
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
                    <button
                      className="btn btn-sm btn-default"
                      onClick={this.showTaskModal}
                    ><i className="fas fa-download">Download </i>
                    </button>
                  </div>

                  {this.state.daily ? <Daily /> : null}
                  {this.state.weekly ? <Weekly /> : null}
                  {this.state.monthly ? <Monthly /> : null}

                  <ReportTable taskDetails={this.state.taskDetails} />
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