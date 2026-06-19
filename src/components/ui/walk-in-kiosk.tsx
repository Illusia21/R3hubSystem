import { useState, type ChangeEvent } from "react";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, UserRoundPlus } from "lucide-react";

type FormState = {
    name: string;
    company: string;
    role: string;
    contact_number: string;
    email: string;
};

const EMPTY: FormState = { name: "", company: "", role: "", contact_number: "", email: "" };

export default function WalkInKiosk() {
    const [form, setForm] = useState<FormState>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const set = (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async () => {
        setError("");
        if (!form.name.trim()) {
            setError("Please enter your name.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/attendees`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    company: form.company.trim(),
                    role: form.role.trim(),
                    contact_number: form.contact_number.trim(),
                    email: form.email.trim(),
                    is_walk_in: true,
                }),
            });
            if (!res.ok) throw new Error("Request failed");
            setDone(true);
        } catch {
            setError("Something went wrong. Please tell the staff or try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const registerAnother = () => {
        setForm(EMPTY);
        setDone(false);
        setError("");
    };

    if (done) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0F2342] p-6">
                <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-xl">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0F2342]">You're registered!</h1>
                    <p className="mt-2 text-muted-foreground">
                        Thanks for joining us. Please hand the laptop back to our team.
                    </p>
                    <Button
                        onClick={registerAnother}
                        className="mt-8 w-full bg-[#f15a24] py-6 text-base hover:bg-[#d94e1c]"
                    >
                        Register another guest
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0F2342] p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f15a24]/10">
                        <UserRoundPlus className="h-7 w-7 text-[#f15a24]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0F2342]">Walk-in Registration</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Please enter your details below.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                        <Input id="name" value={form.name} onChange={set("name")} placeholder="Juan Dela Cruz" className="py-6 text-base" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" value={form.company} onChange={set("company")} placeholder="Company name" className="py-6 text-base" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="role">Designation</Label>
                        <Input id="role" value={form.role} onChange={set("role")} placeholder="e.g. IT Manager" className="py-6 text-base" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input id="contact" value={form.contact_number} onChange={set("contact_number")} placeholder="09XXXXXXXXX" className="py-6 text-base" />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" className="py-6 text-base" />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-[#f15a24] py-6 text-base hover:bg-[#d94e1c]">
                        {submitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>
                        ) : (
                            "Submit Registration"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}