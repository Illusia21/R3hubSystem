import { useEffect, useState } from "react"
import { Pencil, Trash2, ChevronUp, ChevronDown, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ClientFormDialog, type Client } from "./client-form-dialog"
import { toast } from "sonner"
import { API_URL } from "@/lib/api"

function formatName(c: Client) {
    return [c.first_name, c.middle_initial, c.last_name, c.suffix].filter(Boolean).join(" ")
}
function formatDate(iso: string | null | undefined) {
    if (!iso) return "—"
    return new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" })
}

type SortKey =
    | "category" | "company_name" | "client_name"
    | "contact_number" | "email" | "position" | "date_added"

export function ClientTable({ refreshKey, category, search, onClientChanged }: {
    refreshKey: number
    category: string
    search: string
    onClientChanged: () => void
}) {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sortKey, setSortKey] = useState<SortKey | null>(null)
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    useEffect(() => {
        fetch(`${API_URL}/clients`)
            .then((res) => { if (!res.ok) throw new Error("Failed to load clients"); return res.json() })
            .then((data) => setClients(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))
    }, [refreshKey])

    // Jump back to page 1 whenever the filtering/sorting/page size changes
    useEffect(() => { setPage(1) }, [category, search, sortKey, sortDir, pageSize])

    async function handleDelete(id: number) {
        try {
            const res = await fetch(`${API_URL}/clients/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Failed to delete")
            onClientChanged()
            toast.error("Client deleted")        // 🔴 red
        } catch {
            toast.error("Couldn't delete client")
        }
    }

    function sortValue(c: Client, key: SortKey): string {
        if (key === "client_name") return formatName(c)
        return (c[key as keyof Client] ?? "") as string
    }
    function toggleSort(key: SortKey) {
        if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        else { setSortKey(key); setSortDir("asc") }
    }

    // filter client-side (instant, like the attendees page)
    const term = search.trim().toLowerCase()
    const visible = clients.filter((c) => {
        const matchesCategory = !category || c.category === category
        const matchesSearch =
            !term ||
            c.company_name.toLowerCase().includes(term) ||
            c.first_name.toLowerCase().includes(term) ||
            c.last_name.toLowerCase().includes(term) ||
            (c.email ?? "").toLowerCase().includes(term) ||
            (c.position ?? "").toLowerCase().includes(term)
        return matchesCategory && matchesSearch
    })

    const sortedClients = sortKey === null
        ? visible
        : [...visible].sort((a, b) => {
            let cmp: number
            if (sortKey === "date_added") cmp = a.id - b.id
            else cmp = sortValue(a, sortKey).toLowerCase().localeCompare(sortValue(b, sortKey).toLowerCase())
            return sortDir === "asc" ? cmp : -cmp
        })

    const totalPages = Math.max(1, Math.ceil(sortedClients.length / pageSize))
    const pagedClients = sortedClients.slice((page - 1) * pageSize, page * pageSize)

    function SortableHeader({ label, k }: { label: string; k: SortKey }) {
        return (
            <TableHead>
                <button onClick={() => toggleSort(k)}
                    className="flex items-center gap-1 hover:text-foreground cursor-pointer">
                    {label}
                    {sortKey === k && (sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </button>
            </TableHead>
        )
    }

    if (loading)
        return (
            <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" /><span>Loading clients...</span>
            </div>
        )
    if (error) return <p className="p-4 text-red-500">{error}</p>

    return (
        <div className="rounded-md border">
            {/* Pagination — now on top */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-3">
                <span className="text-sm text-muted-foreground">
                    {sortedClients.length} client{sortedClients.length === 1 ? "" : "s"} total
                </span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Rows per page</span>
                        <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {[10, 20, 50, 100].map((n) => (
                                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <span className="text-sm">Page {page} of {totalPages}</span>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}>
                            <ChevronLeft />
                        </Button>
                        <Button variant="outline" size="icon" disabled={page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <SortableHeader label="Category" k="category" />
                        <SortableHeader label="Company Name" k="company_name" />
                        <SortableHeader label="Client Name" k="client_name" />
                        <SortableHeader label="Contact Number" k="contact_number" />
                        <SortableHeader label="Email" k="email" />
                        <SortableHeader label="Position" k="position" />
                        <SortableHeader label="Date Added" k="date_added" />
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pagedClients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                                No clients found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedClients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell className="whitespace-normal align-top">{client.category}</TableCell>
                                <TableCell className="whitespace-normal break-words align-top max-w-[200px]">{client.company_name}</TableCell>
                                <TableCell className="whitespace-normal align-top">{formatName(client)}</TableCell>
                                <TableCell className="align-top">{client.contact_number || "—"}</TableCell>
                                <TableCell className="whitespace-normal break-words align-top max-w-[180px]">{client.email || "—"}</TableCell>
                                <TableCell className="whitespace-normal align-top">{client.position}</TableCell>
                                <TableCell className="align-top whitespace-nowrap">{formatDate(client.created_at)}</TableCell>
                                <TableCell className="text-center align-top">
                                    <div className="flex justify-center gap-2">
                                        <ClientFormDialog mode="edit" client={client} onSaved={onClientChanged}
                                            trigger={<Button size="icon" variant="outline"><Pencil /></Button>} />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="destructive"><Trash2 /></Button>
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
                                                    <AlertDialogAction onClick={() => handleDelete(client.id)}>Delete</AlertDialogAction>
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