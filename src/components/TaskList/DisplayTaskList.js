import React, { useState, useEffect, useRef } from "react";
import AddTask from "./AddTask";
import { Button } from "react-bootstrap";
import { NavDropdown, DropdownButton, Dropdown } from "react-bootstrap";
//import addIcon from "../../assets/images/plus-icon.svg";
import plusImg from "../../assets/images/plus.svg";
import minusImg from "../../assets/images/minus-1.svg";
import moment from "moment";
import { Modal } from "react-bootstrap";
import "../../assets/css/TaskProjectList.scss"
import ReactTooltip from "react-tooltip";
import { debounce } from "../../utils/function";
import Checklist from "./Checklist";
import Filter from "./Filter";
import Summary from "./Summary";
import UserstoryCard from "../UserStory/UserstoryCard";
import UserstoryModal from "../UserStory/UserstoryModal";
import Spinner from 'react-bootstrap/Spinner'
import useOnClickOutside from 'use-onclickoutside';
import userstoryImg from '../../assets/images/userstory.png';
import { ROADMAP_STATUS } from '../../utils/Constants';

const DisplayTaskList = (props) => {
  const [deleteModal, setDeleteModal] = useState(false);
  //const [isOpen, setIsOpen] = useState(false)

  const [roadmapStatus, setRoadmapStatus] = useState({
    color: "#53a4f0",
    statusName: "Not Started",
    id: 1,
  });
  const [storyModal, showUserStoryModal] = useState(false);
  const [modalDetails, setModalDetails] = useState("");
  const [userstoryModal, setUserStoryModal] = useState(false);
  const [userStory, showUserStory] = useState(false);
  const [newUserstory, setNewUserstory] = useState(false);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [member, setMember] = useState(null);
  const [status, setStatus] = useState(null);
  const [userstoryDetails, setUserstorydetails] = useState(null);
  const [currentTask, setCurrentTask] = useState(null)


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
    //setRoadmapStatus({ ...props.taskStatus[e.target.value] });
    props.getRoadmapStatus(e.target.value, props.ProjectTask.id);
  }

  // Opens userstory detaisl
  const handleUserstoryModal = (modalDetails, userstoryId) => {
    // showUserStoryModal(!storyModal)
    props.showUserstoryTasks(false)
    setModalDetails(modalDetails)
    props.fetchUserstory(userstoryId)
    // props.showDetailsModal()
  }
  //closes details modal
  const handleDetailsClose = () => {
    props.showDetailsModal()
  }

  //open task details modal
  const handleTaskDetails = (modalDetails, task) => {
    setModalDetails(modalDetails)
    setCurrentTask(task)
    //props.setUserStoryDetails(task)
    props.showDetailsModal()
    // props.showUserstoryTasks()
  }

  const displayAddUserStory = () => {
    setUserStoryModal(!userstoryModal)
  }

  const closeAddUserStory = () => {
    setUserStoryModal(false)
  }

  const handleMemberChange = (e) => {
    setMember(e.target.value)
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const createUserstory = () => {
    if (name) {
      const defaultStatus = props.taskStatus.filter((a) => { return a.isDefault === true })
      const userStoryData = {
        name: name,
        description: "",
        owner_id: member,
        task_status_id: status ? status : defaultStatus[0].id,
        priority: "low"
      }
      props.addUserStory(userStoryData)
      setUserStoryModal(false)
    }
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
                if (props.isTaskListTasksLoading == false && props.list_id != props.id) {
                  props.loadTaskListTaskData(true, props.ProjectTask.id)
                }
                props.setConjuction(false, "", 0)
                props.closeFilter();
                props.closeSummary();
              }}
            >
              {props.list_id != props.id ? (
                // <i class="fa fa-plus" />
                <div className="add-icon-tasklistopen">
                  <img
                    src={plusImg}
                    height="10%"
                    width="10%"
                    className="plus-icon"
                    alt="open task list task"
                  ></img>
                </div>
              ) : (
                  <div className="minus-icon-tasklist">
                    {/* <i class="fa fa-minus" /> */}
                    <img
                      height="259%"
                      width="242%"
                      src={minusImg}
                      className="minus-icon"
                      alt="minus icon"
                    />
                  </div>
                )}
            </button>
          </div>
          <div className="textCard">
            <div className="project-task-name">
              {props.ProjectTask.name}&nbsp;&nbsp;&nbsp;
              {props.isTaskListTasksLoading && props.ProjectTask.id == props.state.taskListTasksLoadingID ?
                <Spinner animation="grow" variant="success" size="sm" /> :
                null}
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
                  //props.closeFilter();
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
                     {ROADMAP_STATUS &&
                       ROADMAP_STATUS.map((roadmapStatus, index) => {
                         return (
                           <option
                             key={index}
                             selected={
                               props.ProjectTask &&
                               props.ProjectTask.roadmap_status &&
                               roadmapStatus == props.ProjectTask.roadmap_status
                             }
                             value={roadmapStatus}
                           >
                             {roadmapStatus}
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
                data-tip data-for="taskChecklist"
                style={{ color: "#6A7074" }}>
              </i>
              <ReactTooltip id="taskChecklist" effect="solid">
                Roadmap Goals
              </ReactTooltip>
            </div>
            {props.list_id == props.id ? (
              <div
                className="filter-icon"
                onClick={(e) => {
                  e.preventDefault();
                  props.isFilterOpen();
                  //props.closeSummary();
                }}
              >
                <i class="fas fa-filter chg-text-icon" data-tip data-for="filterTask"
                style={{ color: "#6A7074" }}></i>
                <ReactTooltip id="filterTask" effect="solid">
                  Filter Roadmap
              </ReactTooltip>
              </div>) : null}
            {roleType == "admin" ?
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
              </div> : null}
            {roleType == "admin" ?
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
              </div> : null}
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
      ) : null}

      {props.showSummary && props.ProjectTask.id == props.state.summaryID ? (
        <div className="statusModal">
          <Summary
            id={props.ProjectTask.id}
            state={props.state}
            closeSummary={props.closeSummary}
            setConjuction={props.setConjuction}
          ></Summary>
        </div>
      ) : null}

      {props.showFilter && props.list_id == props.id ? (
        <div className="filter-modal">
          <Filter
            state={props.state}
            setConjuction={props.setConjuction}
            projectMembers={props.projectMembers}
            taskStatus={props.taskStatus}
            displayList={props.displayList}
            displayFiteredList={props.displayFiteredList}
            list_id={props.list_id}
            closeFilter={props.closeFilter}
            loadFilteredData={props.loadFilteredData}
          />
        </div>) : null}

      {props.list_id == props.id
        ? <div className="userstory-container">
          {props.Userstories
            && props.Userstories.length > 0
            ? props.Userstories.map((userstory) => {
              return (
                <UserstoryCard
                  state={props.state}
                  userstory={userstory}
                  taskEdit={props.taskEdit}
                  handleUserstoryModal={handleUserstoryModal}
                  isUserStoryLoading={props.isUserStoryLoading}
                  selectedUserStoryId={props.selectedUserStoryId}
                  projectMembers={props.projectMembers}
                  list_id={props.list_id}
                  saveUserstoryTask={props.saveUserstoryTask}
                  showTask={false}
                  taskStatus={props.taskStatus}
                  projectTaskList={props.projectTaskList}
                  switchTask2={props.switchTask2}
                  EditTlt={props.EditTlt}
                  editTltId={props.editTltId}
                  deleteTlt={props.deleteTlt}
                  isFilterLoading={props.isFilterLoading}
                  deleteUserstoryTask={props.deleteUserstoryTask}
                  handleTaskDetails={handleTaskDetails}
                  modalDetails={modalDetails}
                  currentTask={currentTask}
                  userTaskDetails={props.userTaskDetails}
                  // moveToDashBoard={props.moveToDashBoard}
                  usestoryMoveToDashboard={props.usestoryMoveToDashboard}
                  fetchUserstory={props.fetchUserstory}
                  currentUserstory={props.currentUserstory}
                  updatedTask={props.updatedTask}
                  userstoryUpdateTask={props.userstoryUpdateTask}
                  handleUpdatedTask={props.handleUpdatedTask}
                  showUserstoryTasks={props.showUserstoryTasks}
                  currentUserstoryTask={props.currentUserstoryTask}
                />)
            })
            : null}
            {props.state.loadingNewUserStory ? <Spinner animation="grow" variant="success" style={{marginTop: "1%",
              marginLeft: "-7%"}}/> : null}
        </div>
        : null}

      {/* prev position of add user Story */}



      {props.list_id == props.id ? (
        <>
          <div className="showCardDetails2">
            {props.task_lists && props.task_lists.length > 0
              ? props.task_lists.map((task_lists_task) => {
                return (
                  <AddTask
                    taskEdit={props.taskEdit}
                    state={props.state}
                    closeAddTask={props.closeAddTask}
                    addTaskLoading={props.addTaskLoading}
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
                    isFilterLoading={props.isFilterLoading}
                    handleTaskDetails={handleTaskDetails}
                    userTaskDetails={props.userTaskDetails}
                  />
                );
              })
              : ""}
          </div>

          {props.list_id == props.id && userstoryModal
        ? <div className="new-userstory">
          <div className="new-userstory-box">
            {/* <div className="userstory-drag-icon"><i class="fas fa-bars"></i></div> */}
            <div className="userstory-icon" style={{ paddingLeft: "29px" }}> 
            {/* <img src={userstoryImg} />  */}
            <i class="fa fa-users" style={{color:"#7686FF"}} aria-hidden="true"></i>
            </div>
            <div className="userstory-name">
              <input className="form-control" placeholder="Userstory Name" onChange={handleNameChange} />
            </div>
            <div className="userstory-status">
              <div className="status">
                <select
                  name="status"
                  onChange={(e) => handleStatusChange(e)}
                  className="form-control select-status"
                >
                  {props.taskStatus.map((status, index) => {
                    return (<option value={status.id}>{status.statusName}</option>);
                  })}
                </select>
              </div>
            </div>
            <div className="userstory-member">
              <div className="member">
                <div className="navDiv">
                  <select
                    name="member"
                    onChange={(e) => handleMemberChange(e)}
                    className="form-control select-member"
                  >
                    <option value="">Member</option>
                    {props.projectMembers.map((member, index) => {
                      return (<option value={member.id}>{member.name}</option>);
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display:"flex" }}>
            <div><i class="fa fa-check" style={{ cursor: "pointer", fontSize: "20px" }} onClick={createUserstory}></i></div>
            <div style={{ marginLeft:"66%" }}><i class="fa fa-times" style={{ cursor: "pointer", fontSize: "20px" }} onClick={closeAddUserStory}></i>
            </div>
            </div>
          </div>
        </div>
        : null}

        
          {props.TaskShow ? (
            <>
              <div className="showCardDetails">
                <AddTask
                  taskEdit={props.taskEdit}
                  state={props.state}
                  projectMembers={props.projectMembers}
                  list_id={props.list_id}
                  handleSaveTask={props.handleSaveTask}
                  showTask={false}
                  taskStatus={props.taskStatus}
                  displayAddTask={props.displayAddTask}
                  closeAddTask={props.closeAddTask}
                  addTaskLoading={props.addTaskLoading}
                  userTaskDetails={props.userTaskDetails}
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
            <Button
              variant="primary"
              className="add-task-btn"
              onClick={displayAddUserStory}
            >
              <i class="fa fa-plus add-icon" /> Add User Story{" "}
            </Button>
          </div>
        </>
      ) : null}

      {props.list_id == props.id && props.detailsModal
        ? <UserstoryModal
          state={props.state}
          userStory_checklists={props.userStory_checklists}
          userTaskDetails={props.userTaskDetails}
          taskEdit={props.taskEdit}
          userstoryDetails={userstoryDetails}
          handleDescription={props.handleDescription}
          editUserstory={props.editUserstory}
          editDescription={props.editDescription}
          currentTask={currentTask}
          setUserStoryDetails={props.setUserStoryDetails}
          handleTaskDetails={handleTaskDetails}
          handleUserstoryModal={handleUserstoryModal}
          addTaskChecklist={props.addTaskChecklist}
          updateTaskChecklist={props.updateTaskChecklist}
          deleteTaskChecklist={props.deleteTaskChecklist}
          modalDetails={modalDetails}
          currentUserstory={props.currentUserstory}
          projectMembers={props.projectMembers}
          handleMemberChange={handleMemberChange}
          list_id={props.list_id}
          deleteUserStory={props.deleteUserStory}
          taskStatus={props.taskStatus}
          categories={props.categories}
          saveUserstoryTask={props.saveUserstoryTask}
          editUserstory={props.editUserstory}
          handleDetailsClose={handleDetailsClose}
          addUserstoryChecklist={props.addUserstoryChecklist}
          updateUserstoryChecklist={props.updateUserstoryChecklist}
          deleteUserstoryChecklist={props.deleteUserstoryChecklist}
          editTltId={props.editTltId}
          updatedData={props.updatedData}
          handleSaveTask={props.handleSaveTask}
          EditTlt={props.EditTlt}
          handleUpdatedData={props.handleUpdatedData}
          checklistItem={props.checklistItem}
          newChecklist={props.newChecklist}
          handleTaskC={props.handleTaskC}
          action={props.action}
          saveUserstoryTask={props.saveUserstoryTask}
        />
        : null}

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
