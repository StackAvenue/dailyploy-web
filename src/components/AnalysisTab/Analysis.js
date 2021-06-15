import React, { useState, useEffect, useRef } from "react";
import MenuBar from "../dashboard/MenuBar";
import "../../assets/css/Analysis.scss";
import { get } from "../../utils/API";
import {
    DATE_FORMAT2,
    FULL_DATE,
    PIE_CHART_COLOR
} from "./../../utils/Constants";
import {
    firstTwoLetter,
} from "../../utils/function";
import moment from "moment";
import CountUp from 'react-countup';
import DatePicker from "react-datepicker";
import Barchartdata from "./Barchartdata";
import Piechardata from "./Piechardata";

const Analysis = (props) => {
    const [workspaceId, setWorkspaceId] = useState(null)
    const [memberCount, setMemberCount] = useState(null)
    const [totalTasks, setTotalTasks] = useState(null)
    const [completedTasks, setCompletedTasks] = useState(null)
    const [totalTimeSpent, setTotalTimeSpent] = useState(null)
    const [financialHealth, setFinancialHealth] = useState(null)
    const [pieChartColor, setPieChartColor] = useState(null)
    const [projectId, setProjectId] = useState(null)
    const [projectName, setProjectName] = useState(null)
    const [barChartData, setBarChartData] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [filter, setFilter] = useState("Task Completed")
    const [isDeleteShow, setIsDeleteShow] = useState(false)
    const [projects, setProjects] = useState([])
    const [topMembers, setTopMembers] = useState([])
    const [membersList, setMembersList] = useState([])
    const [roadmapProgress, setRoadmapProgress] = useState([])
    const [startDate, setstartDate] = useState(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const calendarMonthRef = useRef(null);

    useEffect(() => {
        loadProjects()
    }, [])

    useEffect(() => {
        if (startDate && endDate && projectId) {
            fetchData()
        }
    }, [startDate, endDate, projectId])

    const loadProjects = async () => {
        try {
            const { workspaceId } = props.match.params;
            setWorkspaceId(workspaceId)
            const { data } = await get(
                `workspaces/${workspaceId}/projects`
            );
            const projectsData = data.projects;
            let date = new Date()
            const output = moment(date, FULL_DATE);
            const dateFrom = output.startOf("month").format(FULL_DATE);
            const dateTo = output.endOf("month").format(FULL_DATE);
            if (projectsData.length > 0) {
                setProjects(projectsData)
                setProjectId(projectsData[0].id)
                setstartDate(dateFrom)
                setEndDate(dateTo)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const classNameRoute = () => {
        let route = props.history.location.pathname;
        let routeName = route.split("/")[3];
        if (routeName === "analysis") {
            return "isAnalysis";
        } else {
            return false;
        }
    };

    const fetchData = async () => {
        try {
            const dateData = {
                start_date: startDate,
                end_date: endDate
            }
            const { data } = await get(
                `workspaces/${workspaceId}/projects/${projectId}/analysis`,
                dateData
            );
            let taskDetails = data.task_details;
            let color = null;
            if (data.financial_health >= 80 && data.financial_health <= 100) {
                color = PIE_CHART_COLOR.ORANGE
            } else if (data.financial_health >= 60 && data.financial_health < 80) {
                color = PIE_CHART_COLOR.YELLOW
            } else if (data.financial_health >= 0 && data.financial_health < 60) {
                color = PIE_CHART_COLOR.GREEN
            } else {
                color = PIE_CHART_COLOR.RED
            }
            setPieChartColor(color)
            setMemberCount(data.members_count)
            setTotalTasks(taskDetails.total_tasks)
            setMembersList(data.top_five_members)
            setTopMembers(data.top_five_members.task_count)
            setCompletedTasks(taskDetails.completed_tasks)
            setTotalTimeSpent(taskDetails.total_time_spent)
            setFinancialHealth(data.financial_health)
            setBarChartData(data.bar_chart)
            setRoadmapProgress(data.roadmap_status)

        } catch (error) {
            console.log(error)
        }
    }



    const handleMonthlyDateFrom = (date) => {
        const output = moment(date, FULL_DATE);
        var dateFrom = output.startOf("month").format(FULL_DATE);
        var dateTo = output.endOf("month").format(FULL_DATE);
        setstartDate(dateFrom)
        setEndDate(dateTo)
        setCurrentMonth(date)
    };

    const handleSelectProject = (e) => {
        const { name, value } = e.target;
        const selectedProject = projects.filter(project => project.name === value)
        let projectId = selectedProject[0].id;
        let projectName = selectedProject[0].name;
        setProjectId(projectId)
        setProjectName(projectName)
    }

    const openMonthCalender = () => {
        calendarMonthRef.current.setOpen(true);
    };

    const formatDate = (date) => {
        return moment(date).format(DATE_FORMAT2)
    }

    const handleFilter = (e) => {
        if (e.target.value === "Priority") {
            setFilter("Priority")
            setTopMembers(membersList.priority_count)
        } else {
            setFilter("Task Completed")
            setTopMembers(membersList.task_count)
        }

    }

    const setRoadmapColors = (status) => {
        if (status === "Running") {
            return "badge bg-soft-warning text-warning";
        } else if (status === "Planned") {
            return "badge bg-soft-planned text-primary";
        } else {
            return "badge bg-soft-success text-success";
        }
    }

    return (
        <>
            <MenuBar
                workspaceId={workspaceId}
                classNameRoute={classNameRoute}
                state={isDeleteShow}
            />
            <div className="analysis-container">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="page-title-box">
                                <div className="page-title">
                                    <div className="title-text">Analysis Dashboard</div>
                                    <div className="project-dropdown">
                                        <span style={{ opacity: "0" }}>Select Project</span>
                                        <div className="select-project">
                                            <select value={projectName}
                                                onChange={handleSelectProject}
                                                className="form-control">
                                                {projects && projects.map(project => {
                                                    return <option value={project.name}>
                                                        {project.name}
                                                    </option>
                                                })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="month-dropdown">
                                        <div className="position-relative d-inline-block  AB ">
                                            <DatePicker
                                                ref={calendarMonthRef}
                                                selected={currentMonth}
                                                onChange={date => handleMonthlyDateFrom(date)}
                                                dateFormat="MMMM  yyyy"
                                                showMonthYearPicker
                                                className="form-control"
                                                popperPlacement="bottom"
                                                popperModifiers={{
                                                    flip: {
                                                        behavior: ["bottom"]
                                                    },
                                                    preventOverflow: {
                                                        enabled: false
                                                    },
                                                    hide: {
                                                        enabled: false
                                                    }
                                                }}
                                            />
                                            <span style={{ position: "absolute", right: "9px", bottom: "0px" }}>
                                                <i
                                                    onClick={openMonthCalender}
                                                    className="fa fa-calendar"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row-card">
                            <div className="col-xl-3 col-md-6 col-lg-6 column-one">
                                <div className="margin-card-box">
                                    <div className="left-side">
                                        <div className="imgs bg-violet ">
                                            <i class="fa fa-file-text-o color-violet"></i>
                                        </div>

                                    </div>
                                    <div className="right-side-text">
                                        <div className="bold-text">
                                            <CountUp
                                                className="total-revenue"
                                                start={0}
                                                end={totalTasks}
                                                delay={0}
                                                duration={1}
                                            />
                                        </div>
                                        <div className="box-main-text">
                                            <div className="">Total Tasks</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 col-lg-6 column-one">
                                <div className="margin-card-box">
                                    <div className="left-side">
                                        <div className="imgs bg-green">
                                            <i class="fas fa-check color-green"></i>
                                        </div>

                                    </div>
                                    <div className="right-side-text">
                                        <div className="bold-text">
                                            <CountUp
                                                className="total-sales"
                                                start={0}
                                                end={completedTasks}
                                                delay={0}
                                                duration={1}
                                            />
                                        </div>
                                        <div className="box-main-text">
                                            <div className="">Completed Tasks</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 col-lg-6 column-one">
                                <div className="margin-card-box">
                                    <div className="left-side">
                                        <div className="imgs bg-chart">
                                            <i class="fa fa-users color-chart fa-lg"></i>
                                        </div>

                                    </div>
                                    <div className="right-side-text">
                                        <div className="bold-text">
                                            <CountUp
                                                className="Conversion"
                                                start={0}
                                                end={memberCount}
                                                delay={0}
                                                duration={1}
                                            />
                                        </div>
                                        <div className="box-main-text">
                                            <div className="">Members</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 col-lg-6 column-one">
                                <div className="margin-card-box">
                                    <div className="left-side">
                                        <div className="imgs bg-eye">
                                            <i class="fa fa-hourglass color-eye fa-lg"></i>
                                        </div>

                                    </div>
                                    <div className="right-side-text">
                                        <div className="bold-text">
                                            <CountUp
                                                className="today-visit"
                                                start={0}
                                                end={totalTimeSpent}
                                                delay={0}
                                                duration={1}
                                            />
                                            {" "}{totalTimeSpent > 1 ? "Hours" : "Hour"}
                                        </div>
                                        <div className="box-main-text">
                                            <div className="">Total time</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chart-row row">
                            <div className="pie-chart-card-box col-lg-4 ">
                                <div className="margin-card-box">
                                    <div className="top-card-row">
                                        <div className="card-heading">Financial Health</div>
                                    </div>
                                    <div className="widget-chart-details">
                                        <Piechardata
                                            id="analysisPieChart"
                                            type="Categories"
                                            financialHealth={financialHealth > 0 ? financialHealth : []}
                                            pieChartColor={pieChartColor}
                                        />

                                        <div className="total-stats">
                                            <h5 className="text-muted mt-0 align font-small">Financial Health</h5>
                                            <h2 className="align">{financialHealth > 0 ? `${financialHealth}%` : "No data"}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bar-graph-card-box col-lg-8">
                                <div className="margin-card-box">
                                    <div className="top-card-row">
                                        <div className="card-heading">Weekly Tasks</div>
                                    </div>
                                    <div className="bar-graph-box">
                                        <div className="apex-chart-canvas" >
                                            <Barchartdata barChartData={barChartData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="user-data-row col-lg-12">
                            <div className="margin-card-box">
                                <div className="card-heading-row">
                                    <div className="heading-card">
                                        <span>Top 5 Members</span>
                                    </div>
                                    <div className="filter-container">
                                        <span>Filter</span>
                                        <div className="filter-dropdown">
                                            <select className="form-control" onChange={handleFilter}>
                                                <option>Task completed</option>
                                                <option>Priority</option>
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div className="users-headers">
                                    <table>
                                        <thead className="thead-light">
                                            <tr>
                                                <th colspan="2" className="width-col">Name</th>
                                                <th>Expense</th>
                                                <th>{filter === "Priority" ? "Velocity" : "Completed tasks"}</th>
                                                <th>Total time</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topMembers && topMembers.length > 0 ? topMembers.map((member) => {
                                                return (
                                                    <tr>
                                                        <td style={{ width: "36px", }}>
                                                            <div className="comment-owner-dot">
                                                                {firstTwoLetter(member.name)}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="user-account">
                                                                <div className="user-account-name">{member.name}</div>
                                                            </div>
                                                        </td>
                                                        <td>{member.expense}</td>
                                                        <td>{member.task_count ? member.task_count : member.velocity}</td>
                                                        <td>{member.total_time > 1
                                                            ? `${member.total_time} Hours`
                                                            : `${member.total_time} Hour`}</td>
                                                    </tr>)
                                            }) : <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>No data</td>
                                                </tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="earned-history col-lg-12">
                            <div className="margin-card-box">
                                <div className="card-heading-row">
                                    <div className="heading-card">Roadmap Progress</div>
                                </div>
                                <div className="revenue-table">
                                    <table>
                                        <thead className="thead-light">
                                            <tr>
                                                <th colSpan="2">Name</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Progess</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        {roadmapProgress.length === 0
                                            ? <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td>No data</td>
                                                </tr>
                                            </tbody>
                                            : < tbody >
                                                {
                                                    roadmapProgress && roadmapProgress.map((roadmap) => {
                                                        return (<tr>
                                                            <td colSpan="2" className="marketplaces">{roadmap.name}</td>
                                                            <td>{roadmap.start_date
                                                                ? formatDate(roadmap.start_date) : "-"}</td>
                                                            <td>{roadmap.end_date
                                                                ? formatDate(roadmap.end_date) : "-"}</td>
                                                            <td>
                                                                <span className={setRoadmapColors(roadmap.status)}>
                                                                    {roadmap.progress}%
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={setRoadmapColors(roadmap.status)}>
                                                                    {roadmap.status}
                                                                </span>
                                                            </td>
                                                        </tr>)
                                                    })
                                                }
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </>
    )
}



export default Analysis;
