import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import FooterNav from "@/components/FooterNav";
import StatsSection from "@/components/sections/StatsSection";
import { Stats } from "@/lib/Icon";

export default async function StatsPage() {
  const session = await getServerSession(authOptions as any);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-3 sm:mx-6 md:mx-16">
      <Header title="Statistiques" />
      <StatsSection />
      <FooterNav />
    </div>

  );
}
