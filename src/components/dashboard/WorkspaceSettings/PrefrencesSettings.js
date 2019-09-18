import React, { Component } from "react";

class PrefrencesSettings extends Component {
  render() {
    return (
      <>
        <div className="col-md-12 heading">Workspace Prefrences</div>
        <div className="col-md-12 box no-padding">
          <div className="col-md-12 inner-box">
            <div className="col-md-2 d-inline-block no-padding name">
              Time Zone
            </div>
            <div className="col-md-5 d-inline-block">
              <select className="form-control input">
                <option>(GMT+5:30) Kolkata</option>
                <option>(GMT+5:30) Kolkata</option>
                <option>(GMT+5:30) Kolkata</option>
              </select>
            </div>
          </div>

          <div className="col-md-12 box-btn">
            <button className="btn btn-default button">Save</button>
          </div>
        </div>
      </>
    );
  }
}

export default PrefrencesSettings;
