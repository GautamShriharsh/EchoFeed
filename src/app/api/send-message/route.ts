import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { moderateContent } from "@/lib/gemini-moderation";


export async function POST(request: Request) {
   
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