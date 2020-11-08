import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import ChecklistAddTask from "./ChecklistAddTask";
import Button from "react-bootstrap/Button";
import { get, post, put, del } from "../../utils/API";
import Spinner from 'react-bootstrap/Spinner';
import ReactTooltip from "react-tooltip";
import roadmapGoals from '../../assets/images/roadmapGoals.png';

const Checklist = (props) => {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [addTaskButton, setAddTaskButton] = useState(true)
  const [checklistsData, setChecklistsData] = useState([]);
  const [isEditTaskFieldOpen, setIsEditTaskFieldOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState("");
  const [selectedChecklistTaskId, setSelectedChecklistTaskId] = useState(null);
  const [isLineThrough, setIsLineThrough] = useState(null)
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [inputTaskData, setInputTaskData] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    if (inputTaskData !== "") {
      var task_lists = {
        inputData: inputTaskData,
      };
      addChecklistsData(task_lists);
      setIsUpdate(true);
      setInputTaskData("");
    }
  };

  const handleInputChange = (e) => {
    setInputTaskData(e.target.value);
  };

  const closeEditTask = () => {
    setIsEditTaskFieldOpen(false);
  };

  const openAddTask = () => {
    setIsAddTaskOpen(true);
    setAddTaskButton(false);
  };

  const closeAddTask = () => {
    setIsAddTaskOpen(false);
    setAddTaskButton(true);
  };

  const addChecklistsData = async (checklistParams) => {
    try {
      let params = {
        name: checklistParams.inputData,
      };
      const { data } = await post(
        params,
        `workspaces/${props.state.workspaceId}/projects/${props.state.projectId}/task_lists/${props.id}/checklists`
      );
      setIsUpdate(true);
      setInputTaskData("");
    } catch (e) {}
  };

  const getChecklistsData = async () => {
    let checklistTaskData = [];
    try {
      const { data } = await get(
        `workspaces/${props.state.workspaceId}/projects/${props.state.projectId}/task_lists/${props.id}/checklists`
      );

      if (data) {
        checklistTaskData = data.entries.map((checklistTask) => {
          return { id: checklistTask.id, name: checklistTask.name, done: checklistTask.is_completed };
        });
      }
      setIsUpdate(false);
    } catch (e) {}

    setChecklistsData(checklistTaskData);
    setIsLoading(false)
  };

  let completedTasksCount = checklistsData.filter((checklist) => checklist.done == true);
  const progress_percentage =
    Math.round((completedTasksCount.length / checklistsData.length) * 100 * 10) / 10;

  // const progressInstance = <ProgressBar now={progress_percentage} label={`${progress_percentage}%`}/>;
  const progressInstance = <ProgressBar now={progress_percentage} />;

  useEffect(() => {
    if (isUpdate) {
      getChecklistsData();
    }
    //setIsUpdate(false);
  }, [isUpdate]);

  useEffect(() => {
    setIsLoading(true);
    getChecklistsData();
  }, []);

  const deleteChecklistData = async (id) => {
    try {
      const { data } = await del(
        `workspaces/${props.state.workspaceId}/projects/${props.state.projectId}/task_lists/${props.id}/checklists/${id}`
      );
      let checklists = checklistsData.filter((checklistData) => checklistData.id != id);
      setChecklistsData(checklists);
    } catch (e) {}
  };

  const editChecklist = async (id, taskName) => {
    setIsEditTaskFieldOpen(true);
    setEditTaskData(taskName);
    setSelectedChecklistTaskId(id);
  };

  const handleInputChanges = (e) => {
    setEditTaskData(e.target.value);
  };

  const handleCheckboxChange = (event) => {
    const checklist = checklistsData.find((checklistData) => checklistData.id == event.target.value);
    if (event.target.checked) {
      if (!checklist.done) {
       setIsLineThrough(true);
       setSelectedTaskId(event.target.value);
       updateChecklistData(event.target.value, "true");
      }
    } else {
      setIsLineThrough(false);
      setSelectedTaskId(event.target.value);
      updateChecklistData(event.target.value, "false");
    }
  };

  const updateChecklistData = async (id, taskCompleted) => {
    let params;
    if (taskCompleted) {
      params = { is_completed: taskCompleted };
    } else {
      params = { name: editTaskData };
    }
    try {
      const { data } = await put(
        params,
        `workspaces/${props.state.workspaceId}/projects/${props.state.projectId}/task_lists/${props.id}/checklists/${id}`
      );
      setIsUpdate(true);
    } catch (e) {}
    setIsEditTaskFieldOpen(false);
  };

  return (
    <div className="checklist-div">
      {/* <i class="fa fa-check-square-o" aria-hidden="true" style={{ color: "#6A7074" }}></i> */}
      <img
                  src={roadmapGoals}
                  data-tip data-for="taskChecklist"
                  style={{
                    height:"16px",
                    width:"16px",
                    marginTop: "-4px",
                    marginRight: "4px", 
                    cursor:"Pointer"
                  }}
                />
      &nbsp;&nbsp;
      <strong>Roadmap Goals</strong>
      <br />
      <div
              className="close-icon"
              onClick={(e) => {
                e.preventDefault();
                props.closeChecklist()
              }}
            >
              <i class="fa fa-times"
                data-tip data-for="closeTask" style={{ color: "#6A7074" }}
              ></i>&nbsp;&nbsp;
              <ReactTooltip id="closeTask" effect="solid">
                Close
              </ReactTooltip>
            </div>
      {isLoading ?
      <Spinner animation="grow" variant="success" /> : 
      (<>
      {progressInstance}
      <div className="tick-checklist">
        {checklistsData.map((checklist) => {
          return (
            <div className="checkbox">
              <input
                type="checkbox"
                onChange={handleCheckboxChange}
                value={checklist.id}
                defaultChecked={checklist.done}
              />
              &nbsp;&nbsp;
              {isEditTaskFieldOpen && selectedChecklistTaskId == checklist.id ? null : (isLineThrough &&
                  selectedTaskId == checklist.id) ||
                  checklist.done ? (
                <strike>{checklist.name}</strike>
              ) : (
                checklist.name
              )}
              {isEditTaskFieldOpen && selectedChecklistTaskId == checklist.id ? (
                <div>
                  <input
                    type={Text}
                    value={editTaskData}
                    placeholder="Enter Goal"
                    onChange={(e) => handleInputChanges(e)}
                    name="taskName"
                    className="checklist-input"
                  />
                  &nbsp;&nbsp;&nbsp;
                  <Button
                    variant="outline-success"
                    onClick={() => updateChecklistData(checklist.id)}
                  >
                    Save
                  </Button>
                  &nbsp;&nbsp;&nbsp;
                  <Button variant="outline-success" onClick={closeEditTask}>
                    X
                  </Button>
                </div>
              ) : (
                <i
                  class="fas fa-pencil-alt chg-text-icon" style={{ color: "#a2aab8" }}
                  onClick={() => editChecklist(checklist.id, checklist.name)}
                ></i>
              )}
              <i
                class="fas fa-trash-alt" style={{ color: "red", opacity: "0.6" }}
                onClick={() => deleteChecklistData(checklist.id)}
              ></i>
              <br />
            </div>
          );
        })}
        {addTaskButton ? (
          <Button variant="light" onClick={openAddTask}>
            + Add an item
          </Button>
        ) : null}
        {isAddTaskOpen ? (
          <ChecklistAddTask
            closeAddTask={closeAddTask}
            handleSave={handleSave}
            handleInputChange={handleInputChange}
            inputTaskData={inputTaskData}
          ></ChecklistAddTask>
        ) : null}
      </div></>)}
    </div>
  );
};

export default Checklist;
