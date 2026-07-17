import { useState, useRef, useEffect } from "react";
import { useEnvironment } from "../../context/EnvironmentContext";
import "../../styles/environment.css";

function EnvironmentSelector() {
  const { environments, activeEnvId, activeEnvironment, setActiveEnvId } =
    useEnvironment();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="env-selector" ref={ref}>
      <button
        className="env-selector-btn"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={activeEnvId ? "env-dot on" : "env-dot"} />
        {activeEnvironment ? activeEnvironment.name : "No Environment"}
        <span className="env-selector-chevron">▾</span>
      </button>

      {open && (
        <div className="env-selector-menu">
          <div
            className={!activeEnvId ? "env-selector-item active" : "env-selector-item"}
            onClick={() => {
              setActiveEnvId(null);
              setOpen(false);
            }}
          >
            No Environment
          </div>

          {environments.map((env) => (
            <div
              key={env.id}
              className={
                env.id === activeEnvId
                  ? "env-selector-item active"
                  : "env-selector-item"
              }
              onClick={() => {
                setActiveEnvId(env.id);
                setOpen(false);
              }}
            >
              {env.name}
              <span className="env-selector-count">
                {env.variables.filter((v) => v.key.trim()).length}
              </span>
            </div>
          ))}

          {environments.length === 0 && (
            <div className="env-selector-empty">
              Create environments in the Environment tab
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EnvironmentSelector;
