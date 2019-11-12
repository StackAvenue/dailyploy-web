import React from "react";
import { Dropdown, select } from "react-bootstrap";
import Add from "../../../assets/images/add.svg";

const ConditionalElements = props => {
  let classNameRoute;
  let routeName = props.classNameRoute();
  if (routeName === "dashboardTrue") {
    classNameRoute = (
      <>
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
