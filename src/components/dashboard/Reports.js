import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet } from "../../utils/API";
import {
  DATE_FORMAT1,
  MONTH_FORMAT,
  DATE_FORMAT6,
  MONTH_FORMAT1,
  MONTH_FORMAT2,
  PRIORITIES
} from "./../../utils/Constants";
import moment from "moment";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import ReportTable from "./Reports/ReportTable";
import DatePicker from "react-datepicker";
import cookie from "react-cookies";
import "../../assets/css/reports.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-tabs/style/react-tabs.css";
import DailyPloySelect from "./../DailyPloySelect";
import { toast } from "react-toastify";
import DailyPloyToast from "./../DailyPloyToast";
import SummuryReportCharts from "./Reports/SummuryReportCharts";
import Loader from "react-loader-spinner";

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
      searchUserDetails: [],
      searchProjectIds: [],
      taskDetails: {},
      message: "My Daily Report",
      frequency: "daily",
      taskCategories: [],
      projectReports: "",
      categoryReports: "",
      priorityReports: "",
      selectedCategory: null,
      selectedPriority: null,
      columnChartData: [],
      barChartArray: this.generateDailyBarChartData(new Date()),
      isLoading: false
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
    var projects = this.state.projects.filter(project =>
      this.props.searchProjectIds.includes(project.id)
    );
    var projectNames = projects.map(project => project.name);
    return this.textTitlize(projectNames.join(", "));
  };

  displayMessage = () => {
    var role = this.state.userRole;
    var frequency = this.textTitlize(this.returnFrequency());
    if (
      role == "admin" &&
      this.props.searchProjectIds.length !== 0 &&
      this.props.searchUserDetails.length === 0
    ) {
      return (
        "Showing " +
        `${frequency}` +
        " Report for " +
        `${this.fetchProjectName()}`
      );
    } else if (
      (role === "member" && this.props.searchUserDetails.length === 0) ||
      (role === "member" &&
        this.props.searchUserDetails.length > 0 &&
        this.props.searchUserDetails[0].email === this.state.userEmail) ||
      (role === "admin" && this.props.searchUserDetails.length === 0) ||
      (role === "admin" &&
        this.props.searchUserDetails &&
        this.props.searchUserDetails[0].email === this.state.userEmail)
    ) {
      return "My " + `${frequency}` + " Report";
    } else if (role == "admin" && this.props.searchUserDetails !== []) {
      return (
        "Showing " +
        `${frequency}` +
        " Report for " +
        this.textTitlize(this.props.searchUserDetails[0].value) +
        "(" +
        `${this.props.searchUserDetails[0].email}` +
        ")"
      );
    }
  };

  textTitlize = text => {
    return text.replace(/(?:^|\s)\S/g, function(a) {
      return a.toUpperCase();
    });
  };

  generateDailyBarChartData = date => {
    var weekDays = this.getWeekDays(this.getWeekRange(date).from);
    var data = [];
    let activeBar = moment(new Date()).format(DATE_FORMAT1);
    var dates = weekDays.map(date => {
      let m = moment(date);
      let bar = moment(date).format(DATE_FORMAT1);
      data.push({ name: m.format(DATE_FORMAT6), activeBar: bar });
      return {
        activeBar: bar,
        startDate: m.format(DATE_FORMAT1),
        endDate: m.format(DATE_FORMAT1),
        name: m.format(DATE_FORMAT6),
        frequency: "daily"
      };
    });
    return { data: data, dates: dates, barWidth: 50, activeBar: activeBar };
  };

  generateWeeklyBarChartData = date => {
    var weekDays = this.getWeekDays(this.getWeekRange(date).from);
    let dates = [];
    let data = [];
    let activeBar = `Week ${moment().week()} ${moment().year()}`;
    for (let i = 0; i < 4; i++) {
      let md = moment(weekDays[0]);
      let lmd = moment(weekDays[6]);
      let week = `Week ${md.week()}`;
      let bar = `Week ${md.week()} ${md.year()}`;
      data.push({ name: week, activeBar: bar });
      dates.push({
        activeBar: bar,
        startDate: md.format(DATE_FORMAT1),
        endDate: lmd.format(DATE_FORMAT1),
        name: week,
        frequency: "weekly"
      });
      let newDate = md.subtract(1, "days");
      weekDays = this.getWeekDays(this.getWeekRange(newDate).from);
    }
    return {
      data: data.reverse(),
      dates: dates.reverse(),
      barWidth: 85,
      activeBar: activeBar
    };
  };

  generateMonthlyBarChartData = d => {
    let year = moment(d).year();
    let dates = [];
    let data = [];
    let activeBar = moment().format(MONTH_FORMAT2);
    for (let i = 1; i <= 12; i++) {
      var startDate = moment(`${year}-${i}-1`).format(DATE_FORMAT1);
      var endDate = moment(startDate)
        .endOf("month")
        .format(DATE_FORMAT1);
      let month = moment(startDate).format(MONTH_FORMAT1);
      let bar = moment(startDate).format(MONTH_FORMAT2);
      data.push({ name: month, activeBar: bar });
      dates.push({
        activeBar: bar,
        startDate: startDate,
        endDate: endDate,
        name: month,
        frequency: "monthly"
      });
    }
    return { data: data, dates: dates, barWidth: 30, activeBar: activeBar };
  };

  calenderButtonHandle = name => {
    var self = this;
    if (name == "daily") {
      self.setState({
        selectedDays: [new Date()],
        weekly: false,
        daily: true,
        monthly: false,
        barChartArray: this.generateDailyBarChartData(new Date()),
        frequency: "daily",
        columnChartData: [],
        dateFrom: new Date(),
        dateTo: new Date()
      });
    }
    if (name == "monthly") {
      let startDate = moment()
        .startOf("month")
        .format(DATE_FORMAT1);
      let endDate = moment()
        .endOf("month")
        .format(DATE_FORMAT1);
      let days = this.getMonthDates(startDate, endDate);
      self.setState({
        weekly: false,
        daily: false,
        monthly: true,
        frequency: "monthly",
        columnChartData: [],
        dateFrom: new Date(startDate),
        dateTo: new Date(endDate),
        selectedDays: days,
        barChartArray: this.generateMonthlyBarChartData(new Date(startDate))
      });
    }
    if (name == "weekly") {
      let week = moment().week();
      let weekdays = this.getWeekDays(this.getWeekRange(new Date()).from);
      let fm = "DD MMM";
      let weekFormated =
        moment(weekdays[0]).format(fm) +
        " - " +
        moment(weekdays[6]).format(fm) +
        " (Week " +
        week +
        ")";
      self.setState({
        weekly: true,
        daily: false,
        monthly: false,
        frequency: "weekly",
        columnChartData: [],
        selectedDays: weekdays,
        dateFrom: weekdays[0],
        dateTo: weekdays[weekdays.length - 1],
        weekNumber: week,
        displayWeek: weekFormated,
        barChartArray: this.generateWeeklyBarChartData(new Date(weekdays[0]))
      });
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
      barChartArray: this.generateWeeklyBarChartData(new Date(weekdays[0]))
    });
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
        ")",
      barChartArray: this.generateWeeklyBarChartData(new Date(weekdays[0]))
    });
  };

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  async componentDidMount() {
    this.props.handleLoading(true);
    var loggedInData = cookie.load("loggedInUser");
    if (!loggedInData) {
      try {
        const { data } = await get("logged_in_user");
        var loggedInData = data;
      } catch (e) {
        console.log("err", e);
      }
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
    const { workspaceId } = this.props.match.params;

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
      var worksapceUsers = data.members;
      var worksapceUser = data.members.find(
        user => user.email === loggedInData.email
      );
      var emailArr = data.members.filter(
        user => user.email !== loggedInData.email
      );
      // .map(user => user.email);
    } catch (e) {
      console.log("users Error", e);
    }

    // MIS report listing
    var searchData = {
      start_date: moment(this.state.dateFrom).format(DATE_FORMAT1),
      user_ids: loggedInData.id,
      frequency: "daily"
    };
    if (this.props.searchProjectIds.length > 0) {
      searchData["project_ids"] = this.props.searchProjectIds.join(",");
    }

    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/reports`,
        searchData
      );
      var details = this.makeDatesHash(data.reports);
      var taskDetails = details.taskReports;
      var totalTime = details.totalTime;
    } catch (e) {}

    // Category Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/task_category`
      );
      var taskCategories = data.task_categories;
    } catch (e) {}

    // Summury reports Projects
    searchData["end_date"] = moment(this.state.selectedDays[0]).format(
      DATE_FORMAT1
    );
    try {
      const { data } = await get(
        `workspaces/${workspaceId}/project_summary_report`,
        searchData
      );
      var projectReportData =
        data.report_data.length > 0
          ? {
              data: data.report_data,
              estimateTime: data.total_estimated_time
            }
          : "";
    } catch (e) {}

    // Summury reports Category
    try {
      const { data } = await get(
        `workspaces/${workspaceId}/category_summary_report`,
        searchData
      );
      var categoryReportData = data.report_data
        ? {
            data: data.report_data,
            estimateTime: data.total_estimated_time
          }
        : "";
    } catch (e) {}

    // Summury reports Priority
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/priority_summary_report`,
        searchData
      );
      var priorityReportData = data.report_data
        ? {
            data: data.report_data,
            estimateTime: data.total_estimated_time
          }
        : "";
    } catch (e) {}

    this.props.handleLoading(false);
    this.setState({
      workspaceId: workspaceId,
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
      userRole: worksapceUser ? worksapceUser.role : null,
      totalTime: totalTime,
      taskCategories: taskCategories,
      projectReports: projectReportData,
      categoryReports: categoryReportData,
      priorityReports: priorityReportData
    });
    this.loadMultipleApiData({ user_ids: loggedInData.id });
    this.createUserProjectList();
  }

  checkProject = () => {
    return (
      this.props.searchProjectIds.length > 0 &&
      this.state.userRole === "admin" &&
      this.props.searchUserDetails.length == 0
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
      prevState.frequency !== this.state.frequency ||
      prevProps.searchProjectIds !== this.props.searchProjectIds ||
      prevProps.searchUserDetails !== this.props.searchUserDetails ||
      prevState.selectedCategory !== this.state.selectedCategory ||
      prevState.selectedPriority !== this.state.selectedPriority
    ) {
      this.props.handleLoading(true);
      let userIds = this.props.searchUserDetails.map(
        member => member.member_id
      );
      var searchData = {
        start_date: moment(this.state.dateFrom).format(DATE_FORMAT1),
        user_ids:
          this.props.searchUserDetails.length > 0
            ? userIds.join(",")
            : this.state.userId,
        frequency: this.returnFrequency()
      };
      if (this.props.searchProjectIds.length > 0) {
        searchData["project_ids"] = this.props.searchProjectIds.join(",");
      }
      if (this.state.selectedCategory) {
        searchData[
          "category_ids"
        ] = this.state.selectedCategory.task_category_id;
      }
      if (this.state.selectedPriority) {
        searchData["priorities"] = this.state.selectedPriority.name;
      }
      // Reports data
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/reports`,
          searchData
        );
        var details = this.makeDatesHash(data.reports);
        var taskDetails = details.taskReports;
        var totalTime = details.totalTime;
      } catch (e) {}

      // Summury reports Projects
      searchData["end_date"] = moment(
        this.state.selectedDays[this.state.selectedDays.length - 1]
      ).format(DATE_FORMAT1);
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/project_summary_report`,
          searchData
        );
        var projectReportData = data.report_data
          ? {
              data: data.report_data,
              estimateTime: data.total_estimated_time
            }
          : "";
      } catch (e) {}

      var message = this.displayMessage();
      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/category_summary_report`,
          searchData
        );
        var categoryReportData = data.report_data
          ? {
              data: data.report_data,
              estimateTime: data.total_estimated_time
            }
          : "";
      } catch (e) {}

      try {
        const { data } = await get(
          `workspaces/${this.state.workspaceId}/priority_summary_report`,
          searchData
        );
        var priorityReportData = data.report_data
          ? {
              data: data.report_data,
              estimateTime: data.total_estimated_time
            }
          : "";
      } catch (e) {}

      let filterUserIds =
        this.props.searchUserDetails.length > 0
          ? userIds.join(",")
          : this.state.userId;
      this.props.handleLoading(false);
      this.setState({
        priorityReports: priorityReportData,
        categoryReports: categoryReportData,
        taskDetails: taskDetails,
        message: message,
        totalTime: totalTime,
        projectReports: projectReportData
      });
      this.loadMultipleApiData({ user_ids: filterUserIds });
    }
  }

  makeDatesHash = reports => {
    var taskReports = {};
    var totalSeconds = 0;
    reports.map((report, i) => {
      taskReports[report.date] = report.tasks;
    });

    this.state.selectedDays.map(date => {
      let dateFormated = moment(date).format(DATE_FORMAT1);
      var tasks = taskReports[dateFormated];
      if (tasks !== undefined) {
        totalSeconds += this.calculateTotalSecond(tasks, dateFormated);
      }
    });
    var time = this.secondsToHours(totalSeconds);
    return { taskReports: taskReports, totalTime: time };
  };

  addTotalDuration = timeTracked => {
    return timeTracked
      .map(log => log.duration)
      .flat()
      .reduce((a, b) => a + b, 0);
  };

  secondsToHours = seconds => {
    let totalSeconds = Number(seconds);
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.floor((totalSeconds % 3600) % 60);
    return h + "h" + " " + m + "m";
  };

  calculateTotalSecond = (tasks, date) => {
    var totalSec = 0;
    tasks.map((task, idx) => {
      totalSec += this.addTotalDuration(task.time_tracked);
    });
    return totalSec;
  };

  createUserProjectList = () => {
    var searchOptions = {};
    let projectList = [];
    let memberList = [];
    if (this.state.projects) {
      {
        this.state.projects.map((project, index) => {
          projectList.push({
            value: project.name,
            project_id: project.id,
            type: "project"
          });
        });
      }
    }
    if (this.state.userRole === "admin" && this.state.worksapceUsers) {
      {
        this.state.worksapceUsers.map((member, idx) => {
          memberList.push({
            value: member.name,
            member_id: member.id,
            email: member.email,
            type: "member",
            role: member.role
          });
        });
      }
    }
    searchOptions["projects"] = projectList;
    searchOptions["members"] = memberList;
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
    let routeName = route.split("/")[3];
    if (routeName === "reports") {
      return "reportsTrue";
    } else {
      return false;
    }
  };

  handleDateFrom = date => {
    this.setState({
      dateFrom: date,
      selectedDays: [new Date(date)],
      barChartArray: this.generateDailyBarChartData(new Date(date))
    });
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
      barChartArray: this.generateMonthlyBarChartData(new Date(startDate))
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
        barChartArray: this.generateDailyBarChartData(new Date(startOfDate))
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
        barChartArray: this.generateWeeklyBarChartData(new Date(weekStart))
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
        barChartArray: this.generateMonthlyBarChartData(new Date(endDate))
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
        barChartArray: this.generateDailyBarChartData(new Date(nextDate))
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
        barChartArray: this.generateWeeklyBarChartData(new Date(weekStart))
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
        barChartArray: this.generateMonthlyBarChartData(new Date(startDate))
      });
    }
  };

  handleCategoryChange = option => {
    this.setState({ selectedCategory: option });
  };
  handlePriorityChange = option => {
    this.setState({ selectedPriority: option });
  };

  setColumnChartData = data => {
    this.setState({ columnChartData: data });
  };

  loadMultipleApiData = async (searchParam, newD) => {
    var results = [];
    const { workspaceId } = this.props.match.params;
    let finalResults = new Promise(async (resolve, reject) => {
      try {
        let finalArray = this.state.barChartArray.dates.map(
          async (option, index) => {
            let searchData = {
              start_date: option.startDate,
              end_date: option.endDate
            };
            const searchResult = await get(
              `workspaces/${workspaceId}/user_summary_report`,
              { ...searchData, ...searchParam }
            );
            results.push({
              totalEstimateTime: searchResult.data.total_estimated_time,
              trackedTime: searchResult.data.total_tracked_time,
              date: searchData.start_date,
              id: index + 1,
              activeBar: this.getActive(searchData.start_date)
            });
          }
        );
        await Promise.all(finalArray).then(response => {});
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
    var newFinalResults = [];
    var self = this;
    await finalResults.then(function(response) {
      newFinalResults = response;
      self.setState({ columnChartData: newFinalResults, ...newD });
    });
  };

  getActive = date => {
    if (this.state.frequency == "weekly") {
      let md = moment(date);
      return `Week ${md.week()} ${md.year()}`;
    } else if (this.state.frequency == "monthly") {
      return moment(date).format(MONTH_FORMAT2);
    } else {
      return date;
    }
  };

  downloadReportsCsv = async () => {
    var searchData = {
      start_date: moment(this.state.dateFrom).format(DATE_FORMAT1),
      user_ids:
        this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails
              .map(member => member.member_id)
              .join(",")
          : this.state.userId,
      frequency: this.returnFrequency()
    };
    if (this.props.searchProjectIds.length > 0) {
      searchData["project_ids"] = this.props.searchProjectIds.join(",");
    }
    if (this.state.selectedCategory) {
      searchData["category_ids"] = this.state.selectedCategory.task_category_id;
    }
    if (this.state.selectedPriority) {
      searchData["priorities"] = this.state.selectedPriority.name;
    }
    try {
      this.setState({ isLoading: true });
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/csv_download`,
        searchData
      );
      let csvUrl = data.csv_url;
      var link = document.createElement("a");
      link.download = "csv download";
      link.href = csvUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link.remove();
      this.setState({ isLoading: false });
    } catch (e) {
      toast(<DailyPloyToast message="something went wrong" status="error" />, {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER
      });
      let self = this;
      setTimeout(function() {
        self.setState({ isLoading: false });
      }, 2000);
    }
  };

  render() {
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
          <div className="week-hover-bg d-inline-block">
            <DatePicker
              showWeekNumbers
              selected={this.state.dateFrom}
              onChange={this.handleDayChange}
              startDate={this.state.selectedDays[0]}
              endDate={this.state.selectedDays[6]}
              onWeekSelect={this.handleWeekClick}
              value={this.state.displayWeek}
              showWeekNumbers
            />
          </div>
        </>
      );
    };

    return (
      <>
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          state={this.state}
        />
        <div className="analysis-box row no-margin padding-top-60px">
          <div className="col-md-12 no-padding ">
            <div className="reports-container col-sm-offset-2">
              <div className="reports-btns ">
                <div className="SelectedWeekExample">
                  <button
                    onClick={this.setPreviousDate}
                    className="arrow-button"
                  >
                    <i className="fa fa-angle-left"></i>
                  </button>
                  {this.state.daily ? <Daily /> : null}
                  {this.state.weekly ? <Weekly /> : null}
                  {this.state.monthly ? <Monthly /> : null}
                  <button onClick={this.setNextDate} className="arrow-button">
                    <i className="fa fa-angle-right"></i>
                  </button>
                </div>

                <div className="report-viewtype-btns d-inline-block">
                  <div
                    onClick={() => this.calenderButtonHandle("daily")}
                    name="daily"
                    className={`d-inline-block ${
                      this.state.daily ? "active" : ""
                    }`}
                  >
                    Daily
                  </div>
                  <div
                    onClick={() => this.calenderButtonHandle("weekly")}
                    name="weekly"
                    className={`d-inline-block ${
                      this.state.weekly ? "active" : ""
                    }`}
                  >
                    Weekly
                  </div>
                  <div
                    onClick={() => this.calenderButtonHandle("monthly")}
                    name="monthly"
                    className={`d-inline-block ${
                      this.state.monthly ? "active" : ""
                    }`}
                  >
                    Monthly
                  </div>
                </div>

                <div className="report-caleneder-btn">
                  <div className="d-inline-block report-category">
                    <DailyPloySelect
                      placeholder="search for category"
                      options={this.state.taskCategories}
                      onChange={this.handleCategoryChange}
                    />
                  </div>
                  <div className="d-inline-block report-priority">
                    <DailyPloySelect
                      placeholder="select priority"
                      onChange={this.handlePriorityChange}
                      label="label"
                      suggesionBy="label"
                      iconType="circle"
                      optionPlaceholder={true}
                      options={PRIORITIES}
                    />
                  </div>
                </div>
                <div className="report-download">
                  <button
                    className={`btn btn-sm btn-default ${
                      this.state.isLoading ? "disabled" : ""
                    }`}
                    onClick={() => this.downloadReportsCsv()}
                  >
                    {this.state.isLoading ? (
                      <Loader
                        type="Oval"
                        color="#1f8354"
                        height={20}
                        width={20}
                        className="d-inline-block csv-loader"
                      />
                    ) : null}
                    <i className="fas fa-download right-left-space-5"></i>
                    Download
                  </button>
                </div>
              </div>

              <div className="">
                <SummuryReportCharts
                  priorities={PRIORITIES}
                  projects={this.state.projects}
                  state={this.state}
                  searchUserDetails={this.props.searchUserDetails}
                  searchProjectIds={this.props.searchProjectIds}
                  setColumnChartData={this.setColumnChartData}
                  handleLoading={this.props.handleLoading}
                />
              </div>

              <div className="report-table">
                <ReportTable
                  taskDetails={this.state.taskDetails}
                  state={this.state}
                  searchProjectIds={this.props.searchProjectIds}
                  searchUserDetails={this.props.searchUserDetails}
                  frequency={this.returnFrequency()}
                />
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </>
    );
  }
}

export default withRouter(Reports);
