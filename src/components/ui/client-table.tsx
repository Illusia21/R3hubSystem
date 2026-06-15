import { useEffect, useState } from "react"
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThreeDot } from "react-loading-indicators";
import { ClientFormDialog, type Client } from "./client-form-dialog"
import { API_URL } from "@/lib/api"

function formatName(c: Client) {
    return [c.first_name, c.middle_initial, c.last_name, c.suffix].filter(Boolean).join(" ")
}

type SortKey =
    | "category" | "company_name" | "client_name"
    | "contact_number" | "email" | "position"

export function ClientTable({ refreshKey, category, search, onClientChanged }: {
    refreshKey: number
    category: string
    search: string
    onClientChanged: () => void
}) {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sortKey, setSortKey] = useState<SortKey>("category")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    useEffect(() => {
        const params = new URLSearchParams()
        if (category) params.append("category", category)
        if (search) params.append("search", search)

        fetch(`${API_URL}/clients?${params.toString()}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load clients")
                return res.json()
            })
            .then((data) => setClients(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [refreshKey, category, search])

    async function handleDelete(id: number) {
        try {
            const res = await fetch(`${API_URL}/clients/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")
            onClientChanged()
        } catch {
            alert("Failed to delete client.")
        }
    }

    function sortValue(c: Client, key: SortKey): string {
        if (key === "client_name") return formatName(c)
        return (c[key] ?? "") as string
    }

    function toggleSort(key: SortKey) {
        if (key === sortKey) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        } else {
            setSortKey(key)
            setSortDir("asc")
        }
    }

    const sortedClients = [...clients].sort((a, b) => {
        const cmp = sortValue(a, sortKey).toLowerCase()
            .localeCompare(sortValue(b, sortKey).toLowerCase())
        return sortDir === "asc" ? cmp : -cmp
    })

    // Clickable header cell
    function SortableHeader({ label, k }: { label: string; k: SortKey }) {
        return (
            <TableHead>
                <button
                    onClick={() => toggleSort(k)}
                    className="flex items-center gap-1 hover:text-foreground cursor-pointer w-full justify-start"
                >
                    {label}
                    {sortKey === k &&
                        (sortDir === "asc"
                            ? <ChevronUp className="size-3" />
                            : <ChevronDown className="size-3" />)}
                </button>
            </TableHead>
        )
    }

    if (loading) return (
        <div className="flex justify-center items-center py-10">
            <ThreeDot color="#000000" size="medium" />
        </div>
    )
    if (error) return <p className="p-4 text-red-500">{error}</p>


    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#F2F2F2]">
                        <SortableHeader label="Category" k="category" />
                        <SortableHeader label="Company Name" k="company_name" />
                        <SortableHeader label="Client Name" k="client_name" />
                        <SortableHeader label="Contact Number" k="contact_number" />
                        <SortableHeader label="Email" k="email" />
                        <SortableHeader label="Position" k="position" />
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedClients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                                No clients found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedClients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.category}</TableCell>
                                <TableCell>{client.company_name}</TableCell>
                                <TableCell>{formatName(client)}</TableCell>
                                <TableCell>{client.contact_number}</TableCell>
                                <TableCell>{client.email || "—"}</TableCell>
                                <TableCell>{client.position}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <ClientFormDialog
                                            mode="edit"
                                            client={client}
                                            onSaved={onClientChanged}
                                            trigger={
                                                <Button size="icon" variant="outline">
                                                    <Pencil />
                                                </Button>
                                            }
                                        />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive">
                                                    <Trash2 />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete this client?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This permanently removes{" "}
                                                        <span className="font-semibold">{formatName(client)}</span>{" "}
                                                        from the database. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(client.id)}>
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}