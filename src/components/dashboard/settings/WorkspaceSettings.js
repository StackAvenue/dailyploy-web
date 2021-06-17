import React, { Component } from "react";
import Profile from "../../../assets/images/profile.png";
import Admin from "../../../assets/images/admin.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import GeneralSettings from "./GeneralSettings";
import CategoriesSettings from "./CategoriesSettings";
import StatusProjectList from "./StatusProjectList";
import StatusSettings from "./StatusSettings";
import EmployeeReportsSettings from "./EmployeeReportsSettings";
import ProjectReportsSettings from "./ProjectReportsSettings";
import { toast } from "react-toastify";
import DailyPloyToast from "../../DailyPloyToast";
import { put } from "../../../utils/API";
import cookie from "react-cookies";
import "../../../assets/css/workspaceSettings.scss";
import PropTypes from 'prop-types';

class WorkspaceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceName: "",
      adminUserArr: [],
      workspaceId: "",
      userArr: [],
      userMembers: [],
      isSaveWorkspaceName: false,
    };
  }

  roleType = localStorage.getItem("userRole");

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
        userArr: this.props.state.allMembers,
        userMembers: this.props.state.allMembers.members,
      });
    }
  }

  handleChangeAdminUsers = (arr) => {
    this.setState({ adminUserArr: arr });
  };

  worskpaceNameHandler = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      isSaveWorkspaceName: value ? true : false,
    });
  };

  UserNameHandler = (id) => {
    var members = []


    this.state.userMembers.map((user) => {
      if (user.id !== id) {
        members.push(user);
      }
    });
    this.setState({ userMembers: members });
    return members;


  }
  UserNameAddHandler = (obj) => {
    var members = [...this.state.userMembers]

    members.push(obj);

    this.setState({ userMembers: members });
    return members;
  }
  UserNameHandler2 = (obj) => {
    let count = 0
    var members = []
    this.state.userMembers.map((user) => {
      obj.map((user1) => {
        if (user.id === user1.id) {
          count = count + 1;
        }
      })

      if (count === 0) {
        members.push(user)

      }
      count = 0;
    });
    this.setState({ userMembers: members });
    return members;
  }
  updateWorkspaceName = async (e) => {

    const updateWorkspaceName = {
      user: {
        name: this.state.workspaceName,
        currency: e.target.value
      },
    };
    try {
      const { data } = await put(
        updateWorkspaceName,
        `workspaces/${this.props.workspaceObj.id}/workspace_settings/${this.props.workspaceObj.id}`
      );
      cookie.save("workspaceName", data.workspace_role, { path: "/" });
      cookie.save("currency", data.currency, { path: "/" });
      toast(
        <DailyPloyToast message="Workspace Name Updated" status="success" />,
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        }
      );
      this.setState({ isSaveWorkspaceName: false });
      this.props.workspaceNameUpdate("workspaceName", data.workspace_role);
    } catch (e) {
      console.log("error", e);
      toast(
        <DailyPloyToast message={"Only Admin can change the Workspace Name"} status="error" />,
        { autoClose: 2500, position: toast.POSITION.TOP_CENTER }
      );
    }
  };

  render() {
    return (
      <div className="workspace-settings">
        <Tabs>
          <TabList>
            <Tab>General</Tab>
            {this.roleType =="admin" ? 
            <>
            <Tab>Categories</Tab>
            <Tab>Configure Workflow</Tab> 
            </>
            : null}
            {/* <Tab>Employee Reports</Tab> */}
            {/* <Tab>Project Reports</Tab> */}
          </TabList>

          <TabPanel>
            <GeneralSettings
              UserNameHandler={this.UserNameHandler}
              UserNameAddHandler={this.UserNameAddHandler}
              worskpaceNameHandler={this.worskpaceNameHandler}
              state={this.state}
              workspaceName={this.props.workspaceName}
              workspaceId={this.props.state.workspaceId}
              members={this.state.userArr}
              updateWorkspaceName={this.updateWorkspaceName}
              updateWorkspaceCurrency={this.updateWorkspaceCurrency}
              adminUserArr={this.props.state.adminUserArr}
              handleChangeAdminUsers={this.handleChangeAdminUsers}
              workspace={this.props.workspaceObj}
              loggedInUser={this.props.state.loggedInUser}
              UserNameHandler2={this.UserNameHandler2}
            />
          </TabPanel>
          <TabPanel>
            <CategoriesSettings workspaceId={this.props.state.workspaceId} />
          </TabPanel>
          <TabPanel>
            {/* <StatusSettings workspaceId={this.props.state.workspaceId}
             searchUserDetails={this.props.searchUserDetails}
             searchProjectIds={this.props.searchProjectIds} /> */}
            <StatusProjectList workspaceId={this.props.state.workspaceId}
              searchUserDetails={this.props.searchUserDetails}
              searchProjectIds={this.props.searchProjectIds} />
          </TabPanel>
          {/* <TabPanel>
            <EmployeeReportsSettings />
          </TabPanel> */}
          {/* <TabPanel>
            <ProjectReportsSettings />
          </TabPanel> */}
        </Tabs>
      </div>
    );
  }
}

WorkspaceSettings.propTypes = {
searchUserDetails: PropTypes.array.isRequired,
searchProjectIds: PropTypes.array.isRequired,
workspaceObj: PropTypes.object,
state: PropTypes.object.isRequired,
workspaceName: PropTypes.string.isRequired,
workspaceNameUpdate: PropTypes.func.isRequired
}

export default WorkspaceSettings;
