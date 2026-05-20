import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { notFound, redirect } from "next/navigation";
import VerifyForm from "./VerifyForm";


type Props = {
  params: Promise<{
    username: string;
  }>;
};

export default async function VerifyAccount({params} : Props) {
  const { username } = await params;

  await dbConnect();

  const user = await UserModel.findOne({
    username
  })
   
  if (!user) {
   notFound();
  }

  //already verified users should not access this page
  if (user.isVerified) {
    redirect("/sign-in");
  }

  return <VerifyForm username={username} />;
    
}