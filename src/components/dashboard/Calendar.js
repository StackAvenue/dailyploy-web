import React, { Component } from "react";
import "antd/lib/style/index.less";
import Scheduler, { SchedulerData, ViewTypes } from "react-big-scheduler";
// import Scheduler, {
//   SchedulerData,
//   ViewTypes
// } from "./../../../src/react-big-scheduler";
import withDragDropContext from "./withDnDContext";
import { Dropdown } from "react-bootstrap";
import "../../assets/css/dashboard.scss";
import moment from "moment";
import DashboardEvent from "./../dashboard/DashboardEvent";
import DailyPloyDatePicker from "./../DailyPloyDatePicker";
import MonthlyTaskOverPopup from "./../dashboard/MonthlyTaskOverPopup";

class Calendar extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.schedulerData = new SchedulerData(
      Date.now(),
      ViewTypes.Week,
      false,
      false,
      {
        schedulerWidth: "96.1%",
        besidesWidth: 20,
        schedulerMaxHeight: 0,
        tableHeaderHeight: 34,

        // agendaResourceTableWidth: 160,
        agendaResourceTableWidth: 218,
        agendaMaxEventWidth: 153,

        dayResourceTableWidth: 218,
        weekResourceTableWidth: 218,
        // weekResourceTableWidth: "16%",
        monthResourceTableWidth: 218,
        customResourceTableWidth: 160,

        dayCellWidth: 40,
        weekCellWidth: "12%",
        monthCellWidth: 40,
        customCellWidth: 80,

        dayMaxEvents: 99,
        weekMaxEvents: 99,
        monthMaxEvents: 99,
        customMaxEvents: 99,

        eventItemHeight: 85,
        // eventItemHeight: 45,
        eventItemLineHeight: this.calculateResouceHeight(),
        nonAgendaSlotMinHeight: 0,
        dayStartFrom: 0,
        dayStopTo: 23,
        defaultEventBgColor: "#80C5F6",
        selectedAreaColor: "#7EC2F3",
        nonWorkingTimeHeadColor: "#5c5c5c",
        nonWorkingTimeHeadBgColor: "#fff",
        nonWorkingTimeBodyBgColor: "#ededed",
        summaryColor: "#666",
        groupOnlySlotColor: "#F8F8F8",

        startResizable: true,
        endResizable: true,
        movable: true,
        creatable: true,
        crossResourceMove: false,
        checkConflict: false,
        scrollToSpecialMomentEnabled: true,
        eventItemPopoverEnabled: false,
        calendarPopoverEnabled: true,
        recurringEventsEnabled: true,
        headerEnabled: true,
        displayWeekend: true,
        relativeMove: true,
        defaultExpanded: true,

        resourceName: "",
        taskName: "Task Name",
        agendaViewHeader: "",
        nonAgendaDayCellHeaderFormat: "ha",
        nonAgendaWeekCellHeaderFormat: "ddd DD MMM",
        nonAgendaMonthCellHeaderFormat: "DD",
        nonAgendaOtherCellHeaderFormat: "DD MMM",
        eventItemPopoverDateFormat: "MMM D",
        minuteStep: 30,
        calenderViewType: "customview",

        views: [
          {
            viewName: "Day",
            viewType: ViewTypes.Day,
            showAgenda: true,
            isEventPerspective: false
          },
          {
            viewName: "Week",
            viewType: ViewTypes.Week,
            showAgenda: false,
            isEventPerspective: false
          }
          // {
          //   viewName: "Month",
          //   viewType: ViewTypes.Month,
          //   showAgenda: false,
          //   isEventPerspective: false
          // }
        ]
      }
    );

    this.state = {
      viewModel: this.schedulerData,
      resources: [],
      events: [],
      eventsForCustomStyle: [],
      eventsForTaskView: [],
      show: false,
      setShow: false,
      onGoingTask: false
    };
  }

  calculateResouceHeight = () => {
    let resourcesLength = this.props.resources
      ? this.props.resources.length
      : 0;
    let sceenHeight = window.screen.height;
    let finalSceenHeight = sceenHeight - ((sceenHeight / 10) * 30) / 10;
    let heights = new Map();
    heights.set(0, finalSceenHeight);
    heights.set(1, finalSceenHeight);
    heights.set(2, finalSceenHeight / 2);
    heights.set(3, finalSceenHeight / 3);
    heights.set(4, finalSceenHeight / 4);
    heights.set(5, finalSceenHeight / 5);
    heights.set(6, finalSceenHeight / 6);
    heights.set(7, finalSceenHeight / 7);
    heights.set(8, finalSceenHeight / 8);
    let height = heights.get(resourcesLength);
    if (height === undefined) {
      return 85;
    }
    return height;
  };

  async componentDidMount() {
    this._isMounted = true;
    this.renderData();
    var cal = document.querySelector(".dashboard-calender");
    cal.getElementsByTagName("input")[0].setAttribute("readonly", "readonly");
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.events !== this.props.events ||
      prevProps.resources !== this.props.resources
    ) {
      this.renderData();
    }
    if (prevProps.state.taskFrequency != this.props.state.taskFrequency) {
      var cal = document.querySelector(".dashboard-calender");
      cal.getElementsByTagName("input")[0].setAttribute("readonly", "readonly");
    }
  }

  renderData = () => {
    this.schedulerData.setEventItemLineHeight(this.calculateResouceHeight());
    this.schedulerData.setResources(this.props.resources);
    this.schedulerData.setEvents(this.props.events);
  };

  nonAgendaCellHeaderTemplateResolver = (
    schedulerData,
    item,
    formattedDateItems,
    style
  ) => {
    let datetime = schedulerData.localeMoment(item.time);
    let isCurrentDate = false;

    if (schedulerData.viewType === ViewTypes.Day) {
      isCurrentDate = datetime.isSame(new Date(), "hour");
    } else {
      isCurrentDate = datetime.isSame(new Date(), "day");
    }

    if (isCurrentDate) {
      style.borderTop = "4px solid #33a1ff";
    }

    return (
      <th key={item.time} className={`header3-text`} style={style}>
        {formattedDateItems.map((formattedItem, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{
              __html: formattedItem.replace(/[0-9]/g, "<b>$&</b>")
            }}
          />
        ))}
      </th>
    );
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { viewModel } = this.state;
    this.renderData();
    let leftCustomHeader = (
      <div className="leftheader">
        <span>Team</span>
      </div>
    );

    return (
      <div>
        <div className={`${viewModel.viewType === 0 ? "daily-agenda" : ""}`}>
          <Scheduler
            schedulerData={viewModel}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onSelectDate={this.onSelectDate}
            onViewChange={this.onViewChange}
            eventItemClick={this.eventClicked}
            updateEventStart={this.updateEventStart}
            updateEventEnd={this.updateEventEnd}
            moveEvent={this.moveEvent}
            newEvent={this.newEvent}
            onScrollLeft={this.onScrollLeft}
            onScrollRight={this.onScrollRight}
            onScrollTop={this.onScrollTop}
            onScrollBottom={this.onScrollBottom}
            nonAgendaCellHeaderTemplateResolver={
              this.nonAgendaCellHeaderTemplateResolver
            }
            toggleExpandFunc={this.toggleExpandFunc}
            leftCustomHeader={leftCustomHeader}
            eventItemTemplateResolver={this.eventItemTemplateResolver}
            eventItemPopoverTemplateResolver={
              this.eventItemPopoverTemplateResolver
            }
            customeVeiwTypeButtons={this.viewTypeButtons}
            customeDatePicker={this.customeDatePicker}
          />
        </div>
      </div>
    );
  }
  eventItemPopoverTemplateResolver = (
    schedulerData,
    eventItem,
    title,
    start,
    end,
    statusColor
  ) => {
    let totalSeconds = end.diff(start, "seconds");
    totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);

    var timeDiff = ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + "h";
    if (schedulerData.viewType !== 2) {
      return (
        <div className="custom-event-popup">
          <div className="event-task-hover">
            <div className="title">
              <span className="" title={title}>
                {title}
              </span>
            </div>
            <div className="project">
              <div
                className="status-dot d-inline-block"
                style={{ backgroundColor: `${eventItem.bgColor}` }}
              ></div>
              <div className="d-inline-block">{eventItem.projectName}</div>
            </div>
            <div className="time">
              <div className="d-inline-block">
                {start.format("HH:mm")}-{end.format("HH:mm")}
              </div>
              <div className="d-inline-block pull-right">{timeDiff}</div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <MonthlyTaskOverPopup
          event={eventItem}
          titleText={title}
          end={end}
          schedulerData={this.schedulerData}
          scheduler={this.schedulerData}
          workspaceId={this.props.workspaceId}
          times={this.times}
          bgColor={eventItem.bgColor}
          handleTaskBottomPopup={this.props.handleTaskBottomPopup}
          userId={this.props.state.userId}
          onGoingTask={this.props.onGoingTask}
        />
      );
    }
  };

  prevClick = schedulerData => {
    schedulerData.prev();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
    this.props.updateTaskDateView(
      schedulerData.viewType,
      schedulerData.startDate
    );
  };

  nextClick = schedulerData => {
    schedulerData.next();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
    this.props.updateTaskDateView(
      schedulerData.viewType,
      schedulerData.startDate
    );
  };

  onViewChange = (schedulerData, view) => {
    var newSchedulerData = new SchedulerData(schedulerData);
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    schedulerData.setEvents(this.state.events);
    if (view.viewType === 0) {
      schedulerData.setEventItemHeight(85);
    } else if (view.viewType === 1) {
      schedulerData.setEventItemHeight(85);
    } else if (view.viewType === 2) {
      schedulerData.setEventItemHeight(51);
    }
    this.setState({
      viewModel: schedulerData
    });
    this.props.updateTaskDateView(
      schedulerData.viewType,
      schedulerData.startDate
    );
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
    this.props.updateTaskDateView(
      schedulerData.viewType,
      schedulerData.startDate
    );
  };

  eventClicked = (schedulerData, event) => {
    var taskId = event.id.split("-")[0];
    this.props.editAddTaskDetails(taskId, event);
  };

  ops1 = (schedulerData, event) => {
    alert(
      `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  ops2 = (schedulerData, event) => {
    alert(
      `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    this.props.setAddTaskDetails(slotId, start, end);
  };

  updateEventStart = (schedulerData, event, newStart) => {
    this.setState({
      viewModel: schedulerData
    });
    this.props.updateTaskEvent(event, { start_datetime: newStart });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    this.setState({
      viewModel: schedulerData
    });
    this.props.updateTaskEvent(event, { end_datetime: newEnd });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    schedulerData.moveEvent(event, slotId, slotName, start, end);
    this.setState({
      viewModel: schedulerData
    });
    this.props.updateTaskEvent(event, {
      start_datetime: start,
      end_datetime: end
    });
  };

  onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.next();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData
      });

      schedulerContent.scrollLeft = maxScrollLeft - 10;
    }
  };

  onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.prev();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData
      });

      schedulerContent.scrollLeft = 10;
    }
  };

  onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollTop");
  };

  onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollBottom");
  };

  eventItemTemplateResolver = (
    eventItemClick,
    schedulerData,
    event,
    bgColor,
    isStart,
    isEnd,
    mustAddCssClass,
    mustBeHeight,
    agendaMaxEventWidth
  ) => {
    let backgroundColor = bgColor;
    let titleText = schedulerData.behaviors.getEventTextFunc(
      schedulerData,
      event
    );
    titleText = titleText[0].toUpperCase() + titleText.slice(1);
    var start = moment(event.start);
    var end = moment(event.end);
    let divStyle = {
      borderRadius: "2px",
      backgroundColor: backgroundColor,
      height: mustBeHeight
    };
    if (!!agendaMaxEventWidth)
      divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth, margin: "5px" };

    return (
      <>
        <DashboardEvent
          eventItemClick={eventItemClick}
          schedulerData={schedulerData}
          event={event}
          bgColor={bgColor}
          isStart={isStart}
          isEnd={isEnd}
          mustAddCssClass={mustAddCssClass}
          agendaMaxEventWidth={agendaMaxEventWidth}
          titleText={titleText}
          start={start}
          end={end}
          divStyle={divStyle}
          scheduler={this.schedulerData}
          hideOverPopup={this.hideOverPopup}
          workspaceId={this.props.workspaceId}
          handleTaskBottomPopup={this.props.handleTaskBottomPopup}
          onGoingTask={this.props.onGoingTask}
          eventItemPopoverTemplateResolver={
            this.eventItemPopoverTemplateResolver
          }
          userId={this.props.state.userId}
          taskEventResumeConfirm={this.props.taskEventResumeConfirm}
          handleTaskTracking={this.props.handleTaskTracking}
          state={this.props.state}
          handleTaskStartTop={this.props.handleTaskStartTop}
        />
      </>
    );
  };

  viewTypeButtons = (config, viewFunction) => {
    const type = this.schedulerData.viewType;
    return (
      <div className="viewtype-btns d-inline-block">
        {config.views.map(function(item) {
          var value =
            "" +
            item.viewType +
            (item.showAgenda ? 1 : 0) +
            (item.isEventPerspective ? 1 : 0);
          return (
            <div
              className={`d-inline-block ${
                type === item.viewType ? "active" : ""
              }`}
              key={
                "" +
                item.viewType +
                (item.showAgenda ? 1 : 0) +
                (item.isEventPerspective ? 1 : 0)
              }
              onClick={e => viewFunction(value)}
            >
              {item.viewName}
            </div>
          );
        })}
      </div>
    );
  };

  customeDatePicker = () => {
    var viewType = this.schedulerData.viewType;
    return (
      <div
        className={`dashboard-calender ${
          viewType == "1" ? "week-format-width" : "day-format-width"
        }`}
      >
        <DailyPloyDatePicker
          onSelectDate={this.onSelectDate}
          pickerType={viewType}
          schedulerData={this.schedulerData}
          prev={true}
          next={true}
        />
      </div>
    );
  };

  getTimeDifference = (start, end) => {
    let totalSeconds = end.diff(start, "seconds");
    totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor((totalSeconds % 3600) / 60);
    var s = Math.floor((totalSeconds % 3600) % 60);
    return h + "h" + ":" + m + "m";
  };

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData
    });
  };
}
export default withDragDropContext(Calendar);
