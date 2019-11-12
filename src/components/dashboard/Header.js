import React, { Component } from "react";
// import Search from 'react-search'
import Select from "react-select";
import "../../assets/css/dashboard.css";
import { Dropdown } from "react-bootstrap";
import ReactTags from "react-tag-autocomplete";
import logo from "../../assets/images/logo.png";
import setting from "../../assets/images/setting.png";
import invite from "../../assets/images/invite.png";
import "../../assets/css/dashboard.scss";
import { get } from "../../utils/API";
import userImg from "../../assets/images/profile.png";
import Member from "../../assets/images/member.png";
import Admin from "../../assets/images/admin.png";
import Search from "../../assets/images/search.png";
import SearchImg from "../../assets/images/search.png";

class Header extends Component {
  constructor(props) {
    super(props);
    this.clickClose = React.createRef();
    this.closeSettingModal = this.closeSettingModal.bind(this);
    this.state = {
      workspaces: [],
      userName: "",
      userEmail: "",
      userRole: "",
      userId: "",
      value: "",
      suggestions: [],
      selectedTags: [],
    };
  }

  async componentDidMount() {
    try {
      const { data } = await get("logged_in_user");
      this.setState({
        userId: data.id,
        userName: data.name,
        userEmail: data.email,
      });
    } catch (e) {
      console.log("err", e);
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedTags !== this.state.selectedTags) {
      this.props.handleSearchFilterResult(this.state.selectedTags);
    }

    if (this.props.workspaceId !== prevProps.workspaceId) {
      try {
        const { data } = await get(
          `workspaces/${this.props.workspaceId}/members/${this.state.userId}`,
        );
        this.setState({ userRole: data.role });
      } catch (e) {
        console.log("err", e);
      }
    }
  }

  closeSettingModal = () => {
    this.clickClose.current.click();
  };

