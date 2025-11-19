import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Header, Calendar, CreateRoutineButton, FooterNav } from "@/components";

export default async function Home() {
  const session = await getServerSession(authOptions as any);

  if (session) {
    return (
      <div className="min-h-screen pb-32">
        <Header title="Mes ressources" />
         <main className="flex flex-col items-center gap-6">
          {/* <Calendar /> */}

          <section className="w-full max-w-2xl px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-100">Aujourd'hui</h2>
              <div className="text-sm text-gray-400">0/3 complétées</div>
            </div>

            <div className="flex flex-col gap-4">
              {/* <RoutineList /> */}
            </div>
          </section>

        </main>

        <CreateRoutineButton />
        <FooterNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Transforme tes habitudes
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 mb-6">
          Crée, suis et améliore tes routines quotidiennes
        </p>

        {/* Calendar placeholder */}
        <Card className="mb-6 cursor-not-allowed" padding="lg">
          <div className="flex items-center justify-center text-gray-500 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm select-none">
            Connecte-toi pour voir ton calendrier
          </p>
        </Card>

        {/* Routines section */}
        <div className="mb-30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Routines</h2>
            <Badge variant="secondary">Bientôt</Badge>
          </div>
          <Card padding="lg" variant="glass" className="pb-10">

            <p className="text-gray-400 select-none">
              Tes routines apparaîtront ici après connexion
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card variant="gradient" padding="sm" className="mb-4 fixed max-w-lg bottom-2 w-full left-1/2 transform -translate-x-1/2 px-4">
          <h3 className="text-xl font-semibold text-white mb-2">
            ✨ Enregistre ta progression
          </h3>
          <p className="text-indigo-100 mb-6 text-sm">
            Synchronise tes données sur tous les appareils
          </p>
          <Link href="/login">
            <Button variant="secondary" fullWidth size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Se connecter
            </Button>
          </Link>
        </Card>

        {/* Footer */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
          <span>Gratuit</span> • <span>Sécurisé</span> • <span>Sans engagement</span>
        </div>
      </div>
    </div>

  );
}
