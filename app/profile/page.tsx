import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import FooterNav from "@/components/FooterNav";
import UserEdit from "@/components/UserEdit";


export default async function Home() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/");
  }

    return (
      <div className="mx-3 sm:mx-6 md:mx-16">
        <Header title="Profil" />
        <UserEdit />
        <FooterNav />
      </div>
    );
}
