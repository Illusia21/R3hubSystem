import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// The shape of one client. This matches your future `clients` table columns.
type Client = {
    id: number
    category: string
    companyName: string
    clientName: string
    contactNumber: string
    email: string
    position: string
}

// Temporary mock data — this will come from your API later.
const clients: Client[] = [
    {
        id: 1,
        category: "Multi-Purpose Cooperative & Bank",
        companyName: "Agdao Coop",
        clientName: "Ramon Jr. Gonzales",
        contactNumber: "09938259712",
        email: "gonzalesramon14344@gmail.com",
        position: "I.T Manager",
    },
    {
        id: 2,
        category: "Agriculture & Energy",
        companyName: "Anas Breeders Farms Inc.",
        clientName: "Williard Pernia IV",
        contactNumber: "09091293125",
        email: "wvpernia4@abfi.com.ph",
        position: "IT Manager",
    },
    {
        id: 3,
        category: "BPO",
        companyName: "ARC PH",
        clientName: "Francy Rey Pilapil",
        contactNumber: "09514133229",
        email: "it@arcphbpo.com",
        position: "IT",
    },
]

export function ClientTable() {
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
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client) => (
                        <TableRow key={client.id}>
                            <TableCell>{client.category}</TableCell>
                            <TableCell>{client.companyName}</TableCell>
                            <TableCell>{client.clientName}</TableCell>
                            <TableCell>{client.contactNumber}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.position}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button size="icon" variant="outline">
                                        <Pencil />
                                    </Button>
                                    <Button size="icon" variant="destructive">
                                        <Trash2 />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}