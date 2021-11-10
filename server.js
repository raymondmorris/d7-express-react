/////////////////////////
// Dependencies
/////////////////////////
require("dotenv").config()
// Destructuring pull for PORT (default to 3000)
const {PORT = 3001, DATABASE_URL} = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const morgan = require("morgan")


/////////////////////////
// Connection
/////////////////////////
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
mongoose.connection
.on("open", () => console.log("Connected to mongoose"))
.on("close", () => console.log("Disconnected from mongoose"))
.on("error", (error) => console.log(error))


//////////////////////////
// Model and Schema
/////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String,
}, {timestamps: true})
  
const People = mongoose.model("People", PeopleSchema)

/////////////////////////////////
//Middleware
//////////////////////////////////
app.use(cors()) // prevent cors errors, opens up access for frontend
app.use(morgan("dev")) //logging
app.use(express.json()) // parse json bodies

//////////////////////////
// Routes
/////////////////////////
//Test Route
app.get("/", (req, res) => {
    res.send("Hello World")
})

// Index Route - get - returns all people
app.get("/people", async (req, res) => {
    try {
      res.json(await People.find({}))
    } catch (error) {
      res.status(400).json(error)
    }
})
  
// Create Route - post - creates new person
app.post("/people", async (req, res) => {
    try {
      res.json(await People.create(req.body))
    } catch (error) {
      res.status(400).json(error)
    }
})
  
// Update Route - put - update person
app.put("/people/:id", async (req, res) => {
    try {
      res.json(
        await People.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error)
    }
})
  
// Destroy Route - delete - deletes person
app.delete("/people/:id", async (req, res) => {
    try {
      res.json(await People.findByIdAndRemove(req.params.id))
    } catch (error) {
      res.status(400).json(error)
    }
})






////////////////////////
// Listener
///////////////////////
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})