import { useState, useEffect } from "react"
import { Search, UserRoundPlus, Loader2, ChevronLeft, ChevronRight, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { API_URL } from "@/lib/api"

type Attendee = {
    id: number
    name: string
    company: string | null
    role: string | null
    checked_in: boolean
    checked_in_at: string | null
    is_walk_in: boolean
    created_at: string
}

function StatusPill({ confirmed }: { confirmed: boolean }) {
    return confirmed ? (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Confirmed
        </span>
    ) : (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            Pending
        </span>
    )
}

function AttendeeDialog({ mode, attendee, trigger, onSaved }: {
    mode: "add" | "edit"
    attendee?: Attendee
    trigger: React.ReactNode
    onSaved: (a: Attendee) => void
}) {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        name: attendee?.name ?? "",
        company: attendee?.company ?? "",
        role: attendee?.role ?? "",
    })
    const [saving, setSaving] = useState(false)
    const [err, setErr] = useState("")

    function handleOpenChange(next: boolean) {
        setOpen(next)
        if (next) {
            setForm({
                name: attendee?.name ?? "",
                company: attendee?.company ?? "",
                role: attendee?.role ?? "",
            })
            setErr("")
        }
    }

    async function submit() {
        if (!form.name.trim()) { setErr("Name is required."); return }
        setSaving(true)
        try {
            const url = mode === "add"
                ? `${API_URL}/attendees`
                : `${API_URL}/attendees/${attendee!.id}`
            const method = mode === "add" ? "POST" : "PUT"
            const body = mode === "add" ? { ...form, is_walk_in: true } : { ...form }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error("Failed")
            const saved: Attendee = await res.json()
            onSaved(saved)
            if (mode === "add") toast.success(`${saved.name} added & confirmed`)
            else toast.info(`${saved.name} updated`)
            setOpen(false)
        } catch {
            setErr("Something went wrong while saving.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add Walk-in Guest" : "Edit Attendee"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "They'll be added and marked Confirmed right away."
                            : "Update this attendee's details. This won't change their check-in status."}
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <FieldLabel>Name</FieldLabel>
                        <Input value={form.name} placeholder="Full name"
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                    </Field>
                    <Field>
                        <FieldLabel>Company</FieldLabel>
                        <Input value={form.company} placeholder="Company"
                            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
                    </Field>
                    <Field>
                        <FieldLabel>Role</FieldLabel>
                        <Input value={form.role} placeholder="Role / position"
                            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
                    </Field>
                    {err && <p className="text-sm text-red-500">{err}</p>}
                </FieldGroup>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="cursor-pointer">Cancel</Button>
                    </DialogClose>
                    <Button onClick={submit} disabled={saving}
                        className="bg-[#0F2342] hover:bg-[#0F2342]/80 cursor-pointer">
                        {saving ? "Saving..." : mode === "add" ? "Add Guest" : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function EventAttendance() {
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed">("all")
    const [page, setPage] = useState(1)
    const pageSize = 10

    useEffect(() => {
        fetch(`${API_URL}/attendees`)
            .then((res) => { if (!res.ok) throw new Error("Failed to load attendees"); return res.json() })
            .then(setAttendees)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => { setPage(1) }, [search, statusFilter])

    async function toggleCheckIn(att: Attendee) {
        try {
            const res = await fetch(`${API_URL}/attendees/${att.id}/checkin`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ checked_in: !att.checked_in }),
            })
            if (!res.ok) throw new Error("Failed")
            const updated: Attendee = await res.json()
            setAttendees((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
            toast.success(updated.checked_in ? `${updated.name} confirmed` : `${updated.name} set to pending`)
        } catch {
            toast.error("Couldn't update attendee")
        }
    }

    const total = attendees.length
    const confirmed = attendees.filter((a) => a.checked_in).length
    const remaining = total - confirmed

    const term = search.trim().toLowerCase()
    const filtered = attendees.filter((a) => {
        const matchesSearch =
            !term ||
            a.name.toLowerCase().includes(term) ||
            (a.company ?? "").toLowerCase().includes(term)
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "confirmed" && a.checked_in) ||
            (statusFilter === "pending" && !a.checked_in)
        return matchesSearch && matchesStatus
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

    if (loading)
        return (
            <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" /><span>Loading attendees...</span>
            </div>
        )
    if (error) return <p className="p-4 text-red-500">{error}</p>

    return (
        <div className="flex flex-col gap-4">
            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground">TOTAL EXPECTED</p>
                        <p className="mt-2 text-3xl font-bold">{total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground">CONFIRMED</p>
                        <p className="mt-2 text-3xl font-bold text-[#f15a24]">{confirmed}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <p className="text-xs font-medium tracking-wide text-muted-foreground">REMAINING</p>
                        <p className="mt-2 text-3xl font-bold text-[#0F2342]">{remaining}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search + status filter + Add walk-in */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Search attendee name or company..."
                            value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "pending" | "confirmed")}>
                        <SelectTrigger className="w-full sm:w-44 caret-transparent">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <AttendeeDialog
                    mode="add"
                    onSaved={(a) => setAttendees((prev) => [a, ...prev])}
                    trigger={
                        <Button className="bg-[#f15a24] hover:bg-[#f15a24]/90 text-white cursor-pointer">
                            <UserRoundPlus /> Add Walk-in Guest
                        </Button>
                    }
                />
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paged.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                    No attendees found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paged.map((att) => (
                                <TableRow key={att.id}>
                                    <TableCell className="font-medium">{att.name}</TableCell>
                                    <TableCell>{att.company || "—"}</TableCell>
                                    <TableCell>{att.role || "—"}</TableCell>
                                    <TableCell><StatusPill confirmed={att.checked_in} /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AttendeeDialog
                                                mode="edit"
                                                attendee={att}
                                                onSaved={(updated) => setAttendees((prev) => prev.map((x) => x.id === updated.id ? updated : x))}
                                                trigger={<Button size="icon" variant="outline" className="cursor-pointer"><Pencil /></Button>}
                                            />
                                            {att.checked_in ? (
                                                <Button size="sm" variant="outline" className="cursor-pointer"
                                                    onClick={() => toggleCheckIn(att)}>
                                                    Undo
                                                </Button>
                                            ) : (
                                                <Button size="sm" className="bg-[#f15a24] hover:bg-[#f15a24]/90 text-white cursor-pointer"
                                                    onClick={() => toggleCheckIn(att)}>
                                                    Confirm Attendance
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t px-3 py-3 text-sm">
                    <span className="text-muted-foreground">
                        Showing {paged.length} of {filtered.length}{(term || statusFilter !== "all") ? " (filtered)" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                        <span>Page {page} of {totalPages}</span>
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
        </div>
    )
}