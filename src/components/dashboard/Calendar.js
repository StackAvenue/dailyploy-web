import React, { Component } from "react";
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader
} from "react-calendar-timeline";
import containerResizeDetector from "react-calendar-timeline/lib/resize-detector/container";
import "react-calendar-timeline/lib/Timeline.css";
import moment from "moment";
import generateFakeData from "../generate-fake-data";
import "../../assets/css/dashboard.scss";

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
      .startOf("day")
      .toDate();
    const defaultTimeEnd = moment()
      .endOf("day")
      .add(1, "day")
      .toDate();
    const visibleTimeStart = moment()
      .startOf("day")
      .toDate();
    const visibleTimeEnd = moment()
      .endOf("day")
      .toDate();

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      visibleTimeStart,
      visibleTimeEnd
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
          visibleTimeStart: moment()
            .startOf(select)
            .toDate(),
          visibleTimeEnd: moment()
            .endOf(select)
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

  render() {
    const {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      visibleTimeStart,
      visibleTimeEnd
    } = this.state;

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
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
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
