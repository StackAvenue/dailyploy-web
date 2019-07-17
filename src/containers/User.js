import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../assets/css/styles.css";
import { logout } from "../utils/API";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/dashboard.css";
import MenuBar from "../components/MenuBar";
import Calendar from "../components/Calendar";
import cookie from "react-cookies";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: ""
    };
  }
  componentDidMount() {
    const token = cookie.load("authToken");
    if (token !== "undefined") {
      return this.props.history.push("/user");
    } else {
      return null;
    }
  }

  onSelectSort = value => {
    console.log("selected value ", value);
    this.setState({ sort: value });
  };

  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };

  render() {
    return (
      <>
        <Header logout={this.logout} />
        <MenuBar onSelectSort={this.onSelectSort} />
        <Calendar sortUnit={this.state.sort} />
        <div>
          <button className="btn menubar-task-btn">
            <i class="fas fa-plus" />
          </button>
        </div>

        {/* <Footer />  */}
      </>
    );
  }
}

export default withRouter(User);
