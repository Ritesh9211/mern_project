const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

dotenv.config({path:"./config.env"}); //no need to mention this path in every file

require('./db/conn');
// const User = require("./model/userSchema");
app.use(express.json());//to read json for  file
app.use(cookieParser());

app.use(require('./router/auth')) //linked router files

const PORT = process.env.PORT;







// app.get('/about',middleware,(req,res)=>{
//     res.send("about page");
// });
// app.get('/contact',(req,res)=>{
//     res.send("contact page");
// });
app.get('/login',(req,res)=>{
    res.send("login page");
});
app.get('/signup',(req,res)=>{
    res.send("signup page");
});

app.listen(PORT, ()=>{
    console.log(`server running at ${PORT}`)
})