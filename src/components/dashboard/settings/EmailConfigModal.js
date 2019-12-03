import React from "react";
import { Modal } from "react-bootstrap";
import Close from "../../../assets/images/close.svg";

const EmailConfigModal = props => {
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
                  {/* <div>
                      <div className="d-inline-block selected-tags text-titlize">
                        {this.renderSelectedMembers()}
                      </div>
                      <input className="d-inline-block"
                        type="text" value={this.state.memberSearchText}
                        placeholder="Select Memebrs"
                        onChange={this.onSearchMemberTextChange}
                      />
                    </div>
                    <div className="suggestion-holder">
                      {this.renderMembersSearchSuggestion()}
                    </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-12 input-row">
              <div className="col-md-2 label">Cc</div>
              <div className="col-md-10 no-padding d-inline-block">
                <div className="project-member-search">
                  {/* <div>
                      <div className="d-inline-block selected-tags text-titlize">
                        {this.renderSelectedMembers()}
                      </div>
                      <input className="d-inline-block"
                        type="text" value={this.state.memberSearchText}
                        placeholder="Select Memebrs"
                        onChange={this.onSearchMemberTextChange}
                      />
                    </div>
                    <div className="suggestion-holder">
                      {this.renderMembersSearchSuggestion()}
                    </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-12 input-row">
              <div className="col-md-2 label">Bcc</div>
              <div className="col-md-10 no-padding d-inline-block">
                <div className="project-member-search">
                  {/* <div>
                      <div className="d-inline-block selected-tags text-titlize">
                        {this.renderSelectedMembers()}
                      </div>
                      <input className="d-inline-block"
                        type="text" value={this.state.memberSearchText}
                        placeholder="Select Memebrs"
                        onChange={this.onSearchMemberTextChange}
                      />
                    </div>
                    <div className="suggestion-holder">
                      {this.renderMembersSearchSuggestion()}
                    </div> */}
                </div>
              </div>
            </div>
            <div className="col-md-12 input-row">
              <div className="col-md-2 label">Email text</div>
              <div className="col-md-10 no-padding d-inline-block">
                <textarea></textarea>
              </div>
            </div>
            <div className="col-md-12 no-padding input-row">
              <div className="col-md-4 ml-auto no-padding">
                <button
                  type="button"
                  className="btn col-md-5 button1 btn-primary"
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
