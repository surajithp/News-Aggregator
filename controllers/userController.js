const User = require("../models/userModel");
const axios = require("axios") 

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { registerValidation, loginValidation } = require("../middleware/validation");
const JWT_KEY = process.env.JWT_KEY;

exports.signUp = async (req, res, next) => {
   const { error, value } = registerValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);
 
   const emailExist = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
   if (emailExist) return res.status(400).send({ message: "Email already exists!" });
 
   try {
     const newUser = await createUserObj(req);
     const savedUser = await User.create(newUser);
     return res.status(200).send({ message: "User created successfully!", user: savedUser });
   } catch (err) {
     return res.status(400).send({ error: "User created successfully!", error: err });
   }
 };
 
 // login
 exports.logIn = async (req, res) => {
   const { error } = loginValidation(req.body);
   if (error) return res.status(400).send(error.details[0].message);
 
   const foundUser = await User.findOne({ email: req.body.email }); //returns the first document that matches the query criteria or null
   if (!foundUser) return res.status(400).send({ message: "invalid login credential" });
 
   try {
     const isMatch = await bcrypt.compareSync(req.body.password, foundUser.password);
     if (!isMatch) return res.status(400).send({ message: "invalid login credential" });
     // create and assign jwt
     const token = await jwt.sign({ userId: foundUser._id }, JWT_KEY);
 
     return res.status(200).header("auth-token", token).send({ "auth-token": token, userId: foundUser._id });
   } catch (error) {
     return res.status(400).send(error);
   }
 };


 exports.getUserPreferences = async(req, res) => {
  try{
  const user = req.user
  const userDetails = await User.findOne({ _id : user.userId})
  if (!userDetails) {
     return res.status(400).send({ message: "Could not get user preferences" });
   }
   return res.status(200).send({ message: "User preferences fetched successfully", userDetails });
 } catch (error) {
   return res.status(400).send({ error: "An error has occurred, unable to get user preferences" });
 }
}

exports.updateUserPreferences = async(req, res) => {
   try{
   const user = req.user
   console.log("=====reeq", req.body.preferences)
   const updatedUser = await User.findByIdAndUpdate( user.userId, { preferences: req.body.preferences})
   if (!updatedUser) {
      return res.status(400).send({ message: "Could not update user preferences" });
    }
    return res.status(200).send({ message: "User preferences updated successfully", updatedUser });

  } catch (error) {
    return res.status(400).send({ error: "An error has occurred, unable to update user preferences" });
  }
}

exports.data = async(req, res) => {
   let results = []
   const user = req.user
   const userDetails = await User.findOne({ _id : user.userId})
   const preferences = userDetails.preferences
   const response = await axios.get('http://eventregistry.org/api/v1/article/getArticles', {
      params: {
            "action": "getArticles",
            "keyword": preferences,
            "articlesPage": 1,
            "articlesCount": 5,
            "articlesSortBy": "date",
            "articlesSortByAsc": false,
            "articlesArticleBodyLen": -1,
            "resultType": "articles",
            "dataType": [
              "news",
              "pr"
            ],
            "apiKey": process.env.NEWS_API_KEY,
            "forceMaxDataTimeWindow": 31
          }
    })
    if(response){
      results = response.data.articles.results
    }
    return res.status(200).send({message:"Successfully Fetched Results", data: results})
}

const createUserObj = async (req) => {
   return{
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      preferences: req.body.preferences,
      phone: req.body.phone,
   };
}