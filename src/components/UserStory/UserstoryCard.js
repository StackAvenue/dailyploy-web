import React, { useEffect, useState } from 'react';
import "../../assets/css/userstory.scss";
import { Button } from "react-bootstrap";
import AddTask from "../TaskList/AddTask";
import userstoryImg from '../../assets/images/userstory.png';
import Spinner from 'react-bootstrap/Spinner';
import plusImg from "../../assets/images/plus.svg";
import minusImg from "../../assets/images/minus-1.svg";
import ErrorBoundary from '../../ErrorBoundary';

function UserstoryCard(props) {
    const [userStory, showUserStory] = useState(false)
    const [addTask, showAddTask] = useState(false)
    const [taskList, setTaskList] = useState([])
    const [userStoryId, setUserStoryId] = useState(null)

    useEffect(() => {
        setData()
    }, [])

    useEffect(() => {
        if (props.currentUserstoryTask) {
            setData()
        }
    }, [props.currentUserstoryTask])

    useEffect(() => {
        if(props.userstory)
        {
            setTaskList(props.userstory.task_lists)
        }
    },[props.userstory])

    const setUserstoryData = () => {
        setTaskList(props.userstory.task_lists)
    }

    const setData = () => {
        setTaskList(props.currentUserstoryTask)
        props.handleUpdatedTask()
    }

    const handleUserStory = () => {
        if (!userStory) {
            setUserStoryId(props.userstory.id)
            showAddTask(false)
            props.showUserstoryTasks(true)
            props.fetchUserstory(props.userstory.id)
            showUserStory(!userStory)
         } else {
            showUserStory(!userStory)
            props.showUserstoryTasks(true)
        }

    }

    useEffect(() => {
        if(userStory)
        {
            props.fetchUserstory(props.userstory.id)
        }
    },[props.state.filterParams])

    const handleAddTaskModal = () => {
        showAddTask(!addTask)
    }

    const closeAddTask = () => {
        showAddTask(false)
    }

    const handleUserstoryTask = (taskDetails) => {
        if(addTask) {
            showAddTask(false)
            props.saveUserstoryTask(taskDetails, props.userstory.id)
        } else {
            props.saveUserstoryTask(taskDetails, props.userstory.id)
        }
        
    }

    const moveToDashboardUTask = (taskDetails) => {
        props.usestoryMoveToDashboard(taskDetails, props.userstory.id)
    }

    const deleteTask = (task_id) => {
        props.deleteUserstoryTask(props.userstory.id, task_id)
    }

    return (
        <div className={`Userstory ${userStory ? "background-change" : ""}`}>
            <div className="userstory-drag-icon">
                {/* <i class="fas fa-bars"></i> */}
                <div className="story-add-icon"
                        onClick={handleUserStory}>
                        {userStory ? 
                        <div className="minus-icon-tasklist" style={{paddingLeft:"2px", paddingTop:"1px"}}>
                        {/* <i class="fa fa-minus" /> */}
                        <img
                          height="18px"
                          width="18px"  
                          src={minusImg}
                          className="minus-icon"
                          alt="minus icon"
                        />
                      </div>
               : 
               <div className="add-icon-tasklistopen" style={{paddingLeft:"2px", paddingTop:"1px"}}>
               <img
                 src={plusImg}
                 height="18px"
                 width="18px"
                 className="plus-icon"
                 alt="open task list task"
               ></img>
             </div>}
                    </div>
            </div>
            
            {props.state.editedUserStoryloading && props.state.editedUserStoryloadingId == props.userstory.id
            ? <Spinner animation="grow" variant="success" 
            style = {{marginTop:"10px", marginLeft:"1%", width:'1rem', height:"1rem"}}/> : null }   
            
            <div className="userstory-icon">
                {/* <i class="fas fa-archive"></i> */}
                {/* <img src={userstoryImg} /> */}
                <i class="fa fa-users" style={{color:"#7686FF"}} aria-hidden="true"></i>
            </div>
            <div className="UserstoryCard">
                <div className="user-story-header">

                    <div className="user-story-name">{props.userstory.name}</div>
                    <div className="hover-task" >{props.userstory.name}</div>
                    
                    <div className="user-story-details" style={{ marginTop: "4px" }}>
                        <div
                            className="user-story-btn"
                            onClick={() => props.handleUserstoryModal("user-story", props.userstory.id)}>
                            <span>Details</span>
                            <i class="fas fa-chevron-right"></i>
                        </div>

                    </div>
                </div>
                <div className="userstory-tasklist">
                    {props.isUserStoryLoading && props.userstory.id == props.selectedUserStoryId ?
                    <Spinner animation="grow" variant="success" /> :
                        userStory 
                            ? taskList.map((task_lists_task) => {
                                return (<div className="showCardDetails2 userstory-showCardDetails2">
                                    <ErrorBoundary>
                                        <AddTask
                                            state={props.state}
                                            showTask={
                                                props.editTltId != task_lists_task.id ? true : false
                                            }
                                            taskEdit={props.taskEdit}
                                            deleteTask={deleteTask}
                                            isFilterLoading={props.isFilterLoading}
                                            // moveToDashBoard={props.moveToDashBoard}
                                            moveToDashboardUTask={moveToDashboardUTask}
                                            task_lists_task={task_lists_task}
                                            // projectTaskList={props.projectTaskList}
                                            // switchTask={props.switchTask}
                                            EditTlt={props.EditTlt}
                                            // handleSaveTask={props.handleSaveTask}
                                            taskStatus={props.taskStatus}
                                            categories={props.categories}
                                            //memeberSelected={props.memeberSelected}
                                            // isFilterLoading={props.isFilterLoading}
                                            // handleTaskDetails={handleTaskDetails}
                                            handleTaskDetails={props.handleTaskDetails}
                                            modalDetails={props.modalDetails}
                                            currentTask={task_lists_task}
                                            projectTaskList={props.projectTaskList}
                                            switchTask2={props.switchTask2}
                                            userTaskDetails={props.userTaskDetails}
                                            projectMembers={props.projectMembers}
                                            list_id={props.list_id}
                                            task_lists_task={task_lists_task}
                                            isUserstory={true}
                                            handleUserstoryTask={handleUserstoryTask}
                                        />
                                    </ErrorBoundary>
                                </div>)
                            })
                            : null
                    }
                </div>
                {props.state.addUserStoryTaskLoading && props.state.addUserStoryTaskLoadingId == props.userstory.id
                ? <Spinner animation="grow" variant="success" 
            style = {{marginTop:"11px", marginLeft:"43%"}}/> : null }
                {addTask
                    ? <div className="new-userstory">
                        <div className="showCardDetails userstory-showCardDetails">
                            <ErrorBoundary>
                                <AddTask
                                    projectMembers={props.projectMembers}
                                    list_id={props.list_id}
                                    isUserstory={true}
                                    closeAddTask={closeAddTask}
                                    handleUserstoryTask={handleUserstoryTask}
                                    showTask={false}
                                    state={props.state}
                                    taskStatus={props.taskStatus} />
                            </ErrorBoundary>
                        </div>  
                        </div> : null}
                                 
                {userStory ? <div className="container2OpenModal1">
                    <Button
                        variant="primary"
                        className="add-task-btn"
                        onClick={handleAddTaskModal}
                    >
                        <i class="fa fa-plus add-icon" /> Add Task{" "}
                    </Button>
                </div> : null}

            </div >
        </div>
    );
}

export default UserstoryCard;