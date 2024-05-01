const express = require('express');
const mongoose = require('mongoose')
const userRouter = require('./routes/userRoutes')
const errorHandler = require('./middlewares/errorHandlerMiddleware')
const app = express()
//desarrolloppagano91
//bU4kU51OTWnaRG5d
//url: mongodb+srv://desarrolloppagano91:bU4kU51OTWnaRG5d@mern-expenses-cluster.3hyaoin.mongodb.net/?retryWrites=true&w=majority&appName=mern-expenses-cluster
mongoose
    .connect('mongodb://localhost:27017/mern-expenses', {family:4})
    .then(() => console.log("DB Connected")).catch((e) => console.log(e))

app.use(express.json())

app.use('/api/v1/users',userRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`))