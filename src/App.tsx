import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "./components/ui/app-sidebar"
import { Topbar } from "./components/ui/topbar"
import { ClientTable } from "./components/ui/client-table"
import { Tabletoolbar } from "./components/ui/table-toolbar"
import { EventAttendance } from "./components/ui/event-attendance"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  const [active, setActive] = useState("Client Details")
  const [refreshKey, setRefreshKey] = useState(0)
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")

  const refreshClients = () => setRefreshKey((k) => k + 1)

  return (
    <SidebarProvider>
      <TooltipProvider>
        <Toaster
          richColors
          position="top-center"
          toastOptions={{
            className: "font-sans",
            style: { width: "fit-content" },
          }}
        />
        <AppSidebar active={active} setActive={setActive} />
        <SidebarInset className="min-w-0">
          <Topbar title={active} />
          <div className="p-4 min-w-0">
            {active === "Client Details" && (
              <>
                <Tabletoolbar
                  onClientAdded={refreshClients}
                  category={category}
                  search={search}
                  onCategoryChange={setCategory}
                  onSearchChange={setSearch}
                />
                <ClientTable
                  refreshKey={refreshKey}
                  category={category}
                  search={search}
                  onClientChanged={refreshClients}
                />
              </>
            )}

            {active === "Event Attendance" && <EventAttendance />}

            {active === "Home" && (
              <div className="text-muted-foreground">
                Welcome to R3 Hub. Pick a section from the sidebar.
              </div>
            )}
          </div>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  )
}