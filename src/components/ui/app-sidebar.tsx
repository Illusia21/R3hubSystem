import { Home, Briefcase } from "lucide-react"
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
]

type AppSidebarProps = {
    active: string
    setActive: (title: string) => void
}

export function AppSidebar({ active, setActive }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="py-10 border-b">
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-white font-bold text-black">
                        R3
                    </div>
                    <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-semibold">R3 Hub</span>
                        <span className="text-xs text-muted-foreground">
                            Clients Monitoring
                        </span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        className="py-2 cursor-pointer"
                                        isActive={active === item.title}
                                        onClick={() => setActive(item.title)}
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