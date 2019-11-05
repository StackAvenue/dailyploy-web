import React, { Component } from "react";

class DailyPloyToast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "#00baff"
    };
  }

  componentDidMount = () => {
    var color = ""
    if (this.props.status === "success") {
      color = "#008135"
    } else if (this.props.status === "error") {
      color = "#ea4672"
    } else {
      color = "#00baff"
    }

    this.setState({ color: color })
  }

  render() {
    return (
      <>
        <div>
          <div className="d-inline-block dailyploy-toast" style={{ backgroundColor: `${this.state.color}` }}></div>
          <div className="d-inline-block dailyploy-toast-message" >{this.props.message}</div>
        </div>
      </>
    )
  }
}
export default DailyPloyToast;


// import React from 'react';

// export const DailyPloyToast = (props) => {
//   return (
//     <>
//       <div>
//         <div className="d-inline-block" style={{ width: "6px", verticalAlign: "middle", height: "40px", backgroundColor: `${props.background}` }}></div>
//         <div className="d-inline-block">{props.message}</div>
//       </div>
//     </>
//   )
// };

// export default DailyPloyToast;