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
        this.props.history.push("/login");
      };
    
      render() {
        
        return (
          <>
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
