import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import PropTypes from 'prop-types';

class ReportTimeTrackEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false
    };
  }

  render() {
    const { props } = this;
    return (
      <>
        <Modal
          className="confirm-modal report-edit-timetrack"
          show={props.state.editable}
          style={{ paddingTop: "1.5%", paddingBottom: "30px" }}
        >
          <div
            className="row no-margin"
            style={{ padding: "0px 0px 20px 0px" }}
          >
            <div className="col-md-12 d-inline-block header text-titlize">
              <div className="d-inline-block" style={{ width: "60%" }}>
                <span>Edit Time Track</span>
              </div>
              <button
                className="d-inline-block btn btn-link float-right"
                onClick={props.closeModal}
              >
                <span>
                  <i className="fa fa-close"></i>
                </span>
              </button>
            </div>
            <div className="col-md-12  no-padding">
              <div className="col-md-12 time-edit no-padding d-inline-block">
                <div className="col-md-4 d-inline-block">Start DateTime</div>
                <div className="col-md-6 d-inline-block track-time-edit">
                  <DatePicker
                    selected={new Date(props.state.fromDateTime)}
                    onChange={date => props.handleTimeFrom(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="d MMM, HH:mm"
                  />
                </div>
              </div>
              <div
                className="col-md-12 time-edit  no-padding d-inline-block"
                style={{ marginTop: "15px" }}
              >
                <div className="col-md-4 d-inline-block">End DateTime</div>
                <div className="col-md-6 d-inline-block track-time-edit">
                  <DatePicker
                    selected={new Date(props.state.toDateTime)}
                    onChange={date => props.handleTimeTo(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="d MMM, HH:mm"
                  />
                </div>
                {props.state.trackTimeError ? (
                  <>
                    <div className="col-md-3 d-inline-block"></div>
                    <div
                      className="col-md-9 d-inline-block error"
                      style={{ fontSize: "13px" }}
                    >
                      {props.state.trackTimeError}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="col-md-12 action-btn">
                <button
                  type="button"
                  className="btn pull-right button3 btn-primary"
                  onClick={props.closeModal ? props.closeModal : null}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="button2 pull-right btn-primary text-titlize"
                  onClick={() => props.editTimeTrack()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}
ReportTimeTrackEditModal.propTypes = {
  state: PropTypes.object.isRequired,
  editTimeTrack: PropTypes.func.isRequired,
  handleTimeFrom: PropTypes.func.isRequired,
  handleTimeTo: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
}

export default ReportTimeTrackEditModal;
