const express=require('express');
const app=express();
const mongoose=require('./database/mongoose');
require('dotenv').config();
const port=process.env.PORT || 3000;
const CustomError=require('./utils/CustomError');
const globalErrorHandler=require('./controller/errorController');

app.use(express.json());
app.use(express.static('assets'));




const userRoute=require('./routes/user');

app.use('/api/v1/users',userRoute);

app.all('*',(req,res,next)=>{
    const error=new CustomError(`can't find ${req.originalUrl} on this server`);
    next(error);
})

app.use(globalErrorHandler);

app.listen(port,()=>console.log(`Server is running on port : ${port}`));