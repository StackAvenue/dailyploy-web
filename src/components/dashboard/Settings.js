import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { get, logout } from "../../utils/API";
import MenuBar from "./MenuBar";
import { Tab, Nav } from "react-bootstrap";
import UserSettings from "./settings/UserSettings";
import WorkspaceSettings from "./settings/WorkspaceSettings";

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
      allMembers: []
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
    console.log("selected value ", value);
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
    this.setState({ [name]: value });
  };

  updateUserInfo = async () => {
    const userData = {
      name: this.state.userName
    };
  };

  save = () => {
    this.setState({ isDisableName: true });
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
                <Nav.Item>
                  <Nav.Link eventKey="third">Preferences</Nav.Link>
                </Nav.Item>
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
                      save={this.save}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <WorkspaceSettings
                      workspaceObj={filterArr[0]}
                      state={this.state}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">Prefrences</Tab.Pane>
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
