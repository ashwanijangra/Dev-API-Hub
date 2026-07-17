import { useRequest } from "../../context/RequestContext";

function ParamsEditor() {
  const { params, setParams } = useRequest();

  const updateParam = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...params];
    updated[index][field] = value;
    setParams(updated);
  };

  const addParam = () => {
    setParams([...params, { key: "", value: "" }]);
  };

  const removeParam = (index: number) => {
    if (params.length === 1) return;
    setParams(params.filter((_, i) => i !== index));
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

      {params.map((param, index) => (
        <div key={index} className="header-row">
          <div className="kv-gutter" />

          <input
            placeholder="Parameter"
            value={param.key}
            onChange={(e) => updateParam(index, "key", e.target.value)}
          />

          <input
            placeholder="Value"
            value={param.value}
            onChange={(e) => updateParam(index, "value", e.target.value)}
          />

          <button onClick={() => removeParam(index)}>✕</button>
        </div>
      ))}

      <button className="send-btn" onClick={addParam}>
        + Add Parameter
      </button>
    </div>
  );
}

export default ParamsEditor;
