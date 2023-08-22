const User=require('../models/userSchema');
const CustomError=require('../utils/CustomError');
const asyncErrorHandler=require('../utils/asyncErrorHandler');
const jwt=require('jsonwebtoken');


const signInToken=(id)=>{
    return jwt.sign({id},"secretString",{expiresIn:'3d'});
}

//POST:create user
module.exports.signUp=asyncErrorHandler( async(req,res)=>{

        const newUser=await User.create({
            name:req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            // profilePicture:"abc",
            password:req.body.password ,
            confirmPassword:req.body.confirmPassword ,
            role:req.body.role
        })
        const token=signInToken(newUser._id);
        return res.status(201).json({
            status:"success",
            token,
            user:newUser
        }) 
})

//POST:login
module.exports.signIn=asyncErrorHandler(async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password){
        const error=new CustomError('please provide email and password to login',400)
       next(error);
    }

    const user=await User.findOne({email}).select('+password');

    const isPasswordCorrect=await user.comparePassword(password,user.password);

    if(!user || !isPasswordCorrect){
        const error=new CustomError("Invalid Username or Password",400);
        return next(error);
    }
    const token=signInToken(user._id);

    return res.status(200).json({
        status:"success",
        token
    })
})

//GET:get a user
//only for authenticated user
module.exports.getAUser=asyncErrorHandler(async(req,res,next)=>{
    
    const  user=await User.findById(req.params.id);
    if(!user){
        const error=new  CustomError("User Not found",400);
        return next(error);
    }

    return res.status(200).json({
        status:"success",
        user
    })

})

//GET:get all users
//only authorised user -admin
module.exports.getAllUser=asyncErrorHandler(async (req,res,next)=>{

    const users=await User.find({}).select("name email mobile")
    return res.status(200).json({
        status:"success",
        users
    })
})



//PUT:update user
//only authorised user -admin
module.exports.updateUser=asyncErrorHandler(async(req,res,next)=>{

    const user=await User.findByIdAndUpdate(req.params.id,{$set:req.body},
        {
            new:true,
            runValidators:true
        });
        if(!user){
            const error=new CustomError("User Not found",400);
            return next(error);
          };
        return res.status(200).json({
            status:"success",
            user
        })
        
})


//PUT:delete user
//only authorised user -admin
module.exports.deleteUser=asyncErrorHandler(async(req,res,next)=>{

        const user=await User.findByIdAndDelete({_id:req.params.id});
        if(!user){
            const error=new CustomError("User Not found",400);
            return next(error);
          };
        return res.status(200).json({
            status:"success",
            message:"user has been deleted"
        })
        
})


module.exports.profilePicture=asyncErrorHandler(async(req,res,next)=>{
  
    const user=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            profilePicture:req.file.filename
        }
    })
    return res.status(200).json({
        status:"success",
        message:"profile picture has been uploaded"
    })
})