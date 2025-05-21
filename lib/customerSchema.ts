import {z} from "zod"


export const customerSchema = z.object({
    _id: z.string().optional(), // Include this for edit mode support
    first_name : z.string().min(3).max(30),
    middle_name : z.string().min(3).max(30),
    last_name : z.string().min(3).max(30),
    email : z.string().email(),
    //phone : z.string(),
    phone: z
    .string(),
    dob : z.string(),
    address : z.string().optional()
})

export type CustomerFormValues = z.infer<typeof customerSchema>;