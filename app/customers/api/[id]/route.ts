
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";



export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const collection = await getCollection("customers");
 
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const customer = await collection.findOne({ _id: new ObjectId(id) });
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

   return NextResponse.json({ ...customer, _id: customer._id.toString() });
}