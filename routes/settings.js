const express = require('express');
const bcrypt = required('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { hash } = require('bcryptjs');
const router = express.Router();

router.post('/update-profile',authMiddleware,async(req,res)=>{
  const {name, email} =req.body;

  try{
    const user = await User.findById(req.user.id);


    if(name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({message: 'Profile updated successfully!'});
  } catch (err){
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});


router.post('/update-password', authMiddleware, async(req,res)=>{
  const {new_password} = req.body;

  try{
    const user=await User.findById(req.user.id);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password,salt);

    user.password=hashedPassword;

    await user.save();
    res.json({message: 'Password updated successfully!'});
  } catch (err){
    console.error(err);
    res.status(500).json({error:'Server error'});
  }
});

module.exports = router;