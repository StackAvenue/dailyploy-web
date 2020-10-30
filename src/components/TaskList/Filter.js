import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { firstTwoLetter, textTitlize } from "../../utils/function";
import ReactTooltip from "react-tooltip";

const Filter = (props) => {
  const [statusSelections, setStatusSelections] = useState("");
  const [multiSelections, setMultiSelections] = useState([]);
  const [selection, setSelection] = useState([]);
  const [isSelected, setIsSelected] = useState(false)
  const [isDropdownMemberSelected, setIsDropdownMemberSelected] = useState(false)
  const [isBothSelected, setIsBothSelected] = useState(false)
  const [isMemberSelected, setIsMemberSelected] = useState(false)
  const [isStatusSelected, setIsStatusSelected] = useState(false)
  const [statusId, setStatusId] = useState(null)
  const [memberId, setMemberId] = useState(null)
  const multiSelect = false;

  function handleOnClick(member, type) {
    if(!isMemberSelected && !isStatusSelected) {
      props.loadFilteredData(true)
      setMemberId(member.id)
    if (!selection.some((user) => user.id === member.id)) {
      props.displayFiteredList(props.list_id, member.id, type);
      //props.displayList(props.list_id, member.id, type);
      props.setConjuction(true, type, member.id);
      setIsBothSelected(true)
      setIsMemberSelected(true)
      if (!multiSelect) {
        setSelection([member]);
        setIsSelected(true)
      } else if (multiSelect) {
        setSelection([...selection, member]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (user) => user.id !== member.id
      );
      setSelection([...selectionAfterRemoval]);
      props.displayFiteredList(props.list_id, 0, "all");
      //props.displayList(props.list_id, 0, "all");
      setIsBothSelected(true)
      setIsMemberSelected(false)
      //props.setConjuction(true, "filter", member.id);
      props.setConjuction(false, "", 0)
      setIsSelected(false)
    }
    } else if (isMemberSelected && !isStatusSelected) {
      props.loadFilteredData(true)
      setMemberId(member.id)
    if (!selection.some((user) => user.id === member.id)) {
      props.displayFiteredList(props.list_id, member.id, type);
      //props.displayList(props.list_id, member.id, type);
      props.setConjuction(true, type, member.id);
      setIsBothSelected(true)
      setIsMemberSelected(true)
      if (!multiSelect) {
        setSelection([member]);
        setIsSelected(true)
      } else if (multiSelect) {
        setSelection([...selection, member]);
      }
    } else {
      let selectionAfterRemoval = selection;
      selectionAfterRemoval = selectionAfterRemoval.filter(
        (user) => user.id !== member.id
      );
      setSelection([...selectionAfterRemoval]);
      props.displayFiteredList(props.list_id, 0, "all");
      //props.displayList(props.list_id, 0, "all");
      setIsBothSelected(true)
      setIsMemberSelected(false)
      //props.setConjuction(true, "filter", member.id);
      props.setConjuction(false, "", 0)
      setIsSelected(false)
    }
    }
    else {
      setMemberId(member.id)
      props.loadFilteredData(true)
      if (!selection.some((user) => user.id === member.id)) {
        props.displayFiteredList(props.list_id, member.id, "both", statusId);
        //props.displayList(props.list_id, member.id, "both", statusId);
        props.setConjuction(true, "both", member.id, statusId);
        setIsBothSelected(true)
        setIsMemberSelected(true)
        if (!multiSelect) {
          setSelection([member]);
          setIsSelected(true)
        } else if (multiSelect) {
          setSelection([...selection, member]);
        }
      } else {
        let selectionAfterRemoval = selection;
        selectionAfterRemoval = selectionAfterRemoval.filter(
          (user) => user.id !== member.id
        );
        setSelection([...selectionAfterRemoval]);
        props.displayFiteredList(props.list_id, statusId, "status");
        //props.displayList(props.list_id, statusId, "status");
        props.setConjuction(true, "status", statusId);
        setIsBothSelected(true)
        setIsMemberSelected(false)
        //props.setConjuction(true, "filter", member.id);
        //props.setConjuction(false, "", 0)
        setIsSelected(false)
      }
    }
  }

  function isItemInSelection(item) {
    if (selection.some((current) => current.id === item.id)) {
      return true;
      //setIsSelected(true)
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
                    //setIsDropdownMemberSelected(!isDropdownMemberSelected)
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
        setStatusId(selectedStatus.id)
        //setIsBothSelected(true)
        props.loadFilteredData(true)
        // props.setConjuction(true, "status", selectedStatus.id)
        if (isMemberSelected && !isStatusSelected) {
          props.displayFiteredList(props.list_id, memberId, "both", selectedStatus.id);
          //props.displayList(props.list_id, memberId, "both", selectedStatus.id);
          props.setConjuction(true, "both", memberId, selectedStatus.id);
          setIsStatusSelected(true)
          setIsMemberSelected(true)
        }
        else {
          props.displayFiteredList(props.list_id, selectedStatus.id, props.state.STATUS);
          //props.displayList(props.list_id, selectedStatus.id, props.state.STATUS);
          props.setConjuction(true, "status", selectedStatus.id);
          setIsStatusSelected(true)
          setIsBothSelected(true)
        }
      } else {
        console.log("undefined");
      }
    } else if (event.keyCode === 8 && statusSelections.length > 0) {
      var flag = false;
      if (!flag) {
        //setIsStatusSelected(false)
        props.loadFilteredData(true)
        if (isMemberSelected && isStatusSelected) {
          props.displayFiteredList(props.list_id, memberId, props.state.MEMBER);
          //props.displayList(props.list_id, memberId, props.state.MEMBER);
          //setIsBothSelected(false)
          props.setConjuction(true, "member", memberId)
          setIsStatusSelected(false)
          
        } else {
          props.displayFiteredList(props.list_id, 0, "all");
          //props.displayList(props.list_id, 0, "all");
          setIsStatusSelected(false);
          props.setConjuction(false, "", 0)
        }
        //props.displayList(props.list_id, 0, "all");
        // props.setConjuction(false, "", 0)
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
        {isSelected && props.projectMembers.length>4 && isDropdownMemberSelected ? <span class="member-selected">Member selected : 1</span> : null}
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
          props.loadFilteredData(true)
          props.displayFiteredList(props.list_id, 0, "all");
          //props.displayList(props.list_id, 0, "all");
        }}
      >
        <i class="fa fa-times" data-tip data-for="closeTask" onClick={(e) => props.setConjuction(false, "", 0)}></i>&nbsp;&nbsp;
        <ReactTooltip id="closeTask" effect="solid">
          Close
        </ReactTooltip>
      </div>
    </div>
  );
};

export default Filter;
