import React from "react";

const GridBlock = props => {
  return (
    <div className="col-md-2 grid-div">
      <div className="col-md-12 id">1</div>
      <div className="col-md-12 name">Project Name</div>
      <div className="col-md-12 no-padding">
        <div className="col-md-2 d-inline-block no-padding">
          <div className="user-block">AJ</div>
        </div>
        <div className="col-md-8 d-inline-block no-padding">
          <div className="user-block">AJ</div>
        </div>
        <div className="col-md-2 d-inline-block no-padding">
          <div className="grid-color"></div>
        </div>
      </div>
      <div className="col-md-12 no-padding">
        <div className="col-md-8 d-inline-block date">
          25 Jul 2019 - Undefined
        </div>
        <div className="col-md-4 d-inline-block duration">10 Months</div>
      </div>
    </div>
  );
};

export default GridBlock;
