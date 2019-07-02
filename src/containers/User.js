import React,{ Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "../assets/css/styles.css";
// import axios from "axios"


class User extends Component{
    constructor(props){
        super(props);

    }

    logout = async () => {
        await localStorage.removeItem("token");
        await localStorage.removeItem("name");
        alert("User logged out");
        this.props.history.push("/");
      };
    
      render() {
        
        return (
          <>
            <h1>Dashboard</h1>
            <br />
            <br />
            <button onClick={this.logout} className="btn btn-primary">
              Logout
            </button>
          </>
        );
      }
}


export default withRouter(User);
