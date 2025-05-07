const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config();
const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000



app.use(express.json({ limit: '10mb' }))
app.use(cors())

console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL)
    .then((con)=>console.log(`MongoDB is connected to the host :${con.connection.name}`))
    .catch((err)=>{
        console.log(err)
    })
app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})
