import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { UserRoundPlus, Search } from "lucide-react"
import { ClientFormDialog } from "./client-form-dialog"

const categories = [
    "PRIVATE EDUCATION", "PUBLIC EDUCATION", "GOVERNMENT",
    "AGRICULTURE & ENERGY", "CONSTRUCTION", "HEALTHCARE",
    "LOGISTICS - RETAIL - HOSPITALITY & TOURISM",
    "MULTI - PURPOSE COOPERATIVE & BANK",
]

export function Tabletoolbar({ onClientAdded, category, search, onCategoryChange, onSearchChange }: {
    onClientAdded: () => void
    category: string
    search: string
    onCategoryChange: (value: string) => void
    onSearchChange: (value: string) => void
}) {
    return (
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <ClientFormDialog
                mode="add"
                onSaved={onClientAdded}
                trigger={
                    <Button variant="outline" className="cursor-pointer bg-card">
                        <UserRoundPlus />
                        Add Client
                    </Button>
                }
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select value={category || "all"} onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}>
                    <SelectTrigger className="w-full sm:w-56 caret-transparent bg-card">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9 bg-card"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}