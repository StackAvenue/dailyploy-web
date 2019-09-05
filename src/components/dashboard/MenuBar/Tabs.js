import React from "react";
import { Link } from "react-router-dom";

const Tabs = props => {
  let classNameRoute;
  let routeName = props.classNameRoute();
  if (routeName === "dashboardTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 active">
          <Link to={`/dashboard/${props.workspaceId}`}>Home</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/analysis/${props.workspaceId}`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/projects/${props.workspaceId}`}>Projects</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/members/${props.workspaceId}`}>Members</Link>
        </div>
      </>
    );
  } else if (routeName === "analysisTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <Link to={`/dashboard/${props.workspaceId}`}>Home</Link>
        </div>
        <div className="col-md-1 active">
          <Link to={`/analysis/${props.workspaceId}`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/projects/${props.workspaceId}`}>Projects</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/members/${props.workspaceId}`}>Members</Link>
        </div>
      </>
    );
  } else if (routeName === "projectsTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <Link to={`/dashboard/${props.workspaceId}`}>Home</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/analysis/${props.workspaceId}`}>Analysis</Link>
        </div>
        <div className="col-md-1 active">
          <Link to={`/projects/${props.workspaceId}`}>Projects</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/members/${props.workspaceId}`}>Members</Link>
        </div>
      </>
    );
  } else if (routeName === "membersTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <Link to={`/dashboard/${props.workspaceId}`}>Home</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/analysis/${props.workspaceId}`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/projects/${props.workspaceId}`}>Projects</Link>
        </div>
        <div className="col-md-1 active">
          <Link to={`/members/${props.workspaceId}`}>Members</Link>
        </div>
      </>
    );
  } else {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <Link to={`/dashboard/${props.workspaceId}`}>Home</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/analysis/${props.workspaceId}`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/projects/${props.workspaceId}`}>Projects</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/members/${props.workspaceId}`}>Members</Link>
        </div>
      </>
    );
  }
  return classNameRoute;
};

export default Tabs;
