import React, { Component } from "react";
import "../assets/css/dashboard.css";

class Header extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light header-bgcolor">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo03"
          aria-controls="navbarTogglerDemo03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <a className="navbar-brand header-logo-box" href="#">
          DAILYPLOY
        </a>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
          <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link font-weight-bold">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link">Analysis</a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a className="nav-link">
                <i class="fas fa-bell" />
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link">Help</a>
            </li>
            <li className="nav-item">
              <button
                onClick={this.props.logout}
                className="btn header-auth-btn"
              >
                AP
              </button>
              &nbsp;&nbsp;&nbsp;
              <i class="fas fa-angle-down" />
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
