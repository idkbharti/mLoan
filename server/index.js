const express = require('express')
const bodyParser = require("body-parser")
require('dotenv').config()
const cors = require("cors")
const userRouter = require("./routes/user")
const connectToDb = require('./lib/connect')

const PORT = process.env.PORT || 3333

const app = express()
app.use(cors())
app.use(bodyParser.json());
connectToDb(process.env.MURI)

app.use(bodyParser.json())
app.use("/api",userRouter)

app.listen(PORT, ()=>{`server is running at PORT${PORT}`})