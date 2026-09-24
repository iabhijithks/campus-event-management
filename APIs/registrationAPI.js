import exp from 'express'

import {RegistrationModel} from '../models/RegistrationModel.js'

import {EventModel} from '../models/EventModel.js'

import {verifyToken} from '../middlewares/verifyTokenMiddleware.js'

import {allowedRoles} from '../middlewares/allowedRolesMiddleware.js'

// create mini-express app

const registrationApp = exp.Router()

// REGISTER FOR EVENT

registrationApp.post("/events/:eventId/register", verifyToken, allowedRoles("USER"), async(req,res)=>{

    try{

        let eventId = req.params.eventId
        let userId = req.user.id

        // Check whether event exists

        let event = await EventModel.findById(eventId)

        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            })
        }

        // Check event status

        if(event.status !== "PUBLISHED"){
            return res.status(400).json({
                success:false,
                message:"Registration is not available for this event"
            })
        }

        // Check whether user already registered

        let existingRegistration = await RegistrationModel.findOne({
            userId:userId,
            eventId:eventId,
            status:"REGISTERED"
        })

        if(existingRegistration){
            return res.status(400).json({
                success:false,
                message:"User already registered for this event"
            })
        }

        // Check capacity

        let registeredUsers = await RegistrationModel.countDocuments({
            eventId:eventId,
            status:"REGISTERED"
        })

        if(registeredUsers >= event.capacity){
            return res.status(400).json({
                success:false,
                message:"Event capacity is full"
            })
        }

        // Create registration

        let newRegistration = await RegistrationModel.create({
            userId:userId,
            eventId:eventId
        })

        res.status(201).json({
            success:true,
            message:"Event registration successful",
            data:newRegistration
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

// VIEW MY REGISTRATIONS

registrationApp.get("/my-registrations", verifyToken, allowedRoles("USER"), async(req,res)=>{

    try{

        let userId = req.user.id

        let registrations = await RegistrationModel.find({
            userId:userId
        })
        .populate("eventId", "title description date venue status")

        res.status(200).json({
            success:true,
            message:"List of my registrations",
            data:registrations
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

// CANCEL EVENT REGISTRATION

registrationApp.put("/events/:eventId/cancel", verifyToken, allowedRoles("USER"), async(req,res)=>{

    try{

        let eventId = req.params.eventId
        let userId = req.user.id

        let registration = await RegistrationModel.findOne({
            userId:userId,
            eventId:eventId,
            status:"REGISTERED"
        })

        if(!registration){
            return res.status(404).json({
                success:false,
                message:"Active registration not found"
            })
        }

        registration.status = "CANCELLED"

        await registration.save()

        res.status(200).json({
            success:true,
            message:"Event registration cancelled successfully",
            data:registration
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

// ADMIN - VIEW ALL REGISTRATIONS
registrationApp.get("/all-registrations", verifyToken, allowedRoles("ADMIN"), async(req,res)=>{
    try{
        let registrations = await RegistrationModel.find()
            .populate("userId", "name email")
            .populate("eventId", "title date venue status")

        res.status(200).json({
            success:true,
            message:"List of all registrations",
            data:registrations
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

// ADMIN - UPDATE REGISTRATION STATUS
registrationApp.put("/registrations/:registrationId/status", verifyToken, allowedRoles("ADMIN"), async(req,res)=>{
    try{
        let registrationId = req.params.registrationId
        let {status} = req.body

        if(status !== "REGISTERED" && status !== "CANCELLED"){
            return res.status(400).json({
                success:false,
                message:"Invalid registration status"
            })
        }

        let registration = await RegistrationModel.findById(registrationId)

        if(!registration){
            return res.status(404).json({
                success:false,
                message:"Registration not found"
            })
        }

        registration.status = status
        await registration.save()

        res.status(200).json({
            success:true,
            message:"Registration status updated successfully",
            data:registration
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

export {registrationApp}