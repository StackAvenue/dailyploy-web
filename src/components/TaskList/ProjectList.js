import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, logout, put, del } from "../../utils/API";
import MenuBar from "../dashboard/MenuBar";
import { Button } from "react-bootstrap";
import "../../assets/css/TaskProjectList.scss";
import checkbox from "../../assets/images/checkbox.svg";
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      showbutton: false,
    };
  }

  handleData = (id) => {
    if (!this.state.showbutton && this.props.id) {
      this.props.handleOpenTaskData(this.props.id);
      this.setState({ id: this.props.id, showbutton: true });
    } else {
      this.props.handleOpenTaskData(0);
      this.setState({ id: 0, showbutton: false });
    }
  };

  render() {
    return (
      <div
        key={this.props.id}
        className="projectListTopCard"
        style={{ border: `solid 2px` + `${this.props.bgcolor}` }}
      >
        <div className="projectListInCard">
          <div className="textCard">{this.props.name}</div>
          <div className="buttonCard">
            {/* <button className="buttonCardIcon " style={{border:`solid 5px`+`${props.bg
              color}`}}> */}
            {!this.props.showbutton ? (
              <Button
                variant="primary"
                className=" btn btn-primary buttonCardIcon "
                disabled={this.props.disabled}
                onClick={this.handleData}
              >
                {/* <i class="fa fa-plus" /> */}
                {/* <img className="checkbox-img" src={checkbox}></img> */}
                {this.props.disabled ? <i class="far fa-square square-box"></i> : <i class="far fa-square square-box"></i>}
                {/* <i class="far fa-check-square checkbox-icon"></i> */}
              </Button>
            ) : (
                <button className="buttonCardIcon2 " onClick={this.handleData}>
                  {/* <i class="fa fa-check"></i> */}
                  {/* <img src={checkbox}></img> */}
                  <i class="far fa-check-square checkbox-icon"></i>
                </button>
              )}
          </div>
        </div>
      </div>
    );
  }
}
export default ProjectList;
