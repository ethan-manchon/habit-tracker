import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

// Disable static caching for this dynamic route
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Déconnecté" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      icon,
      type,
      goal,
      frequency,
      weekDays,
      tags = [],
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }

    // Prepare connectOrCreate for tags
    const tagOps = (tags as string[]).map((t) => ({
      where: { name: t },
      create: { name: t },
    }));

    // Diagnostic: ensure Prisma client exposes the `routine` model
    if (!prisma || !(prisma as any).routine || typeof (prisma as any).routine.create !== "function") {
      console.error("Prisma client doesn't expose `routine` model:", prisma && Object.keys(prisma));
      return NextResponse.json({
        error:
          "Erreur serveur",
      }, { status: 500 });
    }

    const routine = await (prisma as any).routine.create({
      data: {
        user: { connect: { id: session.user.id } },
        name,
        icon: icon ?? null,
        type: type ?? undefined,
        goal: goal ?? null,
        frequency: frequency ?? undefined,
        weekDays: weekDays ?? [],
        tags: { connectOrCreate: tagOps },
      },
      include: { tags: true },
    });

    return NextResponse.json(routine);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Déconnecté" }, { status: 401 });
    }

    const routines = await (prisma as any).routine.findMany({
      where: { userId: session.user.id },
      include: { tags: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(routines);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
