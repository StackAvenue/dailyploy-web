import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";
import TimePicker from "rc-time-picker";

class EditableTimeTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
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
    if (this.props.value) {
      this.setState({
        suggestions: this.props.options ? this.props.options : [],
        selectedText: this.props.value.name,
        selected: this.props.value,
        editable: true
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.options != this.props.options &&
      this.props.options.length > 0
    ) {
      this.setState({
        suggestions: this.props.options,
        selectedText: this.props.options[0].name,
        selected: this.props.options[0],
        editable: true
      });
    }
  };

  onClickInput = () => {
    this.setState({ show: !this.state.show, suggestions: this.props.options });
  };

  renderSearchSuggestions = () => {
    return (
      <>
        {this.props.options.length > 0 ? (
          <ul>
            {this.props.options.map((option, idx) => {
              return (
                <li key={idx} onClick={() => this.selectSuggestion(option)}>
                  <span className="d-inline-block right-left-space-5 text-titlize">{`${option["name"]}`}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </>
    );
  };

  selectSuggestion = option => {
    this.setState({
      selected: option,
      show: false,
      editable: true,
      selectedText: option.name
    });
  };

  closeSuggestion = () => {
    if (this.state.show) {
      this.setState({ show: false });
    }
  };

  handleClickOutside = () => {
    this.setState({
      show: false
      // editable: false
    });
  };

  render() {
    const { props } = this;
    return (
      <>
        <div>
          <div
            style={{ height: "34px", display: "flex" }}
            className={`no-padding ${props.className ? props.className : ""}`}
          >
            <div className="custom-search-select" style={{ width: "80%" }}>
              <div onClick={this.onClickInput}>
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
                  readOnly={true}
                />
                <span className="down-icon">
                  <i className="fa fa-angle-down"></i>
                </span>
              </div>
            </div>
            {this.props.action && this.state.editable ? (
              <>
                <div
                  style={{
                    padding: "0px 10px",
                    fontSize: "20px",
                    cursor: "pointer"
                  }}
                  onClick={() => this.props.handleEditLog(this.state.selected)}
                >
                  <i className="fa fa-pencil"></i>
                </div>
                <div
                  style={{
                    padding: "0px 10px",
                    fontSize: "20px",
                    cursor: "pointer"
                  }}
                  onClick={() =>
                    this.props.handleDeleteLog(this.state.selected)
                  }
                >
                  <i class="fas fa-trash-alt"></i>
                </div>
              </>
            ) : null}
          </div>

          {this.state.show && this.state.editable ? (
            <div className="suggestions" style={{ width: "80%" }}>
              {this.renderSearchSuggestions()}
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default onClickOutside(EditableTimeTrack);

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
