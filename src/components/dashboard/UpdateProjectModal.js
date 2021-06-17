import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import { TwitterPicker, Twitter } from "react-color";
import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { get } from "../../utils/API";
import PropTypes from 'prop-types';

class UpdateProjectModal extends Component {
  constructor(props) {
    super(props);
    this.colors = [
      "#FF6900",
      "#FCB900",
      "#7BDCB5",
      "#00D084",
      "#8ED1FC",
      "#0693E3",
      "#ABB8C3",
      "#EB144C",
      "#F78DA7",
      "#9900EF",
    ];
    this.state = {
      projectName: "",
      dateFrom: new Date(),
      dateTo: new Date(),
      multiEmail: true,
      emailOptions: [],
      background: "#000",
      displayColorPicker: false,
    };
    console.log("updatemodal",props);
  }

  async componentDidMount() {
    try {
      const { data } = await get(
        `workspaces/${this.props.workspaceId}/projects/${this.props.projectId}`
      );
      console.log("dataaaaa", data.project);

      this.setState({
        background: data.project.color_code,
        projectName: data.project.name,
      });
    } catch (e) {
      console.log("error", e);
    }
  }

  handleChangeInput = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleDateFrom = date => {
    this.setState({ dateFrom: date });
  };

  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  handleChangeMember = selected => {
    this.setState({ projectMembers: selected });
  };

  handleChangeComplete = (color, event) => {
    this.setState({ background: color.hex });
  };

  handleChangeColor = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  render() {
    return (
      <>
        <Modal
          className="project-modal"
          show={this.props.state.show}
          onHide={this.props.handleClose}
        >
          <div className="row no-margin">
            <div className="col-md-12 header">
              <span>Update Project</span>
              <button
                className="btn btn-link float-right"
                onClick={this.props.handleClose}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
            <div className="col-md-12 body">
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Name
                </div>
                <div className="col-md-10 d-inline-block">
                  <input
                    type="text"
                    name="projectName"
                    value={this.state.projectName}
                    onChange={this.handleChangeInput}
                    placeholder="Write Project Name here"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-2 d-inline-block no-padding label">
                  Duration
                </div>
                <div className="col-md-10 d-inline-block">
                  <div
                    className="col-md-6 d-inline-block"
                    style={{ "padding-left": "0" }}
                  >
                    <DatePicker
                      selected={this.state.dateFrom}
                      onChange={this.handleDateFrom}
                    />
                  </div>
                  <div
                    className="col-md-6 d-inline-block"
                    style={{ "padding-right": "0" }}
                  >
                    <DatePicker
                      selected={this.state.dateTo}
                      onChange={this.handleDateTo}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Members</div>
                <div className="col-md-10">
                  <Typeahead
                    id="projectMembers"
                    onChange={selected => this.handleChangeMember(selected)}
                    multiple={this.state.multiEmail}
                    options={this.state.emailOptions}
                    placeholder="Write Here"
                  />
                </div>
              </div>
              <div className="col-md-12 row no-margin no-padding input-row">
                <div className="col-md-2 no-padding label">Select Color</div>
                <div className="col-md-10">
                  <button
                    className="btn btn-default btn-color-picker"
                    style={{
                      backgroundColor: `${this.state.background}`,
                    }}
                    onClick={this.handleChangeColor}
                  />
                  {this.state.displayColorPicker ? (
                    <div onClick={this.handleColorPickerClose}>
                      <TwitterPicker
                        color={this.state.background}
                        onChangeComplete={this.handleChangeComplete}
                      >
                        <Twitter colors={this.colors} />
                      </TwitterPicker>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-md-12 no-padding input-row">
                <div className="col-md-5 ml-auto">
                  <button
                    type="button"
                    className="btn col-md-5 button1 btn-primary"
                    onClick={this.addProject}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn col-md-6 button2 btn-primary"
                    onClick={this.props.handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

UpdateProjectModal.propTypes = {
  state: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  workspaceId: PropTypes.string.isRequired
}

export default UpdateProjectModal;
