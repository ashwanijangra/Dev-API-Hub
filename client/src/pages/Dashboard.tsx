import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import RequestTabsBar from "../components/workspace/RequestTabsBar";
import RequestBar from "../components/workspace/RequestBar";
import Tabs from "../components/workspace/Tabs";

import RequestEditor from "../components/workspace/RequestEditor";
import HeadersEditor from "../components/workspace/HeadersEditor";
import ParamsEditor from "../components/workspace/ParamsEditor";
import AuthEditor from "../components/workspace/AuthEditor";

import ResponseViewer from "../components/workspace/ResponseViewer";

import "../styles/dashboard.css";
import EnvironmentVariables from "../components/workspace/EnvironmentVariables";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("body");

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-body">
        <Sidebar />

        <main className="workspace">
          <RequestTabsBar />

          <div className="workspace-card">
            <RequestBar />

            <Tabs
              activeTab={activeSection}
              setActiveTab={setActiveSection}
            />

            <div className="editor-area">
              {activeSection === "body" && <RequestEditor />}
              {activeSection === "headers" && <HeadersEditor />}
              {activeSection === "params" && <ParamsEditor />}
              {activeSection === "authorization" && <AuthEditor />}
              {activeSection === "environment" && <EnvironmentVariables />}
            </div>
          </div>

          <div className="workspace-card response-card">
            <ResponseViewer />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
