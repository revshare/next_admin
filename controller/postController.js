"use server"
import {redirect} from "next/navigation"
import {getUserFromCookie} from "../lib/getUser" 
import { getCollection } from "../lib/db"
import { ObjectId } from "mongodb"


function isAlphaNumericBasic(text){
    const regex = /^[a-zA-Z0-9 .,]*$/;
    return regex.test(text)
}


// export const listPost =  async function (id) {
//     const listPostCollection = await getCollection("posts")
//     const result = await listPostCollection.find({user: ObjectId.createFromHexString(id)}).sort().toArray()
//     //console.log(result)
//     return result
// }


async function sharedLogic(formData,user){
    const errors = {}

    const post = {
        line1 : formData.get("line1"),
        line2 : formData.get("line2"),
        user:ObjectId.createFromHexString(user.userId)
    }

    if(typeof post.line1 != "string") post.line1 = ""
    if(typeof post.line2 != "string") post.line2 = ""

    post.line1 = post.line1.trim()
    post.line2 = post.line2.trim()

    if(post.line1.length < 5) errors.line1 = "too few characters."
    if(post.line1.length > 30) errors.line1 = "too many characters."

    if(post.line2.length < 5) errors.line2 = "too few characters."
    if(post.line2.length > 30) errors.line2 = "too many characters."

    if(!isAlphaNumericBasic(post.line1))  errors.line1 = "no special characters allowed."
    if(!isAlphaNumericBasic(post.line2))  errors.line2 = "no special characters allowed."

    if(post.line1.length == 0) errors.line1 = "This field is required"
    if(post.line2.length == 0) errors.line2 = "This field is required"

    return {
        errors,
        post
    }

}

export const edit_post =  async function (prevState,formData) {
    const user = await getUserFromCookie()

    if(!user){
        redirect("/")
    }

    const res = await sharedLogic(formData,user)
    if(res.errors.line1 || res.errors.line2){
        return {errors:res.errors}
    }

    const postCollection = await getCollection("posts")
    let postId = formData.get("postId")
    if(typeof postId != "string") postId = ""

    const postQuestion = await postCollection.findOne({_id :ObjectId.createFromHexString(postId) })
    if(postQuestion.user.toString() !== user.userId){
        return redirect("/")
    }

    await postCollection.findOneAndUpdate({_id : ObjectId.createFromHexString(postId) }, {$set : res.post})

    redirect("/")
}


export const create_post =  async function (prevState,formData) {
    const user = await getUserFromCookie()

    if(!user){
        return redirect("/")
    }

    const res = await sharedLogic(formData,user)
    if(res.errors.line1 || res.errors.line2){
        return {errors:res.errors}
    }

    const postCollection = await getCollection("posts")
    const newPost = await postCollection.insertOne(res.post)
    return redirect("/")
}

export const delete_post =  async function (formData) {
    const user = await getUserFromCookie()

    if(!user){
        return redirect("/")
    }

    const postCollection = await getCollection("posts")
    let postId = formData.get("id")
    if(typeof postId != "string") postId = ""

    const postQuestion = await postCollection.findOne({_id :ObjectId.createFromHexString(postId) })
    if(postQuestion.user.toString() !== user.userId){
        return redirect("/")
    }

    await postCollection.deleteOne({_id : ObjectId.createFromHexString(postId) })
    return redirect("/")
}
