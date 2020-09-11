import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { ERR_MODAL_ID } from "./../utils/Constants";
import "../assets/css/ErrorModal.scss"
class ErrorModal extends Component {
    closeModal = () => {
        const ErrorModalContainer = document.getElementById(ERR_MODAL_ID);
        ErrorModalContainer.classList.remove("active");
        window.location.reload();
    }
    render() {
        return <div id="custom-error-modal-container" >
            <div className="custom-error-modal-content">
                <p>Dailyploy server was contacted but has returned an error response and We are unsure of the result of this operation.</p>
                <p>Click close to continue using dailyploy.</p>
                <div><button className="btn btn-link float-right" onClick={this.closeModal}>Close</button></div>
            </div>
        </div>
    }
}
export default ErrorModal;