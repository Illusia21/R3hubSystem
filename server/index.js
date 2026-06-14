import express from "express"
import cors from "cors"
import { pool } from "./db.js"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// GET all clients (with optional category + search filtering)
app.get("/clients", async (req, res) => {
    try {
        const { category, search } = req.query
        const conditions = []
        const values = []

        if (category && category !== "All Categories") {
            values.push(category)
            conditions.push(`category = $${values.length}`)
        }
        if (search) {
            values.push(`%${search}%`)
            const i = values.length
            conditions.push(
                `(company_name ILIKE $${i} OR first_name ILIKE $${i} OR last_name ILIKE $${i} OR email ILIKE $${i})`
            )
        }

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
        const result = await pool.query(
            `SELECT * FROM clients ${where} ORDER BY id ASC`,
            values
        )
        res.json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch clients" })
    }
})

// GET one client
app.get("/clients/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM clients WHERE id = $1", [
            req.params.id,
        ])
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Client not found" })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch client" })
    }
})

// CREATE a client
app.post("/clients", async (req, res) => {
    try {
        const {
            category, company_name, first_name, middle_initial,
            last_name, suffix, contact_number, email, position,
        } = req.body

        const result = await pool.query(
            `INSERT INTO clients
       (category, company_name, first_name, middle_initial, last_name, suffix, contact_number, email, position)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [category, company_name, first_name, middle_initial, last_name, suffix, contact_number, email, position]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to add client" })
    }
})

// UPDATE a client
app.put("/clients/:id", async (req, res) => {
    try {
        const {
            category, company_name, first_name, middle_initial,
            last_name, suffix, contact_number, email, position,
        } = req.body

        const result = await pool.query(
            `UPDATE clients SET
       category=$1, company_name=$2, first_name=$3, middle_initial=$4,
       last_name=$5, suffix=$6, contact_number=$7, email=$8, position=$9
       WHERE id=$10 RETURNING *`,
            [category, company_name, first_name, middle_initial, last_name, suffix, contact_number, email, position, req.params.id]
        )
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Client not found" })
        res.json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to update client" })
    }
})

// DELETE a client
app.delete("/clients/:id", async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM clients WHERE id = $1 RETURNING *",
            [req.params.id]
        )
        if (result.rows.length === 0)
            return res.status(404).json({ error: "Client not found" })
        res.json({ message: "Client deleted" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to delete client" })
    }
})

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
)