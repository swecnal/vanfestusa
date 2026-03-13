"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { SectionType } from "./types";

type AddSectionFn = (type: SectionType, index?: number) => Promise<void>;

interface PageEditorContextValue {
  addSection: AddSectionFn | null;
  registerHandler: (fn: AddSectionFn) => void;
  unregisterHandler: () => void;
}

const PageEditorContext = createContext<PageEditorContextValue>({
  addSection: null,
  registerHandler: () => {},
  unregisterHandler: () => {},
});

export function PageEditorProvider({ children }: { children: React.ReactNode }) {
  const [handler, setHandler] = useState<AddSectionFn | null>(null);

  const registerHandler = useCallback((fn: AddSectionFn) => {
    setHandler(() => fn);
  }, []);

  const unregisterHandler = useCallback(() => {
    setHandler(null);
  }, []);

  return (
    <PageEditorContext.Provider value={{ addSection: handler, registerHandler, unregisterHandler }}>
      {children}
    </PageEditorContext.Provider>
  );
}

export function usePageEditor() {
  return useContext(PageEditorContext);
}
