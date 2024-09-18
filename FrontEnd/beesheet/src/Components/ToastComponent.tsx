import React from "react";
interface props{
    closeMessage:()=>void;
    errorPresent:string;
}
const ToastComponent = ({closeMessage,errorPresent}:props) => {
  return (
    <div
      className="toast show position-fixed bottom-0 end-0 m-3"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header">
        <strong className="me-auto">Message</strong>
        <button
          type="button"
          className="btn-close"
          onClick={closeMessage}
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{errorPresent}</div>
    </div>
  );
};

export default ToastComponent;
