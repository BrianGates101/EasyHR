import React from 'react';
import '../styling/SaveConfirmation.css'

const SaveConfirmation = ({ onConfirm, onCancel }) => {
    return (
        <div className="save-confirmation-modal">
            <div className="save-modal-content">
                <h2>Are you sure you want to save the changes?</h2>
                <div className="save-modal-buttons">
                    <button className="save-confirm-button" onClick={onConfirm}>Yes</button>
                    <button className="save-cancel-button" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default SaveConfirmation;
