const express=require('express')
const router=express.Router()
const {insertUser,getUserByEmail,getUserById,updatePassword}=require('../model/user/User.model')
const {hashPassword,comparePassword}=require('../helpers/bcrypt.helper')
const { json } = require('body-parser')

router.all('/',(req,res,next)=>{
    //res.json({message:'return from user router'})
    next()
})
router.get("/", async (req, res) => {
    try {
        // This data is coming from the query parameters
        const _id = req.query._id;

        const userProf = await getUserById(_id);
        if (!userProf) {
            return res.status(404).json({ message: "User not found" });
        }
        const { name, email } = userProf;
        res.json({
            user: {
                _id,
                name,
                email,
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
/*router.get('/',async(req,res)=>{
    try {
        // Fetch all users from the database
        const users = await User.find();
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})*/

router.post('/', async (req,res)=>{
    const {name,company,address,phone,email,password} =req.body


    try{
        const hashedPass=await hashPassword(password)
        const newUserObj ={
            name,company,address,phone,email, password: hashedPass
        }

        const result= await insertUser(newUserObj)
  
        res.json({ message :' ALL OK'})
    }catch (error){
        res.json({ status:'error', message : error.message})
    }
    
})


router.post('/login',async (req,res)=>{

    const {email,password}=req.body
    const user= await getUserByEmail(email)
    const passFromDb=user && user._id ? user.password : null;
    
    
    if (!email || !password){
       return res.json({status:"Error",message:"Invalid Submition"})
    }

    
    console.log(user)

   if(!passFromDb) return res.json({status:"Error",message:"Invalid Submition"});
    
  
    const result= await comparePassword(password,passFromDb);

    if (!result){

    return res.json({status:"Error",message:"Invalid Submition"})
    }


    console.log(result);

    res.json({user,status:"Success"})
})

router.patch("/reset-password", async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      // Hash the new password
      const newHashedPass = await hashPassword(newPassword);
  
      // Update the password in the database
      const updatedUser = await updatePassword(email, newHashedPass);
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports=router;