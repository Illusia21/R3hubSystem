import { SidebarTrigger } from "@/components/ui/sidebar"

type TopbarProps = {
    title?: string
}

export function Topbar({ title }: TopbarProps) {
    return (
        <header className="flex h-16 items-center gap-2 border-b px-4 bg-card">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-[#0F2342]">{title}</h1>
        </header>
    )
}