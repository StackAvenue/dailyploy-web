import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { DropdownButton, Dropdown, ListGroup } from "react-bootstrap";
import { PRIORITIES } from "../../utils/Constants";
import DatePicker from "react-datepicker";
import { Modal, Button } from "react-bootstrap";
import { debounce } from "../../utils/function";
import "react-datepicker/dist/react-datepicker.css";
import VideoLoader from "../dashboard/VideoLoader";
import taskImg from '../../assets/images/tasklist.png';
import Spinner from 'react-bootstrap/Spinner';

const AddTask = (props) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [estimation, setEstimation] = useState(0);
  const [estimationtime, setEstimationtime] = useState(0);
  const [priority, setPriority] = useState({
    name: "low",
    color_code: "#555555",
    label: "low"
  });
  const [member, setMember] = useState("");
  const [nameError, setNameError] = useState(false);
  const [memberError, setMemberError] = useState(false);
  const [showTaskListName, setshowTaskListName] = useState(false);
  const [projectTasks, setProjectTasks] = useState([]);
  const [openCalenderModal, setOpenCalenderModal] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [taskCategories, setTaskCategories] = useState();
  const [moveToOTherTask, setMoveToOTherTask] = useState();
  const [status, setstatus] = useState({});

  const showDeleteModal = () => {
    setIsDeleteModal(true)
  }
  const hideDeleteModal = () => {
    setIsDeleteModal(false)
  }
  const calendarFromRef = useRef(null);
  const calendarToRef = useRef(null);

  const openFromCalender = () => {
    calendarFromRef.current.setOpen(true);
  };
  const openToCalender = () => {
    calendarToRef.current.setOpen(true);
  };

  // const openSelectCalender = () => {
  //   openCalender.current.setOpen(true);
  // };

  const handleSave = debounce(() => {
    //props.addTaskLoading(true)
    if (taskName && member != -1) {
      var task_lists = {
        name: taskName,
        estimation: estimation,
        list_id: props.list_id,
        priority: priority.label,
        status: status,
        description: description,
        assigne_id: member,
      };
      { props.isUserstory ? props.handleUserstoryTask(task_lists) : props.handleSaveTask(task_lists) }
      setNameError(false);
      setMemberError(false);
    } else {
      if (!taskName && member == -1) {
        setNameError(true);
        setMemberError(true);
      } else if (!taskName) {
        setNameError(true);
      } else {
        setMemberError(true);
      }
    }
  }, 250);



  const otherTasksSave = debounce((e) => {
    e.preventDefault();
    setshowTaskListName(false);
    var moveTaskId = null
    if(moveToOTherTask == null)
    {
      moveTaskId = projectTasks[0].id;
    }
    else {
      moveTaskId = moveToOTherTask;
    }
    {props.isUserstory ? 
    props.switchTask2(
      moveTaskId,
      props.task_lists_task.id
    ) :
    props.switchTask(
      moveTaskId,
      props.task_lists_task.id
    )}
  }, 250)

  const handleInputChange = (e) => {
    var { name, value } = e.target;

    switch (name) {
      case "taskName":
        setTaskName(value);
        setNameError(false);
        break;
      case "description":
        setDescription(value);
        break;
      case "estimation":
        setEstimation(value);
        console.log(estimation)
        break;
      case "status":
        // console.log("e.target", props.taskStatus[e.target.value]);
        setstatus({ ...props.taskStatus[e.target.value] });
        break;
      case "category":
        // console.log("e.target.value", e.target.value);
        setTaskCategories(e.target.value);
        break;
      case "priority":
        setPriority({ ...PRIORITIES[e.target.value] });
        break;
      case "member":
        setMember(value.toString());
        setMemberError(false);
        break;
      case "moveOther":
        setMoveToOTherTask(value)


    }
    console.log(value);
  };

  const changeMoveTo = (value) => {
    setshowTaskListName(value);
  };

  const changeCalenderModal = (value) => {
    setOpenCalenderModal(value);
  };

  const changeFromDate = (date) => {
    setSelectedFromDate(date);
  };

  const changeToDate = (date) => {
    setSelectedToDate(date);
  };


  const changeToDashboard = () => {
    let dataObject = {
      name: taskName,
      estimation: estimation,
      list_id: props.list_id,
      priority: priority,
      status: status,
      description: description,
      assigne_id: member,
      startDate: selectedFromDate,
      endDate: selectedToDate,
      tltId: props.task_lists_task.id,
    };

    { props.isUserstory ? props.moveToDashboardUTask(dataObject) : props.moveToDashBoard(dataObject); }
    changeCalenderModal(false);
  };

  const handleBlur = (e) => {
    if (e.currentTarget.value === '0') e.currentTarget.value = '1'
  }

  const handleKeypress = (e) => {
    const characterCode = e.key
    if (characterCode === 'Backspace') return
    const characterNumber = Number(characterCode)
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) {
        return
      } else if (characterNumber === 0) {
        e.preventDefault()
      }
    }  else if(e.keyCode==189 || e.keyCode==190) {
      e.preventDefault()
    }
    else {}
  }

  const setTaskStatuses = (taskStatus) => {
    let status = taskStatus.find(status => status.isDefault == true)
    setstatus(status)
  }

  useEffect(() => {
    setTaskStatuses(props.taskStatus)
    if (props.showTask) {
      setTaskName(props.task_lists_task.name);
      setDescription(
        props.task_lists_task.description
          ? props.task_lists_task.description
          : ""
      );
      setEstimation(props.task_lists_task.estimation);
      if(props.isUserstory) {
        setstatus({
          statusName: props.task_lists_task.task_status.name
            ? props.task_lists_task.task_status.name
            : "Not Started",
          color: "#53a4f0",
          id: props.task_lists_task.task_status
            ? props.task_lists_task.task_status.id : 'null'
        });
      } 
      else {
        setstatus({
          statusName: props.task_lists_task.status
            ? props.task_lists_task.status.name
            : "Not Started",
          color: "#53a4f0",
          id: props.task_lists_task.status
            ? props.task_lists_task.status.id : 'null'
        });
      }

      const prio = PRIORITIES.filter(
        priority => props.task_lists_task.priority && priority.label.toLowerCase() == props.task_lists_task.priority.toLowerCase())

      if (prio && prio.length > 0) {
        setPriority(prio[0])
      }
      if(props.isUserstory) {
        setMember(
          props.task_lists_task && props.task_lists_task.owner_id
            ? props.task_lists_task.owner_id.toString()
            : ""
        );
      } 
      else {
        setMember(
          props.task_lists_task && props.task_lists_task.assigne_id
            ? props.task_lists_task.assigne_id.toString()
            : ""
        );
      }
    }
    if (props.projectTaskList) {
      let taskLists = [];
      taskLists = props.projectTaskList.filter((eachTask) => {
        return eachTask.id != props.list_id;
      });

      setProjectTasks(taskLists);
    }
  }, [props.task_lists_task, props.showTask]);

  const onDoubleClickEnable = (e) => {
    e.preventDefault();
    props.EditTlt(props.task_lists_task.id);
    props.taskEdit(true);
  }

  const togglTaskList = (e) => {
    setshowTaskListName(!showTaskListName)

  }

  const handleKeyDown = (e, taskName) => {
    if (e.keyCode === 27 && taskName == "") {
      props.closeAddTask()
    }
    // else if(e.keyCode === 27){
    // }
  }

  return (
    <>
      {/* <div className="InnershowCardDetails"> */}
      <div className={`${props.isUserstory && props.isUserDetailOpen ? "addtask-UserStory" : "InnershowCardDetails"}`}>
        
          <>
            <div className="drag-icon">
              {/* <i class="fas fa-bars"></i> */}
            </div>
            <div className="task-icon">
              {/* <i class="fas fa-clipboard-check fa-lg"></i> */}
              <i class="fa fa-file-text-o" aria-hidden="true" style={{fontSize: "18px",
                color: "rgb(118 134 255)"}}></i>
            </div>
            <div className="task-field">

              <div className="task" onDoubleClick={onDoubleClickEnable}>
                <div className="taskNo">
                  <input
                    type='text'
                    disabled={props.showTask}
                    value={taskName}
                    placeholder="Task Name"
                    onChange={(e) => handleInputChange(e)}
                    name="taskName"
                    className={`form-control ${props.showTask ? "" : "editMode"}`}
                  />
                  <div className="hover-task" >{taskName}</div>
                  {nameError && <span>Please add name</span>}
                </div>
                {/* <div className="Description">
                <input
                  type={Text}
                  disabled={props.showTask}
                  name="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => handleInputChange(e)}
                  className="form-control"
                />
                </div> */}
                <div className="Estimation" style={{display:"flex", width:"5%"}}>
                  <input
                    type="number"
                    onKeyDown={(e) => handleKeypress(e)}
                    onBlur={(e) => handleBlur(e)}
                    min='1'
                    step='1'
                    max='100'
                    disabled={props.showTask}
                    style={{padding: "7px"}}
                    name="estimation"
                    placeholder="Estimation"
                    value={estimation}
                    onChange={(e) => handleInputChange(e)}
                    className={`form-control ${props.showTask ? "" : "editMode"} `}
                  />
                  {props.showTask ? 
                  <div style={{ fontSize:"13px", 
                  marginTop:"6px", 
                  marginLeft: "0px",
                  position: "relative",
                  left: "-6px"}}>hr</div> 
                  : null}
                  {/* <p className="text-Estimation">1hr=1pt</p> */}
                </div>
                {props.isUserstory ? 
                <div className="status">
                  <select
                    name="status"
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    disabled={props.showTask}
                    className={`form-control ${props.showTask ? "" : "editMode"} `}
                  >
                    {/* <option value={""}>Status</option> */}
                    {props.taskStatus &&
                      props.taskStatus.map((status, index) => {
                        // console.log("status", status);
                        return (
                          <option
                            key={index}
                            selected={
                              props.task_lists_task &&
                              props.task_lists_task.task_status &&
                              props.task_lists_task.task_status.id &&
                              status.id == props.task_lists_task.task_status.id
                            }
                            value={index}
                          >
                            {status.statusName}
                          </option>
                        );
                      })}
                  </select>
                </div>: 
                <div className="status">
                <select
                  name="status"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  disabled={props.showTask}
                  className={`form-control ${props.showTask ? "" : "editMode"} `}
                >
                  {/* <option value={""}>Status</option> */}
                  {props.taskStatus &&
                    props.taskStatus.map((status, index) => {
                      // console.log("status", status);
                      return (
                        <option
                          key={index}
                          selected={
                            props.task_lists_task &&
                            props.task_lists_task.status &&
                            props.task_lists_task.status.id &&
                            status.id == props.task_lists_task.status.id
                          }
                          value={index}
                        >
                          {status.statusName}
                        </option>
                      );
                    })}
                </select>
              </div>
                }
                <div className="time">
                  <div
                    className="disc"
                    style={{
                      backgroundColor: `${priority.color_code}`,
                    }}
                  ></div>
            &nbsp;&nbsp;
            <select
                    name="priority"
                    onChange={(e) => handleInputChange(e)}
                    className={`form-control ${props.showTask ? "" : "editMode"} `}
                    placeholder="Priorities"
                   disabled={props.showTask}
                  //value={priority}
                  >
                    {/* <option value="low">Low</option> */}
                    {PRIORITIES.slice(0, 3).map((Priority, index) => (
                      <option value={index} selected={priority.label.toLowerCase().trim() == Priority.label.toLowerCase().trim() ? priority.label : ""}>
                        {Priority.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="member">
            <div className="navDiv">
              <select
                name="status"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                disabled={props.showTask}
                className="form-control"
              >
                {/* <option value={""}>Status</option> */}
                {/* {props.taskStatus &&
                  props.taskStatus.map((status, index) => {
                    console.log("status", status);
                    return (
                      <option
                        key={index}
                        selected={
                          props.task_lists_task &&
                          props.task_lists_task.status &&
                          props.task_lists_task.status.id &&
                          status.id == props.task_lists_task.status.id
                        }
                        value={index}
                      >
                        {status.statusName}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div className="time">
              <div
                className="disc"
                style={{
                  backgroundColor: `${priorities.color_code}`,
                }}
              ></div>
            &nbsp;&nbsp;
            <select
                name="prioritie"
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                placeholder="Priorities"
                disabled={props.showTask}
                value={prioritie}
              > *
                <option value={""}>Member</option>
                {props.projectMembers.map((member, inde) => {
                  return (
                    <option value={member.id}>&nbsp;&nbsp;{member.name}</option>
                  );
                })}
              </select>
              </div>*/}
                <div className="member">
                  <div className="navDiv">
                    <select
                      name="member"
                      disabled={props.showTask}
                      onChange={(e) => handleInputChange(e)}
                      className={`form-control ${props.showTask ? "" : "editMode"} `}
                      value={member}
                    >
                      <option value={""}>Member</option>
                      {props.projectMembers.map((member, inde) => {
                        return (
                          <option value={member.id}>&nbsp;&nbsp;{member.name}</option>
                        );
                      })}
                    </select>
                    {memberError && <span>Please add member</span>}
                  </div>
                </div>
              </div>
              {!showTaskListName ?
                props.showTask && (
                  <div className="option">
                    <div className="navDiv">
                      <DropdownButton
                        title={<i class="fas fa-ellipsis-h" />}
                        id="basic-nav-dropdown"
                        className="btn btn-color"
                      >
                        {projectTasks && projectTasks.length > 0 && (
                          <Dropdown.Item
                            eventKey=""
                            onClick={(e) => {
                              e.preventDefault();
                              changeMoveTo(true);
                            }}
                          >
                            Move to other Roadmap
                          </Dropdown.Item>
                        )}
                        {!props.task_lists_task.task_id && (
                          <Dropdown.Item
                            eventKey=""
                            onClick={(e) => {
                              e.preventDefault();
                              changeCalenderModal(true);
                            }}
                          >
                            Start Task
                          </Dropdown.Item>
                        )}
                        <Dropdown.Item
                          eventKey=""
                          onClick={(e) => {
                            e.preventDefault();
                            props.handleTaskDetails("task-details", props.task_lists_task)
                            //props.userTaskDetails(props.task_lists_task.id)
                          }}
                        >
                          Details
                   </Dropdown.Item>
                        <Dropdown.Item
                          eventKey=""
                          onClick={showDeleteModal}
                        >
                          Delete
                   </Dropdown.Item>
                        <Dropdown.Item
                          eventKey=""
                          onClick={(e) => {
                            e.preventDefault();
                            props.EditTlt(props.task_lists_task.id);
                            props.taskEdit(true);
                          }}
                        >
                          Edit
                    </Dropdown.Item>
                      </DropdownButton>
                    </div>
                  </div>
                ) : null}
              {/* {} */}
              {/* {showTaskListName && (
            <div
              className="option"
              onMouseLeave={(e) => {
                e.preventDefault();
                changeMoveTo(false);
              }}
            >
              <div className="navDiv">
                <ListGroup>
                  {projectTasks.map((eachTask) => {
                    return (
                      <ListGroup.Item
                        onClick={debounce((e) => {
                          e.preventDefault();
                          setshowTaskListName(false);
                          props.switchTask(
                            eachTask.id,
                            props.task_lists_task.id
                          );
                        }, 250)}
                      >
                        {eachTask.name}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </div>
                )} */}

              {showTaskListName && (
                <div className="move-to-other-tasks-dropdown"

                >
                  <div class="close-button"
                    onClick={togglTaskList}
                  >
                    <span className="tooltiptext">Close Move To OTher Task</span>
                    <i class="far fa-times-circle"></i>
                  </div>
                  <select
                    className="other-tasks"
                    name="moveOther"
                    onChange={(e) => handleInputChange(e)}
                  >
                    {projectTasks.map((eachTask) => {
                      return (
                        <option
                          value={eachTask.id}
                          className="roadmaps-name"
                          //selected={eachTask.id}
                        >
                          {eachTask.name}
                        </option>
                      );
                    })}
                  </select>
                  <div className="rightcheck">
                    <button
                      variant="light"
                      className="green-clr-btn"
                      onClick={otherTasksSave}
                    >
                      <i class="fa fa-check" />
                    </button>

              </div>
            </div>
          )}
          {!props.showTask && !props.state.task_edit && (
            <div className="rightMark">
              {props.state.isCheckVisible ? 
               <Spinner animation="grow" variant="success" size="sm" /> :<>
              <button
                variant="light"
                className="btn btn-colo"
                onClick={handleSave}
              >
                <i class="fa fa-check" />
              </button>
              <button
                variant="light"
                className="btn btn-colo"
                onClick={props.closeAddTask}
              >
                <i class="fa fa-times"
                style={{color: "black !important"}}
              ></i>
              </button>
              </>
             }
            </div>
          )}
          {!props.showTask && props.state.task_edit && (
            <div className="rightMark">
              {props.state.isCheckVisible ? 
               <Spinner animation="grow" variant="success" size="sm" /> :<>
              <button
                variant="light"
                className="btn btn-colo"
                //onClick={handleSave}
                onClick={(e) => {
                  e.preventDefault();
                  handleSave();
                  //props.closeAddTask();
                  props.taskEdit(false);
                  //props.EditTlt(null)
                  
                }}
              >
                <i class="fa fa-check" />
              </button>
              <button
                variant="light"
                className="btn btn-colo"
                //onClick={props.closeAddTask}
                
                onClick={(e) => {
                  e.preventDefault();
                  //props.closeAddTask();
                  props.taskEdit(false);
                  props.EditTlt(null)
                  
                }}
              >
                <i class="fa fa-times"
                style={{color: "black"}}
              ></i>
              </button>
              </>
             }
            </div>
          )}
          {/* {openCalenderModal && selectMoveToDashboardDate()} */}

            </div> </>
      </div>

      {/* --------move to Dashboard modal start--------- */}

      <Modal
        className="move-to-dashboard-modal"
        show={openCalenderModal}
        onHide={() => {
          changeCalenderModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Start Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <i class="fas fa-asterisk"
        style={{
          color: "Red",
          fontSize: "9px",
          paddingLeft: "2px"
        }}></i>
          <div className="member">
            <div className="navDiv">
              <select
                name="member"
                onChange={(e) => handleInputChange(e)}
                className="form-control person-name"
                value={member}
              >
                <option value={""}>Member</option>
                {props.projectMembers.map((member, inde) => {
                  return (
                    <option value={member.id}>&nbsp;&nbsp;{member.name}</option>
                  );
                })}
              </select>

              {props.taskStatus && props.taskStatus.length > 0 && (
                props.isUserstory ? 
                <select
                  name="status"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="form-control work-status"
                // value={status}
                >
                  <option value={""}>Status</option>
                  {props.taskStatus.map((status, index) => {
                    // console.log("status", status);
                    return (
                      <option key={index} 
                      selected={
                        props.task_lists_task &&
                        props.task_lists_task.task_status &&
                        props.task_lists_task.task_status.id &&
                        status.id == props.task_lists_task.task_status.id
                      }
                      value={index}>
                        {status.statusName}
                      </option>
                    );
                  })}
                </select> : 
                <select
                name="status"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                className="form-control work-status"
              // value={status}
              >
                <option value={""}>Status</option>
                {props.taskStatus.map((status, index) => {
                  // console.log("status", status);
                  return (
                    <option key={index} 
                    selected={
                          props.task_lists_task &&
                          props.task_lists_task.status &&
                          props.task_lists_task.status.id &&
                          status.id == props.task_lists_task.status.id
                        }
                    value={index}>
                      {status.statusName}
                    </option>
                  );
                })}
              </select>
              )}

              {props.categories && props.categories.length > 0 && (
                <select
                  name="category"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="form-control work-status"
                >
                  <option value={""}>Category</option>
                  {props.categories.map((cate, index) => {
                    return (
                      <option key={cate.id} value={index}>
                        {cate.name}
                      </option>
                    );
                  })}
                </select>
              )}

            </div>
          </div>
          <div className="AddDatePicker task-date">
            <div className="divInline-from">
              <div className="datefromto">From</div>
              <div className="dateDiv">
                <DatePicker
                  className=""
                  ref={calendarFromRef}
                  selected={selectedFromDate}
                  onChange={changeFromDate}
                  placeholderText="Select Date"
                />
                <i
                  onClick={openFromCalender}
                  className="fa fa-calendar"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
            <div className="divInline-to">
              <div className="datefromto">&nbsp;To&nbsp;</div>
              {/* &nbsp;&nbsp; */}
              <div className="dateDiv">
                <DatePicker
                  className=""
                  ref={calendarToRef}
                  selected={selectedToDate}
                  onChange={changeToDate}
                  placeholderText="Select Date"
                />
                <i
                  onClick={openToCalender}
                  className="fa fa-calendar"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            // disabled={!member ? true : false}
            onClick={(e) => {
              e.preventDefault();
              changeToDashboard();
            }}
          >
            Save
            
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --------move to Dashboard modal end--------- */}

      {/*---------- Delete task list task modal start ---------- */}
      <Modal
        className="tlt-delete-confirm-modal "
        show={isDeleteModal}
        onHide={hideDeleteModal}
        style={{ paddingTop: "1.5%", paddingBottom: "30px" }}
      >
        <div className="content-deldesc">
          {/* All the tasks related to this task will also be deleted from dashboard. Please confirm. */}
          Are you sure you want to delete this task list in the Roadmap. Please confirm
        </div>

        <div className="button-delcancel">
          <button className="del-button"
            onClick={(e) => {
              e.preventDefault();
              { props.isUserstory ? props.deleteTask(props.task_lists_task.id) : props.deleteTlt(props.task_lists_task.id); }
            }}
            disabled={props.state.isDeleteDisabled}
          >Delete</button>
          <button
            className="cancel-button"
            onClick={hideDeleteModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
      {/* ----------- Delete task list task modal end ------------ */}
    </>
  );
};
export default AddTask;