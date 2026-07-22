import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendMsgRateLimit } from "@/lib/rateLimit";


export async function POST(request: Request) {
   
   const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() 
    || "127.0.0.1";
   
    const { success, limit, reset, remaining } = await sendMsgRateLimit.limit(ip);

    if (!success) {
    return Response.json(
      { 
        success: false,
        message: "You are sending messages too quickly. Please wait for a minute."
      },
      {
        status: 429, // 429 Too Many Requests
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      }
    );
  }

   try {
      await  dbConnect();
      const {username, content} = await request.json();

       const updatedUser = await UserModel.findOneAndUpdate(
      {
        username,
        isAcceptingMessage: true, // condition inside query
      },
      {
        $push: {
          messages: {
            content,
            createdAt: new Date(),
          },
        },
      },
      {
        new: true, // return updated doc
      }
    );

      // If null → either user not found OR not accepting messages
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found or not accepting messages",
        },
        { status: 404 }
      );
    }

      return Response.json({
         success: true,
         message: "Message sent successfully"
       }, { status: 200 });

   } catch (error) {
       
      console.log("Error sending message", error);

      return Response.json({
         success: false,
         message: "Error sending message"
      }, { status: 500 });

   }
   
}