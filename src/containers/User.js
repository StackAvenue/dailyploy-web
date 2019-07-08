import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import "../assets/css/styles.css";
import { logout } from "../utils/API"
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/dashboard.css"


class User extends Component{
  
    logout = async () => {
        await logout();
        alert("User logged out");
        this.props.history.push("/");
      };
    
      render() {
        
        return (
          <>
            

            {/* <div className="row no-margin">
              <div className="col-3 no-padding sidebar-container">
                <div className="col-12 d-inline-block sidebar-tabs">Dashboard</div>
                <div className="col-12 d-inline-block sidebar-tabs">Profile</div>
                <div className="col-12 d-inline-block sidebar-tabs">Home</div>
                <div className="col-12 d-inline-block sidebar-tabs">Policies</div>
              </div>
              <div className="col-9"></div>
            </div> */}

            <div class="sidenav">
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#clients">Clients</a>
              <a href="#contact">Contact</a>
            </div>

            <div class="main">
              <Header logout={this.logout} />
              <h2>Sidebar</h2>
            </div>

            <Footer />
          </>
        );
      }
}


export default withRouter(User);
