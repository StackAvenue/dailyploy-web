import React, { Component } from "react";
import "../../assets/css/dashboard.css";
import "../../assets/css/dashboard.scss";
import { firstTwoLetter } from "../../utils/function";
import SearchImg from "../../assets/images/search.png";
import onClickOutside from "react-onclickoutside";
import { Dropdown } from "react-bootstrap";

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      projectSuggestions: [],
      memberSuggestions: [],
      selectedTags: [],
      selectedMember: null,
      show: false,
      value: ""
    };
  }

  onClickInput = () => {
    var memberSuggestions = [];
    if (this.props.state.searchFlag === "Members" && this.props.isReports) {
      let selectedMembers = this.state.selectedTags.filter(
        option => option.type === "member"
      );
      if (selectedMembers.length > 0) {
        memberSuggestions = [];
      } else {
        memberSuggestions = this.props.searchOptions.members.filter(
          option => !this.state.selectedTags.includes(option)
        );
      }
    } else if (!this.props.isReports) {
      memberSuggestions = this.props.searchOptions.members
        ? this.props.searchOptions.members.filter(
            option => !this.state.selectedTags.includes(option)
          )
        : [];
    }
    let projectSuggestions = this.props.searchOptions.projects
      ? this.props.searchOptions.projects.filter(
          option => !this.state.selectedTags.includes(option)
        )
      : [];

    this.setState({
      show: !this.state.show,
      memberSuggestions: memberSuggestions,
      projectSuggestions: projectSuggestions
    });
  };

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.state.searchFlag != this.props.state.searchFlag) {
      this.setState({
        show: false,
        memberSuggestions: [],
        projectSuggestions: [],
        selectedTags: []
      });
    }
    if (prevState.selectedTags !== this.state.selectedTags) {
      this.props.handleSearchFilterResult(this.state.selectedTags);
    }
  }

  onSearchTextChange = e => {
    const value = e.target.value;
    let projectSuggestions = [];
    let memberSuggestions = [];
    if (
      value.length > 0 &&
      this.props.searchOptions.projects &&
      this.props.searchOptions.members
    ) {
      const regex = new RegExp(`^${value}`, "i");
      var projectSearchOptions = this.props.searchOptions.projects;
      var memberSearchOptions = this.props.searchOptions.members;
      if (this.props.state.searchFlag === "Members" && this.props.isReports) {
        memberSuggestions = memberSearchOptions
          .sort()
          .filter(
            v => regex.test(v.value) && !this.state.selectedTags.includes(v)
          );
      }
      projectSuggestions = projectSearchOptions
        .sort()
        .filter(
          v => regex.test(v.value) && !this.state.selectedTags.includes(v)
        );
    }
    this.setState({
      memberSuggestions: memberSuggestions,
      projectSuggestions: projectSuggestions,
      value: value
    });
  };

  selectSuggestion = option => {
    var newSelectedTags = new Array(...this.state.selectedTags);
    newSelectedTags.push(option);
    this.setState({
      selectedTags: newSelectedTags,
      memberSuggestions: [],
      projectSuggestions: [],
      value: ""
    });
  };

  removeSelectedTag = option => {
    var selectedTags = this.state.selectedTags;
    selectedTags = selectedTags.filter(item => item != option);
    this.setState({ selectedTags: selectedTags });
  };

  renderSearchSuggestion = () => {
    return (
      <>
        {this.state.show ? (
          <>
            {this.state.selectedTags.length > 2 ? (
              <div className="extra-selected-tags">
                {this.renderSelectedTags(
                  this.state.selectedTags.reverse(),
                  false
                )}
              </div>
            ) : null}
            {this.state.memberSuggestions.length > 0 ? (
              <ul>
                <li className="list-header">
                  <b>Members</b>
                </li>
                {this.state.memberSuggestions.map((option, idx) => {
                  if (option.type == "member") {
                    return (
                      <li
                        key={idx}
                        onClick={() => this.selectSuggestion(option)}
                      >
                        <span className="list-icon">
                          <i className="fa fa-user"></i>
                        </span>
                        <span className="right-left-space-5">
                          {option.value}
                        </span>
                      </li>
                    );
                  }
                })}
              </ul>
            ) : null}

            {this.state.projectSuggestions.length > 0 ? (
              <ul>
                <li className="list-header">
                  <b>Projects</b>
                </li>
                {this.state.projectSuggestions.map((option, idx) => {
                  if (option.type == "project") {
                    return (
                      <li
                        key={idx}
                        onClick={() => this.selectSuggestion(option)}
                      >
                        <span className="list-icon">
                          <i className="fa fa-list-alt"></i>
                        </span>
                        <span className="right-left-space-5">
                          {option.value}
                        </span>
                      </li>
                    );
                  }
                })}
              </ul>
            ) : null}
          </>
        ) : null}
      </>
    );
  };

  renderSelectedTags = (selectedTags, isIcon) => {
    return (
      <>
        {selectedTags.map((option, index) => {
          if (option.type == "member") {
            return (
              <div className={`search-icon-${option.type}`} key={index}>
                <i className="fa fa-user right-left-space-5"></i>
                <span className="right-left-space-5">{option.value}</span>
                <a
                  className="remove-tag right-left-space-5"
                  onClick={() => this.removeSelectedTag(option)}
                >
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
                  onClick={() => this.removeSelectedTag(option)}
                >
                  <i className="fa fa-close"></i>
                </a>
              </div>
            );
          }
        })}
        {isIcon && this.state.selectedTags.length > 2 ? (
          <span search-bar-plus>
            <i className="fa fa-plus"></i>
            {this.state.selectedTags.length - 2}
          </span>
        ) : null}
      </>
    );
  };

  handleClickOutside = () => {
    this.setState({ show: false, value: "" });
  };

  render() {
    const { value } = this.state;
    const x = firstTwoLetter(this.props.loggedInUserName);
    return (
      <>
        <div className="col-md-7 d-inline-block no-padding search-filter-container">
          {this.props.state.userRole === "admin" && this.props.isReports ? (
            <div className=" no-padding d-inline-block admin-filter">
              <Dropdown>
                <Dropdown.Toggle>
                  {this.props.state.searchFlag}
                  <span className="pull-right">
                    <i className="fa fa-caret-down"></i>{" "}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    className={`${
                      this.props.state.searchFlag === "My Reports"
                        ? "active"
                        : ""
                    }`}
                    onClick={() => this.props.toggleSearchBy("My Reports")}
                  >
                    My Reports
                  </Dropdown.Item>
                  <Dropdown.Item
                    className={`${
                      this.props.state.searchFlag === "Members" ? "active" : ""
                    }`}
                    onClick={() => this.props.toggleSearchBy("Members")}
                  >
                    Members
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : null}
          <div
            className=" no-padding d-inline-block"
            onClick={this.onClickInput}
          >
            <div className="user-project-search text-titlize">
              <div className="selected-tags">
                {this.renderSelectedTags(
                  this.state.selectedTags.reverse().slice(0, 2),
                  true
                )}
              </div>
              <input
                type="text"
                value={value}
                placeholder={
                  this.state.selectedTags.length > 0 ? "" : "Search by projects"
                }
                onChange={this.onSearchTextChange}
              />

              <div
                className={`suggestion-holder ${
                  (this.state.projectSuggestions.length > 0 ||
                    this.state.memberSuggestions.length > 0) &&
                  this.state.show
                    ? "suggestion-holder-border"
                    : null
                }`}
              >
                {this.renderSearchSuggestion()}
              </div>
            </div>
          </div>
          <div className=" d-inline-block search-icon">
            <img alt={"search"} src={SearchImg} />
          </div>
        </div>
      </>
    );
  }
}

export default onClickOutside(SearchFilter);
