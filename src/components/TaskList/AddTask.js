import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import { DropdownButton, Dropdown, ListGroup } from "react-bootstrap";
import { PRIORITIES } from "../../utils/Constants";
import DatePicker from "react-datepicker";
import { Modal, Button } from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";

const AddTask = (props) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [estimation, setEstimation] = useState(0);
  const [estimationtime, setEstimationtime] = useState(0);
  const [prioritie, setPrioritie] = useState("");
  const [member, setMember] = useState("");
  const [nameError, setNameError] = useState(false);
  const [memberError, setMemberError] = useState(false);
  const [showTaskListName, setshowTaskListName] = useState(false);
  const [projectTasks, setProjectTasks] = useState([]);
  const [openCalenderModal, setOpenCalenderModal] = useState(false);
  const [selectedFromDate, setSelectedFromDate] = useState(new Date());
  const [selectedToDate, setSelectedToDate] = useState(new Date());

  const [priorities, setPriorities] = useState({
    name: "no_priority",
    color_code: "#9B9B9B",
    label: "no priority",
  });
  const [status, setstatus] = useState({
    color: "#53a4f0",
    statusName: "Not Started",
    id: 6,
  });

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

  const handleSave = () => {
    if (taskName && member != -1) {
      var task_lists = {
        name: taskName,
        estimation: estimation,
        list_id: props.list_id,
        priority: prioritie,
        status: status.statusName,
        description: description,
        assigne_id: member,
      };
      props.handleSaveTask(task_lists);
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

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
        break;
      case "status":
        console.log("e.target", props.taskStatus[e.target.value]);

        setstatus({ ...props.taskStatus[e.target.value] });
        break;
      case "prioritie":
        setPrioritie(value);
        break;
      case "member":
        setMember(value.toString());
        setMemberError(false);
        break;
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
      priority: prioritie,
      status: status,
      description: description,
      assigne_id: member,
      startDate: selectedFromDate,
      endDate: selectedToDate,
      tltId: props.task_lists_task.id,
    };

    props.moveToDashBoard(dataObject);
    changeCalenderModal(false);
  };

  useEffect(() => {
    console.log("props, props", props);
    if (props.showTask) {
      setTaskName(props.task_lists_task.name);
      setDescription(
        props.task_lists_task.description
          ? props.task_lists_task.description
          : ""
      );
      setEstimation(props.task_lists_task.estimation);
      setstatus({
        statusName: props.task_lists_task.status
          ? props.task_lists_task.status.name
          : "Not Started",
        color: "#53a4f0",
        id: props.task_lists_task.status
          ? props.task_lists_task.status.id : 'null'
      });
      setPrioritie(props.task_lists_task.priority);
      setMember(
        props.task_lists_task && props.task_lists_task.assigne_id
          ? props.task_lists_task.assigne_id.toString()
          : ""
      );
    }
  }, []);

  useEffect(() => {
    if (props.projectTaskList) {
      let taskLists = [];
      taskLists = props.projectTaskList.filter((eachTask) => {
        return eachTask.id != props.list_id;
      });

      setProjectTasks(taskLists);
    }
  }, [props]);

  return (
    <>
      <div className="InnershowCardDetails">
        <div className="task">
          <div className="taskNo">
            <input
              type={Text}
              disabled={props.showTask}
              value={taskName}
              placeholder="Task Name"
              onChange={(e) => handleInputChange(e)}
              name="taskName"
              className="form-control"
            />
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
          <div className="Estimation">
            <input
              type={Number}
              disabled={props.showTask}
              name="estimation"
              placeholder="Estimation"
              value={estimation}
              onChange={(e) => handleInputChange(e)}
              className="form-control"
            />
            {/* <p className="text-Estimation">1hr=1pt</p> */}
          </div>
          <div className="status">
            <input
              type={Text}
              disabled={props.showTask}
              name="status"
              disabled="disabled"
              value={status.statusName}
              onChange={(e) => handleInputChange(e)}
              style={{ backgroundColor: `${status.color}` }}
              className="form-control"
            />
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
            >
              <option value="no priority">Priorities</option>
              {PRIORITIES.map((Priorities) => (
                <option value={Priorities.name}>{Priorities.label}</option>
              ))}
            </select>
          </div>
          <div className="member">
            <div className="navDiv">
              <select
                name="member"
                disabled={props.showTask}
                onChange={(e) => handleInputChange(e)}
                className="form-control"
                value={member}
              >
                <option value={""}>Member</option>
                {props.worksapceMembers.map((member, inde) => {
                  return (
                    <option value={member.id}>&nbsp;&nbsp;{member.name}</option>
                  );
                })}
              </select>
              {memberError && <span>Please add member</span>}
            </div>
          </div>
          {props.showTask && (
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
                      Move To Other Tasks
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
                      Move To Dashboard
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    eventKey=""
                    onClick={(e) => {
                      e.preventDefault();
                      props.deleteTlt(props.task_lists_task.id);
                    }}
                  >
                    Delete
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey=""
                    onClick={(e) => {
                      e.preventDefault();
                      props.EditTlt(props.task_lists_task.id);
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>
          )}
          {showTaskListName && (
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
                        onClick={(e) => {
                          e.preventDefault();
                          setshowTaskListName(false);
                          props.switchTask(
                            eachTask.id,
                            props.task_lists_task.id
                          );
                        }}
                      >
                        {eachTask.name}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </div>
            </div>
          )}
          {!props.showTask && (
            <div className="rightMark">
              <button
                variant="light"
                className="btn btn-colo"
                onClick={handleSave}
              >
                <i class="fa fa-check" />
              </button>
            </div>
          )}
          {/* {openCalenderModal && selectMoveToDashboardDate()} */}
        </div>
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
          <Modal.Title>Move to dashboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="member">
            <div className="navDiv">
              <select
                name="member"
                onChange={(e) => handleInputChange(e)}
                className="form-control person-name"
                value={member}
              >
                <option value={""}>Member</option>
                {props.worksapceMembers.map((member, inde) => {
                  return (
                    <option value={member.id}>&nbsp;&nbsp;{member.name}</option>
                  );
                })}
              </select>

              {props.taskStatus && props.taskStatus.length > 0 && (
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
                    console.log("status", status);
                    return (
                      <option key={index} value={index}>
                        {status.statusName}
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
            disabled={!member ? true : false}
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
    </>
  );
};
export default AddTask;
