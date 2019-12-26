import React, { Component } from "react";
import EmailConfigurationModal from "./EmailConfigurationModal";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";
import AddAdminModal from "./AddAdminModal";
import { firstTwoLetter, textTitlize } from "../../../utils/function";
import { post, get, put } from "../../../utils/API";
import { toast } from "react-toastify";
import DailyPloyToast from "../../DailyPloyToast";
import RemoveAdminModal from "./RemoveAdminModal";
import EmailConfigModal from "./EmailConfigModal";
import { async } from "q";

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
      addAdminName: "",
      allUserArr: [],
      suggestions: [],
      isShowRemoveAdmin: false,
      showRemoveAdminId: "",
      toSearchText: "",
      toEmailSuggestions: [],
      selectToMembers: [],
      ccSearchText: "",
      ccEmailSuggestions: [],
      selectCcMembers: [],
      bccSearchText: "",
      bccEmailSuggestions: [],
      selectBccMembers: [],
      emailText: "",
      addAdminData: null,
      adminUserName: "",
      bccMails: [],
      ccMails: [],
      toMails: [],
      isConfig: true,
      isActive: true,
      activeStatus: "",
      toError: "",
      emailTextError: ""
    };
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (
      prevProps.state.userArr !== this.props.state.userArr ||
      prevState.addAdminEmail !== this.state.addAdminEmail
    ) {
      let selectedUser = this.props.state.userArr.members.filter(
        user => user.email === this.state.addAdminEmail
      );
      let addAdminId =
        selectedUser && selectedUser[0] ? selectedUser[0].id : null;
      let addAdminName =
        selectedUser && selectedUser[0] ? selectedUser[0].name : null;
      this.setState({
        addAdminId: addAdminId,
        addAdminName: addAdminName,
        allUserArr: this.props.state.adminUserArr
      });
    }
    if (
      prevProps.workspaceId !== this.props.workspaceId &&
      this.props.workspaceId != ""
    ) {
      try {
        const { data } = await get(
          `workspaces/${this.props.workspaceId}/members`
        );
        var members = data.members;
      } catch (e) {
        console.log("users Error", e);
      }
      this.setState({ members: members });

      try {
        const { data } = await get(
          `workspaces/${this.props.workspaceId}/workspace_settings/show_daily_status_mail`
        );
        if (data) {
          this.setState({
            toMails: data.to_mails,
            bccMails: data.bcc_mails,
            ccMails: data.cc_mails,
            selectToMembers:
              data.to_mails.length > 0
                ? this.filterEmailMember(data.to_mails, members)
                : [],
            selectBccMembers:
              data.bcc_mails.length > 0
                ? this.filterEmailMember(data.bcc_mails, members)
                : [],
            selectCcMembers:
              data.cc_mails.length > 0
                ? this.filterEmailMember(data.cc_mails, members)
                : [],
            isActive: data.is_active,
            emailText: data.email_text,
            isConfig: false,
            members: members
          });
        } else {
          this.setState({ isConfig: true });
        }
      } catch (e) {
        this.setState({ isConfig: true });
      }
    }
  };

  filterEmailMember = (emails, members) => {
    var filterMembers = [];
    emails.map(email => {
      var filterMember = members.filter(member => member.email === email);
      if (filterMember.length > 0) {
        filterMembers.push(...filterMember);
      }
    });
    return [...filterMembers];
  };

  displayEmails = emails => {
    return emails.map(email => {
      var emailName = textTitlize(email.split("@")[0]);
      var emailInitial = email
        .split("")
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return (
        <div className="email-box" style={{ marginRight: "5px" }}>
          <div className="email-icon">{emailInitial}</div>
          <span className="text-titlize">{emailName}</span>
        </div>
      );
    });
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
      addAdminSetShow: true,
      addAdminEmail: ""
    });
  };

  handleAddAdminClose = () => {
    this.setState({
      addAdminShow: false
    });
  };

  handleResumeShow = status => {
    this.setState({
      resumeShow: true,
      resumeSetShow: true,
      activeStatus: status
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

  handleToChange = e => {
    const { name, value } = e.target;
    let toEmailSuggestions = [];
    var searchOptions = this.props.state.userArr.members.map(user => user);
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      toEmailSuggestions = searchOptions
        .sort()
        .filter(v => regex.test(v.email));
    }
    this.setState({ [name]: value, toEmailSuggestions: toEmailSuggestions });
  };

  renderToSuggestions = () => {
    return (
      <>
        {this.state.toEmailSuggestions ? (
          <ul>
            {this.state.toEmailSuggestions.map((option, idx) => {
              return (
                <li
                  key={idx}
                  onClick={() => this.handleSelectToMembers(option)}
                >
                  <span className="right-left-space-5">
                    <span className="text-titlize">{option.name}</span>(
                    {option.email})
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </>
    );
  };

  handleSelectToMembers = option => {
    var selectToMembers = new Array(...this.state.selectToMembers);
    selectToMembers.push(option);
    var toEmailSuggestions = this.state.toEmailSuggestions.map(
      user => !selectToMembers.map(m => m.id).includes(user.id)
    );
    this.setState({
      toEmailSuggestions: [],
      toSearchText: "",
      selectToMembers: selectToMembers
    });
  };

  removeSelectedToTag = index => {
    var selectToMembers = this.state.selectToMembers;
    selectToMembers = selectToMembers.filter((_, idx) => idx !== index);
    this.setState({
      selectToMembers: selectToMembers
    });
  };

  initalChar = str => {
    var matches = str.match(/\b(\w)/g);
    return matches.join("").toUpperCase();
  };

  renderSelectedToMembers = () => {
    return (
      <>
        {this.state.selectToMembers.map((option, index) => {
          return (
            <div className="select-member" key={index}>
              <div className="member-title d-inline-block">
                {this.initalChar(option.name)}
              </div>
              <div className="right-left-space-5 d-inline-block">
                {option.name}
              </div>
              <a
                className="right-left-space-5 d-inline-block"
                onClick={() => this.removeSelectedToTag(index)}
              >
                {/* {state.taskButton === "Save" && state.user.role !== "admin" ? (
                  this.placeCloseIcon(option, state)
                ) : ( */}
                <i className="fa fa-close "></i>
                {/* )} */}
              </a>
            </div>
          );
        })}
      </>
    );
  };

  handleCcChange = e => {
    const { name, value } = e.target;
    let ccEmailSuggestions = [];
    var searchOptions = this.props.state.userArr.members.map(user => user);
    console.log(
      "this.props.state.userArr.members",
      this.props.state.userArr.members,
      "searchOptions",
      searchOptions
    );
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      ccEmailSuggestions = searchOptions
        .sort()
        .filter(v => regex.test(v.email));
    }
    console.log("toEmailSuggestions", ccEmailSuggestions);
    this.setState({ [name]: value, ccEmailSuggestions: ccEmailSuggestions });
  };

  renderCcSuggestions = () => {
    return (
      <>
        {this.state.ccEmailSuggestions ? (
          <ul>
            {this.state.ccEmailSuggestions.map((option, idx) => {
              return (
                <li
                  key={idx}
                  onClick={() => this.handleSelectCcMembers(option)}
                >
                  <span className="right-left-space-5">
                    <span className="text-titlize">{option.name}</span>(
                    {option.email})
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </>
    );
  };

  handleSelectCcMembers = option => {
    var selectCcMembers = new Array(...this.state.selectCcMembers);
    selectCcMembers.push(option);
    var ccEmailSuggestions = this.state.ccEmailSuggestions.map(
      user => !selectCcMembers.map(m => m.id).includes(user.id)
    );
    this.setState({
      ccEmailSuggestions: [],
      ccSearchText: "",
      selectCcMembers: selectCcMembers
    });
  };

  removeSelectedCcTag = index => {
    var selectCcMembers = this.state.selectCcMembers;
    selectCcMembers = selectCcMembers.filter((_, idx) => idx !== index);
    this.setState({
      selectCcMembers: selectCcMembers
    });
  };

  initalChar = str => {
    var matches = str.match(/\b(\w)/g);
    return matches.join("").toUpperCase();
  };

  renderSelectedCcMembers = () => {
    return (
      <>
        {this.state.selectCcMembers.map((option, index) => {
          return (
            <div className="select-member" key={index}>
              <div className="member-title d-inline-block">
                {this.initalChar(option.name)}
              </div>
              <div className="right-left-space-5 d-inline-block">
                {option.name}
              </div>
              <a
                className="right-left-space-5 d-inline-block"
                onClick={() => this.removeSelectedCcTag(index)}
              >
                {/* {state.taskButton === "Save" && state.user.role !== "admin" ? (
                  this.placeCloseIcon(option, state)
                ) : ( */}
                <i className="fa fa-close "></i>
                {/* )} */}
              </a>
            </div>
          );
        })}
      </>
    );
  };

  handleBccChange = e => {
    const { name, value } = e.target;
    let bccEmailSuggestions = [];
    var searchOptions = this.props.state.userArr.members.map(user => user);
    console.log(
      "this.props.state.userArr.members",
      this.props.state.userArr.members,
      "searchOptions",
      searchOptions
    );
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      bccEmailSuggestions = searchOptions
        .sort()
        .filter(v => regex.test(v.email));
    }
    this.setState({ [name]: value, bccEmailSuggestions: bccEmailSuggestions });
  };

  renderBccSuggestions = () => {
    return (
      <>
        {this.state.bccEmailSuggestions ? (
          <ul>
            {this.state.bccEmailSuggestions.map((option, idx) => {
              return (
                <li
                  key={idx}
                  onClick={() => this.handleSelectBccMembers(option)}
                >
                  <span className="right-left-space-5">
                    <span className="text-titlize">{option.name}</span>(
                    {option.email})
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </>
    );
  };

  handleSelectBccMembers = option => {
    var selectBccMembers = new Array(...this.state.selectBccMembers);
    selectBccMembers.push(option);
    var bccEmailSuggestions = this.state.bccEmailSuggestions.map(
      user => !selectBccMembers.map(m => m.id).includes(user.id)
    );
    this.setState({
      bccEmailSuggestions: [],
      bccSearchText: "",
      selectBccMembers: selectBccMembers
    });
  };

  removeSelectedBccTag = index => {
    var selectBccMembers = this.state.selectBccMembers;
    selectBccMembers = selectBccMembers.filter((_, idx) => idx !== index);
    this.setState({
      selectBccMembers: selectBccMembers
    });
  };

  renderSelectedBccMembers = () => {
    return (
      <>
        {this.state.selectBccMembers.map((option, index) => {
          return (
            <div className="select-member" key={index}>
              <div className="member-title d-inline-block">
                {this.initalChar(option.name)}
              </div>
              <div className="right-left-space-5 d-inline-block">
                {option.name}
              </div>
              <a
                className="right-left-space-5 d-inline-block"
                onClick={() => this.removeSelectedBccTag(index)}
              >
                {/* {state.taskButton === "Save" && state.user.role !== "admin" ? (
                  this.placeCloseIcon(option, state)
                ) : ( */}
                <i className="fa fa-close "></i>
                {/* )} */}
              </a>
            </div>
          );
        })}
      </>
    );
  };

  addAdmin = async () => {
    const addAdminData = {
      user_id: this.state.addAdminId
    };
    try {
      const { data } = await post(
        addAdminData,
        `workspaces/${this.props.state.workspaceId}/workspace_settings/add_admin`
      );
      console.log("data", data);
      let filterData = this.props.state.userArr.members.filter(
        user => user.id === this.state.addAdminId
      );
      let addData = [...this.props.state.adminUserArr, ...filterData];
      this.props.handleChangeAdminUsers(addData);
      toast(
        <DailyPloyToast
          message={`${textTitlize(this.state.addAdminName)} added as a Admin`}
          status="success"
        />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
      );
      this.setState({ addAdminShow: false, allUserArr: addData });
    } catch (e) {
      console.log("error", e);
    }
  };

  removeAdmin = async () => {
    const removeAdminData = {
      user_id: this.state.showRemoveAdminId
    };

    try {
      const { data } = await post(
        removeAdminData,
        `workspaces/${this.props.state.workspaceId}/workspace_settings/adminship_removal/`
      );
      let removeData = this.props.state.adminUserArr.filter(
        user => user.id !== this.state.showRemoveAdminId
      );
      this.props.handleChangeAdminUsers(removeData);
      toast(
        <DailyPloyToast
          message={`Removed ${textTitlize(
            this.state.adminUserName
          )} As Admin User`}
          status="success"
        />,
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        }
      );
      this.setState({
        removeShow: false,
        isShowRemoveAdmin: false,
        allUserArr: removeData
      });
    } catch (e) {
      console.log("error", e);
    }
  };

  emailConfigObject = () => {
    var configEmailStatusData = {
      is_active: this.state.isActive
    };
    var toMember = this.state.selectToMembers.map(e => e.email);
    var bccMember = this.state.selectBccMembers.map(e => e.email);
    var ccMember = this.state.selectCcMembers.map(e => e.email);

    toMember =
      toMember.length > 0 ? (configEmailStatusData["to_mails"] = toMember) : "";
    bccMember =
      bccMember.length > 0
        ? (configEmailStatusData["bcc_mails"] = bccMember)
        : "";
    ccMember =
      ccMember.length > 0 ? (configEmailStatusData["cc_mails"] = ccMember) : "";
    var emailText = this.state.emailText
      ? (configEmailStatusData["email_text"] = this.state.emailText)
      : "";
    return configEmailStatusData;
  };

  checkValidate = () => {
    var toError = "";
    var emailTextError = "";
    if (this.state.selectToMembers.length == 0) {
      toError = "please select to emails";
    }
    if (this.state.emailText == "") {
      emailTextError = "please enter email text";
    }
    this.setState({ toError: toError, emailTextError: emailTextError });
    return this.state.selectToMembers.length > 0 && this.state.emailText !== "";
  };

  configEmailStatus = async () => {
    var emailData = this.emailConfigObject();
    if (this.state.isConfig && this.checkValidate()) {
      try {
        const { data } = await post(
          emailData,
          `workspaces/${this.props.state.workspaceId}/workspace_settings/daily_status_mail_settings/`
        );
        this.setEmailState(data);
      } catch (e) {
        console.log("error", e);
      }
    } else if (!this.state.isConfig && this.checkValidate()) {
      try {
        const { data } = await put(
          emailData,
          `workspaces/${this.props.state.workspaceId}/update_daily_status_mail`
        );
        this.setEmailState(data);
      } catch (e) {
        console.log("error", e);
      }
    }
  };

  setEmailState = data => {
    this.setState({
      toMails: data.to_mails,
      bccMails: data.bcc_mails,
      ccMails: data.cc_mails,
      selectToMembers:
        data.to_mails.length > 0
          ? this.filterEmailMember(data.to_mails, this.state.members)
          : [],
      selectBccMembers:
        data.bcc_mails.length > 0
          ? this.filterEmailMember(data.bcc_mails, this.state.members)
          : [],
      selectCcMembers:
        data.cc_mails.length > 0
          ? this.filterEmailMember(data.cc_mails, this.state.members)
          : [],
      isActive: data.is_active,
      emailText: data.email_text,
      editShow: false,
      editSetShow: false,
      isConfig: false
    });
  };

  handleRemoveAdmin = (value, id, name) => {
    this.setState({
      showRemoveAdminId: id,
      isShowRemoveAdmin: !this.state.isShowRemoveAdmin,
      adminUserName: name
    });
  };

  handleEmailText = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  toggleActiveFlag = async flag => {
    try {
      const { data } = await put(
        { is_active: flag },
        `workspaces/${this.props.state.workspaceId}/update_daily_status_mail/`
      );
      this.setState({
        isActive: flag,
        resumeShow: false,
        resumeSetShow: false
      });
    } catch (e) {
      console.log("error", e);
    }
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
            <div className="d-inline-block box-btn">
              <button
                className={`btn btn-primary save-button ${
                  this.props.state.isSaveWorkspaceName
                    ? "btn-blue"
                    : "btn-disable"
                }`}
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
                <div className="text text-titlize">{admin.name}</div>
                <button
                  className="btn btn-link triple-dot"
                  onClick={() =>
                    this.handleRemoveAdmin(
                      this.state.isShowRemoveAdmin,
                      admin.id,
                      admin.name
                    )
                  }
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
                  {this.state.isConfig ? "configure" : "Edit"}
                </button>
              </div>
              <EmailConfigModal
                state={this.state}
                handleClose={this.handleEditClose}
                handleToChange={this.handleToChange}
                renderToSuggestions={this.renderToSuggestions}
                renderSelectedToMembers={this.renderSelectedToMembers}
                handleCcChange={this.handleCcChange}
                renderCcSuggestions={this.renderCcSuggestions}
                renderSelectedCcMembers={this.renderSelectedCcMembers}
                handleBccChange={this.handleBccChange}
                renderBccSuggestions={this.renderBccSuggestions}
                renderSelectedBccMembers={this.renderSelectedBccMembers}
                handleEmailText={this.handleEmailText}
                configEmailStatus={this.configEmailStatus}
              />
              <div className="col-md-6 no-padding d-inline-block">
                <div className="float-right">
                  {this.state.isActive ? (
                    <button
                      className="btn btn-primary suspend-btn"
                      onClick={() => this.handleResumeShow("suspend")}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary resume-btn"
                      onClick={() => this.handleResumeShow("resume")}
                    >
                      Resume
                    </button>
                  )}
                  <EmailConfigurationModal
                    state={this.state}
                    handleClose={this.handleResumeClose}
                    toggleActiveFlag={this.toggleActiveFlag}
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
                  {this.state.toMails.length > 0
                    ? this.displayEmails(this.state.toMails)
                    : ""}
                </div>
              </div>
              <div className="col-md-12 inner-container">
                <div className="col-md-1 no-padding time-desc d-inline-block">
                  Cc
                </div>
                <div className="col-md-9 no-padding d-inline-block">
                  {this.state.ccMails.length > 0
                    ? this.displayEmails(this.state.ccMails)
                    : ""}
                </div>
              </div>
              <div className="col-md-12 inner-container">
                <div className="col-md-1 no-padding time-desc d-inline-block">
                  Bcc
                </div>
                <div className="col-md-9 no-padding d-inline-block">
                  {this.state.bccMails.length > 0
                    ? this.displayEmails(this.state.bccMails)
                    : ""}
                </div>
              </div>
              <div className="col-md-12 inner-container">
                <div className="col-md-2 no-padding time-desc">Email Text</div>
                <div className="email-format">{this.state.emailText}</div>
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
            <button
              className="btn btn-link"
              style={{ pointerEvents: "none" }}
              onClick={this.handleDeleteShow}
            >
              comming soon...!
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
