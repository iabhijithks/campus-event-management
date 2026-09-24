import {Schema, model} from 'mongoose';

// Design User Schema (name, email, password, role, active)
const userSchema = new Schema({
    name:{
        type: String,
        required:[true, "Name of User is required"],
        trim:true
    },
    email:{
        type: String,
        required:[true, "Email is required"],
        unique: [true, "Email already exists"]
    },
    password:{
        type: String,
        required:[true, "Password is required"],
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