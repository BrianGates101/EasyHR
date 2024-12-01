import React from 'react';
import '../styling/SaveConfirmation.css'

const SaveConfirmation = ({ onConfirm, onCancel }) => {
    return (
        <div className="save-confirmation-modal">
            <div className="modal-content">
                <h2>Are you sure you want to save the changes?</h2>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Yes</button>
                    <button className="cancel-button" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default SaveConfirmation;
