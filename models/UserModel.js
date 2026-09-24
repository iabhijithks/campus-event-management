import {Schema, model} from 'mongoose'

// Design User Schema
const userSchema = new Schema({

    name:{
        type: String,
        required:[true, "Name of User is required"],
        trim:true,
        match:[
            /^[A-Za-z ]+$/,
            "Name can contain only letters and spaces"
        ]
    },

    email:{
        type: String,
        required:[true, "Email is required"],
        unique: [true, "Email already exists"],
        trim:true,
        lowercase:true,
        match:[
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },

    password:{
        type: String,
        required: [true, "Password is required"],
        minLength:[3, "Minimum length of password is 3"]
    },

    role:{
        type: String,
        enum:{
            values:["USER", "ADMIN"],
            message: "Invalid Role"
        }
    },

    active:{
        type: Boolean,
        default: true
    }

}, {
    versionKey: false,
    timestamps: true,
    strict: "throw"
})

// Create UserModel
export const UserModel = model("user", userSchema)