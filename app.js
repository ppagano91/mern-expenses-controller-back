const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const errorHandler = require('./middlewares/errorHandlerMiddleware');
const app = express()
//desarrolloppagano91
//bU4kU51OTWnaRG5d
//url: mongodb+srv://desarrolloppagano91:bU4kU51OTWnaRG5d@mern-expenses-cluster.3hyaoin.mongodb.net/?retryWrites=true&w=majority&appName=mern-expenses-cluster
mongoose
    .connect('mongodb://localhost:27017/mern-expenses', {family:4})
    .then(() => {
        console.log("| Database Connected\t\t\t✔ |")
        console.log("===========================================")
    }).catch((e) => console.log(e))

// CORS Config
const corsOptions = {
    origin: ['http://localhost:5173']
}

app.use(cors(corsOptions))

// Middlewares
app.use(express.json())

// Routes
app.use('/api/v1/users',userRouter)
app.use('/api/v1/categories',categoryRouter)
app.use('/api/v1/transactions',transactionRouter)

// Errors
app.use(errorHandler)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("===========================================")
    console.log(`| Server is running in port ${PORT}\t✔ |`)
    console.log("-------------------------------------------")
})