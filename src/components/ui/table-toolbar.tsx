import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { UserRoundPlus } from "lucide-react"
import { ClientFormDialog } from "./client-form-dialog"

const categories = [
    "PRIVATE EDUCATION", "PUBLIC EDUCATION", "GOVERNMENT",
    "AGRICULTURE & ENERGY", "CONSTRUCTION", "HEALTHCARE",
    "LOGISTICS - RETAIL - HOSPITALITY & TOURISM",
    "MULTI - PURPOSE COOPERATIVE & BANK",
]

export function Tabletoolbar({ onClientAdded, onApplyFilters, onClearFilters }: {
    onClientAdded: () => void
    onApplyFilters: (category: string, search: string) => void
    onClearFilters: () => void
}) {
    const [categoryInput, setCategoryInput] = useState("all")
    const [searchInput, setSearchInput] = useState("")

    const handleSearch = () =>
        onApplyFilters(categoryInput === "all" ? "" : categoryInput, searchInput.trim())

    const handleClear = () => {
        setCategoryInput("all")
        setSearchInput("")
        onClearFilters()
    }

    return (
        <div className="flex justify-between mb-4 gap-2">
            <ClientFormDialog
                mode="add"
                onSaved={onClientAdded}
                trigger={
                    <Button variant="outline" className="cursor-pointer">
                        <UserRoundPlus />
                        Add Client
                    </Button>
                }
            />

            <div className="flex gap-2">
                <Select value={categoryInput} onValueChange={setCategoryInput}>
                    <SelectTrigger className="w-56">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Search..."
                    className="w-56"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} className="bg-[#0F2342] hover:bg-[#0F2342]/80 cursor-pointer">Search</Button>
                <Button variant="outline" onClick={handleClear} className="cursor-pointer">Clear</Button>
            </div>
        </div>
    )
}