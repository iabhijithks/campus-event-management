import exp from 'express'

import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

import {UserModel} from '../models/UserModel.js'

import {verifyToken} from '../middlewares/verifyTokenMiddleware.js'

import {allowedRoles} from '../middlewares/allowedRolesMiddleware.js'

// create mini-express app

const userApp = exp.Router()

// REGISTER USER

userApp.post("/register", async(req,res)=>{

    try{

        let {name,email,password} = req.body

        if(!password){
            return res.status(400).json({
            success:false,
            message:"Password is required"
             })
        }

        if(password.length < 3){
            return res.status(400).json({
                success:false,
                message:"Minimum length of password is 3"
                })
        }

        let existingUser = await UserModel.findOne({email:email})

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }

        let hashedPassword = await bcrypt.hash(password,10)

        let newUser = await UserModel.create({
            name:name,
            email:email,
            password:hashedPassword,
            role:"USER"
        })

        res.status(201).json({
            success:true,
            message:"User registered successfully",
            data:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role
            }
        })

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:"Error occured",
            reason:error.message
        })

    }

})

// LOGIN USER

userApp.post("/login", async(req,res)=>{

    try{

        let {email,password} = req.body

        let user = await UserModel.findOne({email:email})

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        let passwordMatch = await bcrypt.compare(password,user.password)

        if(!passwordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            })
        }

        if(!user.active){
            return res.status(403).json({
                success:false,
                message:"User account is inactive"
            })
        }

        let token = jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        )

        res.cookie("token",token,{
            httpOnly:true
        })

        res.status(200).json({
            success:true,
            message:"Login successful",
            data:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:"Error occured",
            reason:error.message
        })

    }

})



export {userApp}