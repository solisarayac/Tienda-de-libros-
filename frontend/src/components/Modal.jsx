import React from "react";

const Modal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-4">
        <h4 className="mb-3">{title}</h4>
        <p>{message}</p>
        <button className="btn btn-primary w-100" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default Modal;
