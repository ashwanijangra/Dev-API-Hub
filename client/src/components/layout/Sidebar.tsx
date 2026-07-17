import { useEffect, useState, useCallback } from "react";

import "../../styles/sidebar.css";

import { useRequest } from "../../context/RequestContext";

import {
  getCollections,
  deleteCollection,
  saveCollection,
} from "../../services/collectionService";

import { getHistory } from "../../services/historyService";
import toast from "react-hot-toast";
import EnvironmentVariables from "../workspace/EnvironmentVariables";

interface Collection {
  _id: string;
  name: string;
  method: any;
  url: string;
  body: string;
  headers: any[];
  params: any[];
  token: string;
}

interface HistoryItem {
  _id: string;
  method: string;
  url: string;
}

type Panel = "collections" | "history" | "environments";

function Sidebar() {
  const { openNewTab, resetRequest } = useRequest();

  const [panel, setPanel] = useState<Panel>("collections");
  const [collapsed, setCollapsed] = useState(false);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [c, h] = await Promise.all([getCollections(), getHistory()]);
      setCollections(c);
      setHistory(h);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    window.addEventListener("collectionsUpdated", loadData);
    return () =>
      window.removeEventListener("collectionsUpdated", loadData);
  }, [loadData]);

  const handleDelete = async (id: string) => {
    await deleteCollection(id);
    loadData();
  };

  const openCollection = (item: Collection) => {
    openNewTab({
      name: item.name,
      collectionId: item._id,
      saved: true,
      method: item.method,
      url: item.url,
      body: item.body,
      headers: item.headers?.length ? item.headers : [{ key: "", value: "" }],
      params: item.params?.length ? item.params : [{ key: "", value: "" }],
      token: item.token,
    });
  };

  const openHistoryItem = (item: HistoryItem) => {
    openNewTab({
      name: `${item.method} ${item.url}`.slice(0, 40),
      method: item.method as any,
      url: item.url,
    });
  };

  const exportCollections = () => {
    if (!collections.length) {
      toast.error("No collections to export");
      return;
    }

    const data = JSON.stringify(collections, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "devapihub-collections.json";
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Collections exported");
  };

  const importCollections = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (!Array.isArray(data)) {
          toast.error("Invalid collection file");
          return;
        }

        for (const item of data) {
          await saveCollection({
            name: item.name,
            method: item.method,
            url: item.url,
            body: item.body,
            headers: item.headers,
            params: item.params,
            token: item.token,
          });
        }

        toast.success("Collections Imported");
        loadData();
      } catch {
        toast.error("Import Failed");
      }
    };

    input.click();
  };

  const filteredCollections = collections.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sidebar-shell">
      <nav className="icon-rail">
        <button
          className={panel === "collections" ? "rail-btn active" : "rail-btn"}
          onClick={() => {
            setPanel("collections");
            setCollapsed(false);
          }}
          title="Collections"
        >
          📁
        </button>

        <button
          className={panel === "history" ? "rail-btn active" : "rail-btn"}
          onClick={() => {
            setPanel("history");
            setCollapsed(false);
          }}
          title="History"
        >
          🕒
        </button>

        <button
          className={panel === "environments" ? "rail-btn active" : "rail-btn"}
          onClick={() => {
            setPanel("environments");
            setCollapsed(false);
          }}
          title="Environments"
        >
          ⚙️
        </button>

        <div className="rail-spacer" />

        <button
          className="rail-btn"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </nav>

      {!collapsed && (
        <aside className="sidebar">
          <button className="new-btn" onClick={resetRequest}>
            + New Request
          </button>

          {panel === "collections" && (
            <>
              <div className="sidebar-toolbar">
                <button className="export-btn" onClick={exportCollections}>
                  📤 Export
                </button>
                <button className="import-btn" onClick={importCollections}>
                  📥 Import
                </button>
              </div>

              <div className="search-box">
                🔍
                <input
                  placeholder="Search Collections"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="section">
                <div className="section-header">📁 Collections</div>

                {loading ? (
                  <p className="empty">Loading...</p>
                ) : filteredCollections.length === 0 ? (
                  <p className="empty">No saved requests yet.</p>
                ) : (
                  filteredCollections.map((item) => (
                    <div
                      key={item._id}
                      className="item"
                      onClick={() => openCollection(item)}
                    >
                      <span className={`item-method m-${item.method?.toLowerCase()}`}>
                        {item.method}
                      </span>
                      <span className="item-name">{item.name}</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item._id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {panel === "history" && (
            <div className="section">
              <div className="section-header">🕒 History</div>

              {history.length === 0 ? (
                <p className="empty">No requests sent yet.</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item._id}
                    className="history-item"
                    onClick={() => openHistoryItem(item)}
                  >
                    <span className={`method m-${item.method?.toLowerCase()}`}>
                      {item.method}
                    </span>
                    <span>{item.url}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {panel === "environments" && <EnvironmentVariables />}
        </aside>
      )}
    </div>
  );
}

export default Sidebar;
