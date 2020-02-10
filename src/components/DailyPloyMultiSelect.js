import React, { Component } from "react";
import { firstTwoLetter, textTitlize } from "./../utils/function";

class DailyPloyMultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      selectedTags: [],
      searchText: "",
      notFound: "hide"
    };
  }

  componentDidMount = () => {
    if (this.props.reset) {
      console.log("hiii");
      this.setState({
        selectedTags: []
      });
    } else {
      this.setState({
        selectedTags:
          this.props.defaultSelected && this.props.defaultSelected.length > 0
            ? this.props.defaultSelected
            : []
      });
    }
  };

  onSearchTextChange = e => {
    const value = e.target.value;
    const searchBy = this.props.searchBy ? this.props.searchBy : "name";
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = this.props.options.filter(
        s =>
          !this.state.selectedTags.map(m => m.id).includes(s.id) &&
          regex.test(`${s[searchBy]}`)
      );
    } else {
      suggestions = [];
    }
    this.setState({
      suggestions: suggestions,
      searchText: value,
      notFound: suggestions.length > 0 || value.length === 0 ? "hide" : "show"
    });
  };

  selectSuggestion = option => {
    var newSelectedTags = new Array(...this.state.selectedTags);
    newSelectedTags.push(option);
    this.setState({
      selectedTags: newSelectedTags,
      searchText: "",
      suggestions: []
    });
    this.props.onChange(newSelectedTags);
  };

  removeSelectedTag = option => {
    var selectedTags = this.state.selectedTags.filter(item => item !== option);
    this.setState({ selectedTags: selectedTags });
    this.props.onChange(selectedTags);
  };

  renderSearchSuggestions = () => {
    return (
      <>
        {this.state.suggestions ? (
          <ul>
            {this.state.suggestions.map((option, idx) => {
              return (
                <li key={idx} onClick={() => this.selectSuggestion(option)}>
                  {this.props.suggestionIcon === "initial" ? (
                    <div className="member-title d-inline-block">
                      {firstTwoLetter(option.name)}
                    </div>
                  ) : this.props.suggestionIcon !== undefined ? (
                    <i className={this.props.suggestionIcon}></i>
                  ) : null}
                  <span className="right-left-space-5">
                    {textTitlize(option.name)}({option.email})
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
        <span
          className={`text-titlize left-padding-20px  ${this.state.notFound}`}
        >
          No Match Found
        </span>
      </>
    );
  };

  renderSelectedTags = () => {
    return (
      <>
        {this.state.selectedTags.map((option, index) => {
          return (
            <div className="select-member d-inline-block" key={index}>
              {this.props.selectedIcon === "initial" ? (
                <div className="d-inline-block member-title">
                  {firstTwoLetter(option.name)}
                </div>
              ) : this.props.selectedIcon !== undefined ? (
                <div className="d-inline-block">
                  <i
                    className={`right-left-space-5 ${this.props.selectedIcon}`}
                  ></i>
                </div>
              ) : null}
              <span className="d-inline-block right-left-space-5">
                {option.name}
              </span>
              <a
                className="remove-tag right-left-space-5"
                onClick={() => this.removeSelectedTag(option)}
              >
                <i className="d-inline-block fa fa-close"></i>
              </a>
            </div>
          );
        })}
      </>
    );
  };

  render() {
    const { props } = this;
    return (
      <>
        <div
          className={`col-md-12 d-inline-block no-padding dailyploy-multi-select ${
            props.className ? props.className : ""
          }`}
        >
          <div className="project-member-search">
            <div className="selected-tags text-titlize">
              {this.renderSelectedTags()}
            </div>
            <input
              type="text"
              value={this.state.searchText}
              placeholder="Search for member"
              onChange={this.onSearchTextChange}
            />
          </div>
          <div
            className="suggestion-holder"
            style={
              this.state.suggestions.length == 0 ? { borderColor: "#fff" } : {}
            }
          >
            {this.renderSearchSuggestions()}
          </div>
        </div>
      </>
    );
  }
}

export default DailyPloyMultiSelect;

{
  /* <DailyPloyMultiSelect
  options={this.state.members}
  searchBy="name"
  defaultSelected={this.state.members}
  selectedIcon="initial | fa fa-user | '' "
  suggestionIcon="initial | fa fa-user | '' "
/>; */
}
