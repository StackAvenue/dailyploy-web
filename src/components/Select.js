import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      show: false,
      border: "solid 1px #d1d1d1",
      color: "#d1d1d1"
    };
    console.log("select.js", props);
  }

  onClickInput = () => {
    this.setState({ show: !this.state.show });
  };

  renderSearchSuggestions = () => {
    return (
      <>
        {this.props.options && this.props.options.length > 0 ? (
          <>
            {this.props.options.map((option, idx) => {
              return (
                <li key={idx} style={{ listStyleType: "none" }}>
                  {option.name}
                </li>
              );
            })}
          </>
        ) : null}
      </>
    );
  };

  renderSelectedSuggestion = () => {
    const selected = this.props.value;
    return (
      <>
        {selected ? (
          <li style={{ listStyleType: "none" }}>
            <span className="text-titlize">{selected.name}</span>
          </li>
        ) : null}
      </>
    );
  };

  handleClickOutside = () => {
    // this.setState({ show: false });
    this.props.onClickInput();
  };

  render() {
    const { props } = this;
    return (
      <>
        <div style={{ listStyleType: "none" }} className="track-log-dropdown">
          {this.renderSearchSuggestions()}
        </div>
      </>
    );
  }
}
export default onClickOutside(Select);
