import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import { TwitterPicker, Twitter } from "react-color";
import "react-datepicker/dist/react-datepicker.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

const AddProjectModal = props => {
  return (
    <>
      <Modal
        className="project-modal"
        show={props.state.show}
        onHide={props.handleClose}
      >
        <div className="row no-margin">
          <div className="col-md-12 header">
            <span>Add New Project</span>
            <button
              className="btn btn-link float-right"
              onClick={props.handleClose}
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
                  onChange={props.handleChangeInput}
                  placeholder="Write Project Name here"
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                Start Date
              </div>
              <div
                className="col-md-6 d-inline-block date-picker-container no-padding"
              >
                <div className="col-md-3 d-inline-block date-text-light"><span>From:</span></div>
                <div className="col-md-9 d-inline-block">
                  <DatePicker
                    selected={props.state.dateFrom}
                    onChange={props.handleDateFrom}
                    placeholderText="Select Date"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12 no-padding input-row">
              <div className="col-md-2 d-inline-block no-padding label">
                End Date
              </div>
              <div className="col-md-10 d-inline-block no-padding">
                <div className="col-md-6 d-inline-block date-picker-container no-padding">
                  <div className="col-md-3 d-inline-block date-text-light "><span>To:</span></div>
                  <div className="col-md-9 d-inline-block">
                    <DatePicker
                      onChange={props.handleDateTo}
                      placeholderText="Select Date"
                    />
                  </div>
                </div>

                <div className="col-md-6 d-inline-block left-padding-50px custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input d-inline-block"
                    id="endDateUndefined"
                  />
                  <label
                    className="custom-control-label d-inline-block"
                    htmlFor="endDateUndefined"
                  >Undefined</label>
                </div>
              </div>
            </div>
            <div className="col-md-12 row no-margin no-padding input-row">
              <div className="col-md-2 no-padding label">Members</div>
              <div className="col-md-10">
                <Typeahead
                  id="projectMembers"
                  onChange={selected => props.handleChangeMember(selected)}
                  multiple={props.state.multiEmail}
                  options={props.emailOptions}
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
                    backgroundColor: `${props.state.background}`,
                  }}
                  onClick={props.handleChangeColor}
                />
                {props.state.displayColorPicker ? (
                  <div onClick={props.handleColorPickerClose}>
                    <TwitterPicker
                      color={props.state.background}
                      onChangeComplete={props.handleChangeComplete}
                    >
                      <Twitter colors={props.colors} />
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
                  onClick={props.addProject}
                >
                  {props.btnText}
                </button>
                <button
                  type="button"
                  className="btn col-md-6 button2 btn-primary"
                  onClick={props.handleClose}
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
};

export default AddProjectModal;
