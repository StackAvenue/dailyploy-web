import React, { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import ReactTooltip from "react-tooltip";

const Filter = (props) => {
  const [multiSelections, setMultiSelections] = useState([]);
  const [multipleMemberSelections, setMultipleMemberSelections] = useState([]);
  const [isMemberSelected, setIsMemberSelected] = useState(false);
  const [isStatusSelected, setIsStatusSelected] = useState(false);
  const [statusId, setStatusId] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [isMemberChanged, setIsMemberChanged] = useState(false);

  const statuses = props.taskStatus.map((status) => {
    return status.statusName;
  });

  const roadmapMembers = props.projectMembers.map((member) => {
    return member.name;
  });

  useEffect(() => {
    if (isStatusChanged) {
      filterStatuses();
    }
  }, [multiSelections, isStatusChanged]);

  useEffect(() => {
    if (isMemberChanged) {
      filterMembers();
    }
  }, [multipleMemberSelections, isMemberChanged]);

  const filterMembers = () => {
    if (multipleMemberSelections.length > 0) {
      let filterMemberIds = [];
      props.loadFilteredData(true);
      for (var i = 0; i < multipleMemberSelections.length; i++) {
        for (var j = 0; j < props.projectMembers.length; j++) {
          if (multipleMemberSelections[i] == props.projectMembers[j].name) {
            filterMemberIds.push(props.projectMembers[j].id);
          }
        }
      }
      setMemberId(filterMemberIds.toString());
      if (!isMemberSelected && !isStatusSelected) {
        props.displayFiteredList(
          props.list_id,
          filterMemberIds.toString(),
          props.state.MEMBER
        );
        props.setConjuction(true, "member", filterMemberIds.toString());
        setIsMemberSelected(true);
      } else if (isMemberSelected && !isStatusSelected) {
        props.displayFiteredList(
          props.list_id,
          filterMemberIds.toString(),
          props.state.MEMBER
        );
        props.setConjuction(true, "member", filterMemberIds.toString());
        setIsMemberSelected(true);
      } else {
        props.displayFiteredList(
          props.list_id,
          filterMemberIds.toString(),
          "both",
          statusId
        );

        props.setConjuction(true, "both", filterMemberIds.toString(), statusId);
        setIsMemberSelected(true);
      }
    } else {
      if (multipleMemberSelections.length == 0 && multiSelections.length > 0) {
        props.displayFiteredList(props.list_id, statusId, props.state.STATUS);
        props.setConjuction(true, "status", statusId);
        setIsMemberSelected(false);
        setIsStatusSelected(true);
      } else if (
        multiSelections.length == 0 &&
        multipleMemberSelections.length == 0
      ) {
        props.displayFiteredList(props.list_id, 0, "all");
        props.setConjuction(false, "", 0);
        setIsMemberSelected(false);
        setIsStatusSelected(false);
      } else {
        props.displayFiteredList(props.list_id, 0, "all");
      }
    }
  };

  const filterStatuses = () => {
    if (multiSelections.length > 0) {
      let filterStatusIds = [];
      props.loadFilteredData(true);
      for (var i = 0; i < multiSelections.length; i++) {
        for (var j = 0; j < props.taskStatus.length; j++) {
          if (multiSelections[i] == props.taskStatus[j].statusName) {
            filterStatusIds.push(props.taskStatus[j].id);
          }
        }
      }
      setStatusId(filterStatusIds.toString());
      if (isMemberSelected && !isStatusSelected) {
        props.displayFiteredList(
          props.list_id,
          memberId,
          "both",
          filterStatusIds.toString()
        );

        props.setConjuction(true, "both", memberId, filterStatusIds.toString());
        setIsStatusSelected(true);
        setIsMemberSelected(true);
      } else if (isMemberSelected && isStatusSelected) {
        props.displayFiteredList(
          props.list_id,
          memberId,
          "both",
          filterStatusIds.toString()
        );
        props.setConjuction(true, "both", memberId, filterStatusIds.toString());
        setIsStatusSelected(true);
        setIsMemberSelected(true);
      } else {
        props.displayFiteredList(
          props.list_id,
          filterStatusIds.toString(),
          props.state.STATUS
        );
        props.setConjuction(true, "status", filterStatusIds.toString());
        setIsStatusSelected(true);
      }
    } else {
      if (multiSelections.length == 0 && multipleMemberSelections.length > 0) {
        props.displayFiteredList(props.list_id, memberId, props.state.MEMBER);
        props.setConjuction(true, "member", memberId);
        setIsMemberSelected(true);
        setIsStatusSelected(false);
      } else if (
        multiSelections.length == 0 &&
        multipleMemberSelections.length == 0
      ) {
        props.displayFiteredList(props.list_id, 0, "all");
        props.setConjuction(false, "", 0);
        setIsMemberSelected(false);
        setIsStatusSelected(false);
      } else {
        props.displayFiteredList(props.list_id, 0, "all");
      }
    }
  };

  const filteredStatusValues = (selected) => {
    setMultiSelections(selected);
    setIsStatusChanged(true);
  };

  const filteredMemberValues = (selected) => {
    setMultipleMemberSelections(selected);
    setIsMemberChanged(true);
  };

  return (
    <div className="filter-div">
      <div className="input-filter">
        <Typeahead
          id="basic-typeahead-multiple"
          labelKey="name"
          multiple
          clearButton
          onChange={(selected) => {
            filteredStatusValues(selected);
          }}
          //onKeyDown={handleStatusKeyDown}
          //labelKey="statusName"
          options={statuses}
          placeholder="Filter Statuses"
          selected={multiSelections}
        />
      </div>
      <div className="member-search-filter">
        <Typeahead
          id="basic-typeahead-multiple"
          labelKey="name"
          multiple
          clearButton
          onChange={(selected) => {
            filteredMemberValues(selected);
          }}
          //onKeyDown={handleMemberKeyDown}
          options={roadmapMembers}
          placeholder="Filter Members"
          selected={multipleMemberSelections}
        />
      </div>
      <div
        className="close-filter"
        onClick={(e) => {
          e.preventDefault();
          props.closeFilter();
          props.loadFilteredData(true);
          props.displayFiteredList(props.list_id, 0, "all");
        }}
      >
        <i
          class="fa fa-times"
          data-tip
          data-for="closeTask"
          onClick={(e) => props.setConjuction(false, "", 0)}
        ></i>
        &nbsp;&nbsp;
        <ReactTooltip id="closeTask" effect="solid">
          Close
        </ReactTooltip>
      </div>
    </div>
  );
};

export default Filter;
