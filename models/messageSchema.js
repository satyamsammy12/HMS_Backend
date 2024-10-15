import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [2,"First Name must be greater than 2 characters"],
        maxlength: [10,"First Name must be less than 10 characters"],
        validate: [validator.isAlpha, "First Name should contain only alphabetic characters"]
    }
    , lastName: {
        type: String,
        required: true,
        minlength: [2,"Last Name must be greater than 2 characters"],
        maxlength: [10,"Last Name must be less than 10 characters"],
        validate: [validator.isAlpha, "Last Name should contain only alphabetic characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        required: true,
        minlength: [9,"Phone number must be greater than or equal to 9 characters"],
        maxlength: [10,"Phone number must be less than or equal to 10 characters"],
        validate: [validator.isNumeric, "Phone number should contain only numeric characters"]
    },
    message: {
        type: String,
        required: true,
        minlength: [10,"Message must be greater than 10 characters"],
    }
})
export const Message = mongoose.model("Message", messageSchema);
