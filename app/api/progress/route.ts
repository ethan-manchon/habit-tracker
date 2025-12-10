import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

// Disable static caching for this dynamic route
export const dynamic = "force-dynamic";

function parseDateToMidnight(d?: string) {
  if (!d) return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  // Expecting 'YYYY-MM-DD'
  const parts = d.split("-");
  if (parts.length >= 3) {
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    return new Date(y, m, day);
  }
  return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
}

export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Déconnecté" }, { status: 401 });
    }

    const body = await req.json();
    const { routineId, date, booleanValue, numericValue } = body;

    if (!routineId) return NextResponse.json({ error: "Routine manquante" }, { status: 400 });

    const day = parseDateToMidnight(date);

    // Find if a progress already exists for this routine/date/user
    let result;
    if ((prisma as any).progress && typeof (prisma as any).progress.findFirst === "function") {
      const existing = await (prisma as any).progress.findFirst({
        where: { routineId, userId: session.user.id, date: day },
      });

      if (existing) {
        result = await (prisma as any).progress.update({
          where: { id: existing.id },
          data: { booleanValue: booleanValue ?? null, numericValue: numericValue ?? null },
        });
      } else {
        result = await (prisma as any).progress.create({
          data: {
            routine: { connect: { id: routineId } },
            user: { connect: { id: session.user.id } },
            date: day,
            booleanValue: booleanValue ?? null,
            numericValue: numericValue ?? null,
          },
        });
      }
    } else {
      const dateIso = day.toISOString();
      const existingRows: any[] = await prisma.$queryRaw`
        SELECT * FROM "Progress"
        WHERE "routineId" = ${routineId}
          AND "userId" = ${session.user.id}
          AND "date" = ${dateIso}
        LIMIT 1
      `;

      if (existingRows && existingRows.length > 0) {
        const existingId = existingRows[0].id;
        const updated = await prisma.$queryRaw`
          UPDATE "Progress"
          SET "booleanValue" = ${booleanValue ?? null}, "numericValue" = ${numericValue ?? null}, "updatedAt" = NOW()
          WHERE id = ${existingId}
          RETURNING *
        `;
        result = Array.isArray(updated) ? updated[0] : updated;
      } else {
        const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const inserted = await prisma.$queryRaw`
          INSERT INTO "Progress" ("id","userId","routineId","date","booleanValue","numericValue","createdAt","updatedAt")
          VALUES (${newId}, ${session.user.id}, ${routineId}, ${dateIso}, ${booleanValue ?? null}, ${numericValue ?? null}, NOW(), NOW())
          RETURNING *
        `;
        result = Array.isArray(inserted) ? inserted[0] : inserted;
      }
    }

    return NextResponse.json(result);
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

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date") || undefined;
    const routineId = url.searchParams.get("routineId");

    const day = parseDateToMidnight(dateParam);

    const where: any = { userId: session.user.id, date: day };
    if (routineId) where.routineId = routineId;

    if ((prisma as any).progress && typeof (prisma as any).progress.findMany === "function") {
      const list = await (prisma as any).progress.findMany({ where });
      return NextResponse.json(list);
    }

    const dateIso = day.toISOString();
    const rows: any[] = await prisma.$queryRaw`
      SELECT * FROM "Progress"
      WHERE "userId" = ${session.user.id}
        AND "date" = ${dateIso}
    `;
    return NextResponse.json(rows || []);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
