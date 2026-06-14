import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ClientFormDialog, type Client } from "./client-form-dialog"
import { API_URL } from "@/lib/api"

function formatName(c: Client) {
    return [c.first_name, c.middle_initial, c.last_name, c.suffix].filter(Boolean).join(" ")
}

export function ClientTable({ refreshKey, category, search, onClientChanged }: {
    refreshKey: number
    category: string
    search: string
    onClientChanged: () => void
}) {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

    if (loading) return <p className="p-4 text-muted-foreground">Loading clients...</p>
    if (error) return <p className="p-4 text-red-500">{error}</p>

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-6">
                                No clients found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.category}</TableCell>
                                <TableCell>{client.company_name}</TableCell>
                                <TableCell>{formatName(client)}</TableCell>
                                <TableCell>{client.contact_number}</TableCell>
                                <TableCell>{client.email || "—"}</TableCell>
                                <TableCell>{client.position}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
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