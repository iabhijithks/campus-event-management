import {Schema, model} from 'mongoose'

// Design Registration Schema
const registrationSchema = new Schema({

    userId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:[true, "User ID is required"]
    },

    eventId:{
        type:Schema.Types.ObjectId,
        ref:"event",
        required:[true, "Event ID is required"]
    },

    teamName:{
        type:String,
        required:[true, "Team name is required"],
        trim:true,
        minLength:[2, "Team name must be at least 2 characters"]
    },

    status:{
        type:String,
        enum:{
            values:["REGISTERED", "CANCELLED"],
            message:"Invalid Registration Status"
        },
        default:"REGISTERED"
    }

}, {
    versionKey:false,
    timestamps:true,
    strict:"throw"
})

// Create RegistrationModel
export const RegistrationModel = model("registration", registrationSchema)