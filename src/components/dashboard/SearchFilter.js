import React, { Component } from "react";
import Select from "react-select";
import "../../assets/css/dashboard.css";
import logo from "../../assets/images/logo.png";
import "../../assets/css/dashboard.scss";
import { firstTwoLetter } from "../../utils/function";
import userImg from "../../assets/images/profile.png";
import Search from "../../assets/images/search.png";
import SearchImg from "../../assets/images/search.png";
import { WORKSPACE_ID } from "./../../utils/Constants";
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
      show: false
    };
  }

  onClickInput = () => {
    this.setState({
      show: !this.state.show,
      suggestions: !this.state.show ? this.props.searchOptions : []
    });
  };

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState) {}

  onSearchTextChange = e => {
    const value = e.target.value;
    let projectSuggestions = [];
    let memberSuggestions = [];
    if (value.length > 0) {
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
    if (option.type === "member") {
      var selectedMember = option;
    }
    newSelectedTags.push(option);
    if (selectedMember) {
      this.setState({
        selectedTags: newSelectedTags,
        selectedMember: selectedMember,
        suggestions: [],
        value: ""
      });
    } else {
      this.setState({
        selectedTags: newSelectedTags,
        suggestions: [],
        value: ""
      });
    }
  };

  removeSelectedTag = index => {
    var selectedTags = this.state.selectedTags;
    if (this.state.selectedMember) {
      var selectedMemberTags = selectedTags.filter(
        (item, i) => this.state.selectedMember.id === item.id && i === index
      );
    }
    selectedTags = selectedTags.filter((item, i) => i !== index);
    if (selectedMemberTags) {
      this.setState({ selectedTags: selectedTags, selectedMember: null });
    } else {
      this.setState({ selectedTags: selectedTags });
    }
  };

  renderSearchSuggestion = () => {
    return (
      <>
        <div className="extra-selected-tags"></div>
        {this.state.memberSuggestions.length > 0 ? (
          <ul>
            <li className="list-header">
              <b>Members</b>
            </li>
            {this.state.memberSuggestions.map((option, idx) => {
              if (option.type == "member") {
                return (
                  <li key={idx} onClick={() => this.selectSuggestion(option)}>
                    <span className="list-icon">
                      <i className="fa fa-user"></i>
                    </span>
                    <span className="right-left-space-5">{option.value}</span>
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
                  <li key={idx} onClick={() => this.selectSuggestion(option)}>
                    <span className="list-icon">
                      <i className="fa fa-list-alt"></i>
                    </span>
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
                  onClick={() => this.removeSelectedTag(index)}
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
                  onClick={() => this.removeSelectedTag(index)}
                >
                  <i className="fa fa-close"></i>
                </a>
              </div>
            );
          }
        })}
      </>
    );
  };

  textTitlize = text => {
    return text.replace(/(?:^|\s)\S/g, function(a) {
      return a.toUpperCase();
    });
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
                <Dropdown.Toggle>{this.props.state.searchFlag}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <div className="col-md-12"></div>
                  <Dropdown.Item
                    onClick={() => this.props.toggleSearchBy("My Reports")}
                  >
                    My Reports
                  </Dropdown.Item>
                  <Dropdown.Item
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
              <div className="selected-tags">{this.renderSelectedTags()}</div>
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
                  this.state.suggestions.length > 0 && this.state.show
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
