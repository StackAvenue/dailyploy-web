import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Dailyployloader2 from "../../assets/images/GifLoader.gif"
import "../../assets/css/loading.scss";
import { Modal } from "react-bootstrap";
class VideoLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };
  }
  render() {
    return(
    <div className="loading2">
      <img src={Dailyployloader2}/>
        
  
  </div>
  
  );
  }

}
export default withRouter(VideoLoader);