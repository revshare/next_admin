import { MongoClient } from "mongodb"

const uri = process.env.CONNECTIONSTRING
const options = {}

if (!uri) {
  throw new Error("Please add your MongoDB URI to the .env file")
}

let client
let clientPromise

// Global is used only in development to prevent hot-reload issues
const globalWithMongo = globalThis

if (process.env.NODE_ENV === "development") {
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase() {
  const client = await clientPromise
  return client.db()
}

export async function getCollection(name) {
  const db = await getDatabase()
  return db.collection(name)
}