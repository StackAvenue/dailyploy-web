import React, { Component } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader
} from "react-calendar-timeline";
import { Modal, Button } from "react-bootstrap";
import containerResizeDetector from "react-calendar-timeline/lib/resize-detector/container";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import generateFakeData from "../generate-fake-data";
import "../../assets/css/dashboard.scss";
import Add from "../../assets/images/add.svg";

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title"
};

export default class Calendar extends Component {
  constructor(props) {
    super(props);

    const { groups, items } = generateFakeData();
    const defaultTimeStart = moment()
      .startOf("month")
      .toDate();
    const defaultTimeEnd = moment()
      .startOf("month")
      .add(1, "month")
      .toDate();

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      show: false,
      setShow: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("nextProps", nextProps);
    console.log("thisprops", this.props);
    console.log("nextState", nextState);
    let select = nextProps.sortUnit;
    if (nextProps === this.props) {
      return false;
    } else {
      this.setState(
        {
          defaultTimeStart: moment()
            .startOf(select)
            .toDate(),
          defaultTimeEnd: moment()
            .startOf(select)
            .add(1, select)
            .toDate()
        },
        console.log(select)
      );
      return true;
    }
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;

    const group = groups[newGroupOrder];

    this.setState({
      items: items.map(item =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id
            })
          : item
      )
    });

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map(item =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time
            })
          : item
      )
    });

    console.log("Resized", itemId, time, edge);
  };

  handleItemSelect = (itemId, e, time) => {
    console.log("Select", itemId, e, time);
  };

  someCustomHandler = () => {
    console.log("someCustomHandler");
  };

  itemRenderer = ({
    item,
    timelineContext,
    itemContext,
    getItemProps,
    getResizeProps
  }) => {
    // console.log("itemContext", itemContext);
    // console.log("timelineContext", timelineContext);
    itemContext.dimensions.height = "45px";
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = itemContext.selected
      ? itemContext.dragging
        ? "red"
        : item.selectedBgColor
      : item.bgColor;
    const borderColor = itemContext.resizing ? "red" : item.color;
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: "solid",
            borderWidth: 1,
            borderRadius: 2,
            borderLeftWidth: 1,
            borderRightWidth: 1
          },
          onMouseDown: () => {
            console.log("on item click", item);
          }
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {itemContext.title}
        </div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  };

  handleClose = () => {
    this.setState({
      show: false
    });
  };
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };

  render() {
    const {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      show
    } = this.state;

    console.log("after update the component", defaultTimeStart);

    return (
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        fullUpdate
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        canMove={true}
        canResize={"both"}
        itemsSorted
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        onItemMove={this.handleItemMove}
        onItemResize={this.handleItemResize}
        onItemSelect={this.handleItemSelect}
        sidebarWidth={260}
        itemRenderer={this.itemRenderer}
        resizeDetector={containerResizeDetector}
      >
        <TimelineHeaders className="calender-timelineheader">
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <>
                  <div className="sidebarHeader" {...getRootProps()}>
                    {/* <Button
                      variant="primary"
                      className="btn btn-primary"
                      onClick={this.handleShow}
                    >
                      <img src={Add} alt="add" />
                      &nbsp;Add
                    </Button>
                    <Modal show={show} onHide={this.handleClose}>
                      <div className="row no-margin calender-modal">
                        <div className="col-md-12 header">
                          <span>Add project</span>
                          <button
                            className="btn btn-link float-right"
                            onClick={this.handleClose}
                          >
                            <i class="fas fa-times" />
                          </button>
                        </div>
                        <div className="col-md-12">
                          <div className="col-md-12 no-padding">
                            <div className="col-md-8 no-padding">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Project Name"
                              />
                            </div>
                          </div>
                          <div className="col-md-12 no-padding">
                            <div className="col-md-8 no-padding">
                              <textarea
                                type="text"
                                className="form-control"
                                placeholder="Project Description"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal> */}
                    <button type="button" className="btn btn-link">
                      People
                      <i class="fas fa-sort-down" />
                    </button>
                  </div>
                </>
              );
            }}
          </SidebarHeader>
          <DateHeader unit="primaryHeader" className="calender-dateheader" />
          <DateHeader className="calender-dateheader" />
        </TimelineHeaders>
      </Timeline>
    );
  }
}

// const TimelineUpdate
