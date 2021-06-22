import React, { Component } from "react";
import "../../assets/css/dashboard.scss";
import { Dropdown } from "react-bootstrap";
import Add from "../../assets/images/add.svg";
import { get, post, mockPost } from "../../utils/API";
import {
  validateName,
  validateEmail,
  validatePhone,
} from "../../utils/validation";
import { toast } from "react-toastify";
import AddProjectModal from "./AddProjectModal";
import AddMemberModal from "./AddMemberModal";
import Tabs from "./MenuBar/Tabs";
import ConditionalElements from "./MenuBar/ConditionalElements";
import DailyPloyToast from "./../DailyPloyToast";
import cookie from "react-cookies";
import { USER_ROLE } from "../../utils/Constants";
import AOS from "aos";
import PropTypes from 'prop-types';
import ErrorBoundary from '../../ErrorBoundary';

export default class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.sortValues = [
      {
        content: "Daily",
        value: "day",
      },
      {
        content: "Weekly",
        value: "week",
      },
      {
        content: "Monthly",
        value: "month",
      },
    ];
    this.colors = [
      "#b9e1ff",
      "#ffc1de",
      "#4fefde",
      "#c7d0ff",
      "#ffc6ac",
      "#ffa2a2",
      "#e9ff71",
      "#d7a0ff",
    ];
    this.state = {
      projectName: "",
      projectMembers: [],
      sort: "week",
      show: false,
      setShow: false,
      memberShow: false,
      memberSetShow: false,
      dateFrom: new Date(),
      dateTo: "",
      multiEmail: true,
      background: "#b9e1ff",
      displayColorPicker: false,
      emailOptions: [],
      memberName: "",
      memberEmail: "",
      memberAccess: "",
      memberRole: "",
      memberWorkingHours: "",
      memberProject: "",
      isLoading: false,
      logedInUserEmail: "",
      disabledDateTo: false,
      disableColor: "#fff",
      suggestions: [],
      projectsListing: [],
      userRole: null,
      selectedTags: [],
      btnEnable: true,
      error: "",
      monthlyExpense: null,
      hourlyExpense: null,
      memberWorkingHoursError: "",
      memberRoleError: "",
      memberEmailError: "",
      memberNameError: "",
      saveDisable: true,
      reset: false,
      monthlyBudget: "",
      contacts: [
        {
          name: "",
          email: "",
          phone_number: "",
        },
      ],
    };
  }

  async componentDidMount() {
    var loggedInData = cookie.load("loggedInUser");
    if (!loggedInData) {
      try {
        const { data } = await get("logged_in_user");
        this.setState({ logedInUserEmail: data.email });
      } catch (e) {
        console.log("err", e);
      }
    } else {
      this.setState({ logedInUserEmail: loggedInData.email });
    }
  }

  componentDidMount() {
    AOS.init({
      duration: 2000
    });
  }

  handleContactChangeInput = (e, idx) => {
    const { name, value } = e.target;
    var contacts = this.state.contacts;
    let contact = contacts.find((contact, index) => idx === index);
    contact[name] = value;
    this.setState({
      contacts: contacts,
    });
  };

  addContactsRow = () => {
    let contacts = this.state.contacts;
    contacts.push({
      name: "",
      email: "",
      phone_number: "",
    });
    this.setState({
      contacts: contacts,
    });
  };

  removeContactsRow = (idx) => {
    let contacts = this.state.contacts.filter((contact, index) => idx != index);
    this.setState({
      contacts: contacts,
    });
  };

  validateContackts = () => {
    var flag = true;
    var updatedContacts = this.state.contacts;
    if (
      this.state.contacts.length == 1 &&
      this.state.contacts[0].name == "" &&
      this.state.contacts[0].email == "" &&
      this.state.contacts[0].phone_number == ""
    ) {
      flag = true;
    } else {
      var updatedContacts = this.state.contacts.map((contact) => {
        let nm = validateName(contact.name);
        if (nm) {
          contact["nameError"] = nm;
          flag = false;
        } else {
          contact["nameError"] = null;
        }
        let em = validateEmail(contact.email);
        let ph = validatePhone(contact.phone_number);
        if (contact.email == "" && contact.phone_number == "") {
          if (em) {
            contact["emailError"] = em;
            flag = false;
          } else {
            contact["emailError"] = null;
          }
          if (ph) {
            contact["phoneError"] = ph;
            flag = false;
          } else {
            contact["phoneError"] = null;
          }
        } else if (contact.email != "" && contact.phone_number != "") {
          if (em) {
            contact["emailError"] = em;
            flag = false;
          } else {
            contact["emailError"] = null;
          }
          if (ph) {
            contact["phoneError"] = ph;
            flag = false;
          } else {
            contact["phoneError"] = null;
          }
        } else if (contact.email != "" || contact.phone_number != "") {
          if (contact.email != "" && em) {
            contact["emailError"] = em;
            flag = false;
          } else {
            contact["emailError"] = null;
          }
          if (contact.phone_number != "" && ph) {
            contact["phoneError"] = ph;
            flag = false;
          } else {
            contact["phoneError"] = null;
          }
        }
        return contact;
      });
    }
    this.setState({
      contacts: updatedContacts,
    });
    return flag;
  };

  addProject = async () => {
    let addOwner = [];
    addOwner.push(this.props.state.userId);
    var self = this;
    var preProjectData = {}
    this.handleClose();
    if (this.state.projectName != "") {
      if (this.validateContackts()) {
        this.setState({ saveDisable: true });
        const projectData = {
          project: {
            name: this.state.projectName,
            start_date: this.state.dateFrom,
            end_date: this.state.dateTo,
            monthly_budget: this.state.monthlyBudget,
            members: !this.state.projectMembers.includes(
              this.props.state.userId
            )
              ? [...this.state.projectMembers, ...addOwner]
              : this.state.projectMembers,
            color_code: this.state.background,
          },
        };

        preProjectData = {
          project: {
            color_code: this.state.background,
            contacts: [],
            created_at: Date.now(),
            description: null,
            end_date: null,
            id: 99999,
            members: [{ email: " ", id: 99, name: " " }],
            name: this.state.projectName,
            start_date: "2020-05-20"
          }
        };
        this.props.manageProjectListing(preProjectData.project, 0);

        if (this.state.contacts.length > 0) {
          projectData.project["contacts"] = this.state.contacts;
        }
        try {
          const { data } = await post(
            projectData,
            `workspaces/${this.props.workspaceId}/projects`
          );
          // toast(
          //   <DailyPloyToast
          //     message="Project added successfully!"
          //     status="success"
          //   />,
          //   { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
          // );
          console.log(data)
          console.log(projectData)

          this.props.manageProjectListing(data.project, 1);
          this.props.handleLoad(false);
        } catch (e) {
          if (e.response && e.response.data) {
            var errors = e.response.data.errors;
            if (errors && errors.project_name_workspace_uniqueness) {
              toast(
                  <DailyPloyToast
                    message={`Project Name ${errors.project_name_workspace_uniqueness}`}
                    status="error"
                  />,
                { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
              );
              this.props.manageProjectListing(preProjectData.project, 2);
              this.handleShow();
              setTimeout(function () {
                self.setState({ saveDisable: false });
              }, 2000);
            } else if (errors && errors.name) {
              toast(
                  <DailyPloyToast
                    message={`Project name ${errors.name}`}
                    status="error"
                  />,
                { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
              );
              setTimeout(function () {
                self.setState({ saveDisable: false });
              }, 2000);
              this.props.manageProjectListing(preProjectData.project, 2);
              this.handleShow();
            } else {
              this.handleShow();
              this.props.manageProjectListing(preProjectData.project, 2);
              this.setState({ show: false });
            }
          }
        }
      }
    } else {
      toast(
          <DailyPloyToast
            message={`Project Name can't be blank`}
            status="error"
          />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
      );
      this.props.manageProjectListing(preProjectData.project, 2);
      this.handleShow();
      setTimeout(function () {
        self.setState({ saveDisable: false });
      }, 2000);
    }
  };

  addMember = async () => {
    var memberData = {
      invitation: {
        name: `${this.state.memberName}`,
        email: `${this.state.memberEmail}`,
        status: "Pending",
        workspace_id: Number(this.props.workspaceId),
        role_id: Number(this.state.memberRole),
        working_hours: Number(this.state.memberWorkingHours),
        hourly_expense: Number(this.state.hourlyExpense)
      },
    };
    if (this.state.memberProject) {
      memberData.invitation["project_id"] = this.state.memberProject;
    }
    this.clearAddMemberModaldata();
    this.setState({ memberShow: false, isLoading: false, error: "" });
    try {
      this.setState({ isLoading: true, btnEnable: false });
      const { data } = await post(memberData, "invitations");
      toast(
          <DailyPloyToast
            message="Member Invited successfully!"
            status="success"
          />,
        { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
      );

      this.setState({ memberShow: false, isLoading: false, error: "" });
      // this.props.handleLoad(true);
    } catch (e) {
      if (e.response.data && e.response.status === 404) {
        // toast(
        //   <DailyPloyToast message={`${e.response.data}`} status="error" />,
        //   { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        // );
        this.handleMemberShow();
        this.setState({ isLoading: false, error: e.response.data, memberShow: false });
      } else if (
        e.response.data &&
        e.response.data.user_already_exists &&
        e.response.status === 402
      ) {
        // toast(
        //   <DailyPloyToast
        //     message="User already exists in workspace."
        //     status="error"
        //   />,
        //   { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        // );

        this.setState({
          isLoading: false,
          error: "User already exists in workspace.",
        });
        toast(<DailyPloyToast
            message="User already exists in workspace!"
            status="error"
            />,
          { autoClose: 2000, position: toast.POSITION.TOP_CENTER }

        );
        this.handleMemberShow();
        this.setState({ memberShow: false, isLoading: false, error: "" });
      } else {
        this.setState({ isLoading: false, error: "", memberShow: false });
        this.handleMemberShow();
      }
    }
  };

  clearAddMemberModaldata = () => {
    this.setState({
      memberName: "",
      memberEmail: "",
      memberRole: "",
      memberWorkingHours: "",
    });
  };

  handleChangeMember = (selectedTags) => {
    var ids = selectedTags.map((option) => option.id);
    this.setState({ projectMembers: ids, selectedTags: selectedTags });
  };

  handleChangeInput = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value, saveDisable: false });
  };

  handleChangeMemberInput = (e) => {
    const { name, value } = e.target;
    if (name === "memberName") {
      let suggestions = [];
      var searchOptions = this.props.state.isLogedInUserEmailArr.map(
        (user) => user.name
      );
      if (value.length > 0) {
        const regex = new RegExp(`^${value}`, "i");
        suggestions = searchOptions.sort().filter((v) => regex.test(v));
        this.setState({
          [name]: value,
          suggestions: suggestions,
          btnEnable: true,
          error: "",
          [`${name}Error`]: "",
        });
      } else {
        this.setState({
          [name]: value,
          suggestions: suggestions,
          btnEnable: true,
          [`${name}Error`]: "please select",
        });
      }
    } else if (name === "memberEmail") {
      let suggestions = [];
      var searchOptions = this.props.state.isLogedInUserEmailArr.map(
        (user) => user.name
      );
      if (value.length > 0) {
        const regex = new RegExp(`^${value}`, "i");
        suggestions = searchOptions.sort().filter((v) => regex.test(v));
        var error = validateEmail(value);
        this.setState({
          [name]: value,
          suggestions: suggestions,
          btnEnable: true,
          error: "",
          [`${name}Error`]: error,
          btnEnable: error ? false : true,
        });
      } else {
        this.setState({
          [name]: value,
          suggestions: suggestions,
          btnEnable: true,
          [`${name}Error`]: "please select",
        });
      }
    } else {
      console.log("else", name, value, value != "");
      if (this.state.hourlyExpense && this.state.monthlyExpense) {
        const totalWorkingHours = value * 20;
        const monthlyExpense = this.state.hourlyExpense * totalWorkingHours
        this.setState({
          [name]: value,
          btnEnable: true,
          [`${name}Error`]: value != "" ? "" : "please select",
          monthlyExpense
        });
      } else {
        this.setState({
          [name]: value,
          btnEnable: true,
          [`${name}Error`]: value != "" ? "" : "please select",
        });
      }
    }
  };

  handleChangeProjectSelect = (value) => {
    this.setState({ memberProject: value ? value.id : "" });
  };

  selectAutoSuggestion = (option) => {
    var filterArr = this.props.state.isLogedInUserEmailArr.filter(
      (user) => user.name === option
    );
    var filterProjectIds = filterArr[0].projects.map((project) => project.id);
    let memberRole = filterArr[0].role === "admin" ? "1" : "2";
    let memberProjects = this.props.state.projects.filter(
      (project) => !filterProjectIds.includes(project.id)
    );
    this.setState({
      memberName: filterArr[0].name,
      memberEmail: filterArr[0].email,
      memberRole: memberRole,
      memberWorkingHours: filterArr[0].working_hours,
      projectsListing: memberProjects,
      suggestions: [],
      memberEmailError: "",
    });
  };

  handleChangeMemberRadio = (e) => {
    this.setState({ memberAccess: e.target.value });
  };

  handleDateFrom = (date) => {
    this.setState({ dateFrom: date });
  };
  handleDateTo = (date) => {
    this.setState({ dateTo: date });
  };

  handleClose = () => {
    this.setState({
      show: false,
      projectName: "",
      projectMembers: [],
      dateTo: null,
      background: "#b9e1ff",
      dateFrom: new Date(),
      reset: false,
      monthlyBudget: ""
    });
  };

  handleShow = () => {
    this.setState({
      setShow: true,
      show: true,
      saveDisable: false,
      reset: true,
    });
  };

  handleMemberClose = () => {
    this.setState({
      memberShow: false,
    });
  };
  handleMemberShow = () => {
    this.setState({
      memberSetShow: true,
      memberShow: true,
      projectsListing: this.props.state.projects,
    });
  };

  handleChangeComplete = (color, event) => {
    this.setState({
      background: color.hex,
      displayColorPicker: !this.state.displayColorPicker,
    });
  };

  handleChangeColor = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleUndefinedToDate = () => {
    if (this.state.disabledDateTo) {
      var disableColor = "#fff";
    } else {
      var disableColor = "#eaeaed";
    }
    this.setState({
      disabledDateTo: !this.state.disabledDateTo,
      disableColor: disableColor,
      dateTo: null,
    });
  };
  handleBudget = (e) => {
    const { name, value } = e.target;
    this.setState({ monthlyBudget: value })
  }
  handleProjectByUser = () => { };

  handleExpense = (e) => {
    const { name, value } = e.target;
    if (name === "hourlyExpense") {
      const totalWorkingHours = this.state.memberWorkingHours * 20;
      let monthlyExpense = totalWorkingHours * value
      this.setState({ hourlyExpense: value, monthlyExpense })
    } else {
      const totalWorkingHours = this.state.memberWorkingHours * 20;
      let hourlyExpense = value / totalWorkingHours
      this.setState({ monthlyExpense: value, hourlyExpense })
    }
  }

  render() {
    this.handleProjectByUser();
    const { sort, show } = this.state;
    var userRole = localStorage.getItem("userRole");
    return (
      <>
        <div className="container-fluid sticky-menubar">
          <div className="dashboard-container">
            <div className="row no-margin dashboard-menubar-container">
              <Tabs
                classNameRoute={this.props.classNameRoute}
                userRole={userRole}
                workspaceId={this.props.workspaceId}
              />
              <div className="col-md-5 text-right">
                <ErrorBoundary>
                  <ConditionalElements
                    classNameRoute={this.props.classNameRoute}
                    isDeleteShow={this.props.state.isDeleteShow}
                  />
                </ErrorBoundary>
                <div className="col-md-2 d-inline-block">
                  <Dropdown className={userRole === "member" ? "d-none" : null}>
                    <Dropdown.Toggle
                      className="menubar-button"
                      id="dropdown-basic"
                    >
                      <img src={Add} alt="add" />
                      &nbsp;ADD
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdownMenu" >
                      <Dropdown.Item className="cool-link"
                        onClick={this.handleShow}
                        data-aos="fade-down"
                        data-aos-easing="linear"
                        data-aos-duration="1500"
                      // style={{
                      //   borderBottom: "1px solid rgba(210, 210, 210, 1)",
                      // }}
                      >
                        Project
                      </Dropdown.Item>
                      <ErrorBoundary>
                        <AddProjectModal
                          state={this.state}
                          handleClose={this.handleClose}
                          handleChangeInput={this.handleChangeInput}
                          handleDateFrom={this.handleDateFrom}
                          handleDateTo={this.handleDateTo}
                          handleChangeMember={this.handleChangeMember}
                          handleChangeColor={this.handleChangeColor}
                          handleChangeComplete={this.handleChangeComplete}
                          handleBudget={this.handleBudget}
                          colors={this.colors}
                          addProject={this.addProject}
                          handleContactChangeInput={this.handleContactChangeInput}
                          addContactsRow={this.addContactsRow}
                          removeContactsRow={this.removeContactsRow}
                          btnText={"Add"}
                          headText={"Add New Project"}
                          emailOptions={this.props.state.isLogedInUserEmailArr}
                          handleUndefinedToDate={this.handleUndefinedToDate}
                          workspaceId={this.props.workspaceId}
                          ownerClassName={"d-none"}
                        />
                      </ErrorBoundary>
                      <Dropdown.Item className="cool-link" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500" onClick={this.handleMemberShow} >
                        People
                      </Dropdown.Item>
                      {this.state.memberShow ? (
                        <ErrorBoundary>
                          <AddMemberModal
                            state={this.state}
                            handleClose={this.handleMemberClose}
                            handleChangeMemberInput={this.handleChangeMemberInput}
                            handleChangeMemberRadio={this.handleChangeMemberRadio}
                            addMember={this.addMember}
                            projects={this.state.projectsListing}
                            selectAutoSuggestion={this.selectAutoSuggestion}
                            handleChangeProjectSelect={
                              this.handleChangeProjectSelect
                            }
                            handleExpense={this.handleExpense}
                          />
                        </ErrorBoundary>
                      ) : null}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

MenuBar.propTypes = {
  workspaceId: PropTypes.string,
  classNameRoute: PropTypes.func,
  state: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  onSelectSort: PropTypes.func,
  manageProjectListing: PropTypes.func,
  handleLoad: PropTypes.func,
}
