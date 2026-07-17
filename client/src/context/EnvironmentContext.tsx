import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Environment, EnvVariable } from "../types/requestTypes";

const STORAGE_KEY = "devapihub_environments";
const ACTIVE_KEY = "devapihub_active_env";

let envCounter = 0;
const makeId = () => `env_${Date.now()}_${envCounter++}`;

interface EnvironmentContextType {
  environments: Environment[];
  activeEnvId: string | null;
  activeEnvironment: Environment | null;
  setActiveEnvId: (id: string | null) => void;
  addEnvironment: (name: string) => void;
  deleteEnvironment: (id: string) => void;
  renameEnvironment: (id: string, name: string) => void;
  updateVariables: (id: string, variables: EnvVariable[]) => void;
}

const EnvironmentContext =
  createContext<EnvironmentContextType | null>(null);

function loadEnvironments(): Environment[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }

  // migrate legacy flat variable list if present
  try {
    const legacy = localStorage.getItem("envVariables");
    if (legacy) {
      const variables = JSON.parse(legacy);
      if (Array.isArray(variables) && variables.length) {
        return [
          {
            id: makeId(),
            name: "Default",
            variables,
          },
        ];
      }
    }
  } catch {
    // ignore
  }

  return [];
}

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environments, setEnvironments] = useState<Environment[]>(
    loadEnvironments
  );

  const [activeEnvId, setActiveEnvId] = useState<string | null>(() =>
    localStorage.getItem(ACTIVE_KEY)
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(environments));
  }, [environments]);

  useEffect(() => {
    if (activeEnvId) {
      localStorage.setItem(ACTIVE_KEY, activeEnvId);
    } else {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }, [activeEnvId]);

  const addEnvironment = useCallback((name: string) => {
    const env: Environment = {
      id: makeId(),
      name: name || "New Environment",
      variables: [{ key: "", value: "" }],
    };
    setEnvironments((prev) => [...prev, env]);
    setActiveEnvId(env.id);
  }, []);

  const deleteEnvironment = useCallback(
    (id: string) => {
      setEnvironments((prev) => prev.filter((e) => e.id !== id));
      setActiveEnvId((current) => (current === id ? null : current));
    },
    []
  );

  const renameEnvironment = useCallback((id: string, name: string) => {
    setEnvironments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, name } : e))
    );
  }, []);

  const updateVariables = useCallback(
    (id: string, variables: EnvVariable[]) => {
      setEnvironments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, variables } : e))
      );
    },
    []
  );

  const activeEnvironment =
    environments.find((e) => e.id === activeEnvId) ?? null;

  return (
    <EnvironmentContext.Provider
      value={{
        environments,
        activeEnvId,
        activeEnvironment,
        setActiveEnvId,
        addEnvironment,
        deleteEnvironment,
        renameEnvironment,
        updateVariables,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);

  if (!context) {
    throw new Error(
      "useEnvironment must be used inside EnvironmentProvider"
    );
  }

  return context;
}
