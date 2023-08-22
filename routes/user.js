const express=require('express');
const router=express.Router();

const multer=require('multer');
const path=require('path');

const userController=require('../controller/userController');

const {isAuthenticated,isAdminOrNot}=require('../utils/authentication');




//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..','./assets/uploades'))
    },
    filename: function (req, file, cb) {
        // console.log(file);
      const uniqueSuffix = file.fieldname + '-' +Date.now()
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
   
  })
  const upload = multer({ storage: storage });


router.post('/sign-up',userController.signUp);


router.post('/sign-in',userController.signIn);

router.get('/all',isAuthenticated,isAdminOrNot("admin"),userController.getAllUser);

router.get('/:id',isAuthenticated,userController.getAUser);

router.put('/:id',isAuthenticated,isAdminOrNot("admin"),userController.updateUser);

router.delete('/:id',isAuthenticated,isAdminOrNot("admin"),userController.deleteUser);

router.post('/profile-picture/:id',isAuthenticated,upload.single('image'),userController.profilePicture);





module.exports=router;