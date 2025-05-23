import User from "@/models/User";
import { Inngest } from "inngest";
// import { connection } from "mongoose";
import connection from "./db";
import connectDB from "./db";
// Create a client to send and receive events
export const inngest = new Inngest({ id: "ecommerce-next" });
 
// inngest function to save user data in data base
export const syncUserCreation=inngest.createFunction(
    {
        id:"sync-user-from-clerk"
    },
    {event:'clerk/user.created'}
    ,async({event})=>{
 const { id,first_name ,last_name,email_addresses,image_url}=event.data
     const userData={
        _id:id,
        email:email_addresses[0].email_address,
        name:first_name + ' ' + last_name,
        imageUrl:image_url
     }
     await connection()
     await User.create(userData)

}
)// inngest function to update user data in data base
export const syncUserUpdation=inngest.createFunction({
    id:"update-user-from-clerk"
},
{event:'clerk/user.updated'}
,async({event})=>{
    const { id,first_name ,last_name,email_addresses,image_url}=event.data
        const userData={
           _id:id,
           email:email_addresses[0].email_address,
           name:first_name + ' ' + last_name,
           imageUrl:image_url
        }
        await connection()
        await User.findByIdAndUpdate(id,userData)
    }
)
// inngest function to delete user data in data base
export const syncUserDeletion=inngest.createFunction({
    id:"delete-user-from-clerk"
},
{event:'clerk/user.deleted'}
,async({event})=>{
    const { id}=event.data
    
        await connection()
        await User.findByIdAndDelete(id)
    }
)

export const createUserOrder=inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents:{
            maxSize:5,
            timeout:'5s'
        }
    },
    {event:'order/created'},
    async({events})=>{
        const orders = events.map((event)=>{
            return{
                userId:event.data.userId,
                items:event.data.items,
                amount:event.data.amount,
                address:event.data. address,
                date:event.data.date
            }
        })
        await connectDB()
        await Order.insertMany(orders)
        return {success:true, processed:orders.length};
    }
)