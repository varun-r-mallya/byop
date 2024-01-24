import React, { useState } from "react";
import "./Modal.css";
import Modal from "react-overlays/Modal";

export default function MainModal(props) {


  return (
    <div>
      <Modal
        className="modal"
        show={props.showModal}
        onHide={props.handleClose}
        renderBackdrop={props.renderBackdrop}
      >
        <div>
          <div className="modal-header">
            <div className="modal-title">Review Details</div>
            <div>
              <span className="close-button" onClick={props.handleClose}>
                x
              </span>
            </div>
          </div>
          <div className="modal-desc" style={{color: "black"}}>
            {props.review.reply}
          </div>
          <div className="modal-footer">
            <button className="primary-button" onClick={props.handleSuccess}>
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}