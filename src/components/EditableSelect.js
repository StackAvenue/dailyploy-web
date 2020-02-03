import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";

class EditableSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: "",
      suggestions: [],
      searchText: "",
      isBorder: false,
      show: false,
      canBack: false,
      border: "solid 1px #d1d1d1",
      color: "#d1d1d1",
      notFound: "hide",
      editable: false,
      beforeEdit: false
    };
  }

  componentDidMount = () => {
    this.setState({
      suggestions: this.props.options ? this.props.options : [],
      selected: this.props.default ? this.props.default : ""
    });
  };

  onClickInput = () => {
    this.setState({ show: !this.state.show, suggestions: this.props.options });
  };

  onSearchTextChange = e => {
    const value = e.target.value;
    const searchBy = this.props.searchBy ? this.props.searchBy : "name";
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = this.props.options.filter(s =>
        regex.test(`${s[searchBy]}`)
      );
    } else {
      suggestions = this.props.options;
    }
    this.setState({
      suggestions: suggestions,
      searchText: value,
      show: true,
      notFound: suggestions.length > 0 ? "hide" : "show"
    });
  };

  renderSearchSuggestions = () => {
    const klass =
      this.props.iconType == "block"
        ? "color-block"
        : this.props.iconType == "circle"
        ? "color-dot"
        : "";
    const name = this.props.suggesionBy ? this.props.suggesionBy : "name";
    const icon = this.props.icon;
    return (
      <>
        {this.state.suggestions.length > 0 && !this.state.editable ? (
          <ul>
            {klass != ""
              ? this.state.suggestions.map((option, idx) => {
                  return (
                    <li key={idx} onClick={() => this.selectSuggestion(option)}>
                      {icon !== "" && klass === "" ? (
                        <i className={`left-padding-10px ${icon}`}></i>
                      ) : (
                        <div
                          className={`d-inline-block ${klass}`}
                          style={{ backgroundColor: `${option.color_code}` }}
                        ></div>
                      )}
                      <span className="d-inline-block right-left-space-5 text-titlize">{`${option[name]}`}</span>
                    </li>
                  );
                })
              : this.state.suggestions.map((option, idx) => {
                  return (
                    <li key={idx} onClick={() => this.selectSuggestion(option)}>
                      {icon !== "" ? (
                        <i className={`left-padding-10px ${icon}`}></i>
                      ) : null}
                      <span className="d-inline-block right-left-space-5 text-titlize">{`${option[name]}`}</span>
                    </li>
                  );
                })}
          </ul>
        ) : null}
      </>
    );
  };

  renderSelectedSuggestion = () => {
    const selected = this.state.selected;
    const klass =
      this.props.iconType == "block"
        ? "color-block"
        : this.props.iconType == "circle"
        ? "color-dot"
        : "";
    const label = this.props.label ? this.props.label : "name";
    const icon = this.props.icon;
    if (
      (icon == undefined || icon == "") &&
      (klass === undefined || klass === "")
    ) {
      return (
        <>
          {selected != "" ? (
            <div className="">
              <div className="l-padding-12px d-inline-block">{`${selected[label]}`}</div>
            </div>
          ) : null}
        </>
      );
    } else if (
      (icon !== undefined || icon !== "") &&
      (klass === undefined || klass === "")
    ) {
      return (
        <>
          {selected != "" ? (
            <div>
              <i className={`l-padding-12px ${icon}`}></i>
              <div className="left-padding-20px d-inline-block">{`${selected[label]}`}</div>
            </div>
          ) : null}
        </>
      );
    } else if (
      (icon === undefined || icon === "") &&
      (klass !== undefined || klass !== "")
    ) {
      return (
        <>
          {selected != "" ? (
            <div className="">
              <div
                className={`d-inline-block ${klass}`}
                style={{
                  backgroundColor: `${
                    selected.color_code ? selected.color_code : this.state.color
                  }`
                }}
              ></div>
              <div className="right-left-space-5 d-inline-block">{`${selected[label]}`}</div>
            </div>
          ) : null}
        </>
      );
    } else {
      return (
        <>
          {selected != "" ? (
            <div className="">
              <div className="right-left-space-5 d-inline-block">{`${selected[label]}`}</div>
            </div>
          ) : null}
        </>
      );
    }
  };

  selectSuggestion = option => {
    this.setState({
      selected: option,
      show: false,
      searchText: "",
      editable: true,
      selectedText: option.name,
      beforeEdit: false
    });
    this.props.onChange(option);
  };

  editSelecedOption = e => {
    let text = e.target.value;
    let regex = /^([0-9- :]*)$/;
    if (text.match(regex)) {
      this.setState({
        selectedText: text
      });
    }
  };

  handleBackSpace = event => {
    if (event.keyCode === 8 && this.state.searchText.length === 0) {
      this.setState({
        canBack: true,
        selected: "",
        suggestions: this.props.options
      });
      this.props.onChange(null);
    }
  };

  closeSuggestion = () => {
    if (this.state.show) {
      this.setState({ show: false });
    }
  };

  handleClickOutside = () => {
    this.setState({
      show: false,
      editable: false,
      searchText: this.state.selectedText,
      beforeEdit: false
    });
  };

  makeInputEditable = () => {
    this.setState({ beforeEdit: true });
  };

  render() {
    const { props } = this;
    return (
      <>
        <div
          style={{ height: "34px" }}
          className={`col-md-12 d-inline-block no-padding ${
            props.className ? props.className : ""
          }`}
        >
          <div
            className="d-inline-block custom-search-select"
            style={{ width: "80%" }}
          >
            <div
              onClick={this.onClickInput}
              className={`${this.state.beforeEdit ? "editable-focus" : ""}`}
            >
              <input
                className={`d-inline-block`}
                style={{ color: "#000000" }}
                type="text"
                placeholder="hh.mm - hh.mm"
                value={
                  this.state.editable
                    ? this.state.selectedText
                    : this.state.searchText
                }
                onChange={
                  this.state.editable
                    ? this.editSelecedOption
                    : this.onSearchTextChange
                }
                readOnly={this.state.beforeEdit ? false : true}
              />
              {this.state.show ? (
                <div className="suggestions" style={{ width: "80%" }}>
                  {this.renderSearchSuggestions()}
                </div>
              ) : null}
              <span className="down-icon">
                <i className="fa fa-angle-down"></i>
              </span>
            </div>
          </div>
          {this.state.editable ? (
            <>
              <div
                className="d-inline-block col-md-1"
                style={{
                  paddingLeft: "5px ",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
                onClick={this.makeInputEditable}
              >
                <i className="fa fa-pencil"></i>
              </div>
              <span
                className="d-inline-block col-md-1"
                style={{
                  paddingLeft: "5px ",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
                onClick={() =>
                  this.props.saveInputEditable(this.state.selectedText)
                }
              >
                save
              </span>
            </>
          ) : (
            <div
              className="d-inline-block col-md-1"
              style={{
                paddingLeft: "5px ",
                fontSize: "20px",
                cursor: "pointer"
              }}
            >
              <i className="fa fa-bars"></i>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default onClickOutside(EditableSelect);

{
  /* <DailyPloySelect
  options={this.props.projects}
  placeholder="select"
  label="name"
  className=""
  searchBy="name"
  suggesionBy="name"
  iconType="circle"
  iconType="block"
  name="taskName"
  icon="fa fa-user"
  onChange={() => { }}
  canAdd={true}
  addNew={() => {}}
/> */
}
