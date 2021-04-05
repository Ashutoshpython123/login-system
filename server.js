//import all required libraries
require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const CookieParser = require('cookie-parser')
const path = require('path')


//App Config
const app = express()
app.use(express.json())
app.use(cors())
app.use(CookieParser())



//Routes
app.use('/api', require('./routes'))

//Db Config
const connection_url = 'mongodb+srv://demo:TD9XnR4R8XcyITI0@cluster0.0s8hw.mongodb.net/demodb?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})


//listener
const port = 8001
app.listen(port, () => {
    console.log(`listening port localhost : ${port}`)
})