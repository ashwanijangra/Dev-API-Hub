import { useState } from "react";
import "../../styles/modal.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

function SaveModal({
  open,
  onClose,
  onSave,
}: Props) {

  const [name, setName] =
    useState("");

  if (!open) return null;

  return (

    <div className="modal-overlay">

      <div className="modal">

        <h2>
          Save Request
        </h2>

        <p>
          Give this request a name.
        </p>

        <input
          value={name}
          onChange={(e)=>
            setName(e.target.value)
          }
          placeholder="Login API"
        />

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="save-modal-btn"
            onClick={() => {

              onSave(name);

              setName("");

            }}
          >
            Save
          </button>

        </div>

      </div>

    </div>

  );

}

export default SaveModal;