import { useState, useEffect } from "react";
import "../../styles/modal.css";

interface SaveRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  initialName?: string;
}

function SaveRequestModal({
  open,
  onClose,
  onSave,
  initialName = "",
}: SaveRequestModalProps) {

  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) setName(initialName);
  }, [open, initialName]);

  if (!open) return null;

  const handleSave = async () => {

    if (!name.trim()) return;

    await onSave(name);

    setName("");

    onClose();

  };

  return (

    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">

          <h2>Save Request</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="modal-body">

          <label>

            Request Name

          </label>

          <input
            value={name}
            onChange={(e)=>
              setName(e.target.value)
            }
            placeholder="Example: Get Users"
          />

        </div>

        <div className="modal-footer">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="save-modal-btn"
            onClick={handleSave}
          >
            Save Request
          </button>

        </div>

      </div>

    </div>

  );

}

export default SaveRequestModal;