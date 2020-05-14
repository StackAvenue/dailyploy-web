import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Dailyployloader2 from "../../assets/images/Dailyploy loader 2.mp4"
import "../../assets/css/loading.scss"
class VideoLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };
  }
  render() {
    return(
    <div className="loading2">
         <video autoplay="true" height="300" width="300" muted loop id="video" preload="metadata">
    <source src={Dailyployloader2} type="video/mp4"/>
  </video>
  </div>
  
  );
  }

}
export default withRouter(VideoLoader);