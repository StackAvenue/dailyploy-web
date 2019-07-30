import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { logout } from "../utils/API";
import Header from "../components/dashboard/Header";
import Footer from "../components/Footer";
import "../assets/css/dashboard.scss";
import MenuBar from "../components/dashboard/MenuBar";
import Calendar from "../components/dashboard/Calendar";
import cookie from "react-cookies";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: "week"
    };
  }
  componentDidMount() {
    const token = cookie.load("authToken");
    if (token !== "undefined") {
      return this.props.history.push("/dashboard");
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

export default withRouter(Dashboard);
