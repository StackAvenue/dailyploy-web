import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import { get, logout } from "../../utils/API";
import MenuBar from "./MenuBar";
import Sidebar from "./Sidebar";
import cookie from "react-cookies";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MemberAnalysis from "./Analysis/MemberAnalysis";
import ProjectAnalysis from "./Analysis/ProjectAnalysis";

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaces: [],
      workspaceId: "",
      projectNames: [],
      sort: "week",
      dateFrom: new Date(),
      dateTo: new Date(),
      isLogedInUserEmailArr: [],
      projects: [],
      userId: "",
      users: []
    };
  }
  logout = async () => {
    await logout();
    this.props.history.push("/login");
  };
  // async componentDidMount() {
  //   this.props.handleLoading(true);
  //   var loggedInData = cookie.load("loggedInUser");
  //   if (!loggedInData) {
  //     try {
  //       const { data } = await get("logged_in_user");
  //       var loggedInData = data;
  //     } catch (e) {
  //       console.log("err", e);
  //     }
  //   }

  //   // workspace Listing
  //   try {
  //     const { data } = await get("workspaces");
  //     var workspacesData = data.workspaces;
  //   } catch (e) {
  //     console.log("err", e);
  //   }

  //   //get workspace Id
  //   this.getWorkspaceParams();

  //   // worksapce project Listing
  //   try {
  //     const { data } = await get(
  //       `workspaces/${this.state.workspaceId}/projects`
  //     );
  //     var projectsData = data.projects;
  //   } catch (e) {
  //     console.log("err", e);
  //   }

  //   // workspace Member Listing
  //   try {
  //     const { data } = await get(
  //       `workspaces/${this.state.workspaceId}/members`
  //     );
  //     var userArr = data.members.map(user => user.email);
  //     var emailArr = data.members.filter(
  //       user => user.email !== loggedInData.email
  //     );
  //     // .map(user => user.email);
  //     this.props.handleLoading(false);
  //   } catch (e) {
  //     console.log("users Error", e);
  //   }

  //   this.setState({
  //     userId: loggedInData.id,
  //     userName: loggedInData.name,
  //     userEmail: loggedInData.email,
  //     workspaces: workspacesData,
  //     projects: projectsData,
  //     users: userArr,
  //     isLogedInUserEmailArr: emailArr
  //   });
  // }

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
    let routeName = route.split("/")[3];
    if (routeName === "analysis") {
      return "analysisTrue";
    } else {
      return false;
    }
  };

  handleDateFrom = date => {
    this.setState({ dateFrom: date });
  };
  handleDateTo = date => {
    this.setState({ dateTo: date });
  };

  render() {
    return (
      <>
        <MenuBar
          onSelectSort={this.onSelectSort}
          workspaceId={this.state.workspaceId}
          classNameRoute={this.classNameRoute}
          state={this.state}
        />
        <div className="analysis-box row no-margin padding-top-60px">
          <div className="col-md-12 no-padding analysis-top">
            {/* <Tabs>
              <TabList>
                <Tab>Members</Tab>
                <Tab>Projects</Tab>
              </TabList>

              <TabPanel>
                <MemberAnalysis
                  state={this.state}
                  handleDateFrom={this.handleDateFrom}
                  handleDateTo={this.handleDateTo}
                />
              </TabPanel>
              <TabPanel>
                <ProjectAnalysis />
              </TabPanel>
            </Tabs> */}
            <h4
              style={{
                textAlign: "center",
                paddingTop: "110px",
                color: "#9b9b9b"
              }}
            >
              Comming soon...
            </h4>
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Analysis);
