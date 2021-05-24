const jwt = require('jsonwebtoken');
// const cookieParser = require("cookie-parser");
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");
require('../db/conn');
const User = require('../model/userSchema');

router.get('/',(req,res)=>{
    res.send("Home page from router");
});


router.post('/register', async (req, res) => {
  

    const {name, email, phone, work, password, cpassword } = req.body; 
    if(!name || !email || !phone || !work || !password ||  !cpassword ){
    
        return res.status(422).json({error: "Fill the form"});
    }
try{
    
const userExist =  await User.findOne({email:email});
    
if(userExist){
    return res.status(422).json({error: "Email already exist"});
    }
    else if(password != cpassword){
        return res.status(422).json({error: "Password not matched"});
    }
    else{
        // const user = new User(req.body);
        const user = new User({name, email, phone, work, password, cpassword });
        //hashing password 
        
    
        await user.save();
        res.status(201).json({message : "user registered sucessfuly"});

    }


    
                                        
}

catch(err){
    console.log(err);
}


});

//login route

router.post('/signin',async (req, res) => {
    
    try{
        let token;
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({error:"plz fill the form"});

        }
        const userLogin = await User.findOne({email:email});
        // console.log(userLogin);

        
        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password); //comparing saved password with current typre password
           
            token = await userLogin.generateAuthToken();
            console.log(token);
            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 300000),
                httpOnly:true
            });


            if(!isMatch){
                res.status(400).json({error:"Invalid Credentials.Please check your email and password"});
            }
            else{
                res.json({message : "user signin successfully"});
            }
        }
        else{
            res.status(400).json({error:"Invalid Credentials.Please check your email and password"});
        }

       
        

    }catch(err){
        console.log(err);
    }
})

// router.use(cookieParser);
    

//about page

router.get('/about',authenticate,(req,res)=>{
    res.send(req.rootUser);
});


//get user data for contact and home page
router.get('/getdata', authenticate ,(req,res)=> {
    // console.log("Hellow world");
    res.send(req.rootUser);
})

//contact use page 
router.post('/contact',authenticate,async (req,res)=>{
    try{
        const {name, email, phone, message} = req.body;
        if(!name || !email || !phone || !message){
            console.log("error in contact form");
            return res.json({error:"Plzz fill the contact form"});
        }

        const userContact = await User.findOne({_id: req.userID });
        if(userContact){
            const userMessage = await userContact.addMessage(name, email, phone , message);
            await userContact.save();
            res.status(201).json({message:"User Contact Successful"});
        }
    }catch(error){
        console.log(error);
    }
});
module.exports = router;