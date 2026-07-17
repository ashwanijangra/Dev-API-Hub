import { useState } from "react";
import { useEnvironment } from "../../context/EnvironmentContext";
import "../../styles/environment.css";

function EnvironmentVariables() {
  const {
    environments,
    activeEnvId,
    setActiveEnvId,
    addEnvironment,
    deleteEnvironment,
    renameEnvironment,
    updateVariables,
  } = useEnvironment();

  const [newEnvName, setNewEnvName] = useState("");

  const current = environments.find((e) => e.id === activeEnvId);

  const updateVariable = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    if (!current) return;
    const copy = [...current.variables];
    copy[index] = { ...copy[index], [field]: value };
    updateVariables(current.id, copy);
  };

  const addVariable = () => {
    if (!current) return;
    updateVariables(current.id, [
      ...current.variables,
      { key: "", value: "" },
    ]);
  };

  const removeVariable = (index: number) => {
    if (!current) return;
    updateVariables(
      current.id,
      current.variables.filter((_, i) => i !== index)
    );
  };

  const handleCreate = () => {
    if (!newEnvName.trim()) return;
    addEnvironment(newEnvName.trim());
    setNewEnvName("");
  };

  return (
    <div className="env-container">
      <div className="env-header">
        <h3>Environments</h3>
      </div>

      <div className="env-create-row">
        <input
          placeholder="New environment name..."
          value={newEnvName}
          onChange={(e) => setNewEnvName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <button onClick={handleCreate}>+ Create</button>
      </div>

      {environments.length === 0 ? (
        <p className="env-empty">
          No environments yet. Create one above, then use{" "}
          <code>{"{{variable}}"}</code> in your URL, body, headers, or auth.
        </p>
      ) : (
        <div className="env-list">
          {environments.map((env) => (
            <div
              key={env.id}
              className={
                env.id === activeEnvId ? "env-chip active" : "env-chip"
              }
              onClick={() =>
                setActiveEnvId(env.id === activeEnvId ? null : env.id)
              }
            >
              {env.id === activeEnvId ? "● " : ""}
              {env.name}
              <button
                className="env-chip-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEnvironment(env.id);
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {current && (
        <div className="env-editor">
          <div className="env-editor-header">
            <input
              className="env-name-input"
              value={current.name}
              onChange={(e) => renameEnvironment(current.id, e.target.value)}
            />
            <button onClick={addVariable}>+ Add Variable</button>
          </div>

          {current.variables.map((item, index) => (
            <div key={index} className="env-row">
              <input
                placeholder="Variable"
                value={item.key}
                onChange={(e) =>
                  updateVariable(index, "key", e.target.value)
                }
              />

              <input
                placeholder="Value"
                value={item.value}
                onChange={(e) =>
                  updateVariable(index, "value", e.target.value)
                }
              />

              <button onClick={() => removeVariable(index)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnvironmentVariables;
