import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

export async function PATCH(req: Request, ctx: any) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const id = ctx.params.id;
    const body = await req.json();
    const { name, icon, type, goal, frequency, everyNDays, weekDays, tags } = body;

    // prepare tag connectOrCreate
    const tagOps = Array.isArray(tags)
      ? tags.map((t: string) => ({ where: { name: t }, create: { name: t } }))
      : undefined;

    if (!prisma || !(prisma as any).routine) {
      return NextResponse.json({ error: "Prisma client missing 'routine' model" }, { status: 500 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (icon !== undefined) updateData.icon = icon;
    if (type) updateData.type = type;
    if (goal !== undefined) updateData.goal = goal;
    if (frequency) updateData.frequency = frequency;
    if (everyNDays !== undefined) updateData.everyNDays = everyNDays;
    if (weekDays !== undefined) updateData.weekDays = weekDays;
    if (tagOps) updateData.tags = { connectOrCreate: tagOps };

    const updated = await (prisma as any).routine.updateMany({
      where: { id, userId: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: any) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const id = ctx.params.id;
    if (!prisma || !(prisma as any).routine) {
      return NextResponse.json({ error: "Prisma client missing 'routine' model" }, { status: 500 });
    }

    const del = await (prisma as any).routine.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true, deleted: del });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
