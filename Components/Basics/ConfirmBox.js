import React, { useState } from 'react'

const ConfirmBox = ({ title, setshowConfirm, showConfirm, actionType, cancelLabel = "Cancel", confirmLabel = "Confirm" }) => {
    return (

        <>
            {showConfirm ? <div className="confirmBox">
                <div className="main-box-inside">
                    <div className="text-head">{title}</div>
                    <div className="btn-row">
                        <button className="btn btn-grey me-3" onClick={() => setshowConfirm(!showConfirm)}> {cancelLabel} </button>
                        <button className="btn btn-primary" onClick={actionType}> {confirmLabel} </button>
                    </div>
                </div>
            </div> : null}
        </>
    )
}

export default ConfirmBox
