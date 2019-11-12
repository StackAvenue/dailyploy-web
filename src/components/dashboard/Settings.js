import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout, mockGet } from "../../utils/API";
import MenuBar from "./MenuBar";
import { Tab, Nav } from "react-bootstrap";
import GeneralSettings from "./UserSettings/GeneralSettings";
import PrivacySettings from "./UserSettings/PrivacySettings";
import Sidebar from "./Sidebar";

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
      users: [],
    };
  }
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
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
        `workspaces/${this.state.workspaceId}/projects`,
      );
      var projectsData = data.projects;
    } catch (e) {
      console.log("err", e);
    }

    // workspace Member Listing
    try {
      const { data } = await get(
        `workspaces/${this.state.workspaceId}/members`,
      );
      var userArr = data.members.map(user => user.email);
      var emailArr = data.members
        .filter(user => user.email !== loggedInData.email)
        .map(user => user.email);
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

  render() {
    return (
      <>
        <div className="dashboard-main no-padding">
          <Header
            logout={this.logout}
            workspaces={this.state.workspaces}
            workspaceId={this.state.workspaceId}
          />
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
                    <Nav.Link eventKey="first">General</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">Privacy</Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
              <div className="col-md-10">
                <div className="col-md-12 body-tabs">
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <GeneralSettings />
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <PrivacySettings />
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </div>
            </div>
          </Tab.Container>
        </div>
      </>
    );
  }
}

export default withRouter(Settings);
