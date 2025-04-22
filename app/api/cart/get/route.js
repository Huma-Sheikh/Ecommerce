import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User"




export async function GET(request){
    try {
        const {userId} = getAuth(request)
        
        await connectDB()
        const user = await User.findOne({ clerkId: userId })
        const {cartItems} = user
       await user.save()
      return  NextResponse.json({success:true , cartItems})
    } catch (error) {
        NextResponse.json({success:false, message:error.message})
    }
}