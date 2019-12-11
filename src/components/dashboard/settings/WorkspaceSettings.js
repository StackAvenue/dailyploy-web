import React, { Component } from "react";
import Profile from "../../../assets/images/profile.png";
import Admin from "../../../assets/images/admin.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import GeneralSettings from "./GeneralSettings";
import CategoriesSettings from "./CategoriesSettings";
import EmployeeReportsSettings from "./EmployeeReportsSettings";
import ProjectReportsSettings from "./ProjectReportsSettings";
import { put } from "../../../utils/API";

class WorkspaceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceName: "",
      adminUserArr: [],
      workspaceId: "",
      userArr: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.workspaceObj !== this.props.workspaceObj ||
      prevProps.state.adminUserArr.length !==
        this.props.state.adminUserArr.length ||
      prevProps.state.allMembers.length !== this.props.state.allMembers.length
    ) {
      let workspaceName = this.props.workspaceObj
        ? this.props.workspaceObj.name
        : null;
      let adminUserArr = this.props.state.adminUserArr;
      this.setState({
        workspaceName: workspaceName,
        adminUserArr: adminUserArr,
        workspaceId: this.props.workspaceObj.id,
        userArr: this.props.state.allMembers
      });
    }
  }

  handleChangeAdminUsers = arr => {
    this.setState({ adminUserArr: arr });
  };

  worskpaceNameHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  updateWorkspaceName = async () => {
    const updateWorkspaceName = {
      user: {
        name: this.state.workspaceName
      }
    };
    try {
      const { data } = await put(
        updateWorkspaceName,
        `workspaces/${this.props.workspaceObj.id}/workspace_settings/${this.props.workspaceObj.id}`
      );
      console.log("Data", data);
    } catch (e) {
      console.log("error", e);
    }
  };
  render() {
    // console.log("UserArr", this.state.userArr);
    return (
      <div className="workspace-settings">
        <Tabs>
          <TabList>
            <Tab>General</Tab>
            <Tab>Categories</Tab>
            <Tab>Employee Reports</Tab>
            <Tab>Project Reports</Tab>
          </TabList>

          <TabPanel>
            <GeneralSettings
              worskpaceNameHandler={this.worskpaceNameHandler}
              state={this.state}
              updateWorkspaceName={this.updateWorkspaceName}
              adminUserArr={this.props.state.adminUserArr}
              handleChangeAdminUsers={this.handleChangeAdminUsers}
            />
          </TabPanel>
          <TabPanel>
            <CategoriesSettings />
          </TabPanel>
          <TabPanel>
            <EmployeeReportsSettings />
          </TabPanel>
          <TabPanel>
            <ProjectReportsSettings />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default WorkspaceSettings;
