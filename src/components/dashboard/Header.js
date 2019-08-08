import React, { Component } from "react";
import "../../assets/css/dashboard.css";
import { Dropdown } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import "../../assets/css/dashboard.scss";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaces: []
    };
  }

  render() {
    return (
      <>
        <div className="container-fluid dashbaord-header-bg no-padding">
          <div className="dashboard-container dashboard-header-container">
            <nav className="navbar navbar-expand-lg navbar-light">
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
              <a className="navbar-brand logo" href="#">
                <img src={logo} alt="Logo" className="img-responsive image" />
              </a>

              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo03"
              >
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                  <li className="nav-item active notification">
                    <a className="nav-link">
                      <i class="fas fa-bell" />
                    </a>
                  </li>
                  <Dropdown>
                    <Dropdown.Toggle
                      className="header-auth-btn"
                      id="dropdown-basic"
                    >
                      AP
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="header-dropdown">
                      <Dropdown.Item>
                        <i className="fa fa-wrench" aria-hidden="true" />
                        <span className="header-dropdown-space" />
                        Settings
                      </Dropdown.Item>
                      <Dropdown.Item onClick={this.props.logout}>
                        <i className="fa fa-sign-out" aria-hidden="true" />
                        <span className="header-dropdown-space" />
                        Logout
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <i className="fa fa-desktop" aria-hidden="true" />
                        <span className="header-dropdown-space" />
                        WorkSpaces
                      </Dropdown.Item>
                      {this.props.workspaces.map((workspace, index) => {
                        return (
                          <Dropdown.Item
                            key={index}
                            href={`/dashboard/${workspace.id}`}
                          >
                            <span className="workspace-text">
                              {workspace.name}
                            </span>
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </>
    );
  }
}

export default Header;
