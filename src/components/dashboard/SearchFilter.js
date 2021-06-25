import React, { Component } from "react";
import "../../assets/css/dashboard.css";
import "../../assets/css/dashboard.scss";
import { firstTwoLetter } from "../../utils/function";
import SearchImg from "../../assets/images/search.png";
import onClickOutside from "react-onclickoutside";
import { Dropdown } from "react-bootstrap";
import PropTypes from 'prop-types';

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
      value: "",
      isExpand: false
    };
  }

  onClickInput = () => {
    this.setState({ isExpand: true })
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
      show: true,
      memberSuggestions: memberSuggestions,
      projectSuggestions: projectSuggestions
    });
    // document.querySelector(".suggessionSearchInput").focus();
  };

  async componentDidMount() { }

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
      var projectSuggestions = this.props.searchOptions.projects.filter(
        v => !this.state.selectedTags.includes(v)
      );

      if (this.props.state.searchFlag == "Members" && this.props.isReports) {
        let member = this.state.selectedTags.find(m => m.type == "member");
        var memberSuggestions = [];
        if (!member) {
          var memberSuggestions = this.props.searchOptions.members.filter(
            v => !this.state.selectedTags.includes(v)
          );
        }
      } else if (
        this.props.state.searchFlag == "My Reports" &&
        this.props.isReports
      ) {
        var memberSuggestions = [];
      } else {
        var memberSuggestions = this.props.searchOptions.members.filter(
          v => !this.state.selectedTags.includes(v)
        );
      }
      this.setState({
        memberSuggestions: memberSuggestions,
        projectSuggestions: projectSuggestions
      });
      this.props.handleSearchFilterResult(this.state.selectedTags);
    }
    if (
      prevState.memberSuggestions != this.state.memberSuggestions ||
      prevState.projectSuggestions != this.state.projectSuggestions
    ) {
      let input = document.querySelector(".suggessionSearchInput");
      if (input) {
        input.focus();
      }
    }
  }

  onSearchTextChange = e => {
    const value = e.target.value;
    var projectSuggestions = [];
    var memberSuggestions = [];
    if (
      value.length > 0 &&
      this.props.searchOptions.projects &&
      this.props.searchOptions.members
    ) {
      const regex = new RegExp(`^${value}`, "i");
      var projectSearchOptions = this.props.searchOptions.projects;
      var memberSearchOptions = this.props.searchOptions.members;
      if (this.props.state.searchFlag === "Members" && this.props.isReports) {
        memberSuggestions = memberSearchOptions.filter(
          v => regex.test(v.value) && !this.state.selectedTags.includes(v)
        );
      } else if (
        this.props.state.searchFlag === "My Reports" &&
        this.props.isReports
      ) {
        memberSuggestions = [];
      } else {
        memberSuggestions = memberSearchOptions.filter(
          v => regex.test(v.value) && !this.state.selectedTags.includes(v)
        );
      }
      projectSuggestions = projectSearchOptions.filter(
        v => regex.test(v.value) && !this.state.selectedTags.includes(v)
      );
      this.setState({
        memberSuggestions: memberSuggestions,
        projectSuggestions: projectSuggestions,
        value: value
      });
    } else {
      this.setState({
        memberSuggestions:
          this.props.isReports && this.props.state.searchFlag == "My Reports"
            ? []
            : this.props.searchOptions.members,
        projectSuggestions: this.props.searchOptions.projects,
        value: value
      });
    }
  };

  selectSuggestion = option => {
    var newSelectedTags = new Array(...this.state.selectedTags);
    newSelectedTags.push(option);
    this.setState({
      selectedTags: newSelectedTags,
      value: ""
    });
  };

  removeSelectedTag = option => {
    var selectedTags = this.state.selectedTags;
    selectedTags = selectedTags.filter(item => item != option);
    if (this.state.show) {
      if (option.type == "member") {
        var newMemberOption = [...this.state.memberSuggestions, option];
        this.setState({ memberSuggestions: newMemberOption });
      } else if (option.type == "project") {
        var newProjectOption = [...this.state.projectSuggestions, option];
        this.setState({ projectSuggestions: newProjectOption });
      }
    }
    this.setState({ selectedTags: selectedTags });
  };

  returnPlaceHolder = selectedMember => {
    if (this.props.isReports && this.props.state.searchFlag == "My Reports") {
      return "Search Projects";
    } else if (
      this.props.isReports &&
      this.props.state.searchFlag == "Members" &&
      selectedMember
    ) {
      return "Search Projects";
    } else if (
      this.props.isReports &&
      this.props.state.searchFlag == "Members" &&
      !selectedMember
    ) {
      return "Search Members";
    } else {
      return "Search Members or Projects";
    }
  };

  handleKeyPress = event => {
    if (event.keyCode === 13 && this.state.memberSuggestions.length > 0) {
      let option = this.state.memberSuggestions[0];
      var newSelectedTags = new Array(...this.state.selectedTags);
      newSelectedTags.push(option);
      this.setState({
        selectedTags: newSelectedTags,
        value: "",
        show: false
      });
    } else if (
      event.keyCode === 13 &&
      this.state.projectSuggestions.length > 0
    ) {
      let option = this.state.projectSuggestions[0];
      var newSelectedTags = new Array(...this.state.selectedTags);
      newSelectedTags.push(option);
      this.setState({
        selectedTags: newSelectedTags,
        value: "",
        show: false
      });
    }
  };

  renderSearchSuggestion = () => {
    let selectedMember = this.state.selectedTags.find(
      option => option.type === "member"
    );
    return (
      <>
        {this.state.show ? (
          <>
            {(this.props.isReports && this.state.selectedTags.length > 3) ||
              this.state.selectedTags.length > 1 ? (
                <div className="extra-selected-tags">
                  {this.renderSelectedTags(this.state.selectedTags, false)}
                </div>
              ) : null}
            <div>
              <input
                style={{ width: "100%", paddingLeft: "20px" }}
                className="suggessionSearchInput"
                type="text"
                value={this.state.value}
                onChange={this.onSearchTextChange}
                placeholder={this.returnPlaceHolder(selectedMember)}
                onKeyUp={this.handleKeyPress}
              />
            </div>
            {this.state.memberSuggestions.length > 0 ? (
              <ul>
                <li className="list-header">
                  <span style={{ paddingLeft: "10px" }}>
                    <b>Members</b>
                  </span>
                </li>
                {this.state.memberSuggestions.map((option, idx) => {
                  if (option.type == "member") {
                    return (
                      <li
                        key={idx}
                        onClick={() => this.selectSuggestion(option)}
                      >
                        <span className="list-icon">
                          <i className="fa fa-user-circle" aria-hidden="true"></i>
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
                  <span style={{ paddingLeft: "10px" }}>
                    <b>Projects</b>
                  </span>
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
            {this.state.projectSuggestions.length == 0 &&
              this.state.memberSuggestions.length == 0 ? (
                <div style={{ padding: "10px" }}>record not found</div>
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
              <div
                className={`search-icon-${option.type} d-inline-block`}
                key={index}
              >
                {/* <i className="fa fa-user member-icon right-left-space-5 d-inline-block"></i> */}
                <span className="list-icon">
                  <i class="fa fa-user-circle member-icon right-left-space-5 d-inline-block" aria-hidden="true"></i>
                </span>
                <div className="tag-text right-left-space-5 d-inline-block">
                  {option.value}
                </div>
                <a
                  className="remove-tag right-left-space-5 d-inline-block"
                  onClick={() => this.removeSelectedTag(option)}
                >
                  <i className="fa fa-close"></i>
                </a>
              </div>
            );
          } else {
            return (
              <div
                className={`search-icon-${option.type} d-inline-block`}
                key={index}
              >
                {/* <i className="fa fa-list-alt project-icon right-left-space-5 d-inline-block"></i> */}
                <span className="list-icon">
                  <i className="fa fa-list-alt project-icon right-left-space-5 d-inline-block"></i>
                </span>
                <div className="tag-text right-left-space-5 d-inline-block">
                  {option.value}
                </div>
                <a
                  className="remove-tag right-left-space-5 d-inline-block"
                  onClick={() => this.removeSelectedTag(option)}
                >
                  <i className="fa fa-close"></i>
                </a>
              </div>
            );
          }
        })}
        {/* {isIcon && this.state.selectedTags.length > 2 ? (
          <span search-bar-plus>
            <i className="fa fa-plus"></i>
            {this.state.selectedTags.length - 2}
          </span>
        ) : null} */}
      </>
    );
  };

  handleClickOutside = () => {
    this.setState({
      show: false,
      value: "",
      memberSuggestions: [],
      projectSuggestions: [],
      isExpand: false
    });
  };

  render() {
    const { value } = this.state;
    const x = firstTwoLetter(this.props.loggedInUserName);
    let selectedMember = this.state.selectedTags.find(
      option => option.type === "member"
    );
    return (
      <>
        <div className={`${this.state.isExpand ? "col-md-12 transition-search-bar" : "col-md-5"} flex-row no-padding search-filter-container`} disabled={this.props.isDisabled}>

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
                    style={
                      this.props.state.searchFlag === "My Reports"
                        ? {
                          backgroundColor: "#ffffff",
                          color: "#33a1ff !important"
                        }
                        : { backgroundColor: "#ffffff" }
                    }
                    onClick={() => this.props.toggleSearchBy("My Reports")}
                  >
                    My Reports
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{ backgroundColor: "#ffffff" }}
                    className={`${this.props.state.searchFlag === "Members" ? "active" : ""
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
            className={`no-padding d-inline-block ${this.props.isReports ? "report-search-bar" : "search-bar"
              }`}
            onClick={this.onClickInput}
          >
            <div className="d-inline-block user-project-search text-titlize">
              {this.state.selectedTags.length == 0 ? (
                <span className="placeholder">
                  {this.returnPlaceHolder(selectedMember)}
                </span>
              ) : null}
              <div className="selected-tags">
                {this.props.isReports
                  ? (this.props.state.userRole === "admin" ? 
                    this.renderSelectedTags(this.state.selectedTags.slice(-1).reverse(),
                    true) : this.renderSelectedTags(this.state.selectedTags.slice(-2).reverse(),
                    true))
                  : this.renderSelectedTags(
                    this.state.selectedTags.slice(-2).reverse(),
                    true
                  )}
              </div>
              <div
                className={`suggestion-holder  ${this.state.show ? "suggestion-holder-border" : null
                  }`}
              >
                {this.renderSearchSuggestion()}
              </div>
            </div>
            <div className="search-icon">
              <img alt={"search"} src={SearchImg} />
            </div>
          </div>
        </div>
      </>
    );
  }
}

SearchFilter.propTypes = {
  searchOptions: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  state: PropTypes.object.isRequired,
  isReports: PropTypes.bool.isRequired,
  toggleSearchBy: PropTypes.func.isRequired, 
  handleSearchFilterResult: PropTypes.func.isRequired
}

export default onClickOutside(SearchFilter);
