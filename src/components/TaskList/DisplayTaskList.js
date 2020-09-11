import React, { useState, useEffect, useRef } from "react";
import AddTask from "./AddTask";
import { Button } from "react-bootstrap";
import { NavDropdown, DropdownButton, Dropdown } from "react-bootstrap";
import addIcon from "../../assets/images/plus-icon.svg";
import moment from "moment";
import { Modal } from "react-bootstrap";
import "../../assets/css/TaskProjectList.scss"
import ReactTooltip from "react-tooltip";
import { debounce } from "../../utils/function";
import Checklist from "./Checklist";
import Filter from "./Filter";
import Summary from "./Summary";
import useOnClickOutside from 'use-onclickoutside';


const DisplayTaskList = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  //const [isOpen, setIsOpen] = useState(false)
  
  const [roadmapStatus, setRoadmapStatus] = useState({
    color: "#53a4f0",
    statusName: "Not Started",
    id: 1,
  });

  let roleType = localStorage.getItem("userRole");
  const changeDeleteModal = (value) => {
    setDeleteModal(value);
  };

  const deleteTask = debounce(() => {
    props.deleteTaskList(props.ProjectTask.id);
    changeDeleteModal(false);
  }, 250);

 const ref = useRef();
 useOnClickOutside(ref, () => props.isChecklistOpen(props.ProjectTask.id));
 
  const handleInputChange = (e) => {
    setRoadmapStatus({ ...props.taskStatus[e.target.value] });
    props.getRoadmapStatus(e.target.value, props.ProjectTask.id);
  }

  return (
    <div key={props.id} className="DisplayprojectListTopCard">
      <div className="projectListInCard">
        <div className="cardAndButton">
          <div className="buttonCard">
            <button
              className="buttonCardIcon"
              style={{ border: `solid 1px gray` }}
              onClick={(e) => {
                e.preventDefault();
                props.displayList(props.ProjectTask.id);
                props.closeFilter();
                props.closeSummary();
              }}
            >
              {props.list_id != props.id ? (
                // <i class="fa fa-plus" />
                <div className="add-icon-tasklistopen">
                  <img
                    src={addIcon}
                    className="plus-icon"
                    alt="open task list task"
                  ></img>
                </div>
              ) : (
                  <div className="minus-icon-tasklist">
                    <i class="fa fa-minus" />

                    {/* <img
                      src={substract}
                      className="minus-icon"
                      alt="minus icon"
                    /> */}
                  </div>
                )}
            </button>
          </div>
          <div className="textCard">
            <div className="project-task-name">
              {props.ProjectTask.name}&nbsp;
            </div>
            <div className="project-task-date">
              {props.ProjectTask ? props.ProjectTask.start_date && !props.ProjectTask.end_date ? "Starts:-" : null : null}
              {props.ProjectTask ? props.ProjectTask.start_date ? moment(props.ProjectTask.start_date).format("DD MMM, YY") : null : null}
              {props.ProjectTask.start_date && props.ProjectTask.end_date ? " to " : null}
              {props.ProjectTask ? !props.ProjectTask.start_date && props.ProjectTask.end_date ? "Ends:-" : null : null}
              {props.ProjectTask ? props.ProjectTask.end_date ? moment(props.ProjectTask.end_date).format("DD MMM, YY") : null : null}
              {props.ProjectTask ? !props.ProjectTask.start_date && !props.ProjectTask.end_date ? "No timeline" : null : null}
              &nbsp;&nbsp;&nbsp;
              <Button variant="outline-dark"
                onClick={(e) => {
                  e.preventDefault();
                  props.isSummaryOpen(props.ProjectTask.id);
                  props.closeFilter();
                }}>Summary</Button>
            </div>
          </div>
          <div className="roadmap-status-box">
            <select
              name="statusName"
              onChange={(e) => {
                handleInputChange(e);
              }}
              className="roadmap-status"
            >
              <option value={""}>Select status</option>
              {props.taskStatus &&
                props.taskStatus.map((roadmapStatus, index) => {
                  return (
                    <option
                      key={index}
                      selected={
                        props.ProjectTask &&
                        props.ProjectTask.roadmap_status &&
                        roadmapStatus.id == props.ProjectTask.roadmap_status.id
                      }
                      value={roadmapStatus.id}
                    >
                      {roadmapStatus.statusName}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="option-icons">
          <div
            className="checklist-icon"
            onClick={(e) => {
              e.preventDefault();
              props.isChecklistOpen(props.ProjectTask.id);
              //setIsOpen(true)
            }}
            >
              <i class="fa fa-check-square-o" 
              aria-hidden="true"
              data-tip data-for="taskChecklist">
              </i>
              <ReactTooltip id="taskChecklist" effect="solid">
                Roadmap Checklist
              </ReactTooltip>
            </div>
          {props.list_id == props.id ? (
          <div
              className="filter-icon"
              onClick={(e) => {
                e.preventDefault();
                props.isFilterOpen();
                props.closeSummary();
              }}
            >
             <i class="fas fa-filter chg-text-icon" data-tip data-for="filterTask"></i>
              <ReactTooltip id="filterTask" effect="solid">
                Filter Roadmap
              </ReactTooltip>
              </div>) : null}
            <div
              className="edit-icon"
              onClick={(e) => {
                e.preventDefault();
                if (roleType != "admin") {
                  return;
                }
                props.editTaskList(props.ProjectTask);
              }}
            >
              <i class="fas fa-pencil-alt chg-text-icon"
                data-tip data-for="editTask"

              ></i>
              <ReactTooltip id="editTask" effect="solid">
                Edit Roadmap
              </ReactTooltip>
            </div>
            <div
              className="delete-icon"
              onClick={(e) => {
                e.preventDefault();
                if (roleType != "admin") {
                  return;
                }
                changeDeleteModal(true);
              }}
            >
              <i class="fas fa-trash-alt del-icon"
                data-tip data-for="deleteTask"
              ></i>
              <ReactTooltip id="deleteTask" effect="solid">
                Delete Roadmap
              </ReactTooltip>
            </div>
          </div>
        </div>
      </div>
      {props.showChecklist && props.ProjectTask.id == props.checklistID ? (
          <div ref={ref} className="checklistModal">
            <Checklist
            state={props.state}
            id={props.ProjectTask.id}
            closeChecklist={props.closeChecklist}
            >
            </Checklist>
          </div>
        ):null}

      {props.showSummary && props.ProjectTask.id == props.state.summaryID ? (
        <div className="statusModal">
          <Summary
            id={props.ProjectTask.id}
            state={props.state}
            closeSummary={props.closeSummary}
          ></Summary>
        </div>
      ) : null}

      {props.showFilter && props.list_id == props.id ? (
        <div className="filter-modal">
          <Filter
            state={props.state}
            projectMembers={props.projectMembers}
            taskStatus={props.taskStatus}
            displayList={props.displayList}
            list_id={props.list_id}
            closeFilter={props.closeFilter}
          />
        </div>) : null}

      {props.list_id == props.id ? (
        <>
          <div className="showCardDetails2">
            {props.task_lists && props.task_lists.length > 0
              ? props.task_lists.map((task_lists_task) => {
                return (
                  <AddTask
                    list_id={props.list_id}
                    projectMembers={props.projectMembers}
                    task_lists_task={task_lists_task}
                    showTask={
                      props.editTltId != task_lists_task.id ? true : false
                    }
                    deleteTlt={props.deleteTlt}
                    moveToDashBoard={props.moveToDashBoard}
                    projectTaskList={props.projectTaskList}
                    switchTask={props.switchTask}
                    EditTlt={props.EditTlt}
                    handleSaveTask={props.handleSaveTask}
                    taskStatus={props.taskStatus}
                    categories={props.categories}
                  />
                );
              })
              : ""}
          </div>
          {props.TaskShow ? (
            <>
              <div className="showCardDetails">
                <AddTask
                  projectMembers={props.projectMembers}
                  list_id={props.list_id}
                  handleSaveTask={props.handleSaveTask}
                  showTask={false}
                  taskStatus={props.taskStatus}
                />
              </div>
            </>
          ) : null}
          <div className="container2OpenModal1">
            <Button
              variant="primary"
              className="add-task-btn"
              onClick={props.displayAddTask}
            >
              <i class="fa fa-plus add-icon" /> Add Task{" "}
            </Button>
          </div>
        </>
      ) : null}

      <Modal
        className="task-delete-confirm-modal "
        show={deleteModal}
        onHide={(e) => {
          changeDeleteModal(false);
        }}
        style={{ paddingTop: "1.5%", paddingBottom: "30px" }}
      >
        <div className="delete-tag">Are you sure you want to delete ?</div>
        <div className="button-delcancel">
          <button className="del-button" onClick={deleteTask}>
            Delete
          </button>
          <button
            className="cancel-button"
            onClick={(e) => {
              e.preventDefault();
              changeDeleteModal(false);
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};
export default DisplayTaskList;
