import React, { Component } from "react";
import "./../assets/css/dashboard.css";
import "./../assets/css/dashboard.scss";
import SearchImg from "./../assets/images/search.png";
import onClickOutside from "react-onclickoutside";

class DailyPloyProjectSelect extends Component {
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
      wrapProjectCount: 0
    };
  }

  onClickInput = () => {
    this.setState({
      show: true,
      suggestions: this.props.options
    });
  };

  async componentDidMount() {
    if (this.props.default && this.props.options) {
      this.setState({
        suggestions: this.props.options,
        selectedTags: this.props.default
        // show: true
      });
    } else if (this.props.options) {
      this.setState({
        suggestions: this.props.options
      });
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.selectedTags != this.state.selectedTags) {
      let width = 0;
      let cnt = 0;
      let tags = document.querySelectorAll(".project-tag");
      tags.forEach(tag => {
        let newWidth = width + tag.offsetWidth;
        if (newWidth <= 338) {
          cnt += 1;
          width = newWidth;
        } else {
          width = newWidth;
        }
      });
      let projectCount = this.state.selectedTags.length;
      if (projectCount >= cnt) {
        this.setState({ wrapProjectCount: projectCount - cnt });
      } else {
        this.setState({ wrapProjectCount: 0 });
      }
    }
  };

  onSearchTextChange = e => {
    const value = e.target.value;
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      var suggestions = this.props.options.filter(
        v => regex.test(v.name) && !this.state.selectedTags.includes(v)
      );
      this.setState({
        suggestions: suggestions,
        value: value
      });
    } else {
      this.setState({
        value: value,
        suggestions: this.props.options
      });
    }
  };

  selectSuggestion = option => {
    var selected = this.state.selectedTags.find(s => s.id == option.id);
    if (!selected) {
      var newSelectedTags = new Array(...this.state.selectedTags);
      newSelectedTags.push(option);
      this.setState({
        selectedTags: newSelectedTags
      });
      this.props.onChange(newSelectedTags);
    } else {
      var newSelectedTags = this.state.selectedTags.filter(
        s => s.id != option.id
      );
      this.setState({
        selectedTags: newSelectedTags
      });
      this.props.onChange(newSelectedTags);
    }
  };

  removeSelectedTag = option => {
    var selectedTags = this.state.selectedTags.filter(item => item != option);
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
      return "Search Members or Projects";
    } else {
      return "Search Members or Projects";
    }
  };

  handleKeyPress = event => {
    if (
      event.keyCode === 13 &&
      this.state.value.length > 0 &&
      this.state.suggestions.length > 0
    ) {
      let option = this.state.suggestions[0];
      var newSelectedTags = new Array(...this.state.selectedTags);
      newSelectedTags.push(option);
      this.setState({
        selectedTags: newSelectedTags,
        value: ""
      });
    }
  };

  isChecked = option => {
    if (this.state.selectedTags.find(s => s.id == option.id)) {
      return true;
    }
    return false;
  };

  toggleSelectedTag = option => {
    if (this.state.selectedTags.find(s => s.id == option.id)) {
      this.removeSelectedTag(option);
      return true;
    } else {
      var newSelectedTags = new Array(...this.state.selectedTags);
      newSelectedTags.push(option);
      this.setState({
        selectedTags: newSelectedTags
      });
      return false;
    }
  };

  renderSearchSuggestion = () => {
    return (
      <>
        {this.state.show ? (
          <>
            <div>
              <input
                style={{
                  width: "100%",
                  paddingLeft: "20px",
                  borderBottom: "solid 1px #d6d6d6"
                }}
                className="suggessionSearchInput"
                type="text"
                autoFocus={true}
                value={this.state.value}
                onChange={this.onSearchTextChange}
                placeholder={"search projects"}
              // onKeyUp={this.handleKeyPress}
              />
            </div>
            {this.state.suggestions.length > 0 ? (
              <>
                {this.state.suggestions.map((option, idx) => {
                  return (
                    <li
                      key={idx}
                      onClick={() => this.selectSuggestion(option)}
                      style={{
                        listStyle: "none",
                        padding: "0px"
                      }}
                    >
                      <div
                        className="d-inline-block"
                        style={{
                          width: "12%",
                          padding: "8px"
                        }}
                      // onClick={() => this.toggleSelectedTag(option)}
                      >
                        <div
                          className={`d-inline-block color-block`}
                          style={{ backgroundColor: `${option.color_code}` }}
                        >
                          {this.isChecked(option) ? (
                            <i className="check-icon fa fa-check"></i>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className="d-inline-block"
                        style={{
                          width: "88%",
                          padding: "8px"
                        }}
                      // onClick={() => this.selectSuggestion(option)}
                      >
                        <span className="right-left-space-5">
                          {option.name}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </>
            ) : null}

            {this.state.suggestions.length == 0 ? (
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
          return (
            <div
              className={`d-inline-block project-tag`}
              key={index}
              style={{
                backgroundColor: option.color_code,
                margin: "2px 2px",
                borderRadius: "15PX",
                height: "28px",
                verticalAlign: "middle"
              }}
            >
              <div
                className="tag-text d-inline-block"
                style={{
                  padding: "4px 10px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: "120px",
                  minWidth: "80px"
                }}
              >
                {option.name}
              </div>
            </div>
          );
        })}
      </>
    );
  };

  handleClickOutside = () => {
    this.setState({
      show: false,
      value: ""
    });
  };

  render() {
    return (
      <>
        <div className="col-md-7 d-inline-block no-padding search-filter-container">
          <div
            className={`no-padding d-inline-block ${
              this.props.isReports ? "report-search-bar" : "search-bar"
              }`}
            onClick={() => this.onClickInput()}
          >
            <div className="d-inline-block user-project-search text-titlize">
              <div
                className="selected-tags"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  maxWidth: "338px"
                }}
              >
                {this.state.selectedTags.length > 0 ? (
                  this.renderSelectedTags(
                    this.state.selectedTags.slice(-4).reverse(),
                    true
                  )
                ) : (
                    <span className="placeholder">{this.props.placeholder}</span>
                  )}
              </div>
              {this.state.wrapProjectCount > 0 ? (
                <div className="d-inline-block project-wrap-count">
                  {this.state.wrapProjectCount}
                </div>
              ) : null}
              <div
                className={`suggestion-holder  ${
                  this.state.show ? "suggestion-holder-border" : null
                  }`}
              >
                {this.renderSearchSuggestion()}
              </div>
            </div>
            <span
              className="down-icon"
              style={{
                position: "absolute",
                fontSize: "22px",
                right: "10px"
              }}
            >
              <i className="fa fa-angle-down"></i>
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default onClickOutside(DailyPloyProjectSelect);
