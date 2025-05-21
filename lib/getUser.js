
import {cookies} from "next/headers"
import jwt from "jsonwebtoken"

export async function getUserFromCookie() {
    const cookieStore = await cookies(); // Await this
    const theCookie = cookieStore.get("CRUD")?.value
    if(theCookie){
        try {
            const decoded = jwt.verify(theCookie,process.env.JWTSECRET)
            return decoded
        } catch (error) {
            return null
        }
    }
}