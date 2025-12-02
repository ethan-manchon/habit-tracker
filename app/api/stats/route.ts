import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";

export const dynamic = "force-dynamic";

function parseDateToMidnight(d: string) {
  const parts = d.split("-");
  if (parts.length >= 3) {
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    return new Date(y, m, day);
  }
  return new Date(d);
}

function formatDateStr(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "7", 10);
    const routineId = url.searchParams.get("routineId");

    // Get all user routines
    const routines = await (prisma as any).routine.findMany({
      where: { userId: session.user.id },
      include: { tags: true },
      orderBy: { createdAt: "asc" },
    });

    // Calculate date range
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(todayStart);
    startDate.setDate(startDate.getDate() - (days - 1));

    // Get all progress in the date range
    const progressList = await (prisma as any).progress.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: todayStart,
        },
      },
    });

    // Build daily completion data
    const dailyData: { date: string; completed: number; total: number }[] = [];
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = formatDateStr(currentDate);

      // Find routines applicable for this day
      const applicableRoutines = routines.filter((r: any) => isForDate(r, currentDate));
      const total = applicableRoutines.length;

      // Count completed routines for this day
      let completed = 0;
      for (const routine of applicableRoutines) {
        const progress = progressList.find(
          (p: any) =>
            p.routineId === routine.id &&
            formatDateStr(new Date(p.date)) === dateStr
        );

        if (routine.type === "BOOLEAN") {
          if (progress?.booleanValue) completed++;
        } else if (routine.type === "NUMERIC") {
          if ((progress?.numericValue ?? 0) >= (routine.goal ?? 1)) completed++;
        }
      }

      dailyData.push({ date: dateStr, completed, total });
    }

    // If a specific routine is requested, get its progress data
    let routineData: { date: string; value: number | boolean | null; goal?: number }[] = [];
    let selectedRoutine = null;

    if (routineId) {
      selectedRoutine = routines.find((r: any) => r.id === routineId);
      
      if (selectedRoutine) {
        for (let i = 0; i < days; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() + i);
          const dateStr = formatDateStr(currentDate);

          const progress = progressList.find(
            (p: any) =>
              p.routineId === routineId &&
              formatDateStr(new Date(p.date)) === dateStr
          );

          if (selectedRoutine.type === "BOOLEAN") {
            routineData.push({
              date: dateStr,
              value: progress?.booleanValue ?? null,
            });
          } else {
            routineData.push({
              date: dateStr,
              value: progress?.numericValue ?? null,
              goal: selectedRoutine.goal,
            });
          }
        }
      }
    }

    return NextResponse.json({
      routines: routines.map((r: any) => ({
        id: r.id,
        name: r.name,
        type: r.type,
        icon: r.icon,
        goal: r.goal,
      })),
      dailyData,
      routineData,
      selectedRoutine: selectedRoutine
        ? {
            id: selectedRoutine.id,
            name: selectedRoutine.name,
            type: selectedRoutine.type,
            goal: selectedRoutine.goal,
          }
        : null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function isForDate(r: any, targetDate: Date) {
  try {
    const freq = r.frequency;
    const dayIdx = targetDate.getDay();

    if (freq === "DAILY") return true;

    if (freq === "SPECIFIC_DAYS") {
      const w = r.weekDays || [];
      return Array.isArray(w) && w.includes(dayIdx);
    }

    if (freq === "EVERY_N_DAYS") {
      const n = Number(r.everyNDays) || 0;
      if (!n || !r.createdAt) return false;
      const created = new Date(r.createdAt);
      const t0 = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
      const c0 = new Date(created.getFullYear(), created.getMonth(), created.getDate()).getTime();
      const days = Math.floor((t0 - c0) / (1000 * 60 * 60 * 24));
      return days >= 0 && days % n === 0;
    }

    return false;
  } catch (e) {
    return false;
  }
}
