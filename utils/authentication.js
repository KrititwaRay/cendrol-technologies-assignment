const CustomError=require('./CustomError');
const asyncErrorHandler=require('./asyncErrorHandler');
const jwt=require('jsonwebtoken');
const User=require('../models/userSchema');


//to check if user is authenticated or not
const isAuthenticated=asyncErrorHandler(async(req,res,next)=>{
    const testToken=req.headers.authorization;
    // console.log(testToken)

    let token;
    
    if(testToken && testToken.startsWith('Bearer')){
        // console.log(testToken.split(' ')[1])
        token= testToken.split(' ')[1];
    }
    // console.log(token)

    if(!token){
        const error=new CustomError('You are not logged in! Please login',401);
       return next(error);
    }

    const decodeData=await jwt.verify(token,"secretString");

    const user= await  User.findById(decodeData.id);

    if(!user){
        const error=new CustomError('The user with the given token does not exixt',401);
        return next(error);
    }
    
    req.user=user;

    next();
})

const isAdminOrNot=(role)=>{ 
    return (req,res,next)=>{
        if(req.user.role!=role){
            return next(new CustomError('You do not have  permission to perform this action',403))
        }
        next();
    }
}


module.exports={
    isAuthenticated,
    isAdminOrNot
}