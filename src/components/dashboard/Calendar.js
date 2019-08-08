import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { get, mockGet } from "../../utils/API";
import "antd/lib/style/index.less";
import Scheduler, {
  SchedulerData,
  ViewTypes,
  DATE_FORMAT
} from "react-big-scheduler";
import withDragDropContext from "./withDnDContext";
import "../../assets/css/dashboard.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.schedulerData = new SchedulerData(
      Date.now(),
      ViewTypes.Week,
      false,
      false,
      {
        resourceName: "",
        nonAgendaOtherCellHeaderFormat: "D ddd",
        dayResourceTableWidth: "218px",
        weekResourceTableWidth: "16%",
        monthResourceTableWidth: "218px",
        dayCellWidth: "3%",
        weekCellWidth: "12%",
        monthCellWidth: "8%",
        eventItemHeight: 45,
        eventItemLineHeight: 50,
        nonWorkingTimeHeadColor: "#5c5c5c",
        nonWorkingTimeHeadBgColor: "#fff",
        nonWorkingTimeBodyBgColor: "#e5e5e54f",
        tableHeaderHeight: 35,
        views: [
          {
            viewName: "Day",
            viewType: ViewTypes.Day,
            showAgenda: false,
            isEventPerspective: false
          },
          {
            viewName: "Week",
            viewType: ViewTypes.Week,
            showAgenda: false,
            isEventPerspective: false
          },
          {
            viewName: "Month",
            viewType: ViewTypes.Month,
            showAgenda: false,
            isEventPerspective: false
          }
        ]
      }
    );

    this.state = {
      viewModel: this.schedulerData,
      resources: [],
      events: [],
      eventsForCustomStyle: [],
      eventsForTaskView: []
    };
  }

  async componentWillMount() {
    try {
      const { data } = await mockGet("calenderData");
      this.setState({
        resources: data[0].resources,
        events: data[0].events,
        eventsForCustomStyle: data[0].eventsForCustomStyle,
        eventsForTaskView: data[0].eventsForTaskView
      });
    } catch (e) {
      console.log("error", e);
    }
    this.schedulerData.setResources(this.state.resources);
    this.schedulerData.setEvents(this.state.events);
  }

  renderData = () => {
    this.schedulerData.setResources(this.state.resources);
    this.schedulerData.setEvents(this.state.events);
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
      style.backgroundColor = "#118dea";
      style.color = "white";
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

  render() {
    const { viewModel } = this.state;
    this.renderData();
    let leftCustomHeader = (
      <div className="leftheader">
        <span>Team</span>
      </div>
    );

    // console.log("schedular Data", this.schedulerData);
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
          />
        </div>
      </div>
    );
  }

  prevClick = schedulerData => {
    schedulerData.prev();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  nextClick = schedulerData => {
    schedulerData.next();
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    );
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(this.state.events);
    this.setState({
      viewModel: schedulerData
    });
  };

  eventClicked = (schedulerData, event) => {
    alert(
      `You just clicked an event: {id: ${event.id}, title: ${event.title}}`
    );
  };

  ops1 = (schedulerData, event) => {
    alert(
      `You just executed ops1 to event: {id: ${event.id}, title: ${
        event.title
      }}`
    );
  };

  ops2 = (schedulerData, event) => {
    alert(
      `You just executed ops2 to event: {id: ${event.id}, title: ${
        event.title
      }}`
    );
  };

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    if (
      window.confirm(
        `Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`
      )
    ) {
      let newFreshId = 0;
      schedulerData.events.forEach(item => {
        if (item.id >= newFreshId) newFreshId = item.id + 1;
      });

      let newEvent = {
        id: newFreshId,
        title: "New event you just created",
        start: start,
        end: end,
        resourceId: slotId,
        bgColor: "purple"
      };
      schedulerData.addEvent(newEvent);
      this.setState({
        viewModel: schedulerData
      });
    }
  };

  updateEventStart = (schedulerData, event, newStart) => {
    if (
      window.confirm(
        `Do you want to adjust the start of the event? {eventId: ${
          event.id
        }, eventTitle: ${event.title}, newStart: ${newStart}}`
      )
    ) {
      schedulerData.updateEventStart(event, newStart);
    }
    this.setState({
      viewModel: schedulerData
    });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    if (
      window.confirm(
        `Do you want to adjust the end of the event? {eventId: ${
          event.id
        }, eventTitle: ${event.title}, newEnd: ${newEnd}}`
      )
    ) {
      schedulerData.updateEventEnd(event, newEnd);
    }
    this.setState({
      viewModel: schedulerData
    });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    console.log(schedulerData, event, slotId, slotName, start, end);
    // if(confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
    schedulerData.moveEvent(event, slotId, slotName, start, end);
    this.setState({
      viewModel: schedulerData
    });
    // }
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
    schedulerData,
    event,
    bgColor,
    isStart,
    isEnd,
    mustAddCssClass,
    mustBeHeight,
    agendaMaxEventWidth
  ) => {
    let borderColor = "rgba(0,139,236,1)",
      backgroundColor = bgColor;
    let titleText = schedulerData.behaviors.getEventTextFunc(
      schedulerData,
      event
    );
    let start = event.start.split(" ")[1];
    let end = event.end.split(" ")[1];
    if (!!event.type) {
      borderColor =
        event.type == 1
          ? "rgba(0,139,236,1)"
          : event.type == 3
          ? "rgba(245,60,43,1)"
          : "#999";
      backgroundColor =
        event.type == 1 ? "#80C5F6" : event.type == 3 ? "#FA9E95" : "#D9D9D9";
    }
    let divStyle = {
      borderRadius: "2px",
      backgroundColor: backgroundColor,
      height: mustBeHeight
    };
    if (!!agendaMaxEventWidth)
      divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };

    return (
      <div key={event.id} className={mustAddCssClass} style={divStyle}>
        <div className="row item">
          <div className="col-md-12 item-heading no-padding">{titleText}</div>
          <div className="col-md-12 no-padding">
            <div className="col-md-6 no-padding d-inline-block item-time">
              {`${start} - ${end}`}
            </div>
            <div className="col-md-6 no-padding d-inline-block item-time text-right">
              3h
            </div>
          </div>
        </div>
      </div>
    );
  };

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData
    });
  };
}
export default withDragDropContext(App);
