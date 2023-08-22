const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide name"],
        maxLenght:[10,"Name should not be cross 10 characters"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Please provide email"],
        lowercase:true,
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email"],
        trim:true
    },
    mobile:{
         type:String,
         required:[true,"Please provide phone number"],
         unique:true,
         trim:true

    },
    profilePicture:{
        type:String
    },
    password:{
        type:String,
        required:[true,"Please enter a Password"],
        minLength:[5,"Password must have 3 characters"],
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,"Please enter confirm password"],
        validate:{
            validator:function (value){
                return value==this.password;
            },
            message:"password and confirm password are not matched"
        }
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    }
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    this.confirmPassword=undefined;
    next();
})

userSchema.methods.comparePassword=async function(pass,passDB){
    return await bcrypt.compare(pass,passDB);
}


const User=mongoose.model('User',userSchema);
module.exports=User;