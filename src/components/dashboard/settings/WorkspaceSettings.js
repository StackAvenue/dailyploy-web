import React, { Component } from "react";
import Profile from "../../../assets/images/profile.png";
import Admin from "../../../assets/images/admin.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import GeneralSettings from "./GeneralSettings";
import CategoriesSettings from "./CategoriesSettings";
import EmployeeReportsSettings from "./EmployeeReportsSettings";
import ProjectReportsSettings from "./ProjectReportsSettings";
import { toast } from "react-toastify";
import DailyPloyToast from "../../DailyPloyToast";
import { put } from "../../../utils/API";
import cookie from "react-cookies";

class WorkspaceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceName: "",
      adminUserArr: [],
      workspaceId: "",
      userArr: [],
      isSaveWorkspaceName: false
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
    this.setState({
      [name]: value,
      isSaveWorkspaceName: value ? true : false
    });
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
      cookie.save("workspaceName", data.workspace_role, { path: "/" });
      toast(
        <DailyPloyToast message="Workspace Name Updated" status="success" />,
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER
        }
      );
      this.setState({ isSaveWorkspaceName: false });
      this.props.workspaceNameUpdate("workspaceName", data.workspace_role);
    } catch (e) {
      console.log("error", e);
    }
  };

  render() {
    return (
      <div className="workspace-settings">
        <Tabs>
          <TabList>
            <Tab>General</Tab>
            <Tab>Categories</Tab>
            <Tab>Employee Reports</Tab>
            {/* <Tab>Project Reports</Tab> */}
          </TabList>

          <TabPanel>
            <GeneralSettings
              worskpaceNameHandler={this.worskpaceNameHandler}
              state={this.state}
              workspaceName={this.props.workspaceName}
              workspaceId={this.props.state.workspaceId}
              members={this.state.userArr}
              updateWorkspaceName={this.updateWorkspaceName}
              adminUserArr={this.props.state.adminUserArr}
              handleChangeAdminUsers={this.handleChangeAdminUsers}
            />
          </TabPanel>
          <TabPanel>
            <CategoriesSettings workspaceId={this.props.state.workspaceId} />
          </TabPanel>
          <TabPanel>
            <EmployeeReportsSettings />
          </TabPanel>
          {/* <TabPanel>
            <ProjectReportsSettings />
          </TabPanel> */}
        </Tabs>
      </div>
    );
  }
}

export default WorkspaceSettings;
