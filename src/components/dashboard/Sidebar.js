import React, { Component } from "react";
import AddWorkspaceModal from "./Sidebar/AddWorkspaceModal";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      setShow: false,
    };
  }

  showTaskModal = () => {
    this.setState({
      setShow: true,
      show: true,
    });
  };

  closeTaskModal = () => {
    this.setState({
      show: false,
    });
  };

  nameSplit = name => {
    let nameArr = name;
    let nameSplit = nameArr.split(" ");
    let showName = nameSplit[2] + " " + nameSplit[3];
    return showName;
  };

  nameFirstLetters = name => {
    let nameArr = this.nameSplit(name);
    let splitName = nameArr
      .split(" ")
      .map(x => x[0])
      .join("");
    return splitName;
  };

  render() {
    let workspacesArr = this.props.workspaces;
    let divideArr = workspacesArr.map(item => item);
    return (
      <>
        <div className="workspace-list no-padding">
          <ul>
            {divideArr.map((item, index) => {
              return (
                <li key={index}>
                  <div className="workspace-box">
                    <a
                      className="btn btn-default"
                      href={`/dashboard/${item.id}`}
                    >
                      {this.nameFirstLetters(item.name)}
                    </a>
                  </div>
                  <div className="workspace-text">
                    {this.nameSplit(item.name)}
                  </div>
                </li>
              );
            })}
            <li>
              <div className="workspace-box">
                <button className="btn btn-link" onClick={this.showTaskModal}>
                  +
                </button>
              </div>
              <div className="workspace-text">Add New</div>
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
