import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      icon,
      type,
      goal,
      frequency,
      everyNDays,
      weekDays,
      tags = [],
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    // Prepare connectOrCreate for tags
    const tagOps = (tags as string[]).map((t) => ({
      where: { name: t },
      create: { name: t },
    }));

    const routine = await (prisma as any).routine.create({
      data: {
        user: { connect: { id: session.user.id } },
        name,
        icon: icon ?? null,
        type: type ?? undefined,
        goal: goal ?? null,
        frequency: frequency ?? undefined,
        everyNDays: everyNDays ?? null,
        weekDays: weekDays ?? null,
        tags: { connectOrCreate: tagOps },
      },
      include: { tags: true },
    });

    return NextResponse.json(routine);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
