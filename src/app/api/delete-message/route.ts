import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request){
 await dbConnect();
    
 const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 },
    );
  }
   try {
    
    const user: User = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);
    const { messageId } = await request.json();

    const updatedUser = await UserModel.findOneAndUpdate(
        {_id : userId},
        {$pull: {
            messages: {
                _id: messageId
            }
        }}, 
        { new: true }
    ) 

    if (!updatedUser) {
        return Response.json({ 
            success: false, 
            message: "User not found"
        }, { status: 404 }
        )
    }

    return Response.json( { 
        success: true, 
        message: "Message deleted successfully", 
    }, { status: 200 } );
      
   } catch (error) {
    console.error("Error deleting message", error);

    return Response.json({
        success: false,
        message: "Error deleting message",
    },
    { status: 500 }
    );
   }
}