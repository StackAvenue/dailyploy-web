import React, { Component } from "react";
import Profile from "../../../assets/images/profile.png";
import Admin from "../../../assets/images/admin.png";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import GeneralSettings from "./GeneralSettings";
import CategoriesSettings from "./CategoriesSettings";
import EmployeeReportsSettings from "./EmployeeReportsSettings";
import ProjectReportsSettings from "./ProjectReportsSettings";

class WorkspaceSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      setShow: false,
      name: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  }
  handleClose = () => {
    this.setState({
      show: false
    });
  };
  handleShow = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
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
            <GeneralSettings />
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
