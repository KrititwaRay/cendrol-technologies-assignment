class CustomError extends Error{
    constructor(message,statsCode){
        super(message);
        this.statsCode=statsCode;
        this.status= statsCode>=400 && statsCode<500 ? 'fail' :'error';
       
        this.isOperational=true; // we will use this custom error class only for operational errror

         Error.captureStackTrace(this,this.constructor);
    }
}

module.exports=CustomError;
