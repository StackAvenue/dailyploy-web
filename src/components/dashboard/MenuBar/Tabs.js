import React from "react";
import { Link } from "react-router-dom";
import EditMemberModal from "../Member/EditMemberModal";
import PropTypes from 'prop-types';
import { propTypes } from "react-bootstrap/esm/Image";
import ErrorBoundary from '../../../ErrorBoundary';

const Tabs = (props) => {
  let classNameRoute;
  let routeName = props.classNameRoute();
  if (routeName === "dashboardTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 active">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>     
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis2">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
            Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else if (routeName === "projectsTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 active">
        <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
        </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis2">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
            Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>Task</Link>
        </div> */}
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else if (routeName === "membersTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
        <ErrorBoundary>
          <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
        </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>\
          </ErrorBoundary>
        </div>
        <div className="col-md-1 active">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis2">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
              Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>Task</Link>
        </div> */}
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else if (routeName === "reportsTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 active">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>       
        </div>
        <div className="col-md-1 analysis2">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
              Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>Task</Link>
        </div> */}
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else if (routeName === "TaskProjectListTrue") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
            </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 active">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
              Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 active">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else if (routeName === "isMilestone") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis2">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
              Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 active">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 active">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else if (routeName === "isAllocation") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
              Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 active">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 active">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else if (routeName === "isAnalysis") {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
              Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
                Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 active">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 active">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  } else {
    classNameRoute = (
      <>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/dashboard`}>Home</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/reports`}>Reports</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/projects`}>Projects</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/members`}>Members</Link>
          </ErrorBoundary>
        </div>
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>
            Roadmaps
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/milestone`}>
              Milestone
              </Link>
            </ErrorBoundary>
          </div>}
        <div className="col-md-1 analysis">
          <ErrorBoundary>
            <Link to={`/workspace/${props.workspaceId}/allocation`}>
            Allocation
            </Link>
          </ErrorBoundary>
        </div>
        {props.userRole && props.userRole == "admin" &&
          <div className="col-md-1 analysis">
            <ErrorBoundary>
              <Link to={`/workspace/${props.workspaceId}/analysis`}>
                Analysis
              </Link>
            </ErrorBoundary>
          </div>
        }
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/TaskProjectList`}>Task</Link>
        </div> */}
        {/* <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/analysis`}>Analysis</Link>
        </div>
        <div className="col-md-1 analysis">
          <Link to={`/workspace/${props.workspaceId}/task_list`}>
            Task List
          </Link>
        </div> */}
      </>
    );
  }
  return classNameRoute;
};

Tabs.propTypes = {
  classNameRoute: PropTypes.func.isRequired,
  workspaceId: PropTypes.string
}


export default Tabs;
