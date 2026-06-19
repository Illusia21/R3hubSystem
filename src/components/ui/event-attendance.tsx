import { useState, useEffect } from "react"
import { Search, UserRoundPlus, Loader2, ChevronLeft, ChevronRight, Pencil, Users, CircleCheck, CircleCheckBig, Clock, Circle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { API_URL } from "@/lib/api"

type Attendee = {
    id: number
    name: string
    company: string | null
    role: string | null
    contact_number: string | null
    email: string | null
    checked_in: boolean
    checked_in_at: string | null
    is_walk_in: boolean
    created_at: string
}

function StatusPill({ confirmed }: { confirmed: boolean }) {
    return confirmed ? (
        <Badge className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Confirmed
        </Badge>
    ) : (
        <Badge className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            Pending
        </Badge>
    )
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/)
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?"
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-medium break-all">{value || "—"}</span>
        </div>
    )
}

function DetailDialog({ attendee }: { attendee: Attendee }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    title="View details"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-300 cursor-pointer"
                >
                    {getInitials(attendee.name)}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Attendee Details</DialogTitle>
                    <DialogDescription>Full information for this attendee.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 text-sm">
                    <DetailRow label="Name" value={attendee.name} />
                    <DetailRow label="Company" value={attendee.company} />
                    <DetailRow label="Role" value={attendee.role} />
                    <DetailRow label="Contact Number" value={attendee.contact_number} />
                    <DetailRow label="Email" value={attendee.email} />
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <StatusPill confirmed={attendee.checked_in} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function StatCard({ icon: Icon, iconClass, label, value, valueClass, badge, badgeClass, progress, barClass }: {
    icon: LucideIcon
    iconClass: string
    label: string
    value: number
    valueClass: string
    badge: string
    badgeClass: string
    progress: number
    barClass: string
}) {
    return (
        <Card>
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${iconClass}`}>
                        <Icon className="size-5" />
                    </div>
                    <Badge className={`rounded-full border-transparent ${badgeClass}`}>
                        {badge}
                    </Badge>
                </div>
                <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground">{label}</p>
                    <p className={`mt-1 text-3xl font-bold ${valueClass}`}>{value}</p>
                </div>
                <Progress value={progress} className={`h-1.5 bg-muted ${barClass}`} />
            </CardContent>
        </Card>
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
        contact_number: attendee?.contact_number ?? "",
        email: attendee?.email ?? "",
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
                contact_number: attendee?.contact_number ?? "",
                email: attendee?.email ?? "",
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
                    <Field>
                        <FieldLabel>Contact Number</FieldLabel>
                        <Input value={form.contact_number} placeholder="09XXXXXXXXX"
                            onChange={(e) => setForm((f) => ({ ...f, contact_number: e.target.value }))} />
                    </Field>
                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input type="email" value={form.email} placeholder="name@example.com"
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
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
    const confirmedPct = total ? Math.round((confirmed / total) * 100) : 0
    const remainingPct = total ? Math.round((remaining / total) * 100) : 0

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
                <StatCard
                    icon={Users}
                    iconClass="bg-slate-100 text-slate-500"
                    label="TOTAL ATTENDEES"
                    value={total}
                    valueClass="text-slate-500"
                    badge="TARGET"
                    badgeClass="bg-slate-100 text-slate-500"
                    progress={100}
                    barClass="[&>div]:bg-slate-500"
                />
                <StatCard
                    icon={CircleCheck}
                    iconClass="bg-green-100 text-green-700"
                    label="CONFIRMED"
                    value={confirmed}
                    valueClass="text-green-700"
                    badge={`${confirmedPct}% COMPLETE`}
                    badgeClass="bg-green-100 text-green-700"
                    progress={confirmedPct}
                    barClass="[&>div]:bg-green-600"
                />
                <StatCard
                    icon={Clock}
                    iconClass="bg-muted text-muted-foreground"
                    label="REMAINING"
                    value={remaining}
                    valueClass="text-[#0F2342]"
                    badge="PENDING"
                    badgeClass="bg-muted text-muted-foreground"
                    progress={remainingPct}
                    barClass="[&>div]:bg-[#0F2342]"
                />
            </div>

            {/* One unified card: toolbar header + name list + pagination */}
            <div className="mx-auto w-full max-w-3xl rounded-md border bg-card">
                {/* Toolbar header band */}
                <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="bg-[#f6f7f9] pl-9" placeholder="Search attendee name or company..."
                            value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div className="flex gap-2">
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
                </div>

                {/* Name-only list */}
                <div>
                    {paged.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">No attendees found.</div>
                    ) : (
                        paged.map((att) => (
                            <div
                                key={att.id}
                                className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <DetailDialog attendee={att} />
                                    <span className="font-medium">{att.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AttendeeDialog
                                        mode="edit"
                                        attendee={att}
                                        onSaved={(updated) => setAttendees((prev) => prev.map((x) => x.id === updated.id ? updated : x))}
                                        trigger={<Button size="icon" variant="outline" className="cursor-pointer"><Pencil /></Button>}
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="cursor-pointer"
                                        title={att.checked_in ? "Confirmed — click to undo" : "Confirm attendance"}
                                        onClick={() => toggleCheckIn(att)}
                                    >
                                        {att.checked_in ? (
                                            <CircleCheckBig className="text-green-600" />
                                        ) : (
                                            <Circle className="text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

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