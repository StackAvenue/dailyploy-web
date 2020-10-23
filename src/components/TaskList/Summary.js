import React, { useState, useEffect } from "react";
import { get, post, logout, put, del } from "../../utils/API";
import ProjectReportsSettings from "../dashboard/settings/ProjectReportsSettings";
import ReactTooltip from "react-tooltip";
import Spinner from 'react-bootstrap/Spinner'

const Summary = props => {
    const[totalTasks, setTotalTasks]=useState(null)
    const[taskCompleted, setTaskCompleted]=useState(null)
    const[estTime, setEst]=useState(null)
    const[tasksleft, setTasksleft]=useState(null)
    const[totalTime, setTotaltime]=useState(null)
    const[remainTime, setRemaintime]=useState(null)
    const[isLoading, setIsLoading]=useState(true)

    const getSummary = async () => {
        try {
            const { data } = await get(
                `workspaces/${props.state.workspaceId}/projects/${props.state.projectId}/task_lists/${props.id}/summary`
              );
              var save = data.summary;
              setTotalTasks(save.total_tasks)
              setTaskCompleted(save.completed_task)
              var taskleft= save.total_tasks - save.completed_task
              setTasksleft(taskleft)
              setTotaltime(save.total_estimate_hours)
              setRemaintime(Math.round(save.remaining_hours * 10) / 10)
              setIsLoading(false)
              console.log(data)
        } catch (e) { }
    }

    useEffect(() => {
        getSummary()
    }, [])

    return (
        <div>
            <div className="first">
                {isLoading ? 
                <Spinner animation="grow" variant="success" /> :
                <>
                <div className="one-col">
            <i class="fa fa-list-ul" aria-hidden="true" style={{ color: "#6A7074" }}></i>&nbsp;
                Total tasks : {totalTasks}
            <br/>
            <i class="fa fa-check-circle fa-lg" aria-hidden="true" style={{ color: "#6A7074" }}></i>&nbsp;
                Completed tasks : {taskCompleted}
            <br/>
            <i class="fa fa-exclamation-circle fa-lg" aria-hidden="true" style={{ color: "#6A7074" }}></i>&nbsp;
                Tasks left : {tasksleft}
                </div>
                <div className="two-col">
            <br/>
            <i class="fa fa-hourglass" aria-hidden="true" style={{ color: "#6A7074" }}></i>&nbsp;
                Total estimated time (in hours) : {totalTime}
            <br/>
            <i class="fa fa-hourglass-end" aria-hidden="true" style={{ color: "#6A7074" }}></i>&nbsp;
                Remaining time : {remainTime}
                </div>&nbsp;&nbsp;&nbsp;
                <div
              className="close-icon"
              onClick={(e) => {
                e.preventDefault();
                props.closeSummary()
              }}
            >
              <i class="fa fa-times"
                data-tip data-for="closeTask" style={{ color: "#6A7074" }}
              ></i>&nbsp;&nbsp;
              <ReactTooltip id="closeTask" effect="solid">
                Close
              </ReactTooltip>
            </div></>
            }
            </div>
        </div>
    )
}

export default Summary;