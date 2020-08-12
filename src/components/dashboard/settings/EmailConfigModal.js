import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";

const EmailConfigModal = (props) => {
  return (
    <>
      <Modal
        show={props.state.editShow}
        onHide={props.handleClose}
        className="email-config-modal"
      >
        <div className="row config-modal-box">
          <div className="col-md-12 header">
            <span>Edit Daily Status Mail</span>
            <button
              className="btn btn-link pull-right"
              onClick={props.handleClose}
            >
              <img src={Close} alt="close" />
            </button>
          </div>
          <div className="col-md-11 body">
            <div className="col-md-12 input-row">
              <div className="col-md-2 label">To</div>
              <div className="col-md-10 no-padding d-inline-block">
                <div className="project-member-search">
                  <div>
                    <div className="d-inline-block selected-tags text-titlize">
                      {props.renderSelectedToMembers()}
                    </div>
                    <input
                      className="d-inline-block"
                      name="toSearchText"
                      type="text"
                      value={props.state.toSearchText}
                      placeholder="Select Members"
                      onChange={props.handleToChange}
                    />
                  </div>
                  <div className="suggestion-holder">
                    {props.renderToSuggestions()}
                  </div>
                </div>
              </div>
              {props.state.toError ? (
                <>
                  <div className="col-md-2 label"></div>
                  <div className="col-md-10 no-padding d-inline-block">
                    <span className="error">{props.state.toError}</span>
                  </div>
                </>
              ) : null}
            </div>
            <div className="col-md-12 input-row">
              <div className="col-md-2 label">Cc</div>
              <div className="col-md-10 no-padding d-inline-block">
                <div className="project-member-search">
                  <div>
                    <div className="d-inline-block selected-tags text-titlize">
                      {props.renderSelectedCcMembers()}
                    </div>
                    <input
                      className="d-inline-block"
                      name="ccSearchText"
                      type="text"
                      value={props.state.ccSearchText}
                      placeholder="Select Members"
                      onChange={props.handleCcChange}
                    />
                  </div>
                  <div className="suggestion-holder">
                    {props.renderCcSuggestions()}
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="col-md-12 input-row">
              <div className="col-md-2 label">Bcc</div>
              <div className="col-md-10 no-padding d-inline-block">
                <div className="project-member-search">
                  <div>
                    <div className="d-inline-block selected-tags text-titlize">
                      {props.renderSelectedBccMembers()}
                    </div>
                    <input
                      className="d-inline-block"
                      name="bccSearchText"
                      type="text"
                      value={props.state.bccSearchText}
                      placeholder="Select Memebrs"
                      onChange={props.handleBccChange}
                    />
                  </div>
                  <div className="suggestion-holder">
                    {props.renderBccSuggestions()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 input-row">
              <div className="col-md-2 label">Email text</div>
              <div className="col-md-10 no-padding d-inline-block">
                <textarea
                  name="emailText"
                  value={props.state.emailText}
                  onChange={props.handleEmailText}
                ></textarea>
              </div>
              {props.state.emailTextError ? (
                <>
                  <div className="col-md-2 label"></div>
                  <div className="col-md-10 no-padding d-inline-block">
                    <span className="error">{props.state.emailTextError}</span>
                  </div>
                </>
              ) : null}
            </div>  */}

            <div className="col-md-12 no-padding input-row">
              <div className="col-md-4 ml-auto no-padding">
                <button
                  type="button"
                  className="btn col-md-5 button1 btn-primary"
                  onClick={props.configEmailStatus}
                >
                  Save
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

export default EmailConfigModal;
