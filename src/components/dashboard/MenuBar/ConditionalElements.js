import React from "react";
import { Dropdown, select } from "react-bootstrap";
import Add from "../../../assets/images/add.svg";

const ConditionalElements = props => {
  let classNameRoute;
  let routeName = props.classNameRoute();
  if (routeName === "dashboardTrue") {
    classNameRoute = (
      <>
        <div className="menubar-taskview-btn d-inline-block">
          <select onChange={(e) => props.handleTaskView(e)}>
            <option value="0">Daily</option>
            <option selected value="1">Weekly</option>
            <option value="2">Monthly</option>
          </select>
        </div>
      </>
    );
  } else if (routeName === "analysisTrue") {
    classNameRoute = <></>;
  } else if (routeName === "projectsTrue") {
    classNameRoute = (
      <>
        <div className="col-md-2 d-inline-block">
          <button className="btn btn-primary menubar-button">Delete</button>
        </div>
      </>
    );
  } else if (routeName === "membersTrue") {
    classNameRoute = (
      <>
        <div className="col-md-2 d-inline-block">
          <button className="btn btn-primary menubar-button">Delete</button>
        </div>
      </>
    );
  } else {
    classNameRoute = <></>;
  }
  return classNameRoute;
};

export default ConditionalElements;
