require('dotenv').config()
const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const cors=require("cors")
const helmet=require("helmet")
const morgan=require('morgan')
const mongoose = require('mongoose');



//app.use(helmet())

app.use(cors())





mongoose.connect(process.env.MONGO_URl)

if(process.env.NODE_ENV !== 'production'){
    const mdb=mongoose.connection;
    mdb.on("open",()=>{
        console.log('mongo OK')
    })
    mdb.on("error",(error)=>{
        console.log(error)
    })

    app.use(morgan("tiny"))
}



app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

const port=process.env.PORT || 3001

const userRouter=require('./src/routers/user.router')
const ticketRouter=require('./src/routers/ticket.router')

app.use('/v1/user',userRouter)
app.use('/v1/ticket',ticketRouter)


app.use((req,res,next)=>{
    const error=new Error('Ressources not found')
    error.status=404

    next(error)
})

app.use((error,req,res,next)=>{
    handleError(error,res)
})

const handleError=require('./src/utils/errorHandler')

app.listen(port,()=>{
    console.log(`API is ready on http://localhost:${port}`)
})