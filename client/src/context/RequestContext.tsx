import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import type { ReactNode } from "react";

import type {
  HttpMethod,
  HeaderItem,
  ParamItem,
  RequestTab,
  ApiResponse,
} from "../types/requestTypes";

let tabCounter = 0;
const makeId = () => `tab_${Date.now()}_${tabCounter++}`;

const blankTab = (overrides: Partial<RequestTab> = {}): RequestTab => ({
  id: makeId(),
  name: "Untitled Request",
  saved: false,
  dirty: false,
  method: "GET",
  url: "",
  body: "",
  headers: [{ key: "", value: "" }],
  params: [{ key: "", value: "" }],
  token: "",
  response: null,
  ...overrides,
});

interface OpenTabOptions {
  name?: string;
  collectionId?: string;
  method?: HttpMethod;
  url?: string;
  body?: string;
  headers?: HeaderItem[];
  params?: ParamItem[];
  token?: string;
  saved?: boolean;
}

interface RequestContextType {
  // Tab management
  tabs: RequestTab[];
  activeTabId: string;
  activeTab: RequestTab;
  switchTab: (id: string) => void;
  openNewTab: (opts?: OpenTabOptions) => void;
  closeTab: (id: string) => void;
  closeOtherTabs: (id: string) => void;
  duplicateTab: (id: string) => void;
  renameTab: (id: string, name: string) => void;
  markSaved: (id: string, collectionId: string, name: string) => void;

  // Active-tab convenience accessors (kept for existing components)
  method: HttpMethod;
  setMethod: (v: HttpMethod) => void;

  url: string;
  setUrl: (v: string) => void;

  body: string;
  setBody: (v: string) => void;

  headers: HeaderItem[];
  setHeaders: (v: HeaderItem[]) => void;

  params: ParamItem[];
  setParams: (v: ParamItem[]) => void;

  token: string;
  setToken: (v: string) => void;

  response: ApiResponse | null;
  setResponse: (v: ApiResponse | null) => void;

  resetRequest: () => void;
}

const RequestContext =
  createContext<RequestContextType | null>(null);

export function RequestProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tabs, setTabs] = useState<RequestTab[]>(() => [blankTab()]);
  const [activeTabId, setActiveTabId] = useState<string>(
    () => tabs[0].id
  );

  const activeTab =
    tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const updateTab = useCallback(
    (id: string, patch: Partial<RequestTab>, markDirty = true) => {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, ...patch, dirty: markDirty ? true : t.dirty }
            : t
        )
      );
    },
    []
  );

  const switchTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const openNewTab = useCallback((opts: OpenTabOptions = {}) => {
    const tab = blankTab({
      name: opts.name ?? "Untitled Request",
      collectionId: opts.collectionId,
      saved: opts.saved ?? false,
      dirty: false,
      method: opts.method ?? "GET",
      url: opts.url ?? "",
      body: opts.body ?? "",
      headers: opts.headers?.length ? opts.headers : [{ key: "", value: "" }],
      params: opts.params?.length ? opts.params : [{ key: "", value: "" }],
      token: opts.token ?? "",
    });

    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        if (idx === -1) return prev;

        const next = prev.filter((t) => t.id !== id);

        if (next.length === 0) {
          const fresh = blankTab();
          setActiveTabId(fresh.id);
          return [fresh];
        }

        setActiveTabId((current) => {
          if (current !== id) return current;
          const fallback = next[Math.max(0, idx - 1)];
          return fallback.id;
        });

        return next;
      });
    },
    []
  );

  const closeOtherTabs = useCallback((id: string) => {
    setTabs((prev) => prev.filter((t) => t.id === id));
    setActiveTabId(id);
  }, []);

  const duplicateTab = useCallback((id: string) => {
    setTabs((prev) => {
      const source = prev.find((t) => t.id === id);
      if (!source) return prev;

      const copy = blankTab({
        ...source,
        id: makeId(),
        name: `${source.name} Copy`,
        saved: false,
        collectionId: undefined,
        dirty: true,
      });

      const idx = prev.findIndex((t) => t.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      setActiveTabId(copy.id);
      return next;
    });
  }, []);

  const renameTab = useCallback((id: string, name: string) => {
    updateTab(id, { name }, false);
  }, [updateTab]);

  const markSaved = useCallback(
    (id: string, collectionId: string, name: string) => {
      updateTab(
        id,
        { saved: true, collectionId, name, dirty: false },
        false
      );
    },
    [updateTab]
  );

  const resetRequest = useCallback(() => {
    openNewTab();
  }, [openNewTab]);

  return (
    <RequestContext.Provider
      value={{
        tabs,
        activeTabId,
        activeTab,
        switchTab,
        openNewTab,
        closeTab,
        closeOtherTabs,
        duplicateTab,
        renameTab,
        markSaved,

        method: activeTab.method,
        setMethod: (v) => updateTab(activeTab.id, { method: v }),

        url: activeTab.url,
        setUrl: (v) => updateTab(activeTab.id, { url: v }),

        body: activeTab.body,
        setBody: (v) => updateTab(activeTab.id, { body: v }),

        headers: activeTab.headers,
        setHeaders: (v) => updateTab(activeTab.id, { headers: v }),

        params: activeTab.params,
        setParams: (v) => updateTab(activeTab.id, { params: v }),

        token: activeTab.token,
        setToken: (v) => updateTab(activeTab.id, { token: v }),

        response: activeTab.response,
        setResponse: (v) => updateTab(activeTab.id, { response: v }, false),

        resetRequest,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  const context = useContext(RequestContext);

  if (!context) {
    throw new Error(
      "useRequest must be used inside RequestProvider"
    );
  }

  return context;
}
