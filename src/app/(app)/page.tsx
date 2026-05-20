import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import HomePageClient from "@/components/HomePageClient";



async function Home() {
  
  const session = await getServerSession(authOptions);

  if (session) {
  redirect("/dashboard");
}
   return <HomePageClient />;
}

export default Home;