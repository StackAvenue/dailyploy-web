import React from "react";

const ConditionalElements = props => {
  let classNameRoute;
  let routeName = props.classNameRoute();
  if (routeName === "dashboardTrue") {
    classNameRoute = <></>;
  } else if (routeName === "analysisTrue") {
    classNameRoute = <></>;
  } else if (routeName === "projectsTrue") {
    classNameRoute = <></>;
  } else if (routeName === "membersTrue") {
    classNameRoute = <></>;
  } else if (routeName === "TaskProjectListTrue") {
    classNameRoute = <></>;
  } else if (routeName === "isMilestone") {
    classNameRoute = <></>;
  } else if (routeName === "isAllocation") {
    classNameRoute = <></>;
  }
  else {
    classNameRoute = <></>;
  }
  return classNameRoute;
};

export default ConditionalElements;
