import React, { useState, useEffect, useRef } from 'react';
import MenuBar from "../dashboard/MenuBar";
import '../../assets/css/milestone.scss';
import cookie from "react-cookies";
import { Dropdown } from "react-bootstrap";
import { get, logout, post, put, del } from "../../utils/API";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MilestoneCard from './MilestoneCard';
import moment from "moment";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import DailyPloyToast from "./../DailyPloyToast";
import { debounce } from "../../utils/function";
import VideoLoader from "../dashboard/VideoLoader";
import { MONTH_FORMAT, FULL_DATE } from "../../utils/Constants";

function Milestone(props) {
    const [workspaceId, setWorkspaceId] = useState(null)
    const [projectId, setProjectId] = useState(null)
    const [projectName, setProjectName] = useState(null)
    const [isDeleteShow, setIsDeleteShow] = useState(false)
    const [projects, setProject] = useState(null)
    const [modal, showModal] = useState(false)
    const [edit, showEdit] = useState(false)
    const [milestones, setMilestone] = useState([])
    const [status, setStatus] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [startDate, setStartDate] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [id, setId] = useState("")
    const [errorName, setNameError] = useState(false)
    const [errorDueDate, setDueDateError] = useState(false)
    const [quarter, setQuarter] = useState("")
    const [hover, setHover] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false);
    const [year, setYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        loadData();
    }, [])

    useEffect(() => {
        if (startDate && endDate && projectId) {
            fetchMilestoneData()
        }
    }, [startDate, endDate, projectId])

    const showToast = (message) => {
        toast(
            <DailyPloyToast
                message={message}
                status="error"
            />,
            { autoClose: 2000, position: toast.POSITION.TOP_CENTER }
        );
    }

    const loadData = async () => {
        const { workspaceId } = props.match.params;
        setWorkspaceId(workspaceId)
        setIsLoading(true)

        let date = new Date();
        setYear(date.getFullYear())
        let iQuarter = parseInt(date.getMonth() / 3) + 1;
        initialQuarter(iQuarter)

        try {
            const { data } = await get(
                `workspaces/${workspaceId}/projects`
            );
            const projectsData = data.projects;
            if (projectsData.length > 0) {
                const id = projectsData[0].id;
                const name = projectsData[0].name;
                setProject(projectsData)
                setProjectId(id)
            }
        } catch (e) {
            showToast("Something went wrong. Please contact support");
        }
    }



    const fetchMilestoneData = async () => {
        const dateData = {
            start_date: startDate,
            end_date: endDate,
        }

        try {
            const { data } = await get(
                `workspaces/${workspaceId}/projects/${projectId}/milestone`,
                dateData
            );
            const { milestone } = data;
            setMilestone(milestone)
            setIsLoading(false)
        } catch (e) {
            showToast("Something went wrong. Please contact support");
        }
    }

    const classNameRoute = () => {
        let route = props.history.location.pathname;
        let routeName = route.split("/")[3];
        if (routeName === "milestone") {
            return "isMilestone";
        } else {
            return false;
        }
    };

    const addMilestoneModal = () => {
        if (projects && projects.length > 0) {
            showModal(true)
            showEdit(false)
            setName("")
            setDueDate("")
        } else {
            showToast("Add projects first")
        }

    }

    const removeMilestoneModal = () => {
        showModal(false)
        showEdit(false)
        setName("")
        setDueDate("")
        setStatus("")
        setDescription("")
        setNameError(false)
        setDueDateError(false)
    }

    const editMilestone = (milestone) => {
        setId(milestone.id)
        setName(milestone.name)
        setDescription(milestone.description)
        setStatus(milestone.status)
        setDueDate(new Date(milestone.due_date))
        setNameError(false)
        showEdit(true)
        showModal(false)
    }

    const selectProject = (e) => {
        if (projects && projects.length > 0) {
            const { name, value } = e.target;
            const selectedProject = projects.filter(project => project.name === value)
            let projectId = selectedProject[0].id;
            let projectName = selectedProject[0].name;
            setProjectId(projectId)
            setProjectName(projectName)
            showModal(false)
            showEdit(false)
            setStatus("")
            setDueDate("")
            setIsLoading(true)
        }

    }

    const handleStatus = (status) => {
        setStatus(status)
    }

    const setDate = (date) => {
        setDueDate(date)
    }

    const handleName = (e) => {
        const { name, value } = e.target;
        setName(value)
    }

    const handleDescription = (e) => {
        const { name, value } = e.target;
        setDescription(value)
    }

    const addMilestone = debounce(async () => {
        if (name === "") {
            setNameError(true)
            setDueDateError(false)
        } else if (dueDate === "") {
            setDueDateError(true)
            setNameError(false)
        } else if (name === "" && dueDate === "") {
            setNameError(true)
            setDueDateError(true)
        } else {
            if (milestones.length == 0) {
                setIsLoading(true)
            }
            const milestoneData = {
                milestone: {
                    name,
                    description,
                    due_date: dueDate,
                    status
                }
            }
            try {
                const { data } = await post(
                    milestoneData,
                    `workspaces/${workspaceId}/projects/${projectId}/milestone`
                );
                showModal(false)
                setStatus("")
                setDueDate("")
                setNameError(false)
                setDueDateError(false)
                fetchMilestoneData()
            } catch (e) {
                showToast("Something went wrong. Please contact support");
            }
        }
    }, 500)

    const updateMilestone = debounce(async () => {
        if (edit) {
            if (name === "") {
                setNameError(true)
                setDueDateError(false)
            } else if (dueDate === "") {
                setDueDateError(true)
                setNameError(false)
            } else if (name === "" && dueDate === "") {
                setNameError(true)
                setDueDateError(true)
            } else {
                const milestoneData = {
                    milestone: {
                        name,
                        description,
                        due_date: dueDate,
                        status
                    }
                }

                try {
                    const { data } = await put(
                        milestoneData,
                        `workspaces/${workspaceId}/projects/${projectId}/milestone/${id}`
                    );
                    showModal(false)
                    setStatus("")
                    setDueDate("")
                    setNameError(false)
                    setDueDateError(false)
                    showEdit(false)
                    fetchMilestoneData()
                } catch (e) {
                    showToast("Something went wrong. Please contact support");
                }
            }
        }
    }, 500)

    const deleteMilestone = debounce(async () => {
        setIsLoading(true)
        setDeleteModal(false);
        try {
            const data = await del(`workspaces/${workspaceId}/projects/${projectId}/milestone/${id}`)
            fetchMilestoneData()
        } catch (error) {
            showToast("Something went wrong. Please contact support");
        }
    }, 800)


    const initialQuarter = (quarter) => {
        let date = new Date();
        showModal(false)
        showEdit(false)
        setIsLoading(true)
        if (quarter == 1) {
            let start_date = new Date(date.getFullYear(), 0, 1);
            let end_date = new Date(date.getFullYear(), 2, 31);
            setStartDate(start_date)
            setEndDate(end_date)
            setQuarter("1")
        } else if (quarter == 2) {
            let start_date = new Date(date.getFullYear(), 3, 1);
            let end_date = new Date(date.getFullYear(), 5, 30);
            setStartDate(start_date)
            setEndDate(end_date)
            setQuarter("2")
        } else if (quarter == 3) {
            let start_date = new Date(date.getFullYear(), 6, 1);
            let end_date = new Date(date.getFullYear(), 8, 30);
            setStartDate(start_date)
            setEndDate(end_date)
            setQuarter("3")
        } else {
            let start_date = new Date(date.getFullYear(), 9, 1);
            let end_date = new Date(date.getFullYear(), 11, 31);
            setStartDate(start_date)
            setEndDate(end_date)
            setQuarter("4")
        }
    }

    const addHover = (id) => {
        showEdit(false)
        setHover(true)
        setId(id)
    }

    const removeHover = () => {
        setHover(false)
    }

    const changeDeleteModal = (value) => {
        setId(value)
        setDeleteModal(true);
    }

    return (
        <div className="container-milestone">
            <MenuBar
                workspaceId={workspaceId}
                classNameRoute={classNameRoute}
                state={isDeleteShow}
            />
            {
                !isLoading ?
                    < div className={`${milestones && milestones.length > 0 || modal
                        ? "row no-margin milestone"
                        : "row no-margin milestone bg-img"}`} >
                        <div className={`${milestones && milestones.length > 0 ? "select-container add-bg" : "select-container"}`}>
                            <div className="select-project">
                                <span>Select Project</span>
                                <select value={projectName} onChange={selectProject} className="form-control">
                                    {projects && projects.map(project => {
                                        return <option value={project.name}>
                                            {project.name}
                                        </option>
                                    })
                                    }
                                </select>
                            </div>
                            <div className="select-quarter">
                                <span>Select Quarter</span>
                                <select
                                    className="form-control"
                                    value={quarter}
                                    onChange={(e) => initialQuarter(e.target.value)}>
                                    <option value="1">{`January ${year} - March ${year}`}</option>
                                    <option value="2">{`April ${year} - June ${year}`}</option>
                                    <option value="3">{`July ${year} - September ${year}`}</option>
                                    <option value="4">{`October ${year} - December ${year}`}</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-12 no-padding milestone-container">
                            <div className="cd-timeline-img add-btn cd-theme"
                                onClick={addMilestoneModal}
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Add Milestone"
                            >
                                <i class="fa fa-plus "></i>
                            </div>
                            <section id="cd-timeline" className="cd-container">
                                {modal
                                    ? <div className="cd-timeline-block">
                                        <div className="cd-timeline-img cd-primary"
                                            onClick={addMilestone}
                                            data-toggle="tooltip"
                                            data-placement="bottom"
                                            title="Add Milestone"
                                        >
                                            <i class="fa fa-check fa-lg check-icon-color"></i>
                                        </div>
                                        <div className="status-container">
                                            <div className={`cd-timeline-img-1 cd-primary 
                                         ${status === 0
                                                    ? "active-status"
                                                    : ""}`}
                                                onClick={() => handleStatus(0)}
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="Planned"
                                            >
                                                <i className="fa fa-tag"></i>
                                            </div>
                                            <div className={`cd-timeline-img-2 cd-warning
                                         ${status === 1
                                                    ? "active-status"
                                                    : ""}`}
                                                onClick={() => handleStatus(1)}
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="In Progress"
                                            >
                                                <i class="fa fa-hourglass"></i>
                                            </div>
                                            <div className={`cd-timeline-img-3 cd-success
                                         ${status === 2
                                                    ? "active-status"
                                                    : ""}`}
                                                onClick={() => handleStatus(2)}
                                                data-toggle="tooltip"
                                                data-placement="bottom"
                                                title="Achieved"
                                            >
                                                <i className="fa fa-star"></i>
                                            </div>
                                        </div>
                                        <div className="cd-timeline-content">
                                            <div onClick={removeMilestoneModal}
                                                style={{ float: "right", cursor: "pointer" }}>
                                                <i class="md md-lg md-clear"></i>
                                            </div>
                                            <input className={`form-control m_name ${errorName ? "show-error" : ""}`}
                                                autoFocus
                                                type="text"
                                                onChange={handleName}
                                                placeholder="Enter Milestone"
                                            />
                                            <p>
                                                <textarea className="form-control description"
                                                    placeholder="Enter Description"
                                                    type="text"
                                                    onChange={handleDescription} />
                                            </p>
                                            <div>
                                                <div>
                                                    <DatePicker
                                                        onSelect={setDate}
                                                        placeholderText="Select Due Date"
                                                        selected={dueDate}
                                                        className={`form-control ${errorDueDate ? "show-error" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null}
                                {milestones && milestones.length > 0 && milestones.map((milestone) => {
                                    return (
                                        <MilestoneCard
                                            key={milestone.id}
                                            milestone={milestone}
                                            edit={edit}
                                            errorDueDate={errorDueDate}
                                            errorName={errorName}
                                            setDate={setDate}
                                            dueDate={dueDate}
                                            id={id}
                                            deleteMilestone={deleteMilestone}
                                            name={name}
                                            description={description}
                                            handleDescription={handleDescription}
                                            handleName={handleName}
                                            editMilestone={editMilestone}
                                            handleStatus={handleStatus}
                                            removeHover={removeHover}
                                            addHover={addHover}
                                            hover={hover}
                                            updateMilestone={updateMilestone}
                                            removeMilestoneModal={removeMilestoneModal}
                                            changeDeleteModal={changeDeleteModal}
                                            currentDate={currentDate}
                                            status={status} />
                                    )
                                })}
                            </section>
                        </div>
                    </div >
                    : <div className="loader">
                        <VideoLoader />
                    </div>
            }
            <Modal
                className="task-delete-confirm-modal "
                show={deleteModal}
                onHide={(e) => {
                    setDeleteModal(false)
                }}
                style={{ paddingTop: "1.5%", paddingBottom: "30px" }}
            >
                <div className="delete-tag">Are you sure you want to delete ?</div>
                <div className="button-delcancel">
                    <button className="del-button"
                        onClick={deleteMilestone}>
                        Delete
                    </button>
                    <button
                        className="cancel-button"
                        onClick={(e) => {
                            e.preventDefault();
                            setDeleteModal(false)
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </Modal>
        </div >
    );
}

export default Milestone;