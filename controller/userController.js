"use server"


import { hash } from "crypto";
import { getCollection } from "../lib/db"
import bcrypt from "bcrypt"
import {cookies} from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation";

function isAlphaNumeric(x){
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(x)
}

export const login = async function (prevState,formData) {
    const failObject = {
        success : false,
        message : "Invalid username / password combination."
    }
  
    const errors = {}
    const Auth = {
        username : formData.get("username"),
        password : formData.get("password")
    }
    if(typeof Auth.username != "string" ) Auth.username = "";
    if(typeof Auth.password != "string" ) Auth.password = "";


    const collection = await getCollection("users")
    const user = await collection.findOne({username : Auth.username})
    console.log("debug")
 
    if(!user){
        console.log(failObject)
        return failObject
         
    }

    const matchOrNot = bcrypt.compareSync(Auth.password,user.password)
    if(!matchOrNot){
        return failObject
    }

    //cr8 jwt value
    const ourTokenValue = jwt.sign({userId:user._id,exp:Math.floor(Date.now() / 1000 ) + 60 * 60 * 24},process.env.JWTSECRET)

    cookies().set("CRUD",ourTokenValue, {
        httpOnly : true,
        sameSite : "strict",
        maxAge : 60 * 60 * 24,
        secure :true
    })

    return redirect("/")

}

export const logout =  async function () {
    cookies().delete("CRUD")
    redirect("/")
}

export const register =  async function (prevState,formData) {
    const errors = {}
    const Auth = {
        username : formData.get("username"),
        password : formData.get("password")
    }

    if(typeof Auth.username != "string" ) Auth.username = "";
    if(typeof Auth.password != "string" ) Auth.password = "";

    Auth.username = Auth.username.trim();
    Auth.password = Auth.password.trim();

    if(Auth.username.length < 3) errors.username = "Username must be at least 3 characters."
    if(Auth.username.length > 30) errors.username = "Username cannot exceed 30 characters."

    if(!isAlphaNumeric(Auth.username)) errors.username = "You can only use a-z and 0-9."
    if(Auth.username == "") errors.username = "You must provide username."


    const usersCollection = await getCollection("users")
    const usernameExist = await usersCollection.findOne({username : Auth.username})
    if(usernameExist){
        errors.username = "Username already exist."
    }

    if(Auth.password.length < 8) errors.password = "Password must be at least 12 characters."
    if(Auth.password.length > 50) errors.password = "Password cannot exceed 50 characters."
    if(Auth.password == "") errors.password = "You must provide password."


    if(errors.username || errors.password){
        return {
            errors : errors, 
            success : false
        }
    }

    //hash password
    const salt = bcrypt.genSaltSync(10) 
    Auth.password = bcrypt.hashSync(Auth.password,salt)

   
    const newUser = await usersCollection.insertOne(Auth)
    const userId = newUser.insertedId.toString()


    //cr8 jwt value
    const ourTokenValue = jwt.sign({userId:userId,exp:Math.floor(Date.now() / 1000 ) + 60 * 60 * 24},process.env.JWTSECRET)

    cookies().set("CRUD",ourTokenValue, {
        httpOnly : true,
        sameSite : "strict",
        maxAge : 60 * 60 * 24,
        secure :true
    })

    //console.log("hellow")
    return {
        success : true
    }
}

