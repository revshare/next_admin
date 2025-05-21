"use server"
import {redirect} from "next/navigation"
import {getUserFromCookie} from "../lib/getUser" 
import { getCollection } from "../lib/db"
import { ObjectId } from "mongodb"
import {parseWithZod} from "@conform-to/zod"
import {customerSchema } from "../lib/customerSchema"

function isAlphaNumericBasic(text){
    const regex = /^[a-zA-Z0-9 .,]*$/;
    return regex.test(text)
}

////changes from desktop
////changes from desktop 2

export const edit_customer = async function (prevState, formData) {
    const user = await getUserFromCookie();
    if (!user) {
        redirect("/");
    }

    const submission = parseWithZod(formData, {
        schema: customerSchema,
    });

  
    if(submission.status !== "success"){
        return {
            message: "Validation failed",
            errors: submission.error.flatten().fieldErrors,
        };
    }

    const customerCollection = await getCollection("customers");
    const id = formData.get("_id");

    if (typeof id !== "string" || !ObjectId.isValid(id)) {
        return {
            message: "Invalid customer ID",
        };
    }

    const updatedData = { ...submission.value };
    delete updatedData._id;

    await customerCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedData }
    );

    redirect("/customers");
};


export const create_customer =  async function (prevState,formData) {
    const submission = parseWithZod( formData, {
        schema : customerSchema,
    })
    console.log(submission)
    console.log("values here")
    console.log(submission.value)

    if(submission.status !== "success"){
        return submission.reply();
    }
    
    const customerCollection = await getCollection("customers")
    const newPost = await customerCollection.insertOne(submission.value)
    return redirect("/customers")



   
}

export const delete_customer = async function (FormData) {
  const customerCollection = await getCollection("customers")
    // console.log("delete controller")
    // console.log(FormData)
  let id = FormData.get("id")
  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    throw new Error("Invalid customer ID")
  }

  await customerCollection.deleteOne({ _id: new ObjectId(id) })

  // Optionally redirect after delete:
  //return redirect("/customers") // or wherever you want to redirect

  return { success: true }
}
