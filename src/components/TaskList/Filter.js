import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { firstTwoLetter, textTitlize } from "../../utils/function";
import ReactTooltip from "react-tooltip";

const Filter = (props) => {
  const [statusSelections, setStatusSelections] = useState("");
  const [multiSelections, setMultiSelections] = useState([]);
  const [selection, setSelection] = useState([]);
  const multiSelect = false;

  function handleOnClick(member, type) {
    if (!selection.some((user) => user.id === member.id)) {
      props.displayList(props.list_id, member.id, type);
      if (!multiSelect) {
        setSelection([member]);
      } else if (multiSelect) {
        setSelection([...selection, member]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (user) => user.id !== member.id
      );
      setSelection([...selectionAfterRemoval]);
      props.displayList(props.list_id, 0, "all");
    }
  }

  function isItemInSelection(item) {
    if (selection.some((current) => current.id === item.id)) {
      return true;
    }
    return false;
  }

  const countIncrese = (projectUser) => {
    let arr = projectUser;
    let count;
    if (arr.length >= 4) {
      count = arr.length - 4;
    }
    let showCount = count ? (
      <div className="user-block2">
        <span>
          <Dropdown>
            <Dropdown.Toggle
              className="dropdown-block"
              variant="success"
              id="dropdown-basic"
            >
              +{count}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {props.projectMembers.slice(4).map((member) => (
                <Dropdown.Item
                  onClick={() => {
                    handleOnClick(member, props.state.MEMBER);
                  }}
                >
                  {member.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>
                    {isItemInSelection(member) && <i class="fa fa-check" />}
                  </span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </span>
      </div>
    ) : null;
    return showCount;
  };

  const statuses = props.taskStatus.map((status) => {
    return status.statusName;
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const selectedStatus = props.taskStatus.find(
        (taskStatus) => taskStatus.statusName == statusSelections
      );
      if (selectedStatus != null) {
        console.log(selectedStatus.id);
        props.displayList(props.list_id, selectedStatus.id, props.state.STATUS);
      } else {
        console.log("undefined");
      }
    } else if (event.keyCode === 8 && statusSelections.length > 0) {
      var flag = false;
      if (!flag) {
        props.displayList(props.list_id, 0, "all");
        flag = true;
      }
      console.log("delete");
    }
  };

  return (
    <div className="filter-div">
      <div className="input-filter">
        <Typeahead
          //clearButton
          id="basic-typeahead-single"
          labelKey="name"
          onChange={setStatusSelections}
          onKeyDown={handleKeyDown}
          options={statuses}
          placeholder="Filter Status"
          selected={statusSelections}
        />
      </div>
      <div className="member-filter">
        <span>
          {props.projectMembers.slice(0, 4).map((member, index) => {
            return (
              <div
                key={index}
                className="user-block"
                title={textTitlize(member.name)}
              >
                <span
                  key={index}
                  onClick={() => {
                    handleOnClick(member, props.state.MEMBER);
                  }}
                >
                  {firstTwoLetter(member.name)}
                  <span>
                    {isItemInSelection(member) && <i class="fa fa-check" />}
                  </span>
                </span>
              </div>
            );
          })}
        </span>
        {countIncrese(props.projectMembers.map((member) => member.name))}
      </div>
      <div
        className="close-filter"
        onClick={(e) => {
          e.preventDefault();
          props.closeFilter();
          props.displayList(props.list_id, 0, "all");
        }}
      >
        <i class="fa fa-times" data-tip data-for="closeTask"></i>&nbsp;&nbsp;
        <ReactTooltip id="closeTask" effect="solid">
          Close
        </ReactTooltip>
      </div>
    </div>
  );
};

export default Filter;
