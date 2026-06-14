import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Topbar } from "./components/ui/topbar"
import { ClientTable } from "./components/ui/client-table"
import { Tabletoolbar } from "./components/ui/table-toolbar"

export default function App() {
  const [active, setActive] = useState("Client Details")

  return (

    <>
      <SidebarProvider>
        <AppSidebar active={active} setActive={setActive} />
        <SidebarInset>
          <Topbar title={active} />
          <div className="p-4">
            <Tabletoolbar />
            <ClientTable />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}