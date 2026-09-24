import exp from 'express'

import {EventModel} from '../models/EventModel.js'

import {verifyToken} from '../middlewares/verifyTokenMiddleware.js'

import {allowedRoles} from '../middlewares/allowedRolesMiddleware.js'

// create mini-express app

const eventApp = exp.Router()

// CREATE EVENT - ADMIN ONLY

eventApp.post("/events", verifyToken, allowedRoles("ADMIN"), async(req,res)=>{

    try{

        let newEvent = req.body

        let event = await EventModel.create(newEvent)

        res.status(201).json({
            success:true,
            message:"Event created successfully",
            data:event
        })

    }
    catch(error){

        res.status(400).json({
            success:false,
            message:"Error occured",
            reason:error.message
        })

    }

})

// GET PUBLISHED EVENTS

eventApp.get("/events", verifyToken, async(req,res)=>{

    try{

        let events = await EventModel.find({status:"PUBLISHED"})

        res.status(200).json({
            success:true,
            message:"List of published events",
            data:events
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

// ADMIN - UPDATE EVENT
eventApp.put("/events/:eventId", verifyToken, allowedRoles("ADMIN"), async(req,res)=>{
    try{
        let eventId = req.params.eventId
        let modifiedEvent = req.body

        let event = await EventModel.findById(eventId)

        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            })
        }

        let updatedEvent = await EventModel.findByIdAndUpdate(
            eventId,
            modifiedEvent,
            {new:true, runValidators:true}
        )

        res.status(200).json({
            success:true,
            message:"Event updated successfully",
            data:updatedEvent
        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"Error occured",
            reason:error.message
        })
    }
})

// ADMIN - CANCEL EVENT
eventApp.put("/events/:eventId/cancel", verifyToken, allowedRoles("ADMIN"), async(req,res)=>{
    try{
        let eventId = req.params.eventId

        let event = await EventModel.findById(eventId)

        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            })
        }

        event.status = "CANCELLED"
        await event.save()

        res.status(200).json({
            success:true,
            message:"Event cancelled successfully",
            data:event
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

// ADMIN - PUBLISH EVENT
eventApp.put("/events/:eventId/publish", verifyToken, allowedRoles("ADMIN"), async(req,res)=>{
    try{
        let eventId = req.params.eventId

        let event = await EventModel.findById(eventId)

        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            })
        }

        event.status = "PUBLISHED"
        await event.save()

        res.status(200).json({
            success:true,
            message:"Event published successfully",
            data:event
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

// ADMIN - VIEW ALL EVENTS
eventApp.get("/admin/events", verifyToken, allowedRoles("ADMIN"), async(req,res)=>{
    try{
        let events = await EventModel.find()

        res.status(200).json({
            success:true,
            message:"List of all events",
            data:events
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

export {eventApp}