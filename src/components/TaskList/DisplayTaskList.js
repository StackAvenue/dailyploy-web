import React, { useState } from "react";
import AddTask from "./AddTask";
import { Button } from "react-bootstrap";
import { NavDropdown, DropdownButton, Dropdown } from "react-bootstrap";
import addIcon from "../../assets/images/plus-icon.svg";
import moment from "moment";
import { Modal } from "react-bootstrap";
import "../../assets/css/TaskProjectList.scss"
import ReactTooltip from "react-tooltip";
import { debounce } from "../../utils/function";


const DisplayTaskList = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);

  let roleType = localStorage.getItem("userRole");
  const changeDeleteModal = (value) => {
    setDeleteModal(value);
  };

  const deleteTask = debounce(() => {
    props.deleteTaskList(props.ProjectTask.id);
    changeDeleteModal(false);
  }, 250);

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
              {props.ProjectTask ? props.ProjectTask.start_date ? moment(props.ProjectTask.start_date).format("DD MMM, YY") : "Starts :-" : null}
              &nbsp;to&nbsp;
              {props.ProjectTask ? props.ProjectTask.end_date ? moment(props.ProjectTask.end_date).format("DD MMM, YY") : "Ends :-" : null}
            </div>
          </div>
          <div className="option-icons">
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

      {props.list_id == props.id ? (
        <>
          <div className="showCardDetails2">
            {props.task_lists && props.task_lists.length > 0
              ? props.task_lists.map((task_lists_task) => {
                return (
                  <AddTask
                    projects={props.projects}
                    list_id={props.list_id}
                    projectMembers={props.projectMembers}
                    task_lists_task={task_lists_task}
                    showTask={
                      props.editTltId != task_lists_task.id ? true : false
                    }
                    worksapceMembers={props.worksapceMembers}
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
                  worksapceMembers={props.worksapceMembers}
                  projects={props.projects}
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
