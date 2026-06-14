import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/ui/app-sidebar"
import { Topbar } from "./components/ui/topbar"
import { ClientTable } from "./components/ui/client-table"
import { Tabletoolbar } from "./components/ui/table-toolbar"

export default function App() {
  const [active, setActive] = useState("Client Details")
  const [refreshKey, setRefreshKey] = useState(0)
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")

  const refreshClients = () => setRefreshKey((k) => k + 1)
  const applyFilters = (cat: string, term: string) => { setCategory(cat); setSearch(term) }
  const clearFilters = () => { setCategory(""); setSearch("") }

  return (
    <SidebarProvider>
      <AppSidebar active={active} setActive={setActive} />
      <SidebarInset>
        <Topbar title={active} />
        <div className="p-4">
          <Tabletoolbar
            onClientAdded={refreshClients}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
          />
          <ClientTable
            refreshKey={refreshKey}
            category={category}
            search={search}
            onClientChanged={refreshClients}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}