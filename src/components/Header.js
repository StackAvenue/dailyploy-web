import React, { Component } from "react";
import "../assets/css/dashboard.css";
import { Dropdown } from 'react-bootstrap';

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
            <Dropdown>
              <Dropdown.Toggle className="header-auth-btn" id="dropdown-basic">
                AP
              </Dropdown.Toggle>

              <Dropdown.Menu className="header-dropdown">
                <Dropdown.Item href="#/action-1"><i class="fa fa-wrench" aria-hidden="true"></i> &nbsp;&nbsp;&nbsp;Settings</Dropdown.Item>
                <Dropdown.Item onClick={this.props.logout}><i class="fa fa-sign-out" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
