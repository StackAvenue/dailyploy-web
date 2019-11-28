import React from "react";

const GeneralSettings = props => {
  return (
    <>
      <div className="row no-margin general-setting">
        <div className="col-md-12 workspace-name">
          <div className="col-md-2 d-inline-block no-padding name">
            Workspace Name
          </div>
          <div className="col-md-6 d-inline-block">
            <input
              type="text"
              placeholder="Workspace Name"
              className="form-control input"
            />
          </div>
          <div className="d-inline-block">
            <button className="btn btn-primary save-button">Save</button>
          </div>
        </div>
        <div className="col-md-12 workspace-name">
          <div className="col-md-2 no-padding name">Admins</div>
        </div>
        <div className="col-md-12 admin-add">
          <div className="admin-box">
            <div className="img-box">AJ</div>
            <div className="text">Arpit Jain</div>
            <div className="triple-dot">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div className="admin-box">
            <div className="img-box">AJ</div>
            <div className="text">Arpit Jain</div>
            <div className="triple-dot">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div className="admin-box">
            <div className="img-box">AJ</div>
            <div className="text">Arpit Jain</div>
            <div className="triple-dot">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div className="admin-box">
            <div className="img-box">AJ</div>
            <div className="text">Arpit Jain</div>
            <div className="triple-dot">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div className="admin-box">
            <div className="img-box">AJ</div>
            <div className="text">Arpit Jain</div>
            <div className="triple-dot">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div className="admin-box">
            <div className="img-box">AJ</div>
            <div className="text">Arpit Jain</div>
            <div className="triple-dot">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div className="admin-box">
            <div className="img-box">AJ</div>
            <div className="text">Arpit Jain</div>
            <div className="triple-dot">
              <i class="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <button className="btn btn-primary addnew-button"> + Add New</button>
        </div>
        <div className="col-md-12 hr1"></div>
        <div className="config-email-box">
          <div className="col-md-12 heading">
            <div className="col-md-6 no-padding d-inline-block">
              Daily Status Mail<button className="btn btn-link">Edit</button>
            </div>
            <div className="col-md-6 no-padding d-inline-block">
              <div className="float-right">
                <button
                  className="btn btn-primary resume-btn"
                  // onClick={this.handleShow}
                >
                  Resume
                </button>
                {/* <EmailConfigurationModal
                state={this.state}
                handleClose={this.handleClose}
              /> */}
              </div>
            </div>
          </div>
          <div className="col-md-12 box no-padding">
            <div className="col-md-12 time-desc">
              Daily status email will be sent by default at 12:00 AM everyday.
            </div>
            <div className="col-md-12 inner-container">
              <div className="col-md-1 no-padding time-desc d-inline-block">
                To
              </div>
              <div className="col-md-9 no-padding d-inline-block">
                <div className="email-box">
                  <div className="email-icon">AJ</div>
                  <span>Arpit Jain</span>
                </div>
              </div>
            </div>
            <div className="col-md-12 inner-container">
              <div className="col-md-1 no-padding time-desc d-inline-block">
                Cc
              </div>
              <div className="col-md-9 no-padding d-inline-block">
                <div className="email-box">
                  <div className="email-icon">AJ</div>
                  <span>Arpit Jain</span>
                </div>
              </div>
            </div>
            <div className="col-md-12 inner-container">
              <div className="col-md-1 no-padding time-desc d-inline-block">
                Bcc
              </div>
              <div className="col-md-9 no-padding d-inline-block">
                <div className="email-box">
                  <div className="email-icon">AJ</div>
                  <span>Arpit Jain</span>
                </div>
              </div>
            </div>
            <div className="col-md-12 inner-container">
              <div className="col-md-1 no-padding time-desc">Email Text</div>
              <div className="email-format">
                <br />
                Lorem ipsum is dummy text in typesetting industry. Lorem ipsum
                is dummy text in typesetting industry. Lorem ipsum is dummy text
                in typesetting industry. Lorem ipsum is dummy text in
                typesetting industry. <br />
                <br />
                Regards,
                <br /> Aishwarya Chandan
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-12 hr1"></div>
      </div>
    </>
  );
};

export default GeneralSettings;
