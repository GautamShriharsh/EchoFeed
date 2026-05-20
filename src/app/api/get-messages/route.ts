import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
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
  const sessionUser: User = session?.user as User;

  const userId = new mongoose.Types.ObjectId(sessionUser._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: {
          path: "$messages",
          preserveNullAndEmptyArrays: true,
         },
      },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: '$_id', messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    const messages = user[0]?.messages.filter(Boolean) || [];
    
     
    return Response.json(
      {
        success: true,
        messages: messages,
      },
      { status: 200 },
    );
    
  } catch (error) {
    console.log("Error fetching messages", error);

    return Response.json(
      {
        success: false,
        message: "Error fetching messages",
      },
      { status: 500 },
    );
  }
}
