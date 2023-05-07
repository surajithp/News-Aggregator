const mongoose = require("mongoose");
const { Bool } = require("mongoose/lib/schema/index");
const userSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            //this will trim all the spaces for us
            //in case we get wrong input from frontend
            trim: true,
            required:true,
        },
        lastName:{
            type: String,
            trim:true,
            required:true,
        },
        email:{
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        password:{
            type: String,
            required: true,
        },
        verified:{
            type: Boolean,
            default: false,
        },
        phone:{
            type: String,
        //password can be 10 digits, between 0 and 9 (number)
            match: /^[0-9]{10}$/,
        },
        preferences: {
            type: String
        },
        resetPasswordLink:{
            data: String,
            default:'',
        }
    },
    {timestamps: true}
);

const validate = (user) => {
    const schema = Joi.object({
      firstName: Joi.string().min(3).max(255).required(),
      lastName: Joi.string().min(3).max(255).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(3).max(255).required()
    });
    return schema.validate(user);
  };
  
const User = mongoose.model("User", userSchema);

module.exports = {
    User,
    validate
}