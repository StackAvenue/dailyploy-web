import React, { Component } from "react";
import EmailConfigurationModal from "../WorkspaceSettings/EmailConfigurationModal";
import DeleteWorkspaceModal from "../WorkspaceSettings/DeleteWorkspaceModal";
import AddAdminModal from "./AddAdminModal";
import { firstTwoLetter } from "../../../utils/function";
import { post } from "../../../utils/API";
import { toast } from "react-toastify";
import DailyPloyToast from "../../DailyPloyToast";
import RemoveAdminModal from "./RemoveAdminModal";
import EmailConfigModal from "./EmailConfigModal";

class GeneralSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resumeShow: false,
      resumeSetShow: false,
      deleteShow: false,
      deleteSetShow: false,
      addAdminShow: false,
      addAdminSetShow: false,
      removeShow: false,
      removeSetShow: false,
      editShow: false,
      editSetShow: false,
      addAdminEmail: "",
      addAdminId: "",
      allUserArr: [],
      suggestions: [],
      isShowRemoveAdmin: false,
      showRemoveAdminId: ""
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.state.userArr !== this.props.state.userArr ||
      prevState.addAdminEmail !== this.state.addAdminEmail
    ) {
      let selectedUser = this.props.state.userArr.members.filter(
        user => user.email === this.state.addAdminEmail
      );
      let addAdminId = selectedUser[0] ? selectedUser[0].id : null;
      this.setState({ addAdminId: addAdminId });
    }
  };

  handleRemoveShow = () => {
    this.setState({
      removeShow: true,
      removeSetShow: true
    });
  };

  handleRemoveClose = () => {
    this.setState({
      removeShow: false,
      isShowRemoveAdmin: false
    });
  };

  handleEditShow = () => {
    this.setState({
      editShow: true,
      editSetShow: true
    });
  };

  handleEditClose = () => {
    this.setState({
      editShow: false
    });
  };

  handleAddAdminShow = () => {
    this.setState({
      addAdminShow: true,
      addAdminSetShow: true
    });
  };

  handleAddAdminClose = () => {
    this.setState({
      addAdminShow: false
    });
  };

  handleResumeShow = () => {
    this.setState({
      resumeShow: true,
      resumeSetShow: true
    });
  };

  handleResumeClose = () => {
    this.setState({
      resumeShow: false
    });
  };
  handleDeleteShow = () => {
    this.setState({
      deleteShow: true,
      deleteSetShow: true
    });
  };

  handleDeleteClose = () => {
    this.setState({
      deleteShow: false
    });
  };

  adminEmailHandleChange = e => {
    const { name, value } = e.target;
    let suggestions = [];
    let memberList = this.props.state.userArr.members.filter(
      user => user.role === "member"
    );
    var searchOptions = memberList.map(user => user.email);
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = searchOptions.sort().filter(v => regex.test(v));
    }
    this.setState({ [name]: value, suggestions: suggestions });
  };

  selectAutoSuggestion = option => {
    var filterArr = this.props.state.userArr.members.filter(
      user => user.email === option
    );
    this.setState({ addAdminEmail: filterArr[0].email, suggestions: [] });
  };

  autoSearchSuggestion = () => {
    return (
      <>
        {this.state.suggestions ? (
          <ul>
            {this.state.suggestions.map((option, idx) => {
              return (
                <li key={idx} onClick={() => this.selectAutoSuggestion(option)}>
                  <i className="fa fa-user"></i> {option}
                </li>
              );
            })}
          </ul>
        ) : null}
      </>
    );
  };

  addAdmin = () => {
    const addAdminData = {
      user_id: this.state.addAdminId
    };
    try {
      const { data } = post(
        addAdminData,
        `workspaces/${this.props.state.workspaceId}/workspace_settings/add_admin`
      );

      toast(
        <DailyPloyToast message="Admin add Successful" status="success" />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
      );
      this.setState({ addAdminShow: false });
    } catch (e) {
      console.log("error", e);
    }
  };

  removeAdmin = () => {
    const removeAdminData = {
      user_id: this.state.showRemoveAdminId
    };

    try {
      const { data } = post(
        removeAdminData,
        `workspaces/${this.props.state.workspaceId}/workspace_settings/adminship_removal/`
      );
      toast(<DailyPloyToast message="Remove Admenship" status="success" />, {
        autoClose: 2000,
        position: toast.POSITION.TOP_CENTER
      });
      this.setState({ removeShow: false, isShowRemoveAdmin: false });
    } catch (e) {
      console.log("error", e);
    }
  };

  handleRemoveAdmin = (value, id) => {
    this.setState({ showRemoveAdminId: id, isShowRemoveAdmin: value });
  };

  render() {
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
                name="workspaceName"
                value={this.props.state.workspaceName}
                onChange={this.props.worskpaceNameHandler}
              />
            </div>
            <div className="d-inline-block">
              <button
                className="btn btn-primary save-button"
                onClick={this.props.updateWorkspaceName}
              >
                Save
              </button>
            </div>
          </div>
          <div className="col-md-12 workspace-name">
            <div className="col-md-2 no-padding name">Admins</div>
          </div>
          <div className="col-md-12 admin-add">
            {this.props.state.adminUserArr.map((admin, index) => (
              <div className="admin-box" key={index}>
                <div className="img-box">{firstTwoLetter(admin.name)}</div>
                <div className="text">{admin.name}</div>
                <button
                  className="btn btn-link triple-dot"
                  onClick={() => this.handleRemoveAdmin(true, admin.id)}
                  // onBlur={() => this.handleRemoveAdmin(false, admin.id)}
                >
                  <i className="fas fa-ellipsis-v"></i>
                </button>
                <div style={{ position: "absolute" }}>
                  {this.state.isShowRemoveAdmin &&
                  this.state.showRemoveAdminId === admin.id ? (
                    <>
                      <button
                        className="btn btn-primary remove-btn"
                        onClick={this.handleRemoveShow}
                      >
                        Remove
                      </button>
                      <RemoveAdminModal
                        state={this.state}
                        handleClose={this.handleRemoveClose}
                        removeAdmin={this.removeAdmin}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            ))}

            <button
              className="btn btn-primary addnew-button"
              onClick={this.handleAddAdminShow}
            >
              {" "}
              + Add New
            </button>
            <AddAdminModal
              state={this.state}
              handleClose={this.handleAddAdminClose}
              onChange={this.adminEmailHandleChange}
              addAdmin={this.addAdmin}
              autoSearchSuggestion={this.autoSearchSuggestion}
            />
          </div>
          <div className="col-md-12 hr1"></div>
          <div className="col-md-12 config-heading">Email Configuration</div>
          <div className="config-email-box">
            <div className="col-md-12 heading">
              <div className="col-md-6 no-padding d-inline-block">
                Daily Status Mail
                <button className="btn btn-link" onClick={this.handleEditShow}>
                  Edit
                </button>
              </div>
              <EmailConfigModal
                state={this.state}
                handleClose={this.handleEditClose}
              />
              <div className="col-md-6 no-padding d-inline-block">
                <div className="float-right">
                  <button
                    className="btn btn-primary resume-btn"
                    onClick={this.handleResumeShow}
                  >
                    Suspend
                  </button>
                  <EmailConfigurationModal
                    state={this.state}
                    handleClose={this.handleResumeClose}
                  />
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
                  is dummy text in typesetting industry. Lorem ipsum is dummy
                  text in typesetting industry. Lorem ipsum is dummy text in
                  typesetting industry. <br />
                  <br />
                  Regards,
                  <br /> Aishwarya Chandan
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 hr1"></div>
          <div className="col-md-12 config-heading">Workspace Preferences</div>
          <div className="col-md-12 box config-email-box">
            <div className="col-md-12 inner-box">
              <div className="col-md-2 d-inline-block no-padding name">
                Currency
              </div>
              <div className="col-md-5 d-inline-block">
                <select className="form-control input">
                  <option>INR - Indian Rupee</option>
                  <option>USD - US Dollar</option>
                  <option>INR - Indian Rupee</option>
                </select>
              </div>
            </div>
            <div className="col-md-12 inner-box">
              <div className="col-md-2 d-inline-block no-padding name">
                Time Zone
              </div>
              <div className="col-md-5 d-inline-block">
                <select className="form-control input">
                  <option>(GMT+5:30) Kolkata</option>
                  <option>(GMT+5:30) Kolkata</option>
                  <option>(GMT+5:30) Kolkata</option>
                </select>
              </div>
            </div>
            <div className="col-md-5 workdays-text">Work Days</div>
            <div className="col-md-5 workdays">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-1`}
                        type="checkbox"
                        name="isChecked"
                      />
                      <label
                        htmlFor="styled-checkbox-1"
                        className="check"
                      ></label>
                    </td>
                    <td className="text" colSpan="2">
                      Sunday
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-1`}
                        type="checkbox"
                        name="isChecked"
                      />
                      <label
                        htmlFor={`styled-checkbox-1`}
                        className="check"
                      ></label>
                    </td>
                    <td className="text">Monday</td>
                    <td>
                      <select>
                        <option>1</option>
                        <option>2</option>
                      </select>
                    </td>
                    <td className="hrs">hrs</td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-1`}
                        type="checkbox"
                        name="isChecked"
                      />
                      <label
                        htmlFor={`styled-checkbox-1`}
                        className="check"
                      ></label>
                    </td>
                    <td className="text">Tuesday</td>
                    <td>
                      <select>
                        <option>1</option>
                        <option>2</option>
                      </select>
                    </td>
                    <td className="hrs">hrs</td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-1`}
                        type="checkbox"
                        name="isChecked"
                      />
                      <label
                        htmlFor={`styled-checkbox-1`}
                        className="check"
                      ></label>
                    </td>
                    <td className="text">Wednesday</td>
                    <td>
                      <select>
                        <option>1</option>
                        <option>2</option>
                      </select>
                    </td>
                    <td className="hrs">hrs</td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-1`}
                        type="checkbox"
                        name="isChecked"
                      />
                      <label
                        htmlFor={`styled-checkbox-1`}
                        className="check"
                      ></label>
                    </td>
                    <td className="text">Thrusday</td>
                    <td>
                      <select>
                        <option>1</option>
                        <option>2</option>
                      </select>
                    </td>
                    <td className="hrs">hrs</td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-1`}
                        type="checkbox"
                        name="isChecked"
                      />
                      <label
                        htmlFor={`styled-checkbox-1`}
                        className="check"
                      ></label>
                    </td>
                    <td className="text">Friday</td>
                    <td>
                      <select>
                        <option>1</option>
                        <option>2</option>
                      </select>
                    </td>
                    <td className="hrs">hrs</td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        className="styled-checkbox"
                        id={`styled-checkbox-6`}
                        type="checkbox"
                        name="isChecked"
                      />
                      <label
                        htmlFor={`styled-checkbox-6`}
                        className="check"
                      ></label>
                    </td>
                    <td className="text" colSpan="2">
                      Saturday
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-12 box-btn">
              <button className="btn btn-default button">Save</button>
            </div>
          </div>
          <div className="col-md-12 hr1"></div>
          <div className="col-md-12 config-heading">Delete Workspace</div>
          <div className="col-md-12 delete-text">
            Deleting a Dailyploy workspace cannot be undone. All data will be
            deleted and irretrievable.
            <button className="btn btn-link" onClick={this.handleDeleteShow}>
              Delete Team
            </button>
            <DeleteWorkspaceModal
              state={this.state}
              handleClose={this.handleDeleteClose}
            />
          </div>
        </div>
      </>
    );
  }
}

export default GeneralSettings;
