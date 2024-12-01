import React from 'react';
import '../styling/DeleteConfirmation.css';

const DeleteConfirmation = ({ employeeName, onDelete, onCancel }) => {
    return (
        <div className="delete-confirmation-modal">
            <div className="modal-content">
                <h2>Are you sure you want to delete {employeeName}?</h2>
                <div className="modal-buttons">
                    <button className="cancel-button" onClick={onCancel}>No</button>
                    <button className="confirm-button" onClick={onDelete}>Yes</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;
