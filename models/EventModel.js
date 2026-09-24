import {Schema, model} from 'mongoose'

// Design Event Schema
const eventSchema = new Schema({

    title:{
        type:String,
        required:[true, "Event title is required"],
        trim:true,
        minLength:[3, "Minimum length of title is 3"]
    },

    description:{
        type:String,
        required:[true, "Event description is required"],
        trim:true,
        minLength:[10, "Minimum length of description is 10"]
    },

    date:{
        type:Date,
        required:[true, "Event date is required"]
    },

    venue:{
        type:String,
        required:[true, "Event venue is required"],
        trim:true
    },

    capacity:{
        type:Number,
        required:[true, "Event capacity is required"],
        min:[1, "Capacity must be at least 1"]
    },

    status:{
        type:String,
        enum:{
            values:["DRAFT", "PUBLISHED", "CANCELLED"],
            message:"Invalid Event Status"
        },
        default:"DRAFT"
    }

}, {
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

// Create EventModel
export const EventModel = model("event", eventSchema)