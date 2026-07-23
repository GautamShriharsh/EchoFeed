import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendMsgRateLimit } from "@/lib/rateLimit";
import { moderateContent } from "@/lib/gemini-moderation";


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
      const {category} = await moderateContent(content);
      
      const isFlagged = category !== "clean";

       const updatedUser = await UserModel.findOneAndUpdate(
      {
        username,
        isAcceptingMessage: true, // condition only if user is accepting message
      },
      {
        $push: {
          messages: {
            content,
            createdAt: new Date(),
            isFlagged,
            flaggedCategory: category,
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