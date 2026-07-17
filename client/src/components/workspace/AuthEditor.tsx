import { useRequest } from "../../context/RequestContext";

function AuthEditor() {
  const { token, setToken } = useRequest();

  return (
    <div className="request-editor auth-editor">
      <div className="kv-head">
        <div className="kv-cell" style={{ padding: "9px 12px" }}>
          Bearer Token
        </div>
      </div>

      <div style={{ padding: 14 }}>
        <input
          type="text"
          placeholder="Paste JWT token..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="auth-token-input"
        />
        <p className="auth-hint">
          Sent as <code>Authorization: Bearer &lt;token&gt;</code> on every
          request in this tab.
        </p>
      </div>
    </div>
  );
}

export default AuthEditor;
