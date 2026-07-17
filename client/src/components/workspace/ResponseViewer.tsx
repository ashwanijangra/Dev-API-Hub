import { useState } from "react";
import { useRequest } from "../../context/RequestContext";
import toast from "react-hot-toast";
import "../../styles/response.css";

const STATUS_TEXT: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  301: "Moved Permanently",
  302: "Found",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

function ResponseViewer() {
  const { response, setResponse } = useRequest();
  const [subTab, setSubTab] = useState<"body" | "headers" | "cookies">(
    "body"
  );

  const copyResponse = async () => {
    if (!response) {
      toast.error("No response available");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(response.data, null, 2)
      );
      toast.success("Response copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const clearResponse = () => {
    setResponse(null);
    toast.success("Response cleared");
  };

  const size = response
    ? (new Blob([JSON.stringify(response.data)]).size / 1024).toFixed(2)
    : "0";

  const getStatusClass = () => {
    if (!response) return "status-gray";
    const status = Number(response.status);

    if (status >= 200 && status < 300) return "status-green";
    if (status >= 300 && status < 400) return "status-blue";
    if (status >= 400 && status < 500) return "status-orange";
    if (status >= 500) return "status-red";
    return "status-red";
  };

  const statusLabel =
    response?.statusText ??
    (typeof response?.status === "number"
      ? STATUS_TEXT[response.status]
      : undefined);

  const headerEntries = response?.responseHeaders
    ? Object.entries(response.responseHeaders)
    : [];

  const cookieHeader = response?.responseHeaders?.["set-cookie"];

  return (
    <div className="response-container">
      <div className="response-top">
        <h2>Response</h2>

        <div className="response-stats">
          <span className={getStatusClass()}>
            {response?.status ?? "--"}
            {statusLabel ? ` ${statusLabel}` : ""}
          </span>

          <span>⚡ {response?.time ?? "--"} ms</span>

          <span>📦 {size} KB</span>

          <button className="copy-response-btn" onClick={copyResponse}>
            Copy
          </button>

          <button className="clear-response-btn" onClick={clearResponse}>
            Clear
          </button>
        </div>
      </div>

      <div className="response-subtabs">
        <button
          className={subTab === "body" ? "resp-subtab active" : "resp-subtab"}
          onClick={() => setSubTab("body")}
        >
          Body
        </button>
        <button
          className={
            subTab === "headers" ? "resp-subtab active" : "resp-subtab"
          }
          onClick={() => setSubTab("headers")}
        >
          Headers
          {headerEntries.length > 0 && (
            <span className="resp-subtab-count">{headerEntries.length}</span>
          )}
        </button>
        <button
          className={
            subTab === "cookies" ? "resp-subtab active" : "resp-subtab"
          }
          onClick={() => setSubTab("cookies")}
        >
          Cookies
        </button>
      </div>

      {subTab === "body" && (
        <pre className="response-code">
          {response
            ? typeof response.data === "string"
              ? response.data
              : JSON.stringify(response.data, null, 2)
            : `Ready to send a request

Select a method, enter a URL and click Send.
The response will appear here in formatted JSON.`}
        </pre>
      )}

      {subTab === "headers" && (
        <div className="response-headers-list">
          {headerEntries.length === 0 ? (
            <p className="empty">No headers to display.</p>
          ) : (
            headerEntries.map(([key, value]) => (
              <div className="response-header-row" key={key}>
                <span className="response-header-key">{key}</span>
                <span className="response-header-value">
                  {String(value)}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {subTab === "cookies" && (
        <div className="response-headers-list">
          {cookieHeader ? (
            <div className="response-header-row">
              <span className="response-header-key">Set-Cookie</span>
              <span className="response-header-value">
                {String(cookieHeader)}
              </span>
            </div>
          ) : (
            <p className="empty">No cookies were set by this response.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ResponseViewer;
