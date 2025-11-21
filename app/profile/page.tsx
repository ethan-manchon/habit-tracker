import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import { Header, FooterNav, UserEdit } from "@/components";


export default async function Home() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/");
  }

    return (
      <div className="mx-16">
        <Header title="Profile" />
        <UserEdit />
        <FooterNav />
      </div>
    );
}
