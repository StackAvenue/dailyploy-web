import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "../../assets/css/TaskProjectList.scss";
import { debounce } from "../../utils/function";
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      showbutton: false,
    };
  }

  handleData = debounce(() => {
    if (this.props.id) {
      localStorage.setItem('selProject', this.props.id);
      this.props.handleOpenTaskData(this.props.id);
      this.setState({ showbutton: true });
    }
  }, 250);

  render() {
    return (
      <div
        key={this.props.id}
        className="projectListTopCard"
        style={{ border: `solid 2px` + `${this.props.bgcolor}` }}
      >
        <div className="projectListInCard"
          onClick={this.handleData}
        >
          <div className="textCard">{this.props.name}</div>
          <div className="buttonCard">
            {/* <button className="buttonCardIcon " style={{border:`solid 5px`+`${props.bg
              color}`}}> */}
            {!this.props.showbutton ? (
              <Button
                variant="primary"
                className=" btn btn-primary buttonCardIcon"
                onClick={this.handleData}
              >
                {<i class="far fa-square square-box"></i>}
              </Button>
            ) : (
                <button className="buttonCardIcon2 ">
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
