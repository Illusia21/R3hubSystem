import { Home, Briefcase, CalendarCheck } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
    { title: "Home", icon: Home },
    { title: "Client Details", icon: Briefcase },
    { title: "Event Attendance", icon: CalendarCheck },
]

type AppSidebarProps = {
    active: string
    setActive: (title: string) => void
}

export function AppSidebar({ active, setActive }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-4 border-b">
                {/* Full logo — shown when the sidebar is expanded */}
                <div className="rounded-md bg-white p-2 w-fit mx-auto group-data-[collapsible=icon]:hidden">
                    <img src="/Logo.png" alt="R3 Hub Clients Monitoring" className="h-20 w-auto" />
                </div>

                {/* Compact mark — shown only when collapsed to icons */}
                <div className="hidden aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-white font-bold text-black group-data-[collapsible=icon]:flex">
                    R3
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2 caret-transparent">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className="py-5 cursor-pointer"
                                        isActive={active === item.title}
                                        onClick={() => setActive(item.title)}
                                        tooltip={item.title}
                                    >
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}