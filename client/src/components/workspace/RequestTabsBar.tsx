import { useState, useRef, useEffect } from "react";
import { useRequest } from "../../context/RequestContext";
import EnvironmentSelector from "./EnvironmentSelector";
import "../../styles/requesttabs.css";

function RequestTabsBar() {
  const {
    tabs,
    activeTabId,
    switchTab,
    openNewTab,
    closeTab,
    closeOtherTabs,
    duplicateTab,
    renameTab,
  } = useRequest();

  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuFor(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const commitRename = (id: string) => {
    if (draftName.trim()) {
      renameTab(id, draftName.trim());
    }
    setEditingId(null);
  };

  const handleClose = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    closeTab(id);
  };

  return (
    <div className="req-tabs-bar">
      <div className="req-tabs-row">
      <div className="req-tabs-scroll">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={
              tab.id === activeTabId
                ? "req-tab active"
                : "req-tab"
            }
            onClick={() => switchTab(tab.id)}
            onDoubleClick={() => {
              setDraftName(tab.name);
              setEditingId(tab.id);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuFor(tab.id);
            }}
          >
            <span className={`req-tab-method m-${tab.method.toLowerCase()}`}>
              {tab.method}
            </span>

            {editingId === tab.id ? (
              <input
                className="req-tab-rename"
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={() => commitRename(tab.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename(tab.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="req-tab-name">
                {tab.name}
                {tab.dirty && <span className="req-tab-dot" />}
              </span>
            )}

            <button
              className="req-tab-close"
              onClick={(e) => handleClose(e, tab.id)}
              title="Close tab"
            >
              ✕
            </button>

            {menuFor === tab.id && (
              <div className="req-tab-menu" ref={menuRef}>
                <button
                  onClick={() => {
                    duplicateTab(tab.id);
                    setMenuFor(null);
                  }}
                >
                  Duplicate Tab
                </button>
                <button
                  onClick={() => {
                    closeOtherTabs(tab.id);
                    setMenuFor(null);
                  }}
                >
                  Close Other Tabs
                </button>
                <button
                  onClick={() => {
                    setDraftName(tab.name);
                    setEditingId(tab.id);
                    setMenuFor(null);
                  }}
                >
                  Rename
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          className="req-tab-add"
          onClick={() => openNewTab()}
          title="New request tab"
        >
          +
        </button>
      </div>

      <div className="req-tabs-side">
        <EnvironmentSelector />
      </div>
      </div>
    </div>
  );
}

export default RequestTabsBar;
