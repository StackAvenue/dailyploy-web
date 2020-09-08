import React, { useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MONTH_FORMAT } from "../../utils/Constants";
import moment from "moment";

function MilestoneCard(props) {
    const [nameHover, setNameHover] = useState(false);
    const [descriptionHover, setDescriptionHover] = useState(false);
    const [dateHover, setDateHover] = useState(false);
    const PLANNED = "Planned";
    const INPROGRESS = "Inprogress";
    const ACHIEVED = "Achieved";

    const extractDate = (date) => {
        let format_date = moment(date).format(MONTH_FORMAT)
        return format_date;
    }

    const statusTags = () => {
        if (props.milestone.status == PLANNED) {
            return (
                <> <div className={`cd-timeline-img 
                    ${props.edit && props.milestone.id === props.id
                        ? "cd-primary" : "cd-primary"}`}
                    onClick={props.id === props.milestone.id ? props.updateMilestone : null}
                >
                    {props.edit && props.milestone.id === props.id
                        ? <i className="fa fa-check fa-lg check-icon-color"></i>
                        : <i className="fa fa-tag"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Planned"></i>}
                    {props.edit && props.milestone.id === props.id
                        ? <div className="edit-tooltip">
                            <span>Edit</span>
                        </div>
                        : null}
                </div>
                </>)
        } else if (props.milestone.status == INPROGRESS) {
            return (
                <div className={`cd-timeline-img 
                    ${props.edit && props.milestone.id === props.id
                        ? "cd-primary" : "cd-warning"}`}
                    onClick={props.id === props.milestone.id ? props.updateMilestone : null}
                >
                    {props.edit && props.milestone.id === props.id
                        ? <i className="fa fa-check fa-lg check-icon-color"></i>
                        : <i class="fa fa-hourglass"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="In Progress"></i>}
                    {props.edit && props.milestone.id === props.id
                        ? <div className="edit-tooltip">
                            <span>Edit</span>
                        </div>
                        : null}
                </div>)
        } else if (props.milestone.status == ACHIEVED) {
            return (
                <div className={`cd-timeline-img 
                    ${props.edit && props.milestone.id === props.id
                        ? "cd-primary" : "cd-success"}`}
                    onClick={props.id === props.milestone.id ? props.updateMilestone : null}
                >
                    {props.edit && props.milestone.id === props.id
                        ? <i className="fa fa-check fa-lg check-icon-color"></i>
                        : <i className="fa fa-star"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="Achieved"></i>}
                    {props.edit && props.milestone.id === props.id
                        ? <div className="edit-tooltip">
                            <span>Edit</span>
                        </div>
                        : null}
                </div>)
        }
    }

    const editStatusTags = () => {
        return <>
            <div className={`cd-timeline-img-edit-1 cd-primary 
             ${props.status === PLANNED || props.status === 0
                    ? "active-status"
                    : ""}`}
                onClick={() => props.handleStatus(0)}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Planned"
            >
                <i className="fa fa-tag"></i>
            </div>
            <div className={`cd-timeline-img-edit-2 cd-warning
             ${props.status === INPROGRESS || props.status === 1
                    ? "active-status"
                    : ""}`}
                onClick={() => props.handleStatus(1)}
                data-toggle="tooltip"
                data-placement="bottom"
                title="In Progress"
            >
                <i class="fa fa-hourglass"></i>
            </div>
            <div className={`cd-timeline-img-edit-3 cd-success
             ${props.status === ACHIEVED || props.status === 2
                    ? "active-status"
                    : ""}`}
                onClick={() => props.handleStatus(2)}
                data-toggle="tooltip"
                data-placement="bottom"
                title="Achieved"
            >
                <i className="fa fa-star"></i>
            </div></>
    }

    const handleNameHover = () => {
        setNameHover(!nameHover)
    }

    const handleDescriptionHover = () => {
        setDescriptionHover(!descriptionHover)
    }

    const handleDateHover = (e) => {
        setDateHover(!dateHover)
    }

    return (
        <div className="cd-timeline-block">
            {props.edit && props.milestone.id === props.id
                ? <>{statusTags()}
                    <div className="cd-timeline-content">
                        <div onClick={props.removeMilestoneModal}
                            style={{ float: "right", cursor: "pointer" }}>
                            <i class="md md-lg md-clear"></i>
                        </div>

                        <input className={`${nameHover
                            ? props.errorName
                                ? "form-control m_name show-error"
                                : "form-control m_name"
                            : " form-control m_name off-hover"}`}
                            autoFocus
                            type="text"
                            placeholder="Enter Milestone"
                            value={props.name}
                            onChange={props.handleName}
                            onMouseEnter={handleNameHover}
                            onMouseLeave={handleNameHover}
                        />
                        <p>
                            <textarea
                                className={`${descriptionHover
                                    ? "form-control description"
                                    : "form-control description off-hover"}`}
                                type="text"
                                placeholder="Enter Description"
                                value={props.description}
                                onChange={props.handleDescription}
                                onMouseEnter={handleDescriptionHover}
                                onMouseLeave={handleDescriptionHover} />
                        </p>
                        <div>
                            <div className="due-date-input"
                                onMouseEnter={handleDateHover}
                                onMouseLeave={handleDateHover}>
                                <DatePicker
                                    onSelect={props.setDate}
                                    placeholderText="Select Due Date"
                                    selected={props.dueDate}
                                    className={`${dateHover
                                        ? props.errorDueDate
                                            ? "form-control show-error"
                                            : "form-control"
                                        : " form-control off-hover"}`} />
                            </div>
                            {editStatusTags()}
                        </div>

                        {props.edit ? null : <span className="cd-date">{props.milestone.due_date}</span>}
                    </div> </> : <>
                    {statusTags()}
                    <div className="cd-timeline-content"
                        onMouseEnter={() => props.addHover(props.milestone.id)}
                        onMouseLeave={props.removeHover}>
                        {props.hover && props.milestone.id === props.id
                            ? <div className="hover-icons">
                                <i class="md md-lg md-delete"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => props.changeDeleteModal(props.milestone.id)}></i>
                                <i class="md md-lg md-edit"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => props.editMilestone(props.milestone)}></i>
                            </div>
                            : null}
                        <div className="name-container">
                            <h3>
                                {props.milestone.name}
                            </h3>
                            {new Date(props.milestone.due_date) < props.currentDate
                                && props.milestone.status === INPROGRESS
                                ? <button
                                    type="button"
                                    className="btn-overdue">
                                    Overdue
                                    </button>
                                : null}
                        </div>
                        <p> {props.milestone.description}</p>
                        <span className="cd-date" onMouseEnter={props.removeHover}>
                            {extractDate(props.milestone.due_date)}
                        </span>
                    </div></>
            }
        </div >
    );
}

export default MilestoneCard;