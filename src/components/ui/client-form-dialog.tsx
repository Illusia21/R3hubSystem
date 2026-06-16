import { API_URL } from "@/lib/api"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Combobox, ComboboxContent, ComboboxEmpty,
    ComboboxInput, ComboboxItem, ComboboxList,
} from "@/components/ui/combobox"
import { toast } from "sonner"
import {
    companies
} from "@/data/options"

export type Client = {
    id: number
    category: string
    company_name: string
    first_name: string
    middle_initial: string | null
    last_name: string
    suffix: string | null
    contact_number: string | null
    email: string | null
    position: string
    created_at: string   // <-- add this line
}

const categories = [
    "PRIVATE EDUCATION", "PUBLIC EDUCATION", "GOVERNMENT",
    "AGRICULTURE & ENERGY", "CONSTRUCTION", "HEALTHCARE",
    "LOGISTICS - RETAIL - HOSPITALITY & TOURISM",
    "MULTI - PURPOSE COOPERATIVE & BANK",
]

const positions = [
    "IT Manager", "IT Specialist", "Sr. System Administrator",
    "DBA & InfoSec", "Lead Infra & Cybersecurity",
]

function FieldCombobox({ items, placeholder, value, onValueChange }: {
    items: string[]; placeholder: string; value: string; onValueChange: (v: string) => void
}) {
    return (
        <Combobox items={items} value={value} onValueChange={(v) => onValueChange(v ?? "")}>
            <ComboboxInput placeholder={placeholder} />
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

type FormState = {
    category: string; company_name: string; first_name: string; middle_initial: string
    last_name: string; suffix: string; contact_number: string; email: string; position: string
}

function toForm(client?: Client): FormState {
    return {
        category: client?.category ?? "",
        company_name: client?.company_name ?? "",
        first_name: client?.first_name ?? "",
        middle_initial: client?.middle_initial ?? "",
        last_name: client?.last_name ?? "",
        suffix: client?.suffix ?? "",
        contact_number: client?.contact_number ?? "",
        email: client?.email ?? "",
        position: client?.position ?? "",
    }
}

export function ClientFormDialog({ mode, client, onSaved, trigger }: {
    mode: "add" | "edit"
    client?: Client
    onSaved: () => void
    trigger: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState<FormState>(toForm(client))
    const [errorMsg, setErrorMsg] = useState("")
    const [saving, setSaving] = useState(false)

    const update = (field: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }))

    // Re-load the client's data each time the dialog opens
    function handleOpenChange(next: boolean) {
        setOpen(next)
        if (next) {
            setForm(toForm(client))
            setErrorMsg("")
        }
    }

    async function handleSubmit() {
        if (!form.category || !form.company_name || !form.first_name || !form.last_name || !form.position) {
            setErrorMsg("Please fill in all required fields.")
            return
        }
        if (!/^09\d{9}$/.test(form.contact_number)) {
            setErrorMsg("Contact number must be 11 digits starting with 09.")
            return
        }

        setSaving(true)
        const payload = {
            ...form,
            email: form.email.trim() || "unknown@unknown.com",
            middle_initial: form.middle_initial || null,
            suffix: form.suffix || null,
        }
        const url = mode === "add"
            ? `${API_URL}/clients`
            : `${API_URL}/clients/${client!.id}`
        const method = mode === "add" ? "POST" : "PUT"

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error("Failed")
            setOpen(false)
            onSaved()
            if (mode === "add") {
                toast.success("Client added")     // 🟢 green
            } else {
                toast.info("Client updated")      // 🔵 blue
            }
        } catch {
            setErrorMsg("Something went wrong while saving.")
            toast.error("Couldn't save client")
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange} modal={false}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add Client" : "Edit Client"}</DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "Add client details to R3hub database."
                            : "Update this client's details."}
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <FieldLabel>Category</FieldLabel>
                        <FieldCombobox items={categories} placeholder="-- Select Category --"
                            value={form.category} onValueChange={(v) => update("category", v)} />
                    </Field>
                    <Field>
                        <FieldLabel>Company Name</FieldLabel>
                        <Input list="company-options" value={form.company_name}
                            onChange={(e) => update("company_name", e.target.value)}
                            placeholder="Type or pick a company" />
                        <datalist id="company-options">
                            {companies.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </Field>

                    <FieldGroup className="grid grid-cols-4 gap-2">
                        <Field>
                            <FieldLabel>First Name</FieldLabel>
                            <Input value={form.first_name} onChange={(e) => update("first_name", e.target.value)} placeholder="Jordan" />
                        </Field>
                        <Field>
                            <FieldLabel>M.I.</FieldLabel>
                            <Input value={form.middle_initial}
                                onChange={(e) => update("middle_initial", e.target.value.slice(0, 1).toUpperCase())} placeholder="L" />
                        </Field>
                        <Field>
                            <FieldLabel>Last Name</FieldLabel>
                            <Input value={form.last_name} onChange={(e) => update("last_name", e.target.value)} placeholder="Lee" />
                        </Field>
                        <Field>
                            <FieldLabel>Suffix</FieldLabel>
                            <Input value={form.suffix} onChange={(e) => update("suffix", e.target.value)} placeholder="Jr." />
                        </Field>
                    </FieldGroup>

                    <Field>
                        <FieldLabel>Contact Number</FieldLabel>
                        <Input value={form.contact_number} inputMode="numeric" placeholder="09XXXXXXXXX"
                            onChange={(e) => update("contact_number", e.target.value.replace(/\D/g, "").slice(0, 11))} />
                    </Field>
                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" />
                    </Field>
                    <Field>
                        <FieldLabel>Position</FieldLabel>
                        <Input list="position-options" value={form.position}
                            onChange={(e) => update("position", e.target.value)}
                            placeholder="Type or pick a position" />
                        <datalist id="position-options">
                            {positions.map((p) => <option key={p} value={p} />)}
                        </datalist>
                    </Field>

                    {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
                </FieldGroup>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="cursor-pointer">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={saving} className="bg-[#0F2342] hover:bg-[#0F2342]/80 cursor-pointer">
                        {saving ? "Saving..." : mode === "add" ? "Add Client" : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}