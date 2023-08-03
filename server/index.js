const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())

app.use(bodyParser.json());

const pool = new Pool({
    user: "phitran",
    host: "localhost",
    database: "phitran",
    port: "5432"
});

app.get("/api/getList", (req, res) => {
    pool.query("SELECT * FROM chores", (error, result) => {
        if (error) {
            console.log("Error Executing Query", error)
            res.status(500).json({ error: "Internal Server Error" })
            return
        }
        res.json(result.rows)
    })
})

app.put("/api/updateList/:id", async (req, res) => {
    console.log("req is", req.body)
    try {
        const { id } = req.params;
        const { todo, due } = req.body;

        //UPDATE ITEMS IN DB
        const updateQuery = "UPDATE chores SET todo = $1, due = $2 WHERE id = $3";
        await pool.query(updateQuery, [todo, due, id]);
        res.json({ message: "Item updated successfully" })

    } catch (error) {
        console.log("Error Updating Query", error)
        res.status(500).json({ error: "Internal Server Error" })
        return;
    }
})

app.post("/api/addNew", (req, res) => {
    const { todo, due } = req.body
    console.log("req", req.body)
    pool.query("INSERT INTO chores (todo, due) VALUES ($1, $2)", [todo, due], (error, result) => {
        if (error) {
            console.log("Error executing query", error)
            res.status(500).json({ message: "Internal Server Error" })
            return
        }
        res.json({ message: "Data Inserted Successfully" })
    })
})

app.delete("/api/deleteChore:id", (req, res) => {
    const id = req.params.id
    console.log("req.param", req.params.id)
    pool.query("DELETE FROM chores WHERE id=$1", [id], (error, result) => {
        if (error) {
            console.log("Error Executing Query", error)
            res.status(500).json({ message: "Internal Server Error" })
            return
        }
        res.json({ message: "Data Delete Successfully" })
    })
})

// LISTEN TO THE SERVER
app.listen(PORT, () => {
    console.log("Server listening on", PORT)

})