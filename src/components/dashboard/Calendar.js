import React, { Component } from "react";
import "antd/lib/style/index.less";
import Scheduler, { SchedulerData, ViewTypes } from "react-big-scheduler";
import withDragDropContext from "./withDnDContext";
import { post } from "../../utils/API";
import "../../assets/css/dashboard.scss";
import AddTaskModal from "../../components/dashboard/AddTaskModal";
import moment from "moment";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.schedulerData = new SchedulerData(
      Date.now(),
      ViewTypes.Week,
      false,
      false,
      {
        schedulerWidth: '96%',
        besidesWidth: 20,
        schedulerMaxHeight: 0,
        tableHeaderHeight: 34,

        agendaResourceTableWidth: 160,
        agendaMaxEventWidth: 100,

        dayResourceTableWidth: 218,
        weekResourceTableWidth: '16%',
        monthResourceTableWidth: 218,
        customResourceTableWidth: 160,

        dayCellWidth: 30,
        weekCellWidth: '12%',
        monthCellWidth: 80,
        customCellWidth: 80,

        dayMaxEvents: 99,
        weekMaxEvents: 99,
        monthMaxEvents: 99,
        customMaxEvents: 99,

        eventItemHeight: 45,
        eventItemLineHeight: this.calculateResouceHeight(),
        nonAgendaSlotMinHeight: 0,
        dayStartFrom: 0,
        dayStopTo: 23,
        defaultEventBgColor: '#80C5F6',
        selectedAreaColor: '#7EC2F3',
        nonWorkingTimeHeadColor: "#5c5c5c",
        nonWorkingTimeHeadBgColor: "#fff",
        nonWorkingTimeBodyBgColor: "#e5e5e54f",
        summaryColor: '#666',
        groupOnlySlotColor: '#F8F8F8',

        startResizable: true,
        endResizable: true,
        movable: true,
        creatable: true,
        crossResourceMove: true,
        checkConflict: false,
        scrollToSpecialMomentEnabled: true,
        eventItemPopoverEnabled: true,
        calendarPopoverEnabled: true,
        recurringEventsEnabled: true,
        headerEnabled: true,
        displayWeekend: true,
        relativeMove: true,
        defaultExpanded: true,

        resourceName: '',
        taskName: 'Task Name',
        agendaViewHeader: 'Agenda',
        nonAgendaDayCellHeaderFormat: 'ha',
        nonAgendaOtherCellHeaderFormat: "D ddd",
        eventItemPopoverDateFormat: 'MMM D',
        minuteStep: 30,
        calenderViewType: "dropdown",

        views: [
          { viewName: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false },
          { viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false },
          { viewName: 'Month', viewType: ViewTypes.Month, showAgenda: false, isEventPerspective: false },
        ],
      },
    );

    this.state = {
      viewModel: this.schedulerData,
      resources: [],
      events: [],
      eventsForCustomStyle: [],
      eventsForTaskView: [],
      show: false,
      setShow: false,
    };
  }

  calculateResouceHeight = () => {
    let resourcesLength = this.props.resources.length
    let sceenHeight = window.screen.height;
    let finalSceenHeight = sceenHeight - (((sceenHeight / 10) * 30) / 10)
    let heights = new Map()
    heights.set(0, finalSceenHeight)
    heights.set(1, finalSceenHeight)
    heights.set(2, finalSceenHeight / 2)
    heights.set(3, finalSceenHeight / 3)
    heights.set(4, finalSceenHeight / 4)
    heights.set(5, finalSceenHeight / 5)
    heights.set(6, finalSceenHeight / 6)
    let height = heights.get(resourcesLength)
    if (height === undefined) {
      return 50
    }
    return height
  }

  async componentDidMount() {
    this.renderData();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.events !== this.props.events ||
      prevProps.resources !== this.props.resources
    ) {
      this.renderData()
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
    style,
  ) => {
    let datetime = schedulerData.localeMoment(item.time);
    let isCurrentDate = false;

    if (schedulerData.viewType === ViewTypes.Day) {
      isCurrentDate = datetime.isSame(new Date(), "hour");
    } else {
      isCurrentDate = datetime.isSame(new Date(), "day");
    }

    if (isCurrentDate) {
      style.borderTop = "4px solid #33a1ff"
    }

    return (
      <th key={item.time} className={`header3-text`} style={style}>
        {formattedDateItems.map((formattedItem, index) => (
          <div
            key={index}
            dangerouslySetInnerHTML={{
              __html: formattedItem.replace(/[0-9]/g, "<b>$&</b>"),
            }}
          />
        ))}
      </th>
    );
  };

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
        <div>
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
            eventItemPopoverTemplateResolver={this.eventItemPopoverTemplateResolver}
          />
        </div>
      </div>
    );
  }
  eventItemPopoverTemplateResolver = (schedulerData, eventItem, title, start, end, statusColor) => {
    let totalSeconds = end.diff(start, 'seconds')
    totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor(totalSeconds % 3600 / 60);
    var s = Math.floor(totalSeconds % 3600 % 60);

    var timeDiff = ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + "h";
    return (
      <div className="event-task-hover">
        <div className="title">
          <span className="" title={title}>{title}</span>
        </div>
        <div className="project">
          <div className="status-dot d-inline-block" style={{ backgroundColor: `${eventItem.bgColor}` }}></div>
          <div className="d-inline-block">{eventItem.projectName}</div>
        </div>
        <div className="time">
          <div className="d-inline-block">{start.format('HH:mm')}-{end.format('HH:mm')}</div>
          <div className="d-inline-block pull-right">{timeDiff}</div>
        </div>
      </div>
    );
  }

  prevClick = schedulerData => {
    schedulerData.prev();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData,
    });
    this.props.updateTaskDateView(schedulerData.viewType, schedulerData.startDate)
  };

  nextClick = schedulerData => {
    schedulerData.next();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData,
    });
    this.props.updateTaskDateView(schedulerData.viewType, schedulerData.startDate)
  };

  onViewChange = (schedulerData, view) => {
    var newSchedulerData = new SchedulerData(schedulerData)
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective,
    );
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData,
    });
    this.props.updateTaskDateView(schedulerData.viewType, schedulerData.startDate)
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData,
    });
    this.props.taskDate(date);
  };

  eventClicked = (schedulerData, event) => {
    alert(
      `You just clicked an event: {id: ${event.id}, title: ${event.title}}`,
    );
  };

  ops1 = (schedulerData, event) => {
    alert(
      `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`,
    );
  };

  ops2 = (schedulerData, event) => {
    alert(
      `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`,
    );
  };

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    this.props.setAddTaskDetails(slotId, start, end)
  };

  updateEventStart = (schedulerData, event, newStart) => {
    if (
      window.confirm(
        `Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`,
      )
    ) {
      schedulerData.updateEventStart(event, newStart);
    }
    this.setState({
      viewModel: schedulerData,
    });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    if (
      window.confirm(
        `Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`,
      )
    ) {
      schedulerData.updateEventEnd(event, newEnd);
    }
    this.setState({
      viewModel: schedulerData,
    });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    console.log(schedulerData, event, slotId, slotName, start, end);
    schedulerData.moveEvent(event, slotId, slotName, start, end);
    this.setState({
      viewModel: schedulerData,
    });
  };

  onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.next();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData,
      });

      schedulerContent.scrollLeft = maxScrollLeft - 10;
    }
  };

  onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.prev();
      schedulerData.setEvents(this.state.events);
      this.setState({
        viewModel: schedulerData,
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
    schedulerData,
    event,
    bgColor,
    isStart,
    isEnd,
    mustAddCssClass,
    mustBeHeight,
    agendaMaxEventWidth,
  ) => {
    let backgroundColor = bgColor;
    let titleText = schedulerData.behaviors.getEventTextFunc(
      schedulerData,
      event,
    );
    titleText = titleText[0].toUpperCase() + titleText.slice(1)
    var start = moment(event.start).format("HH:mm");
    var end = moment(event.end).format("HH:mm");
    let divStyle = {
      borderRadius: "2px",
      backgroundColor: backgroundColor,
      height: mustBeHeight,
    };
    if (!!agendaMaxEventWidth)
      divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth, margin: "5px" };

    if (schedulerData.viewType === 0) {
      return (
        <div key={event.id} className={mustAddCssClass} style={divStyle} >
          <div className="row item">
            <div className="col-md-12 item-heading text-wraper rk" style={{ padding: "7px 7px 0px 7px" }}>{titleText}</div>
            <div className="col-md-12 no-padding">
              <div className="col-md-6 no-padding d-inline-block item-time pull-right text-right">
                {this.getTimeDifference(moment(event.start), moment(event.end))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (schedulerData.viewType === 1) {
      return (
        <div key={event.id} className={mustAddCssClass} style={divStyle}>
          <div className="row item">
            <div className="col-md-12 item-heading text-wraper" style={{ padding: "5px 5px 0px 5px" }}>{titleText}</div>
            <div className="col-md-12 no-padding">
              <div className="col-md-6 no-padding d-inline-block item-time">
                {`${start} - ${end}`}
              </div>
              <div className="col-md-6 no-padding d-inline-block item-time text-right">
                {this.getTimeDifference(moment(event.start), moment(event.end))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (schedulerData.viewType === 2) {
      return (
        <div key={event.id} className={mustAddCssClass} style={divStyle}>
          <div className="row item">
            <div className="col-md-12 item-heading text-wraper" style={{ padding: "5px 5px 0px 5px" }}>{titleText}</div>
          </div>
        </div>
      );
    }
  };

  getTimeDifference = (start, end) => {
    let totalSeconds = end.diff(start, 'seconds')
    totalSeconds = Number(totalSeconds);
    var h = Math.floor(totalSeconds / 3600);
    var m = Math.floor(totalSeconds % 3600 / 60);
    var s = Math.floor(totalSeconds % 3600 % 60);
    return h + "h" + ":" + m + "m";
  }

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData,
    });
  };
}
export default withDragDropContext(Calendar);
