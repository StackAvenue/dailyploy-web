import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../assets/css/styles.css";
import { logout } from "../utils/API";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/dashboard.css";
import MenuBar from "../components/MenuBar";
import Calendar from "../components/Calendar";

class User extends Component {
  logout = async () => {
    await logout();
    // alert("User logged out");
    this.props.history.push("/login");
  };

  render() {
    return (
      <>
        <Header logout={this.logout} />
        <MenuBar />
        <Calendar />

        {/* <Footer />  */}
      </>
    );
  }
}

export default withRouter(User);
