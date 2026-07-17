import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { RequestProvider } from "./context/RequestContext";
import { EnvironmentProvider } from "./context/EnvironmentContext";
import { ThemeProvider } from "./theme/ThemeContext";

import "./styles/global.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider>

        <EnvironmentProvider>

          <RequestProvider>

            <App />

            <Toaster
              position="top-right"
              reverseOrder={false}
            />

          </RequestProvider>

        </EnvironmentProvider>

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);