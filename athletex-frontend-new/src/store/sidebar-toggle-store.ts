import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  openAccordionItems: string[];
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setOpenAccordionItems: (items: string[]) => void;
  toggleAccordionItem: (item: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      isMobileOpen: false,
      openAccordionItems: [],
      toggleSidebar: () =>
        set((state) => ({
          isCollapsed: !state.isCollapsed,
          // Close all accordion items when collapsing
          openAccordionItems: !state.isCollapsed
            ? []
            : state.openAccordionItems,
        })),
      setSidebarCollapsed: (collapsed: boolean) =>
        set({
          isCollapsed: collapsed,
          // Close all accordion items when collapsing
          openAccordionItems: collapsed ? [] : get().openAccordionItems,
        }),
      toggleMobileSidebar: () =>
        set((state) => ({ isMobileOpen: !state.isMobileOpen })),
      setMobileSidebarOpen: (open: boolean) => set({ isMobileOpen: open }),
      setOpenAccordionItems: (items: string[]) =>
        set({ openAccordionItems: items }),
      toggleAccordionItem: (item: string) =>
        set((state) => ({
          openAccordionItems: state.openAccordionItems.includes(item)
            ? state.openAccordionItems.filter((i) => i !== item)
            : [...state.openAccordionItems, item],
        })),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        openAccordionItems: state.openAccordionItems,
      }),
    },
  ),
);
