import React from "react";

const SelectWorkspace = props => {
  if (props.item.id === Number(props.workspaceId)) {
    return (
      <li key={props.index}>
        <div
          className="workspace-box text-titlize"
          style={{ backgroundColor: "#33a1ff" }}>
          <a className="btn btn-default" href={`/dashboard/${props.item.id}`}>
            {props.nameFirstLetters(props.item.name)}
            {}
          </a>
        </div>
        <div className="workspace-text text-titlize">
          {props.nameSplit(props.item.name)}
        </div>
      </li>
    );
  } else {
    return (
      <li key={props.index}>
        <div className="workspace-box text-titlize">
          <a className="btn btn-default" href={`/dashboard/${props.item.id}`}>
            {props.nameFirstLetters(props.item.name)}
            {}
          </a>
        </div>
        <div className="workspace-text text-titlize">
          {props.nameSplit(props.item.name)}
        </div>
      </li>
    );
  }
};

export default SelectWorkspace;
