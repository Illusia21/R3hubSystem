import { categories, companies, positions } from "@/data/options"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"

import { UserRoundPlus } from 'lucide-react';

type SearchableComboboxProps = {
    items: readonly string[]
    placeholder?: string
    value?: string | null
    onValueChange?: (value: string | null) => void
}

export function SearchableCombobox({
    items,
    placeholder = "-- Select --",
    value,
    onValueChange,
}: SearchableComboboxProps) {
    return (
        <Combobox items={items} value={value} onValueChange={onValueChange}>
            <ComboboxInput placeholder={placeholder} />
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}

export function InputInline() {
    return (
        <Field orientation="horizontal">
            <Input type="search" placeholder="Search..." className="w-70" />
            <Button className="bg-[#0F2342] cursor-pointer hover:bg-[#F15A24]">Search</Button>
        </Field>
    )
}

export function InputGrid() {
    return (
        <FieldGroup className="grid max-w-xl grid-cols-4">
            <Field>
                <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                <Input id="first-name" placeholder="Jordan" />
            </Field>
            <Field>
                <FieldLabel htmlFor="middle-intial">Middle Initial</FieldLabel>
                <Input id="middle-intial" placeholder="Jordan" />
            </Field>
            <Field>
                <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                <Input id="last-name" placeholder="Lee" />
            </Field>
            <Field>
                <FieldLabel htmlFor="Suffix">Suffix</FieldLabel>
                <Input id="Suffix" placeholder="Lee" />
            </Field>
        </FieldGroup>
    )
}


export function Tabletoolbar() {
    return (
        <div className="flex justify-between mb-4 gap-2">
            <div>
                <Dialog modal={false}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="cursor-pointer">
                            <UserRoundPlus />
                            Add Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Add Client</DialogTitle>
                            <DialogDescription>
                                Add client details to R3hub database.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label>Category</Label>
                                <SearchableCombobox items={categories} placeholder="-- Select Category --" />

                            </Field>
                            <Field>
                                <Label htmlFor="name-1">Company Name</Label>
                                <SearchableCombobox items={companies} placeholder="-- Select Category --" />

                            </Field>
                            <Field>
                                <InputGrid />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="form-phone">Phone</FieldLabel>
                                <Input id="form-phone" type="tel" placeholder="+63 9XX XXX XXX" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="form-email">Email</FieldLabel>
                                <Input id="form-email" type="email" placeholder="john@example.com" />
                            </Field>
                            <Field>
                                <Label>Position</Label>
                                <SearchableCombobox items={positions} placeholder="-- Select Category --" />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div>
                <InputInline />
            </div>
        </div>
    )
}


