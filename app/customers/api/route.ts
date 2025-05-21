
import { NextRequest, NextResponse } from "next/server";
import { delete_customer } from "@/controller/customerController";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";


export async function GET() {
  try {
    const listCustomersCollection = await getCollection("customers");
    const result = await listCustomersCollection.find().sort().toArray();
  
      // Convert ObjectId (_id) to string
    const plainResult = result.map((doc: { _id: { toString: () => any } }) => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  
    //return plainResult;
    return NextResponse.json(plainResult, { status: 200 });

    // const formData = await request.formData();
    // await delete_customer(formData);
    // return NextResponse.json({ success: true });
  } catch (error) {
    // console.error("Delete customer error:", error);
    // return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const url = new URL(request.url);
//     const id = url.pathname.split("/").pop();

//     const customersCollection = await getCollection("customers");
//     console.log(url);
//     console.log(id)
//     if (id && ObjectId.isValid(id)) {
//    // if (id) {  
//       console.log("TRIGGERED")
//       // Get single customer
//       const customer = await customersCollection.findOne({_id :ObjectId.createFromHexString(id) })
//       //const customer = await customersCollection.findOne({ _id: new ObjectId(id) });

//       if (!customer) {
//         return NextResponse.json({ error: "Customer not found" }, { status: 404 });
//       }

//       return NextResponse.json(
//         {
//           ...customer,
//           _id: customer._id.toString(),
//         },
//         { status: 200 }
//       );
//     }

//     // Get all customers
//     const customers = await customersCollection.find().sort().toArray();
//     const plainResult = customers.map((doc: { _id: { toString: () => any } }) => ({
//       ...doc,
//       _id: doc._id.toString(),
//     }));

//     return NextResponse.json(plainResult, { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

export async function POST(request: NextRequest) {
  try {
    
    const formData = await request.formData();
    await delete_customer(formData);
    return NextResponse.json({ success: true });
  } catch (error) {
    // console.error("Delete customer error:", error);
    // return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}