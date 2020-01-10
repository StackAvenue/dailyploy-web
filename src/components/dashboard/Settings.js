import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, post, put } from "../../utils/API";
import MenuBar from "./MenuBar";
import { Tab, Nav } from "react-bootstrap";
import UserSettings from "./settings/UserSettings";
import WorkspaceSettings from "./settings/WorkspaceSettings";
import cookie from "react-cookies";
import { checkPassword, validateName } from "../../utils/validation";
import { toast } from "react-toastify";
import DailyPloyToast from "../../../src/components/DailyPloyToast";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      members: [],
      isLogedInUserEmailArr: [],
      projects: [],
      userId: "",
      userName: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      users: [],
      isDisableName: false,
      adminUserArr: [],
      allMembers: [],
      nameError: null,
      oldPasswordError: null,
      passwordError: null,
      confirmPasswordError: null,
      isSaveEnable: false,
      isSaveConfirmEnable: false
    };
  }

  async componentDidMount() {
    try {
      const { data } = await get("logged_in_user");
      var loggedInData = data;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Listing
    try {
      const { data } = await get("workspaces");
      var workspacesData = data.workspaces;
    } catch (e) {
      console.log("err", e);
    }

    //get workspace Id
    this.getWorkspaceParams();

    // worksapce project Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/projects`
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`
      );
      var userArr = data.members.map(user => user.email);
      var emailArr = data.members
        .filter(user => user.email !== loggedInData.email)
        .map(user => user.email);
      var adminUserArr = data.members.filter(user => user.role === "admin");
      var allMembers = data;
    } catch (e) {
      console.log("users Error", e);
    }

    this.setState({
      userId: loggedInData.id,
      userName: loggedInData.name,
      userEmail: loggedInData.email,
      workspaces: workspacesData,
      projects: projectsData,
      users: userArr,
      isLogedInUserEmailArr: emailArr,
      adminUserArr: adminUserArr,
      allMembers: allMembers
    });
  }

  getWorkspaceParams = () => {
    const { workspaceId } = this.props.match.params;
    this.setState({ workspaceId: workspaceId });
  };

  onSelectSort = value => {
    this.setState({ sort: value });
  };

  classNameRoute = () => {
    let route = this.props.history.location.pathname;
    let routeName = route.split("/")[1];
    if (routeName === "settings") {
      return "settingsTrue";
    } else {
      return false;
    }
  };

  handleUserChange = e => {
    const { name, value } = e.target;
    if (name == "userName" && value != "") {
      this.setState({ [name]: value, isSaveEnable: true });
    } else {
      this.setState({ [name]: value, isSaveConfirmEnable: true });
    }
  };

  handleConfirmPassChange = e => {
    const { name, value } = e.target;
    if (this.state.newPassword && value != this.state.newPassword) {
      this.setState({
        [name]: value,
        isSaveConfirmEnable: true,
        confirmPasswordError: "Didn't Match, Try Again."
      });
    } else {
      this.setState({ [name]: value, confirmPasswordError: "" });
    }
  };

  handlePasswordChange = e => {
    const { name, value } = e.target;
    if (value != "" && checkPassword(value)) {
      this.setState({
        [name]: value,
        isSaveConfirmEnable: true,
        passwordError: checkPassword(value)
      });
    } else {
      this.setState({ [name]: value, passwordError: "" });
    }
  };

  updateUserInfo = async () => {
    const userData = {
      name: this.state.userName
    };
  };

  updateUserName = async e => {
    e.preventDefault();
    this.validateUserName();
    if (this.state.userName && this.state.userName.length >= 3) {
      var userData = {
        user: {
          name: this.state.userName
        }
      };
      try {
        const { data } = await put(userData, `users/${this.state.userId}`);
        if (data) {
          this.setState({ isSaveEnable: false });
          this.props.workspaceNameUpdate(
            "loggedInUserName",
            data.user ? data.user.name : this.props.state.loggedInUserName
          );
        }
        toast(<DailyPloyToast message="User Name Updated" status="success" />, {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        });
      } catch (e) {
        if (e.response.status) {
          toast(
            <DailyPloyToast message={"Internal Server Error"} status="error" />,
            { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
          );
        }
      }
    }
  };

  updatePassword = async e => {
    e.preventDefault();
    this.validateAllInputs();
    if (this.validityCheck()) {
      var userData = {
        user: {
          name: this.state.userName,
          password: this.state.newPassword,
          password_confirmation: this.state.confirmPassword,
          old_password: this.state.oldPassword
        }
      };
      try {
        const { data } = await put(userData, `users/${this.state.userId}`);
        if (data) {
          this.setState({ isSaveConfirmEnable: false });
        }
        toast(
          <DailyPloyToast message="User Setting Updated" status="success" />,
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_CENTER
          }
        );
      } catch (e) {
        if (e.response.status === 500) {
          toast(
            <DailyPloyToast message={"Internal Server Error"} status="error" />,
            { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
          );
        } else if (e.response.data.error) {
          this.setState({ oldPasswordError: "Old Password is not correct" });
          // toast(
          //   <DailyPloyToast
          //     message="Old Password does not match"
          //     status="error"
          //   />,
          //   { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
          // );
        }
      }
    }
  };

  validityCheck = () => {
    return (
      this.state.userName &&
      this.state.userName.length >= 3 &&
      this.state.newPassword &&
      this.state.newPassword.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      ) &&
      this.state.oldPassword &&
      this.state.newPassword === this.state.confirmPassword
    );
  };

  validateUserName = () => {
    this.setState({ nameError: validateName(this.state.userName) });
  };

  validateAllInputs = () => {
    const errors = {
      nameError: null,
      oldPasswordError: null,
      passwordError: null,
      confirmPasswordError: null
    };
    errors.nameError = validateName(this.state.userName);
    errors.passwordError = checkPassword(this.state.newPassword);
    errors.oldPasswordError = this.state.oldPassword
      ? ""
      : "Old Password cannot blank";
    errors.confirmPasswordError = this.validatePassword(
      this.state.newPassword,
      this.state.confirmPassword
    );
    this.setState(errors);
  };

  validatePassword = (password, confirmPassword) => {
    if (password === "" && confirmPassword === "") {
      return true;
    } else if (password === confirmPassword) {
      return;
    }
    return "Didn't Match, Try Again.";
  };

  render() {
    let filterArr = this.state.workspaces.filter(
      workspace => workspace.id == this.state.workspaceId
    );
    return (
      <>
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          state={this.state}
        />
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <div className="row no-margin workspace1-setting">
            <div className="col-md-2 side-tabs">
              <Nav variant="link" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="first">User Settings</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">Workspace Settings</Nav.Link>
                </Nav.Item>
                {/* <Nav.Item>
                  <Nav.Link eventKey="third">Preferences</Nav.Link>
                </Nav.Item> */}
              </Nav>
            </div>
            <div className="col-md-10">
              <div className="col-md-12 body-tabs">
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <UserSettings
                      handleChange={this.handleUserChange}
                      state={this.state}
                      role={localStorage.getItem("userRole")}
                      updateUserName={this.updateUserName}
                      updatePassword={this.updatePassword}
                      handleConfirmPassChange={this.handleConfirmPassChange}
                      handlePasswordChange={this.handlePasswordChange}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <WorkspaceSettings
                      workspaceObj={filterArr[0]}
                      state={this.state}
                      workspaceName={this.props.state.workspaceName}
                      workspaceNameUpdate={this.props.workspaceNameUpdate}
                    />
                  </Tab.Pane>
                  {/* <Tab.Pane eventKey="third">Prefrences</Tab.Pane> */}
                </Tab.Content>
              </div>
            </div>
          </div>
        </Tab.Container>
      </>
    );
  }
}

export default withRouter(Settings);
