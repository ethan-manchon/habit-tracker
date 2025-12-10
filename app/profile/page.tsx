import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import FooterNav from "@/components/FooterNav";
import ProfileSection from "@/components/Sections/ProfileSection";


export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-3 sm:mx-6 md:mx-16">
      <Header title="Profil" />
      <ProfileSection />
      <FooterNav />
    </div>
  );
}
