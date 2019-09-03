import React from "react";
import { Modal, Tabs, Tab } from "react-bootstrap";

const AddWorkspaceModal = props => {
  return (
    <Modal
      show={props.state.show}
      onHide={props.onHideModal}
      className="workspace-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New Workspace</Modal.Title>
      </Modal.Header>

      <div className="col-md-12 worksapce-tab">
        <Tabs defaultActiveKey="individual" id="uncontrolled-tab-example">
          <Tab eventKey="individual" title="Individual">
            <div className="col-md-12 no-padding">
              <div className="col-md-12 name">Your Name</div>
              <div className="col-md-12 input">
                <input
                  type="text"
                  placeholder="Write Here"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-12 no-padding">
              <div className="col-md-12 name">
                Password
                <span> (Min 8 characters with at least one number)</span>
              </div>
              <div className="col-md-12 input">
                <input
                  type="password"
                  placeholder="Write Here"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-12 no-padding">
              <div className="col-md-12 name">
                <input type="checkbox" />
                <span>
                  {" "}
                  I agree to the terms & conditions and privacy policy
                </span>
              </div>
            </div>
            <div className="col-md-12 text-right no-padding">
              <button className="btn btn-primary create-btn">Create</button>
              <button
                className="btn btn-primary cancel-btn"
                onClick={props.onHideModal}
              >
                Cancel
              </button>
            </div>
          </Tab>
          <Tab eventKey="organization" title="Organization">
            <div className="col-md-12 no-padding">
              <div className="col-md-12 name">Your Name</div>
              <div className="col-md-12 input">
                <input
                  type="text"
                  placeholder="Write Here"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-12 no-padding">
              <div className="col-md-12 name">
                Password
                <span> (Min 8 characters with at least one number)</span>
              </div>
              <div className="col-md-12 input">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-12 no-padding">
              <div className="col-md-12 name">Organisation Name</div>
              <div className="col-md-12 input">
                <input
                  type="text"
                  placeholder="Organisation Name"
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-12 no-padding">
              <div className="col-md-12 name">
                <input type="checkbox" />
                <span>
                  {" "}
                  I agree to the terms & conditions and privacy policy
                </span>
              </div>
            </div>
            <div className="col-md-12 text-right no-padding">
              <button className="btn btn-primary create-btn">Create</button>
              <button
                className="btn btn-primary cancel-btn"
                onClick={props.onHideModal}
              >
                Cancel
              </button>
            </div>
          </Tab>
        </Tabs>
      </div>
    </Modal>
  );
};

export default AddWorkspaceModal;
