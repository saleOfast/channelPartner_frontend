import React from 'react'

const ConfirmBox = ({ title, setshowConfirm, showConfirm, actionType, }) => {
  // Always use blue color (#405189) for confirm button to ensure visibility
  const confirmButtonColor = "#405189"
  
    return (

        <>
            {showConfirm ? <div className="confirmBox">
                <div className="main-box-inside">
                    <div className="text-head">{title}</div>
                    <div className="btn-row">
                    <button className="btn btn-danger rounded-3 me-3" onClick={() => setshowConfirm(!showConfirm)}> Cancel </button>
                        <button className="btn text-white" style={{background: confirmButtonColor, border: 'none'}} onClick={actionType}> Confirm </button>
                    </div>
                </div>
            </div> : null}
        </>
    )
}

export default ConfirmBox
