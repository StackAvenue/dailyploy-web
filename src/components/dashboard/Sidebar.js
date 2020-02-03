import React, { Component } from "react";
import AddWorkspaceModal from "./Sidebar/AddWorkspaceModal";
import SelectWorkspace from "./Sidebar/SelectWorkspace";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      setShow: false
    };
  }

  showTaskModal = () => {
    this.setState({
      setShow: true,
      show: true
    });
  };

  closeTaskModal = () => {
    this.setState({
      show: false
    });
  };

  render() {
    let workspacesArr = this.props.workspaces;
    let divideArr = workspacesArr.map(item => item);
    return (
      <>
        <div className="workspace-list">
          <ul>
            {divideArr.map((item, index) => (
              <SelectWorkspace
                item={item}
                index={index}
                key={index}
                workspaceId={this.props.workspaceId}
                workspaceName={this.props.workspaceName}
              />
            ))}
            <li>
              <div className="workspace-box" style={{ paddingTop: "8px" }}>
                <button className="btn btn-link" onClick={this.showTaskModal}>
                  +
                </button>
              </div>
              <div className="workspace-add-btn">Add New</div>
              <AddWorkspaceModal
                state={this.state}
                onHideModal={this.closeTaskModal}
              />
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export default Sidebar;
