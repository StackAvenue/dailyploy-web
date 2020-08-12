import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
// import AddTask from "./AddTask";
// import DisplayTask from "./DisplayTask";
import { get, post, put, del } from "./../../../utils/API";

import StatusSettings from "./StatusSettings";
class StatusProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PlusIcon: true,
      TaskShow: false,
      list_id: 0,
      task_lists: [],
      project: [],
      workspaceId: 0,
      listID: 0
    };
  }
  async componentDidMount() {
    this.setState({ workspaceId: this.props.workspaceId })
    try {
      var userIds =
        this.props.searchUserDetails.length > 0
          ? this.props.searchUserDetails.map(member => member.member_id)
          : [];
      var searchData = {};
      if (userIds.length > 0) {
        searchData["user_ids"] = userIds.join(",");
      }
      if (this.props.searchProjectIds.length > 0) {
        searchData["project_ids"] = this.props.searchProjectIds.join(",");
      }

      const { data } = await get(
        `workspaces/${this.props.workspaceId}/projects`,
        searchData
      );
      var projectsData = data.projects;
      this.setState({ project: projectsData })

    } catch (e) {
      console.log("err", e);
    }
  }


  displayList = (i) => {

    if (i === this.state.listID) {
      // this.setState({PlusIcon:false,
      // list_id:this.props.ProjectTask.id
      // })
      this.setState({ listID: 0 })
    } else {
      // this.setState({PlusIcon:true,
      //     // list_id:0
      // })
      this.setState({ listID: i })
    }
  }
  displayAddTask = () => {
    if (!this.state.TaskShow)
      this.setState({ TaskShow: true })
    else {
      this.setState({ TaskShow: false })
    }
  }


  handleSaveTask = (state) => {
    var task = [...this.state.task_lists];
    task.push(
      {
        "name": `${state.name}`,
        "estimation": state.estimation,
        "list_id": state.list_id,
        "priority": `${state.priority}`,
        "status": `${state.status}`,
        "description": `${state.description}`,
        "assigne_id": state.assigne_id
      }
    )
    this.setState({ show: false, task_lists: task });
    this.setState({ TaskShow: false })
  }







  render() {

    return (

      <div className="status-setting">
        <div className="row no-margin category" style={{ marginTop: "50px" }}></div>
        {this.state.project.length === 0 ? <div className="spinnerDive" >
          <Spinner animation="border" role="status" aria-hidden="true" variant="success">
          </Spinner></div> : <>
            {this.state.project.map((data, i) => {
              return (
                <div key={i} className="DisplayprojectListTopCard">
                  <div className="projectListInCard">
                    <div className="cardAndButton" >
                      <div className="buttonCard" >
                        <button className="buttonCardIcon" onClick={() => this.displayList(data.id)}>
                          {data.id === this.state.listID ? <i class="fas fa-angle-down"></i> : <i class="fas fa-angle-right"></i>}</button>
                      </div>
                      <div className="textCard" >
                        {data.name} {/* {this.props.ProjectTask.name}&nbsp;(&nbsp;{this.props.ProjectTask.start_date}&nbsp;To&nbsp;{this.props.ProjectTask.end_date}&nbsp;) */}
                      </div>
                    </div>
                  </div>

                  {data.id === this.state.listID ? <>
                    <StatusSettings workspaceId={this.state.workspaceId}
                      searchUserDetails={this.props.searchUserDetails}
                      searchProjectIds={this.props.searchProjectIds}
                      projectId={data.id}
                      color={data.color_code}
                      projectName={data.name} />
                  </>
                    : null}
                </div>)
            })}</>}
      </div>

    );
  }

}
export default withRouter(StatusProjectList);