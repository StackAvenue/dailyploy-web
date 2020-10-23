import React, { useEffect, useState } from "react";
import "../../assets/css/userstory.scss";
import { Button } from "react-bootstrap";
import Close from "../../assets/images/close.svg";
import { PRIORITIES } from "../../utils/Constants";
// import CommentUpload from "./../../components/dashboard/CommentUpload";
import CommentUpload from "../dashboard/CommentUpload";
import { firstTwoLetter } from "../../utils/function";
import { get, post, put, del } from "../../utils/API";
import AddTask from "../TaskList/AddTask";
import "../../assets/css/TaskProjectList.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DATE_FORMAT2 } from "../../utils/Constants";
import moment from "moment";
import ImgsViewer from "react-images-viewer";
import ProgressBar from "react-bootstrap/ProgressBar";
import plusImg from "../../assets/images/plus.svg";
import minusImg from "../../assets/images/minus-1.svg";
import Spinner from 'react-bootstrap/Spinner';
// import { Button } from "react-bootstrap";

function UserstoryModal(props) {
  const [comments, setComment] = useState(null);
  // const [checklist, setChecklist] = useState([]);
  const [edit, setEdit] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [showBox, setShowBox] = useState(false);
  // const [priority, setPriority] = useState(null);

  const [state, setState] = useState({ pictures: [] });

  ///detaisl userstory
  const [uName, setUName] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [uComments, setUComments] = useState([]);
  const [uDescription, setUDescription] = useState(null);
  const [uAName, setuAssigneeName] = useState("No Assignee");
  const [dueDate, setDueDate] = useState("");
  const [member, setMember] = useState("");

  const [clist, showChecklists] = useState(false);
  
  // const [taskChecklist, setTaskChecklist] = useState([]);

  const [category, setCategory] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [priority, setPriority] = useState({
    name: "low",
    color_code: "#555555",
    label: "low",
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estimation, setEstimation] = useState(null);
  const [trackedTime, setTrackedTime] = useState(null);
  const [owner, setOwner] = useState(null);
  const [status, setStatus] = useState(null);
  const [isComplete, setIsComplete] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [A, setA] = useState(false);
  const [markComplete, setMarkComplete] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [editCommentValue, setEditCommentValue] = useState(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showTasklist, setShowTasklist] = useState(false);

  // correct
  const [checklist, setChecklist] = useState([]);
  const [addTaskList, setAddTaskList] = useState(false);
  const [addChecklist, setAddChecklist] = useState(null);
  const [showEditChecklist, setShowEditChecklist] = useState(false);
  const [checklistId, setChecklistId] = useState(false);
  const [checklistItem, setChecklistItem] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    loggedInUserName();
    handleSetUserstory();
  }, []);

  const loggedInUserName = () => {
    setLoggedInUser(localStorage.getItem("logedInName"))
  }

  useEffect(() => {
    if (props.updatedData) {
      handleSetUserstory();
    }
    if (props.newChecklist) {
      const filteredChecklist  = checklist.filter(checklist => {
        return checklist.id != props.checklistItem.id
      })
      if(props.action == "delete") {
       setChecklist(filteredChecklist)  
      } else if(props.action == "update"){
        setChecklist([...filteredChecklist, props.checklistItem]);
      } else {
        setChecklist([...checklist, props.checklistItem]);
      }
      // console.log(props.action, filteredChecklist)
      
      props.handleTaskC();
    }
    if (markComplete && isCompleted) {
      handleEditUserstory();
    }
  }, [props.updatedData, props.newChecklist, markComplete]);

  const handleSetUserstory = () => {
    if (props.modalDetails == "user-story") {
      if (props.currentUserstory) {
        setUName(props.currentUserstory.name);
        setTaskList(props.currentUserstory.task_lists);
        setUComments(props.currentUserstory.comments);
        setUDescription(props.currentUserstory.description);
        setDueDate(
          props.currentUserstory.due_date
            ? new Date(props.currentUserstory.due_date)
            : null
        );
        setChecklist(props.currentUserstory.checklist);
        setCommentList(props.currentUserstory.comments);
        setIsComplete(props.currentUserstory.is_completed);
        setMarkComplete(props.currentUserstory.is_completed)
        const prio = PRIORITIES.filter(
          (priority) =>
            props.currentUserstory.priority &&
            priority.label.toLowerCase() ==
              props.currentUserstory.priority.toLowerCase()
        );

        if (prio && prio.length > 0) {
          setPriority(prio[0]);
        }
        if (props.currentUserstory.owner) {
          setuAssigneeName(props.currentUserstory.owner.name);
        }
      }
      props.handleUpdatedData();
    } else {
      if (props.currentTask) {
        setUName(props.currentTask.name);
        setUComments(props.currentTask.comments);
        setUDescription(props.currentTask.description);
        setEstimation(props.currentTask.estimation);
        setTrackedTime(props.currentTask.tracked_time);
        setStatus(props.currentTask.status);
        setStartDate(
          props.currentTask.start_date
            ? new Date(props.currentTask.start_date)
            : null
        );
        setEndDate(
          props.currentTask.end_date
            ? new Date(props.currentTask.end_date)
            : null
        );
        setIsComplete(props.currentTask.is_complete);
        setCommentList(props.currentTask.comments);
        setChecklist(props.currentTask.checklist);
        if (props.currentTask.category_id) {
          const currentCategory = props.categories.filter((cat) => {
            return cat.task_category_id == props.currentTask.category_id;
          });
          setCategory(currentCategory[0]);
        }

        if (props.currentTask.task_lists) {
          setOwner(props.currentTask.assigne);
        }
        const prio = PRIORITIES.filter(
          (priority) =>
            props.currentTask.priority &&
            priority.label.toLowerCase() ==
              props.currentTask.priority.toLowerCase()
        );

        if (prio && prio.length > 0) {
          setPriority(prio[0]);
        }
        if (props.currentTask.owner) {
          setuAssigneeName(props.currentTask.owner.name);
        }
      }
    }
  };

  const handleUName = (e) => {
    setUName(e.target.value);
  };

  const handleDate = (date) => {
    setDueDate(date);
  };

  const handleStartDate = (date) => {
    setStartDate(date);
  };

  const handleEndDate = (date) => {
    setEndDate(date);
  };

  const handleMarkCompelete = (e) => {
    setMarkComplete(true);
    setIsCompleted(true)
  };

  const handleMarkIncompelete = (e) => {
    setMarkComplete(false);
    const details = {
      is_completed: false,
    };
    props.editUserstory(details, props.currentUserstory.id);
  };

  const handleEditUserstory = () => {
    const details = {
      description: uDescription,
      due_date: dueDate,
      name: uName,
      priority: priority.label,
      owner_id: member,
      is_completed: markComplete,
    };

    props.editUserstory(details, props.currentUserstory.id);
    setEdit(false);
    setIsCompleted(false)
    //setMarkComplete(false);
  };

  const displayAddChecklist = () => {
    showChecklists(!clist);
  };

  const handleUChecklistInput = (e) => {
    setChecklistItem(e.target.value);
  };

  const addCheckList = () => {
    if (checklistItem) {
      const params = {
        name: checklistItem,
      };
      props.addUserstoryChecklist(params, props.currentUserstory);
      setAddChecklist(false);
    }
  };

  const addTltCheckList = () => {
    if (checklistItem) {
      const params = {
        name: checklistItem,
      };
      props.addTaskChecklist(params, props.currentTask);
      setAddChecklist(false);
    }
  };

  const handleDetailsEdit = (e) => {
    var { name, value } = e.target;

    switch (name) {
      case "taskName":
        setUName(value);
        // setNameError(false);
        break;
      case "description":
        setUDescription(value);
        break;
      case "estimation":
        setEstimation(value);
        break;
      case "status":
        setStatus({ ...props.taskStatus[e.target.value] });
        break;
      case "category":
        setCategoryId(e.target.value);
        break;
      case "priority":
        setPriority({ ...PRIORITIES[e.target.value] });
        break;
      case "trackedtime":
        setTrackedTime(e.target.value);
        break;
      case "member":
        setMember(value.toString());
        break;
    }
  };

  const handleEditTaskDetails = () => {
    const defaultStatus = props.taskStatus.filter((a) => {
      return a.isDefault === true;
    });
    const task_lists = {
      name: uName,
      estimation: estimation,
      list_id: props.list_id,
      tracked_time: trackedTime,
      start_date: startDate,
      end_date: endDate,
      priority: priority.label,
      status: status ? status : defaultStatus,
      description: uDescription,
      assigne_id: member,
      category_id: categoryId,
    };

    props.handleSaveTask(task_lists);
    setEdit(!edit);
  };

  const displayAddChecklistBox = () => {
    setAddChecklist(!addChecklist);
  };

  const saveComments = async () => {
    if (comments || pictures.length > 0) {
      try {
        let fd = new FormData();
        pictures.forEach((image) => {
          fd.append("attachments[]", image, image.name);
        });
        let userId = localStorage.getItem("logedInId");
        fd.append("user_id", userId);

        props.modalDetails == "task-details"
          ? fd.append("task_list_tasks_id", props.currentTask.id)
          : fd.append("user_stories_id", props.currentUserstory.id);

        fd.append("comments", comments);
        const { data } = await post(fd, `comment`);
        var comment = data;
        setComment("");
        setA(true);
        setPictures([]);
        setCommentList([...commentList, comment]);
        console.log(comment, "aa");
        // var taskComments = [comment, ...this.props.state.taskComments];
        // this.props.updateTaskComments(taskComments);
        // this.setState({
        //     pictures: [],
        //     comments: "",
        //     showBox: false,
        //     taskloader: false,
        // });
      } catch (e) {
        console.log("ww", e);
        // this.setState({ taskloader: false });
      }
    }
  };

  const saveUpdatedComments = async () => {
    if (editComment && editCommentValue) {
      try {
        let fd = new FormData();
        let commentId = editComment.id;

        pictures.forEach((image) => {
          fd.append("attachments[]", image, image.name);
        });
        let userId = localStorage.getItem("logedInId");
        fd.append("user_id", userId);

        props.modalDetails == "task-details"
          ? fd.append("task_list_tasks_id", props.currentTask.id)
          : fd.append("user_stories_id", props.currentUserstory.id);

        fd.append("comments", editCommentValue);
        const { data } = await put(fd, `comment/${commentId}`);
        var taskComments = commentList;
        var comment = taskComments.find((c) => c.id == commentId);
        comment["comments"] = data.comments;
        comment["user"] = data.user;
        comment["attachments"] = data.attachments;
        setCommentList([...commentList, comment]);
        setEditComment("");
        setEditCommentValue("");
        setPictures([]);
      } catch (e) {
        // this.setState({ taskloader: false });
      }
    }
  };

  const deleteComment = async (comment) => {
    try {
      const { data } = await del(`comment/${comment.id}`);
      const commentsList = commentList.filter((c) => c.id !== data.id);
      setCommentList(commentsList);
    } catch (e) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComment(value);
    // console.log()
  };

  const handleCommentInput = (e) => {
    const { name, value } = e.target;
    setEditCommentValue(value);
  };

  const editComments = (item) => {
    setEditComment(item);
    setEditCommentValue(item.comment ? item.comment : item.comments);
  };

  const handleChecklistInput = (e) => {
    const { name, value } = e.target;
    setChecklistItem(value);
  };

  const handleCheckBox = (e) => {
    // console.log("andad", e.target.checked);
    // console.log("andad", e.target.value);
    const checklistItem = checklist.find(
      (checklistData) => checklistData.id == e.target.value
    );
    if (e.target.checked) {
      if (!checklistItem.done) {
        //  setIsLineThrough(true);
        //  setSelectedTaskId(event.target.value);
        updateChecklistData(e.target.value, "true", "status");
      }
    } else {
      // setIsLineThrough(false);
      // setSelectedTaskId(event.target.value);
      updateChecklistData(e.target.value, "false", "status");
    }
  };

  const updateChecklistData = (id, taskCompleted, option) => {
    let params;
    if (option === "status") {
      params = { is_completed: taskCompleted };
    } else {
      params = { name: checklistItem };
    }
    {props.modalDetails == "user-story" 
     ? props.updateUserstoryChecklist(id, params, props.currentUserstory)
     : props.updateTaskChecklist(id, params, props.currentTask)}
    setShowEditChecklist(false)
  };

  const handleEdit = () => {
    setEdit(!edit);
    if (props.modalDetails == "task-details") {
      props.EditTlt(props.currentTask.id);
    }
  };

  const updateUploadedState = (pictureArr) => {
    let picture = pictureArr[0];
    setPictures([...pictures, picture]);
    // setState(state.pictures.concat(pictureArr))
    // console.log(...state)
    // var x = [pics]
    // setState({ pictures });
    //     let specificArrayInObject = theObject.array.slice();
    // specificArrayInObject.push(newValue);
    // const newObj = { ...theObject, [event.target.name]: specificArrayInObject };
    // theObject(newObj);
    setShowBox(true);
    // }
  };

  const returnAlt = (url) => {
    let splitUrl = url.split("/");
    return splitUrl[splitUrl.length - 1];
  };

  const isImage = (url) => {
    let splitUrl = url.split("/");
    let name = splitUrl[splitUrl.length - 1];
    let nameSplit = name.split(".");
    return ["png", "jpeg", "jpg"].includes(nameSplit[nameSplit.length - 1]);
  };

  const openViewImage = (imge_url) => {
    // if (imge_url) {
    //   this.setState({
    //     viewerIsOpen: true,
    //     imge_url: imge_url,
    //   });
    // }
  };
  
  // removeUploadedImage = (index) => {
  // let pictures = this.state.pictures.filter((f, idx) => idx !== index);
  // this.setState({ pictures: pictures });
  // };

  const displayAddTask = () => {
    setAddTaskList(!addTaskList);
  };

  const closeAddTask = () => {
    setAddTaskList(false);
  }

  const handleUserstoryTask = (taskDetails) => {
    if(addTaskList) {
      setAddTaskList(false);
      props.saveUserstoryTask(taskDetails, props.currentUserstory.id)
  } else {
      props.saveUserstoryTask(taskDetails, props.currentUserstory.id)
  }
  };

  const handleShowChecklist = () => {
    setShowChecklist(!showChecklist);
  };

  const handleShowTasklist = () => {
    setShowTasklist(!showTasklist);
  };

  const editChecklistItem = (checklist) => {
    setShowEditChecklist(!showEditChecklist);
    setChecklistId(checklist.id)
    setChecklistItem(checklist.name)
  };

  const deleteChecklistItem = (checklist) => {
    {props.modalDetails == "user-story" 
    ? props.deleteUserstoryChecklist(checklist.id, props.currentUserstory) 
    : props.deleteTaskChecklist(checklist.id, props.currentTask) }
  }

  // const handleUserstoryTask = (taskDetails) => {
  //   // showAddTask(!addTask)
  //   props.saveUserstoryTask(taskDetails, props.userstory.id)
  // }

  // let completedTasksCount = checklistsData.filter((checklist) => checklist.done == true);
  // const progress_percentage =
  //   Math.round((completedTasksCount.length / checklistsData.length) * 100 * 10) / 10;

  // const progressInstance = <ProgressBar now={progress_percentage} label={`${progress_percentage}%`}/>;
  const progressInstance = <ProgressBar now={props.state.progressPercent ? props.state.progressPercent : 0} />;

  return (
    <div className="UserstoryModal">
      {props.modalDetails == "task-details" ? (
        <>
          <div className="modal-details">
          <i class="fa fa-file-text-o" aria-hidden="true" style={{color:"#7686FF",
          fontSize: "19px",
          marginTop: "-14px",
          marginLeft: "6px"}}></i>
            <div className="name">
              {/* <span>{props.currentTask.name}</span> */}
              <span>
                {!edit ? (
                  uName
                ) : (
                  <div className="edit-input">
                    <input
                      type="text"
                      value={uName}
                      className="form-control"
                      name="taskName"
                      onChange={handleDetailsEdit}
                    />
                  </div>
                )}
              </span>
              <div className={`${uName && uName.length > 35 ? 
                "hide-name" : "hide"}`}>{!edit ? uName : null}</div>
            </div>
            {/* <div className="edit">
                    <i class="md md-lg md-edit"></i>
                </div> */}
            <div className="close-btn">
              {!edit ? (
                 <i class="fas fa-pencil-alt chg-text-icon"
                    style={{ cursor: "pointer",
                    color: "#a2aab8",
                    fontSize: "17px" }}
                    onClick={handleEdit}
               ></i>
              ) : (
                <i
                  class="fa fa-check"
                  style={{ cursor: "pointer", fontSize: "23px" }}
                  onClick={handleEditTaskDetails}
                ></i>
              )}
              <button
                className="btn btn-link float-right"
                onClick={props.handleDetailsClose}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
          </div>
          <div className="modal-details-2">
            <div className="modal-container-1">
              <div className="modal-container-2">
                <div className="box-1">Assignee:</div>
                <div className="box-2">
                  {!edit ? (
                    uAName
                  ) : (
                    <div className="modalMember">
                      <select
                        name="member"
                        onChange={(e) => handleDetailsEdit(e)}
                        className="form-control select-member details-modal"
                      >
                        <option value="">Member</option>
                        {props.projectMembers.map((member, index) => {
                          return (
                            <option value={member.id}>{member.name}</option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="mod-5">
                {isComplete ? (
                  <div className="mark-completed">Completed</div>
                ) : null}
              </div>
            </div>
            <div className="modal-container-1">
              <div className="modal-container-2">
                <div className="box-1">Start date:</div>
                <div className="box-2">
                  <div className="details-modal-datepicker">
                    {!edit ? (
                      startDate ? (
                        moment(startDate).format(DATE_FORMAT2)
                      ) : (
                        "Task not started"
                      )
                    ) : (
                      <DatePicker
                        onSelect={handleDate}
                        placeholderText="Select Due Date"
                        selected={startDate}
                        className={`form-control datepicker`}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-container-2">
                <div className="box-1">End date:</div>
                <div className="box-2">
                  <div className="details-modal-datepicker">
                    {!edit ? (
                      endDate ? (
                        moment(endDate).format(DATE_FORMAT2)
                      ) : (
                        "Task not started"
                      )
                    ) : (
                      <DatePicker
                        onSelect={handleDate}
                        placeholderText="Select Due Date"
                        selected={endDate}
                        className={`form-control datepicker`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-container-1">
              <div className="modal-container-2">
                <div className="box-1">Estimation:</div>
                <div className="box-2">
                  <div className="modalMember">
                    {!edit ? (
                      estimation ? (
                        estimation
                      ) : (
                        "No estimation "
                      )
                    ) : (
                      <input
                        value={estimation}
                        type="text"
                        name="estimation"
                        className="form-control details-modal"
                        onChange={handleDetailsEdit}
                      />
                    )}
                    hrs
                  </div>
                </div>
              </div>
              <div className="modal-container-2">
                <div className="box-1">Tracked time: </div>
                <div className="box-2">
                  <div className="modalMember" style={{ marginLeft:"5%" }}>
                    {!edit ? (
                      trackedTime ? (
                        trackedTime
                      ) : (
                        " Task not started"
                      )
                    ) : (
                      <input
                        value={trackedTime}
                        type="text"
                        name="trackedtime"
                        className="form-control details-modal"
                        onChange={handleDetailsEdit}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-container-1">
              <div className="modal-container-2">
                <div className="box-1">Status:</div>
                <div className="box-2">
                  <div className="modalMember">
                    {!edit ? (
                      status ? (
                        status.name
                      ) : (
                        "No status"
                      )
                    ) : (
                      <select
                        name="status"
                        onChange={(e) => {
                          handleDetailsEdit(e);
                        }}
                        className="form-control work-status details-modal"
                        value={status}
                      >
                        {props.taskStatus.map((status, index) => {
                          // console.log("status", status);
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
              </div>
              <div className="modal-container-2">
                <div className="box-1">Priority:</div>
                <div className="box-2">
                  <div className="modalMember">
                    {!edit ? (
                      priority.name
                    ) : (
                      <div className="time">
                        <div
                          className="disc"
                          style={{
                            backgroundColor: `${priority.color_code}`,
                          }}
                        ></div>
                        <select
                          name="priority"
                          // onChange={(e) => handleInputChange(e)}
                          onChange={(e) => {
                            handleDetailsEdit(e);
                          }}
                          className="form-control"
                          placeholder="Priorities"
                          // value={priority}
                        >
                          {/* <option value="low">Low</option> */}
                          {PRIORITIES.slice(0, 3).map((Priority, index) => (
                            <option
                              value={index}
                              selected={
                                priority.label.toLowerCase().trim() ==
                                Priority.label.toLowerCase().trim()
                                  ? priority.label
                                  : ""
                              }
                            >
                              {Priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-container-3">
              <div className="modal-container-4">
                <div className="box-1">Category:</div>
                <div className="box-2">
                  <div className="modalMember">
                    {!edit ? (
                      category ? (
                        category.name
                      ) : (
                        "no category"
                      )
                    ) : (
                      <select
                        name="category"
                        onChange={(e) => {
                          handleDetailsEdit(e);
                        }}
                        className="form-control work-status details-modal"
                      >
                        {props.categories.map((cate, index) => {
                          return (
                            <option key={cate.id} value={cate.task_category_id}>
                              {cate.name}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-container-5">
              <div className="modal-container-6">
                <div className="box-3">Description:</div>
                <div className="box-4">
                  {!edit ? (
                    uDescription==null ? "NA" : uDescription
                  ) : (
                    <textarea
                      // onChange={handleDescriptionEdit}
                      onChange={handleDetailsEdit}
                      className="form-control description"
                      name="description"
                      value={uDescription}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="a">
            <div className="checklist-container">
              <div className="checklist-title">
                <div className="checklist-icon">
                  {!showChecklist ? (
                    <img
                      src={plusImg}
                      onClick={handleShowChecklist}
                      alt="plus"
                      height="11%"
                      width="11%"
                    />
                  ) : (
                    <img
                      src={minusImg}
                      onClick={handleShowChecklist}
                      alt="minus"
                      height="11%"
                      width="11%"
                    />
                  )}
                  <span style={{ marginLeft:"4%" }}>Checklist</span>
                </div>
                {showChecklist ? (
                  <div className="progress-container">
                    <div className="progress-bar">
                      {progressInstance}
                    </div>
                  </div>
                ) : null}
              </div>

              {showChecklist ? (
                <div className="checklist-open">
                  <div className="checklists">
                    {/* {checklist.map((item) => {
                      return (
                        <div className="checklist-item">
                          <input
                            type="checkbox"
                            onChange={handleCheckBox}
                            className="checklist-tick"
                          />
                          <span className="checklist-name"> {item.name}</span>
                         
                        </div>
                      );
                    })} */}

                    
                    {checklist.map((item) => {
                      return (
                        <div className="checklist-item">
                          <input
                            type="checkbox"
                            onChange={handleCheckBox}
                            value={item.id}
                            defaultChecked={item.is_completed}
                            className="checklist-tick"
                          />
                          <div className="checklist-box">
                            <div className="checklist-name">
                              {" "}
                              {showEditChecklist && item.id == checklistId? (
                                <div className="edit-checklist">
                                  <input
                                    type="text"
                                    className="form-control input-checklist"
                                    placeholder="Add ..."
                                    value={checklistItem}
                                    onChange={handleUChecklistInput}
                                  />
                                  <div className="btn-checklist">
                                    <i
                                      class="fa fa-check"
                                      onClick={() => updateChecklistData(item.id, "", "name")}
                                      style={{ cursor: "pointer", fontSize: "22px" }}
                                    ></i>
                                    <i
                                      class="fas fa-times"
                                      onClick={editChecklistItem}
                                      style={{ cursor: "pointer", marginLeft: "18%",
                                      fontSize: "19px" }}
                                    ></i>
                                  </div>
                                </div>
                              ) : (
                                item.name
                              )}
                            </div>
                            {showEditChecklist && item.id == checklistId ? null : <div className="checklist-icons">
                            <i
                              class="fas fa-pencil-alt chg-text-icon" style={{ color: "#a2aab8" }}
                              onClick={() => editChecklistItem(item)}
                            ></i>
                            <i
                              class="fas fa-trash-alt" style={{ color: "red", opacity: "0.6", marginLeft: "33%" }}
                              onClick={() => deleteChecklistItem(item)}
                            ></i>
                            </div>
                              }
                          </div>
                        </div>
                      );
                    })}  
                    {/* </div> */}
                  </div>
                  <div className="container2OpenModal1">
                    {addChecklist ? (
                      <div className="add-checklist">
                        <input
                          type="text"
                          className="form-control input-checklist"
                          placeholder="Add ..."
                          onChange={handleChecklistInput}
                        />
                        <div className="btn-checklist">
                          <i
                            class="fa fa-check"
                            onClick={addTltCheckList}
                            style={{ cursor: "pointer", fontSize: "22px" }}
                          ></i>
                          <i
                            class="fas fa-times"
                            onClick={displayAddChecklistBox}
                            style={{ cursor: "pointer", marginLeft: "18%",
                            fontSize: "19px" }}
                          ></i>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        className="add-task-btn"
                        onClick={displayAddChecklistBox}
                      >
                        <i class="fa fa-plus add-icon" />
                        Add checklist
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="comments-container">
              <div className="new-comment-box">
                <div className="col-md-12 no-padding input-row text-titlize">
                  <div
                    className="col-md-1 d-inline-block no-padding label"
                    style={{ verticalAlign: "top" }}
                  >
                    {/* Comments */}
                    <div className="comment-owner-dot">
                      {firstTwoLetter(loggedInUser)}

                      {/* {firstTwoLetter(this.props.loggedInUserName)}
                               {firstTwoLetter(this.state.userName)} */}
                    </div>
                  </div>
                  <div className="col-md-11 d-inline-block">
                    <CommentUpload
                      save={saveComments}
                      comments={comments}
                      showAttachIcon={true}
                      commentName="comments"
                      handleInputChange={handleInputChange}
                      showSave={true}
                      pictures={pictures}
                      state={state}
                      showBox={showBox}
                      // onClickOutside={this.onClickOutsideAddCommnetBox}
                      updateUploadedState={updateUploadedState}
                      // removeUploadedImage={this.removeUploadedImage}

                      // showCommentBox={this.onClickAddCommnetBox}
                    />
                  </div>
                </div>
              </div>
              <div className="comments-box">
                <div className="col-md-12 no-padding input-row task-comments details-comments">
                  {commentList.map((item) => {
                    return editComment && editComment.id == item.id ? (
                      <div
                        className="col-md-12 no-padding"
                        style={{
                          display: "inline-flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          className="col-md-1 d-inline-block no-padding mt-3 label"
                          // style={{ verticalAlign: "top" }}
                        >
                          {/* Comments */}
                          <div className="comment-owner-dot">
                            {firstTwoLetter(loggedInUser)}

                            {/* {firstTwoLetter(this.props.loggedInUserName)}
                               {firstTwoLetter(this.state.userName)} */}
                          </div>
                        </div>
                        <div className="col-md-10 d-inline-block mt-2">
                          <CommentUpload
                            save={saveUpdatedComments}
                            comments={editCommentValue}
                            handleInputChange={handleCommentInput}
                            showSave={true}
                            showAttachIcon={true}
                            showBox={false}
                            commentName="editedComments"
                            updateUploadedState={updateUploadedState}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="comments-list">
                        <div
                          className="col-md-1 d-inline-block no-padding label"
                          style={{ verticalAlign: "top" }}
                        >
                          {/* Comments */}
                          <div className="comment-owner-dot">
                            {firstTwoLetter(loggedInUser)}

                            {/* {firstTwoLetter(this.props.loggedInUserName)}
                               {firstTwoLetter(this.state.userName)} */}
                          </div>
                        </div>
                        <div className="col-md-11 d-inline-block ">
                          <div className="commnet-card comment-bg-color">
                            <div
                              className=""
                              // style={{
                              //   display: "flex",
                              //   justifyContent: "space-between",
                              // }}
                            >
                              <div className="owner-name text-titlize">
                                {item.user_name
                                  ? item.user_name
                                  : item.user.name}
                              </div>
                            </div>
                            <div className="comments">
                              {item.comment ? item.comment : item.comments}
                            </div>
                            <div className="col-md-12 no-padding">
                              {item.attachments.map((attachment) => {
                                return (
                                  <>
                                    {isImage(attachment.imge_url) ? (
                                      <div style={{ display: "grid" }}>
                                        <img
                                          src={`${attachment.imge_url}`}
                                          onClick={() =>
                                            openViewImage(attachment.imge_url)
                                          }
                                          alt={returnAlt(attachment.imge_url)}
                                          height="42"
                                          width="42"
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "10px",
                                          }}
                                        ></img>
                                        <a
                                          href={`${attachment.imge_url}`}
                                          download
                                          style={{
                                            fontSize: "12px",
                                            padding: "5px",
                                          }}
                                        >
                                          {returnAlt(attachment.imge_url)}
                                        </a>
                                      </div>
                                    ) : (
                                      <a
                                        href={`${attachment.imge_url}`}
                                        download
                                        style={{ fontSize: "12px" }}
                                      >
                                        {returnAlt(attachment.imge_url)}
                                      </a>
                                    )}
                                  </>
                                );
                              })}
                            </div>
                            <div
                              className="col-md-12"
                              style={{ paddingLeft: "20px" }}
                            >
                              <span onClick={() => editComments(item)}>
                                Edit
                              </span>
                              <span onClick={() => deleteComment(item)}>
                                Delete
                              </span>
                              <div
                                className=""
                                style={{
                                  display: "inline",
                                  fontSize: "11px",
                                  padding: "3px 0px 0px 25px",
                                }}
                                // title={this.titleDateTime(comment)}
                              >
                                {/* {this.commentsTime(comment)} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* </div> //modal details -2 */}
        </>
      ) : (
        <>
          <div className="modal-details">
          <i class="fa fa-users" style={{color:"#7686FF",
          fontSize: "19px",
          marginTop: "-14px",
          marginLeft: "6px"}} aria-hidden="true"></i>
            <div className="name">
              <span>
                {!edit ? (
                  uName
                ) : (
                  <div className="edit-input">
                    <input
                      type="text"
                      value={uName}
                      className="form-control"
                      onChange={handleUName}
                    />
                  </div>
                )}
              </span>
              <div className={`${uName && uName.length > 35 ? 
                "hide-name" : "hide"}`}>{!edit ? uName : null}</div>
            </div>
            <div className="close-btn">
              {!edit ? (
                <i class="fas fa-pencil-alt chg-text-icon"
                style={{ cursor: "pointer",
                color: "#a2aab8",
                fontSize: "17px" }}
                onClick={handleEdit}
           ></i>
              ) : (
                <i
                  class="fa fa-check"
                  style={{ cursor: "pointer", fontSize: "23px" }}
                  onClick={handleEditUserstory}
                ></i>
              )}
              <button
                className="btn btn-link float-right"
                onClick={props.handleDetailsClose}
              >
                <img src={Close} alt="close" />
              </button>
            </div>
          </div>
          <div className="modal-details-2 ss">
            <div className="modal-container-1">
              <div className="modal-container-2">
                <div className="box-1">Assignee:</div>
                {/* <div className="box-2">{props.userstoryDetails.owner.name}</div> */}
                <div className="box-2">
                  {!edit ? (
                    uAName
                  ) : (
                    <div className="modalMember">
                      <select
                        name="member"
                        onChange={(e) => handleDetailsEdit(e)}
                        className="form-control select-member details-modal"
                      >
                        <option value="">Member</option>
                        {props.projectMembers.map((member, index) => {
                          return (
                            <option value={member.id}>{member.name}</option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="mod-5">
                {isComplete ? (
                  <div className="mark-completed" onClick={handleMarkIncompelete}>Completed</div>
                ) : (
                 <div className="mark-complete">
                   <div className="mark-complete-btn" onClick={handleMarkCompelete}>Mark complete</div>
                   </div> 
                  // <button >Mark complete</button>
                )}
              </div>
            </div>
            <div className="modal-container-1">
              <div className="modal-container-2">
                <div className="box-1">Priority:</div>
                <div className="box-2">
                  <div className="modalMember">
                    {!edit ? (
                      priority.name
                    ) : (
                      <div className="time">
                        <div
                          className="disc"
                          style={{
                            backgroundColor: `${priority.color_code}`,
                          }}
                        ></div>
                        <select
                          name="priority"
                          onChange={(e) => {
                            handleDetailsEdit(e);
                          }}
                          className="form-control"
                          placeholder="Priorities"
                        >
                          {PRIORITIES.slice(0, 3).map((Priority, index) => (
                            <option
                              value={index}
                              selected={
                                priority.label.toLowerCase().trim() ==
                                Priority.label.toLowerCase().trim()
                                  ? priority.label
                                  : ""
                              }
                            >
                              {Priority.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-container-2">
                <div className="box-1">Due date:</div>
                <div className="box-2">
                  <div className="details-modal-datepicker">
                    {!edit ? (
                      dueDate ? (
                        moment(dueDate).format(DATE_FORMAT2)
                      ) : (
                        "No due date"
                      )
                    ) : (
                      <DatePicker
                        onSelect={handleDate}
                        placeholderText="Select Due Date"
                        selected={dueDate}
                        className={`form-control datepicker`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-container-5">
              <div className="modal-container-6">
                <div className="box-3">Description:</div>
                <div className="box-4">
                  {!edit ? (
                    uDescription==null ? "NA" : uDescription
                  ) : (
                    <textarea
                      onChange={handleDetailsEdit}
                      className="form-control description"
                      name="description"
                      value={uDescription}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="a">
            <div className="checklist-container">
              <div className="checklist-title">
                <div className="checklist-icon">
                  {!showChecklist ? (
                    <img
                      src={plusImg}
                      onClick={handleShowChecklist}
                      alt="plus"
                      height="11%"
                      width="11%"
                    />
                  ) : (
                    <img
                      src={minusImg}
                      onClick={handleShowChecklist}
                      alt="minus"
                      height="11%"
                      width="11%"
                    />
                  )}
                  <span style={{ marginLeft:"4%" }}>Checklist</span>
                </div>
                {/* <button onClick={handleShowChecklist}>+</button> */}
                {showChecklist ? (
                  <div className="progress-container">
                    <div className="progress-bar">
                      {progressInstance}
                    </div>
                  </div>
                ) : null}
              </div>
              {showChecklist ? (
                <div className="checklist-open userstory">
                  <div className="checklists">
                    {checklist.map((item) => {
                      return (
                        <div className="checklist-item">
                          <input
                            type="checkbox"
                            onChange={handleCheckBox}
                            value={item.id}
                            defaultChecked={item.is_completed}
                            className="checklist-tick"
                          />
                          <div className="checklist-box">
                            <div className="checklist-name">
                              {" "}
                              {showEditChecklist && item.id == checklistId? (
                                <div className="edit-checklist">
                                  <input
                                    type="text"
                                    className="form-control input-checklist"
                                    placeholder="Add ..."
                                    value={checklistItem}
                                    onChange={handleUChecklistInput}
                                  />
                                  <div className="btn-checklist">
                                    <i
                                      class="fa fa-check"
                                      onClick={() => updateChecklistData(item.id, "", "name")}
                                      style={{ cursor: "pointer", fontSize: "22px" }}
                                    ></i>
                                    <i
                                      class="fas fa-times"
                                      onClick={editChecklistItem}
                                      style={{ cursor: "pointer", marginLeft: "18%",
                                      fontSize: "19px" }}
                                    ></i>
                                  </div>
                                </div>
                              ) : (
                                item.name
                              )}
                            </div>
                            {showEditChecklist && item.id == checklistId ? null : <div className="checklist-icons">
                            <i
                              class="fas fa-pencil-alt chg-text-icon" style={{ color: "#a2aab8" }}
                              onClick={() => editChecklistItem(item)}
                            ></i>
                            <i
                              class="fas fa-trash-alt" style={{ color: "red", opacity: "0.6", marginLeft: "33%" }}
                              onClick={() => deleteChecklistItem(item)}
                            ></i>
                            </div>
                              }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {props.state.isChecklistLoading ? 
                  <Spinner animation="grow" variant="success" /> :
                  null}
                  <div className="container2OpenModal1">
                    {addChecklist ? (
                      <div className="add-checklist">
                        <input
                          type="text"
                          className="form-control input-checklist"
                          placeholder="Add ..."
                          onChange={handleUChecklistInput}
                        />
                        <div className="btn-checklist">
                          <i
                            class="fa fa-check"
                            onClick={addCheckList}
                            style={{ cursor: "pointer", fontSize: "22px" }}
                          ></i>
                          <i
                            class="fas fa-times"
                            onClick={displayAddChecklistBox}
                            style={{ cursor: "pointer", marginLeft: "18%",
                            fontSize: "19px" }}
                          ></i>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        className="add-task-btn"
                        onClick={displayAddChecklistBox}
                      >
                        <i class="fa fa-plus add-icon" />
                        Add checklist
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="checklist-container">
              <div className="checklist-title">
                <div className="checklist-icon">
                  {!showTasklist ? (
                    <img
                      src={plusImg}
                      onClick={handleShowTasklist}
                      alt="plus"
                      height="11%"
                      width="11%"
                    />
                  ) : (
                    <img
                      src={minusImg}
                      onClick={handleShowTasklist}
                      alt="minus"
                      height="11%"
                      width="11%"
                    />
                  )}
                  <span style={{ marginLeft:"4%" }}>Tasks</span>
                </div>
                {/* <button onClick={handleShowTasklist}>+</button> */}
              </div>
              {showTasklist ? (
                <div className="checklist-open task">
                  <div className="checklists">
                    {taskList.map((item) => {
                      return (
                        <div className="checklist-item">
                          <div className="showCardDetails4">
                                    <AddTask
                                        showTask={
                                            props.editTltId != item.id ? true : false
                                        }
                                        // showTask={false}
                                        // deleteTask={deleteTask}
                                        // moveToDashBoard={props.moveToDashBoard}
                                        // moveToDashboardUTask={moveToDashboardUTask}

                                        // projectTaskList={props.projectTaskList}
                                        // switchTask={props.switchTask}
                                        EditTlt={props.EditTlt}
                                        // handleSaveTask={props.handleSaveTask}
                                        taskStatus={props.taskStatus}
                                        categories={props.categories}
                                        // isFilterLoading={props.isFilterLoading}
                                        // handleTaskDetails={handleTaskDetails}
                                        // handleTaskDetails={props.handleTaskDetails}
                                        modalDetails={props.modalDetails}
                                        currentTask={item}
                                        projectMembers={props.projectMembers}
                                        list_id={props.list_id}
                                        task_lists_task={item}
                                        isUserstory={true}
                                        state={props.state}
                                        taskEdit={props.taskEdit}
                                        isUserDetailOpen={isUserDetailOpen}
                                        handleUserstoryTask={handleUserstoryTask}
                                        // taskStatus={props.taskStatus}
                                         />
                                </div>
                          {/* <input type="checkbox" className="checklist-tick" /> */}
                          {/* <span className="checklist-name">
                            {item.name}
                          </span> */}
                          {/* <input type="text" className="form-control input-checklist" /> */}
                        </div>
                      );
                    })}
                  </div>
                  {addTaskList ? (
                    <>
                      <div className="showCardDetails3">
                        <AddTask
                          projectMembers={props.projectMembers}
                          list_id={props.list_id}
                          isUserstory={true}
                          handleUserstoryTask={handleUserstoryTask}
                          closeAddTask={closeAddTask}
                          showTask={false}
                          state={props.state}
                          isUserDetailOpen={isUserDetailOpen}
                          taskStatus={props.taskStatus}
                        />
                        <div className="container2OpenModal1">
                        <Button
                          variant="primary"
                          className="add-task-btn"
                          onClick={displayAddTask}
                        >
                        <i class="fa fa-plus add-icon" />
                        Add Task
                      </Button>
                    </div>
                      </div>
                    </>
                  ) : (
                    <div className="container2OpenModal1">
                      <Button
                        variant="primary"
                        className="add-task-btn"
                        onClick={displayAddTask}
                      >
                        <i class="fa fa-plus add-icon" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="comments-container">
              <div className="new-comment-box">
                <div className="col-md-12 no-padding input-row text-titlize">
                  <div
                    className="col-md-1 d-inline-block no-padding label"
                    style={{ verticalAlign: "top" }}
                  >
                    {/* Comments */}
                    <div className="comment-owner-dot">
                      {firstTwoLetter(loggedInUser)}

                      {/* {firstTwoLetter(this.props.loggedInUserName)}
                               {firstTwoLetter(this.state.userName)} */}
                    </div>
                  </div>
                  <div className="col-md-11 d-inline-block">
                    <CommentUpload
                      save={saveComments}
                      comments={comments}
                      showAttachIcon={true}
                      commentName="comments"
                      handleInputChange={handleInputChange}
                      showSave={true}
                      pictures={pictures}
                      showBox={showBox}
                      // showBox={this.state.showAddBox}
                      // onClickOutside={this.onClickOutsideAddCommnetBox}
                      updateUploadedState={updateUploadedState}
                      // removeUploadedImage={this.removeUploadedImage}

                      // showCommentBox={this.onClickAddCommnetBox}
                    />
                  </div>
                </div>
              </div>
              <div className="comments-box">
                <div className="col-md-12 no-padding input-row task-comments details-comments">
                  {commentList.map((item) => {
                    return editComment && editComment.id == item.id ? (
                      <div
                        className="col-md-12 no-padding"
                        style={{
                          display: "inline-flex",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          className="col-md-1 d-inline-block mt-3 no-padding label"
                          // style={{ verticalAlign: "top" }}
                        >
                          {/* Comments */}
                          <div className="comment-owner-dot">
                            {firstTwoLetter(loggedInUser)}

                            {/* {firstTwoLetter(this.props.loggedInUserName)}
                               {firstTwoLetter(this.state.userName)} */}
                          </div>
                        </div>
                        <div className="col-md-10 d-inline-block mt-2">
                          <CommentUpload
                            save={saveUpdatedComments}
                            comments={editCommentValue}
                            handleInputChange={handleCommentInput}
                            showSave={true}
                            showAttachIcon={true}
                            showBox={false}
                            pictures={pictures}
                            commentName="editedComments"
                            updateUploadedState={updateUploadedState}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="comments-list">
                        <div
                          className="col-md-1 d-inline-block no-padding label"
                          style={{ verticalAlign: "top" }}
                        >
                          {/* Comments */}
                          <div className="comment-owner-dot">
                            {firstTwoLetter(loggedInUser)}

                            {/* {firstTwoLetter(this.props.loggedInUserName)}
                               {firstTwoLetter(this.state.userName)} */}
                          </div>
                        </div>
                        <div className="col-md-11 d-inline-block ">
                          <div className="commnet-card comment-bg-color">
                            <div
                              className=""
                              // style={{
                              //   display: "flex",
                              //   justifyContent: "space-between",
                              // }}
                            >
                              <div className="owner-name text-titlize">
                                {item.user_name
                                  ? item.user_name
                                  : item.user.name}
                              </div>
                            </div>
                            <div className="comments">
                              {item.comment ? item.comment : item.comments}
                            </div>

                            <div className="col-md-12 no-padding">
                              {item.attachments.map((attachment) => {
                                return (
                                  <>
                                    {isImage(attachment.url) ? (
                                      <div style={{ display: "grid" }}>
                                        <img
                                          src={`${attachment.url}`}
                                          onClick={() =>
                                            openViewImage(attachment.url)
                                          }
                                          alt={returnAlt(attachment.url)}
                                          height="42"
                                          width="42"
                                          style={{
                                            cursor: "pointer",
                                            marginRight: "10px",
                                          }}
                                        ></img>
                                        <a
                                          href={`${attachment.url}`}
                                          download
                                          style={{
                                            fontSize: "12px",
                                            padding: "5px",
                                          }}
                                        >
                                          {returnAlt(attachment.url)}
                                        </a>
                                      </div>
                                    ) : (
                                      <a
                                        href={`${attachment.url}`}
                                        download
                                        style={{ fontSize: "12px" }}
                                      >
                                        {returnAlt(attachment.url)}
                                      </a>
                                    )}
                                  </>
                                );
                              })}
                            </div>
                            <div
                              className="col-md-12"
                              style={{ paddingLeft: "20px" }}
                            >
                              <span onClick={() => editComments(item)}>
                                Edit
                              </span>
                              <span onClick={() => deleteComment(item)}>
                                Delete
                              </span>
                              <div
                                className=""
                                style={{
                                  display: "inline",
                                  fontSize: "11px",
                                  padding: "3px 0px 0px 25px",
                                }}
                                // title={this.titleDateTime(comment)}
                              >
                                {/* {this.commentsTime(comment)} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* <div className="as">

              </div> */}
          </div>
        </>
      )}
    </div>
  );
}

export default UserstoryModal;
