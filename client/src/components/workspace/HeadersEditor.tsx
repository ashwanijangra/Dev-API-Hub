import { useRequest } from "../../context/RequestContext";

function HeadersEditor() {
  const { headers, setHeaders } = useRequest();

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...headers];
    updated[index][field] = value;
    setHeaders(updated);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    if (headers.length === 1) return;
    setHeaders(headers.filter((_, i) => i !== index));
  };

  return (
    <div className="request-editor">
      <div className="kv-head">
        <div className="kv-gutter" />
        <div className="kv-cell" style={{ flex: 1 }}>
          Key
        </div>
        <div className="kv-cell" style={{ flex: 1 }}>
          Value
        </div>
        <div style={{ width: 34 }} />
      </div>

      {headers.map((header, index) => (
        <div key={index} className="header-row">
          <div className="kv-gutter" />

          <input
            placeholder="Header key"
            value={header.key}
            onChange={(e) => updateHeader(index, "key", e.target.value)}
          />

          <input
            placeholder="Value"
            value={header.value}
            onChange={(e) => updateHeader(index, "value", e.target.value)}
          />

          <button onClick={() => removeHeader(index)}>✕</button>
        </div>
      ))}

      <button className="send-btn" onClick={addHeader}>
        + Add Header
      </button>
    </div>
  );
}

export default HeadersEditor;
