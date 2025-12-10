import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Déconnecté" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const body = await req.json();
    const { name, icon, type, goal, frequency, weekDays, tags } = body;

    // prepare tag connectOrCreate
    const tagOps = Array.isArray(tags)
      ? tags.map((t: string) => ({ where: { name: t }, create: { name: t } }))
      : undefined;

    if (!prisma || !(prisma as any).routine) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (type) updateData.type = type;
    if (goal !== undefined) updateData.goal = goal;
    if (frequency) updateData.frequency = frequency;
    if (weekDays !== undefined) updateData.weekDays = weekDays;
    if (tagOps) {
      // if client sent an explicit empty tags array, clear tags
      if (Array.isArray(tags) && tags.length === 0) {
        updateData.tags = { set: [] };
      } else {
        updateData.tags = { connectOrCreate: tagOps };
      }
    } else if (Array.isArray(tags) && tags.length === 0) {
      // clear tags if explicitly empty
      updateData.tags = { set: [] };
    }

    // verify ownership first
    const existing = await (prisma as any).routine.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
    }
    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Déconnecté" }, { status: 401 });
    }

    const updated = await (prisma as any).routine.update({
      where: { id },
      data: updateData,
      include: { tags: true },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Déconnecté" }, { status: 401 });
    }

    const { id } = await ctx.params;
    if (!prisma || !(prisma as any).routine) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    const del = await (prisma as any).routine.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true, deleted: del });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
