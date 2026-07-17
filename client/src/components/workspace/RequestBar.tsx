import { useState } from "react";
import { useRequest } from "../../context/RequestContext";
import type { HttpMethod } from "../../types/requestTypes";
import { executeRequest } from "../../services/requestService";
import { saveCollection, updateCollection } from "../../services/collectionService";
import { saveHistory } from "../../services/historyService";
import SaveRequestModal from "../modals/SaveRequestModal";
import "../../styles/requestbar.css";
import toast from "react-hot-toast";
import { replaceVariables } from "../../utils/replaceVariables";

function RequestBar() {
  const {
    activeTab,
    method,
    setMethod,
    url,
    setUrl,
    body,
    headers,
    params,
    token,
    setResponse,
    markSaved,
  } = useRequest();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSend = async () => {
    if (!url.trim()) {
      toast.error("Enter API URL");
      return;
    }

    try {
      setLoading(true);

      let parsedBody = {};

      if (body.trim()) {
        try {
          parsedBody = JSON.parse(replaceVariables(body));
        } catch {
          toast.error("Invalid JSON");
          setLoading(false);
          return;
        }
      }

      const finalUrl = replaceVariables(url);

      const response = await executeRequest(
        method,
        finalUrl,
        parsedBody,
        headers,
        params,
        token
      );

      setResponse(response);

      await saveHistory({
        method,
        url: finalUrl,
        status: response.status,
        responseTime: response.time,
      });
    } catch (error: any) {
      setResponse({
        status: "Error",
        time: 0,
        data: error.response?.data || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRequest = async (name: string) => {
    try {
      if (activeTab.saved && activeTab.collectionId) {
        await updateCollection(activeTab.collectionId, {
          name,
          method,
          url,
          body,
          headers,
          params,
          token,
        });
        markSaved(activeTab.id, activeTab.collectionId, name);
      } else {
        const saved = await saveCollection({
          name,
          method,
          url,
          body,
          headers,
          params,
          token,
        });
        markSaved(activeTab.id, saved._id, name);
      }

      window.dispatchEvent(new Event("collectionsUpdated"));

      toast.success("Request Saved");
      setShowModal(false);
    } catch {
      toast.error("Save Failed");
    }
  };

  return (
    <>
      <div className="request-bar">
        <select
          className="method-select"
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>PATCH</option>
          <option>DELETE</option>
        </select>

        <input
          className="url-input"
          placeholder="Enter request URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          className="send-btn"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>

        <button
          className="save-btn"
          onClick={() => setShowModal(true)}
        >
          {activeTab.saved ? "Save" : "Save"}
        </button>
      </div>

      <SaveRequestModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={saveRequest}
        initialName={activeTab.saved ? activeTab.name : ""}
      />
    </>
  );
}

export default RequestBar;
