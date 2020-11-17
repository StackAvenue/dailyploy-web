import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Dailyployloader2 from "../../assets/images/loader.gif"
import "../../assets/css/loading.scss";
import { Modal } from "react-bootstrap";
import Loader from 'react-loader-spinner'

class VideoLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    return (
      <div className="loading2">
        {/* <img src={Dailyployloader2} /> */}
        <Loader
          type="Puff"
          color="rgb(82 180 89)"
          height={65}
          width={65}
          style = {{marginLeft: "19%"}}
          />

      </div>

    );
  }

}
export default withRouter(VideoLoader);