  onSearchTextChange = e => {
    const value = e.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = this.props.searchOptions
        .sort()
        .filter(
          v => regex.test(v.value) && !this.state.selectedTags.includes(v),
        );
    }
    this.setState({ suggestions: suggestions, value: value });
  };

  selectSuggestion = option => {
    var newSelectedTags = new Array(...this.state.selectedTags);
    newSelectedTags.push(option);
    this.setState({
      selectedTags: newSelectedTags,
      suggestions: [],
      value: "",
    });
  };

  removeSelectedTag = index => {
    var selectedTags = this.state.selectedTags;
    selectedTags = selectedTags.filter((item, i) => i !== index);
    this.setState({ selectedTags: selectedTags });
  };

  renderSearchSuggestion = () => {
    return (
      <>
        {this.state.suggestions ? (
          <ul>
            {this.state.suggestions.map((option, idx) => {
              if (option.type == "member") {
                return (
                  <li key={idx} onClick={() => this.selectSuggestion(option)}>
                    <i className="fa fa-user"></i>
                    <span className="right-left-space-5">{option.value}</span>
                  </li>
                );
              } else {
                return (
                  <li key={idx} onClick={() => this.selectSuggestion(option)}>
                    <i className="fa fa-list-alt"></i>
                    <span className="right-left-space-5">{option.value}</span>
                  </li>
                );
              }
            })}
          </ul>
        ) : null}
      </>
    );
  };

  renderSelectedTags = () => {
    return (
      <>
        {this.state.selectedTags.map((option, index) => {
          if (option.type == "member") {
            return (
              <div className={`search-icon-${option.type}`} key={index}>
                <i className="fa fa-user right-left-space-5"></i>
                <span className="right-left-space-5">{option.value}</span>
                <a
                  className="remove-tag right-left-space-5"
                  onClick={() => this.removeSelectedTag(index)}>
                  <i className="fa fa-close"></i>
                </a>
              </div>
            );
          } else {
            return (
              <div className={`search-icon-${option.type}`} key={index}>
                <i className="fa fa-list-alt right-left-space-5"></i>
                <span className="right-left-space-5">{option.value}</span>
                <a
                  className="remove-tag right-left-space-5"
                  onClick={() => this.removeSelectedTag(index)}>
                  <i className="fa fa-close"></i>
                </a>
              </div>
            );
          }
        })}
      </>
    );
  };

  render() {
    const { value } = this.state;
    const x = this.state.userName
      .split(" ")
      .splice(0, 2)
      .map(x => x[0])
      .join("");
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
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <a
                className="navbar-brand logo"
                href={`/dashboard/${this.props.workspaceId}`}>
                <img src={logo} alt="Logo" className="img-responsive image" />
              </a>
              <div className="col-md-6 no-padding header-search-bar">
                <div className="col-md-11 no-padding d-inline-block">
                  <div className="user-project-search text-titlize">
                    <div className="selected-tags">
                      {this.renderSelectedTags()}
                    </div>
                    <input
                      type="text"
                      value={value}
                      placeholder="Search by people/projects"
                      onChange={this.onSearchTextChange}
                    />

                    <div className="suggestion-holder">
                      {this.renderSearchSuggestion()}
                    </div>
                  </div>
                </div>
                <div className="col-md-1 d-inline-block">
                  <img alt={"search"} src={SearchImg} />
                </div>
              </div>
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo03">
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                      <i className="fas fa-bell" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-notification">
                      <div className="col-md-12">
                        <div className="col-md-6 notification-heading">
                          Notifications
                        </div>
                      </div>
                      <Dropdown.Item className="notification-box">
                        <div className="row">
                          <div className="col-md-1 no-padding">
                            <div className="notification-img">
                              <img
                                alt={"userImg"}
                                src={userImg}
                                className="img-responsive"
                              />
                            </div>
                          </div>
                          <div className="col-md-11">
                            <div className="notification-text">
                              Amit Shah added you to the project{" "}
                              <span>
                                Aviabird
                                <br />
                                Technologies
                              </span>
                            </div>
                            <div className="col-md-12 no-padding notification-text text-right">
                              <span>4h </span>
                              Jan 19, 2019
                            </div>
                          </div>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item className="notification-box">
                        <div className="row">
                          <div className="col-md-1 no-padding">
                            <div className="notification-img">
                              <img
                                alt={"userImg"}
                                src={userImg}
                                className="img-responsive"
                              />
                            </div>
                          </div>
                          <div className="col-md-11">
                            <div className="notification-text">
                              Amit Shah added you to the project{" "}
                              <span>
                                Aviabird
                                <br />
                                Technologies
                              </span>
                            </div>
                            <div className="col-md-12 no-padding notification-text text-right">
                              <span>4h </span>
                              Jan 19, 2019
                            </div>
                          </div>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                      <i className="fa fa-bars"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-position">
                      <Dropdown.Item>
                        <div className="workspace-circle d-inline-block">
                          {"Gaurav Gandhi"
                            .split(" ")
                            .map(x => x[0])
                            .join("")}
                        </div>
                        <div className="workspace-name d-inline-block">
                          Gaurav Gandhi
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="workspace-setting"
                        href={`/workspace/${this.props.workspaceId}/settings`}>
                        <img
                          alt={"setting"}
                          src={setting}
                          className="img-responsive"
                        />
                        &nbsp;&nbsp;Workspace Settings
                      </Dropdown.Item>
                      <Dropdown.Item className="invite">
                        <img
                          alt={"invite"}
                          src={invite}
                          className="img-responsive"
                        />
                        &nbsp;&nbsp;Invite to Workspace
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown ref={this.clickClose}>
                    <Dropdown.Toggle
                      className={`header-auth-btn text-titlize ${
                        this.state.userRole === "admin"
                          ? "admin-circle"
                          : "member-circle"
                      } `}
                      id="dropdown-basic">
                      {x}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-position">
                      <div className="display-flex">
                        <div
                          className={`workspace-circle d-inline-block text-titlize ${
                            this.state.userRole === "admin"
                              ? "admin-circle"
                              : "member-circle"
                          } `}>
                          {x}
                        </div>
                        <div className="workspace-name d-inline-block">
                          <span className="text-titlize">
                            {this.state.userName}
                          </span>
                          <br />
                          <span>{this.state.userEmail}</span>
                          <span
                            className="pull-right close-span"
                            onClick={this.closeSettingModal}>
                            <i class="fa fa-close" aria-hidden="true"></i>
                          </span>
                          <br />
                          <img
                            alt={
                              this.state.userRole === "admin"
                                ? "Admin"
                                : "Member"
                            }
                            src={
                              this.state.userRole === "admin" ? Admin : Member
                            }
                            className="img-responsive"
                          />
                          <span className="text-titlize padding-10px">
                            {this.state.userRole}
                          </span>
                        </div>
                      </div>
                      <Dropdown.Item
                        className="workspace-setting"
                        href={`/settings/${this.props.workspaceId}`}>
                        <img
                          alt={"settings"}
                          src={setting}
                          className="img-responsive"
                        />
                        &nbsp;&nbsp;Settings
                      </Dropdown.Item>
                      <div className="col-md-12 logout-user">
                        <span className="text-titlize">
                          Not {this.state.userName} ?{" "}
                          <button
                            className="btn btn-link"
                            onClick={this.props.logout}>
                            Logout
                          </button>
                        </span>
                      </div>
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
