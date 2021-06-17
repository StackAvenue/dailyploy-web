import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import { get, post, put, del } from "../../../utils/API";
import { debounce } from "../../../utils/function";
import DailyPloyToast from "./../../../../src/components/DailyPloyToast";
import ConfirmModal from "../../ConfirmModal";
import { Button } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import Loader from 'react-loader-spinner'
import "../../../assets/css/TaskProjectList.scss";
import PropTypes from 'prop-types';


const StatusList = (props) => {
    const [statusList, setStatusList] = useState([]);
    const [newStatus, setnewStatus] = useState("");
    const [toggleAddpos, setToggleAddpos] = useState(false);
    const [toggleEditpos, setToggleEditpos] = useState(false);
    const [dragloader, setdragLoader] = useState(false);
    const [toggleDel, setToggleDel] = useState(false);
    const [editStatus, setEditStatus] = useState({});
    const [delStatus, setdelStatus] = useState("");


    const onDragEnd = async (result) => {

        if (result && result.draggableId && result.destination) {
            //console.log('ID' + result.draggableId + ' : ' + result.source.index + ': >' + result.destination.index)
            setdragLoader(true);
            const { data } = await put(
                { update_sequence_no: result.destination.index },
                `workspaces/${props.workspaceId}/projects/${props.projectId}/task_status/${result.draggableId}/update_sequence`
            );
            if (data && data.task_status) {
                setdragLoader(false);
                setStatusList(data.task_status)
            }
        }
    }

    const toggleAdd = () => {
        setToggleAddpos(!toggleAddpos)
        setnewStatus("");
    }

    const handleInputChange = (event) => {
        var { name, value } = event.target;

        switch (name) {
            case 'addStatus':
                setnewStatus(value)
            case 'editStatus':
                setEditStatus({ name: value, id: editStatus.id, inserted_at: editStatus.inserted_at });
        }
    }

    const openeditRow = (item) => {
        console.log(item.id)
        if (item != 'NO-VALUE' && !toggleEditpos) {
            setToggleEditpos(true);
            setEditStatus({ id: item.id, inserted_at: item.inserted_at, name: item.name })
        } else {
            setToggleEditpos(false);
        }
    }

    const cancelEditRow = () => {
        setEditStatus({})
        setToggleEditpos(false);
    }

    const addCategory = debounce(async () => {
        if (newStatus && newStatus != "") {
            try {
                const { data } = await post(
                    { name: newStatus, sequence_no: statusList.length },
                    `workspaces/${props.workspaceId}/projects/${props.projectId}/task_status`
                );
                if (data) {
                    statusList.push({ id: data.id, inserted_at: data.inserted_at, name: data.name });
                    setStatusList(statusList);
                    toggleAdd();
                }
            } catch (error) {
                if (error && error.response.status === 400) {
                    toast(
                        <DailyPloyToast message="Status already exists, Please try again"
                            status="error" />,
                        { autoClose: 2000, position: toast.POSITION.TOP_CENTER });
                }
            }
        }
    }, 500)

    const editCategory = async (item) => {
        if (editStatus && editStatus.id) {
            try {
                const { data } = await put(
                    { name: editStatus.name },
                    `workspaces/${props.workspaceId}/projects/${props.projectId}/task_status/${editStatus.id}`
                );
                if (data) {
                    const editedStatus = statusList.map(item => {
                        if (item.id == editStatus.id) {
                            item.name = editStatus.name;
                        }
                        return item;
                    });
                    setStatusList(editedStatus);
                    cancelEditRow();
                }
            } catch (error) {
                if (error && error.status) {

                }
            }
        }
    }

    const deleteCategory = async () => {
        try {
            const { data } = await del(
                `workspaces/${props.workspaceId}/projects/${props.projectId}/task_status/${delStatus}`
            );
            const deletedStatuses = statusList.filter((item) => item.id != delStatus);
            setStatusList(deletedStatuses);
            setToggleDel(false);
            toast(<DailyPloyToast message="Status deleted" status="success" />, {
                autoClose: 2000,
                position: toast.POSITION.TOP_CENTER
            });
        } catch (e) { }
    }

    const handleCloseDeleteStatus = () => {
        setdelStatus(0);
        setToggleDel(false);
    }

    const openDelModal = (delID) => {
        setdelStatus(delID);
        setToggleDel(!toggleDel);
    }

    const getStatus = async () => {
        try {
            const { data } = await get(
                `workspaces/${props.workspaceId}/projects/${props.projectId}/task_status?page_number=1&page_size=20`
            );
            if (data && data.task_status) {
                setStatusList(data.task_status)
            }
        } catch (e) { }
    }

    useEffect(() => {
        //Status Listing
        getStatus();
    }, [])

    return (
        (statusList && statusList.length > 0)
            ? <div className="statusDiv">
                <div className="category-box" style={{ borderTop: `2px solid ${props.color}` }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <table className="table">
                            <thead>
                                <th scope="col">
                                    Status
</th>

                                <th scope="col">
                                    Date Created
</th>


                                <th scope="col">
                                </th>

                            </thead>
                            {
                                (!dragloader) ?
                                    (<Droppable droppableId={"table"}>
                                        {provided => (
                                            <tbody ref={provided.innerRef} {...provided.droppableProps}>
                                                {statusList && statusList.length > 0 ?
                                                    statusList.map((item, index) => {
                                                        if (item.id != editStatus.id) {
                                                            return <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <tr
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        ref={provided.innerRef}
                                                                        className={(snapshot.isDragging) ? 'background-grey' : ''}
                                                                    >
                                                                        <td>
                                                                            <span class="padding-right">
                                                                                {item.name}
                                                                            </span>
                                                                            {item.is_default && <Button variant="outline-info" size="sm">
                                                                                Default
                                            </Button>}
                                                                        </td>
                                                                        <td>
                                                                            {moment(item.inserted_at).format("DD MMM YYYY")}
                                                                        </td>
                                                                        <td>
                                                                            <span onClick={() => openeditRow(item)}><i class="fas fa-pencil-alt edit-icon"></i></span>
                                                                            {!item.is_default && <span onClick={() => openDelModal(item.id)}><i class="fas fa-trash-alt del-icon"></i></span>}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                                }
                                                            </Draggable>
                                                        }
                                                        else {
                                                            return (
                                                                <tr>
                                                                    <td>
                                                                        <input name="editStatus" value={editStatus.name} onChange={(e) => handleInputChange(e)}>
                                                                        </input>
                                                                    </td>
                                                                    <td>
                                                                        {moment(editStatus.inserted_at).format("DD MMM YYYY")}
                                                                    </td>
                                                                    <td>
                                                                        <span class="cursor" onClick={editCategory}><i class="fa fa-check check-icon"></i></span>
                                                                        <span class="cursor" onClick={cancelEditRow}><i class="fa fa-times close-icon"></i></span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    })
                                                    : (<tr>
                                                    </tr>)
                                                }
                                                {toggleAddpos &&
                                                    <tr>
                                                        <td>
                                                            <input name="addStatus" placeholder=" Type your status" onChange={(e) => handleInputChange(e)}>
                                                            </input>
                                                        </td>
                                                        <td></td>
                                                        <td>
                                                            <span class="cursor" onClick={addCategory}><i class="fa fa-check check-icon"></i></span>
                                                            <span class="cursor" onClick={toggleAdd}><i class="fa fa-times close-icon"></i></span>
                                                        </td>
                                                    </tr>}
                                                {provided.placeholder}
                                            </tbody>
                                        )
                                        }
                                    </Droppable>
                                    )
                                    :
                                    <div className="spinnerDive" >
                                        {/* <Spinner animation="border" role="status" aria-hidden="true" variant="success">
                                        </Spinner> */}
                                        <Loader
                                            type="Puff"
                                            color="rgb(82 180 89)"
                                            height={65}
                                            width={65}
                                            style={{
                                                // marginLeft: "46pc",
                                                // marginTop: "13pc"
                                            }}
                                        />
                                    </div>

                            }
                            <tr onClick={toggleAdd}>
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="add-task-btn"
                                >
                                    <i class="md md-lg md-add"></i> Add Status
                                 </Button>
                            </tr>
                        </table>
                    </DragDropContext>
                </div >
                {
                    toggleDel ? (
                        <ConfirmModal
                            show={toggleDel}
                            message="Are you sure to Delete The Status?"
                            buttonText="delete"
                            onClick={deleteCategory}
                            closeModal={handleCloseDeleteStatus}
                        />
                    ) : null
                }
            </div > :
            <div className="spinnerDive" >
                {/* <Spinner animation="border" role="status" aria-hidden="true" variant="success">
                </Spinner> */}
                <Loader
                    type="Puff"
                    color="rgb(82 180 89)"
                    height={65}
                    width={65}
                    style={{
                        // marginLeft: "46pc",
                        // marginTop: "13pc"
                    }}
                />
            </div>
    );

}

StatusList.propTypes = {
    workspaceId: PropTypes.number.isRequired,
    projectId: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    // searchUserDetails: PropTypes.string.isRequired,
    // searchProjectIds: PropTypes.number.isRequired,
    // projectName: PropTypes.string.isRequired
}
export default StatusList;