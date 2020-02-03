import React from "react";
import { workspaceNameSplit, firstTwoLetter } from "./../../../utils/function";

const SelectWorkspace = props => {
  if (props.item.id === Number(props.workspaceId)) {
    return (
      <li key={props.index}>
        <div className="workspace-box text-titlize active">
          <a
            className="btn btn-default"
            href={`/workspace/${props.item.id}/dashboard`}
            title={workspaceNameSplit(props.workspaceName)}
          >
            {firstTwoLetter(props.workspaceName)}
            {}
          </a>
        </div>
        <div className="workspace-text text-titlize">
          {workspaceNameSplit(props.workspaceName)}
        </div>
      </li>
    );
  } else {
    return (
      <li key={props.index}>
        <div className="workspace-box text-titlize">
          <a
            className="btn btn-default"
            href={`/workspace/${props.item.id}/dashboard`}
            title={workspaceNameSplit(props.item.name)}
          >
            {firstTwoLetter(props.item.name)}
            {}
          </a>
        </div>
        <div className="workspace-text text-titlize">
          {workspaceNameSplit(props.item.name)}
        </div>
      </li>
    );
  }
};

export default SelectWorkspace;
