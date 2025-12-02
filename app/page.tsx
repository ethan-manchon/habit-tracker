import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Header from "@/components/Header";
import CreateRoutineButton from "@/components/CreateRoutineButton";
import FooterNav from "@/components/FooterNav";
import HomeContent from "@/components/HomeContent";
import { CheckCircle, Lock, Sparkles, Target } from "@/lib/Icon";

export default async function Home() {
  const session = await getServerSession(authOptions as any);

  if (session) {
    return (
      <div className="mx-3 sm:mx-6 md:mx-16">
        <Header title="Mes ressources" />
        
        <HomeContent />
       
        <CreateRoutineButton />
        
        <FooterNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4">
      <div className="text-center max-w-2xl w-full">
        {/* Icon */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-full bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-xl shadow-accent/30">
            <CheckCircle className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
          Transforme tes habitudes
        </h1>

        {/* Subtitle */}
        <p className="text-muted text-sm sm:text-base mb-4 sm:mb-6">
          Crée, suis et améliore tes routines quotidiennes
        </p>

        {/* Calendar placeholder */}
        <Card className="mb-4 sm:mb-6 cursor-not-allowed" padding="lg">
          <div className="flex items-center justify-center text-muted mb-3 sm:mb-4">
            <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <p className="text-muted text-xs sm:text-sm select-none">
            Connecte-toi pour voir ton calendrier
          </p>
        </Card>

        {/* Routines section */}
        <div className="mb-24 sm:mb-30">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              Routines
            </h2>
            <Badge variant="secondary">Bientôt</Badge>
          </div>
          <Card padding="lg" variant="glass" className="pb-8 sm:pb-10">
            <p className="text-muted text-sm select-none">
              Tes routines apparaîtront ici après connexion
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <Card variant="gradient" padding="sm" className="mb-4 fixed max-w-lg bottom-2 w-[calc(100%-1.5rem)] sm:w-full left-1/2 transform -translate-x-1/2 px-3 sm:px-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 flex items-center justify-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Enregistre ta progression
          </h3>
          <p className="text-indigo-100 mb-4 sm:mb-6 text-xs sm:text-sm">
            Synchronise tes données sur tous les appareils
          </p>
          <Link href="/login">
            <Button variant="secondary" fullWidth size="lg" className="bg-white text-indigo-600 hover:bg-background-secondary text-sm sm:text-base py-2 sm:py-2.5">
              Se connecter
            </Button>
          </Link>
        </Card>

        {/* Footer */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 text-muted text-[10px] sm:text-xs md:text-sm pb-1 whitespace-nowrap">
          <span>Gratuit</span> • <span>Sécurisé</span> • <span>Sans engagement</span>
        </div>
      </div>
    </div>
  );
}
