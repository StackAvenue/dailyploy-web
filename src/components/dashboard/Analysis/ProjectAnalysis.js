import React from "react";

const ProjectAnalysis = props => {
  return (
    <>
      <div className="col-md-12 no-padding head-box">
        <div className="head-main">
          <div className="head-div">
            <div className="hours">
              <span className="active">230</span>
              <span className="span">hrs</span>
            </div>
            <div className="text">Total Capacity</div>
          </div>
          <div className="head-div">
            <div className="hours">
              <span>149</span>
              <span className="span">hrs</span>
            </div>
            <div className="text">Scheduled</div>
          </div>
          <div className="head-div">
            <div className="hours">
              <span>81</span>
              <span className="span">hrs</span>
            </div>
            <div className="text">Unscheduled</div>
          </div>
          <div className="head-div">
            <div className="hours">
              <span>04</span>
              <span className="span">hrs</span>
            </div>
            <div className="text">Overtime</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectAnalysis;
