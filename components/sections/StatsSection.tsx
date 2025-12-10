"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Target, ChevronDown } from "@/lib/Icon";

type DailyData = {
  date: string;
  completed: number;
  total: number;
};

type RoutineOption = {
  id: string;
  name: string;
  type: "BOOLEAN" | "NUMERIC";
  icon: string | null;
  goal: number | null;
};

type RoutineDataPoint = {
  date: string;
  value: number | boolean | null;
  goal?: number;
};

type StatsResponse = {
  routines: RoutineOption[];
  dailyData: DailyData[];
  routineData: RoutineDataPoint[];
  selectedRoutine: RoutineOption | null;
};

const PERIOD_OPTIONS = [
  { value: 7, label: "7 jours" },
  { value: 14, label: "14 jours" },
  { value: 30, label: "30 jours" },
];

export default function StatsContent() {
  // Carrousel: état de la slide active
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Gère le scroll pour détecter la slide active
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollLeft = el.scrollLeft;
      const width = el.offsetWidth;
      const slide = Math.round(scrollLeft / width);
      setActiveSlide(slide);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);
  const [days, setDays] = useState(7);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const params = new URLSearchParams({ days: String(days) });
    if (selectedRoutineId) params.set("routineId", selectedRoutineId);

    fetch(`/api/stats?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (mounted) {
          setData(json);
          // Auto-select first routine if none selected
          if (!selectedRoutineId && json.routines?.length > 0) {
            setSelectedRoutineId(json.routines[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [days, selectedRoutineId]);

  // Format date for display (short format)
  const formatDateShort = (dateStr: string) => {
    const parts = dateStr.split("-");
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    return `${day}/${month}`;
  };

  // Prepare chart data for completion bar chart
  const barChartData = useMemo(() => {
    if (!data?.dailyData) return [];
    return data.dailyData.map((d) => ({
      ...d,
      dateShort: formatDateShort(d.date),
      percentage: d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0,
    }));
  }, [data?.dailyData]);

  // Prepare routine-specific chart data
  const routineChartData = useMemo(() => {
    if (!data?.routineData || !data.selectedRoutine) return [];

    return data.routineData.map((d) => ({
      ...d,
      dateShort: formatDateShort(d.date),
      numericValue: typeof d.value === "number" ? d.value : null,
      booleanValue: typeof d.value === "boolean" ? (d.value ? 1 : 0) : null,
      completed: typeof d.value === "boolean" ? d.value : null,
    }));
  }, [data?.routineData, data?.selectedRoutine]);

  // Calculate average completion
  const avgCompletion = useMemo(() => {
    if (!barChartData.length) return 0;
    const sum = barChartData.reduce((acc, d) => acc + d.percentage, 0);
    return Math.round(sum / barChartData.length);
  }, [barChartData]);

  // Get CSS variables for theming
  const chartColors = {
    accent: "var(--accent)",
    success: "var(--success)",
    danger: "var(--danger)",
    muted: "var(--muted)",
    border: "var(--border)",
    foreground: "var(--foreground)",
    card: "var(--card)"
  };
  return (
    <div className="w-full max-w-lg mx-auto pb-24">
      {/* Period Selector */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex gap-1 sm:gap-2 bg-background-secondary rounded-xl p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <motion.button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${days === opt.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
                }`}
              whileTap={{ scale: 0.95 }}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Carrousel horizontal */}
      <div
        ref={carouselRef}
        className="relative w-full overflow-x-auto flex gap-6 snap-x snap-mandatory pb-8"
        style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
      >
        {/* Slide 1: Complétion moyenne + BarChart */}
        <div className="min-w-full max-w-lg snap-center flex-shrink-0">
          <motion.div
            className="flex items-center gap-3 bg-accent/10 rounded-xl px-4 py-3 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Target className="w-6 h-6 text-accent" />
            <div>
              <p className="text-xs text-muted">Complétion moyenne</p>
              <p className="text-xl sm:text-2xl font-bold text-accent">{avgCompletion}%</p>
            </div>
          </motion.div>
          <Card>
            <CardHeader className="p-4">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                Routines complétées par jour
              </h3>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 pt-0">
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                    <XAxis
                      dataKey="dateShort"
                      tick={{ fontSize: 10, fill: chartColors.muted }}
                      tickLine={false}
                      axisLine={{ stroke: chartColors.border }}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: chartColors.muted }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: chartColors.card,
                        border: `1px solid ${chartColors.border}`,
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: chartColors.foreground, fontWeight: 600 }}
                      formatter={(value: number, name: string) => {
                        if (name === "completed") return [value, "Complétées"];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="completed" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.completed === entry.total && entry.total > 0
                              ? chartColors.success
                              : chartColors.accent
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Slide 2: Détail par routine */}
        <div className="min-w-full max-w-lg snap-center flex-shrink-0">

          {data?.routines && data.routines.length > 0 && (
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">
                    Détail par routine
                  </h3>
                  {/* Routine Select Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedRoutineId || ""}
                      onChange={(e) => setSelectedRoutineId(e.target.value)}
                      className="appearance-none bg-background-secondary border border-border rounded-xl px-3 py-1.5 pr-8 text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                    >
                      {data.routines.map((routine) => (
                        <option key={routine.id} value={routine.id}>
                          {routine.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                  </div>
                </div>
                {data.selectedRoutine && (
                  <p className="text-xs text-muted mt-1">
                    Type: {data.selectedRoutine.type === "BOOLEAN" ? "Oui/Non" : "Numérique"}
                    {data.selectedRoutine.type === "NUMERIC" &&
                      data.selectedRoutine.goal &&
                      ` • Objectif: ${data.selectedRoutine.goal}`}
                  </p>
                )}
              </CardHeader>
              <CardContent className="p-2 sm:p-4 pt-0">
                <div className="h-48 sm:h-64">
                  {data.selectedRoutine?.type === "NUMERIC" ? (
                    /* Numeric routine: Line chart with dots */
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={routineChartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                        <XAxis
                          dataKey="dateShort"
                          tick={{ fontSize: 10, fill: chartColors.muted }}
                          tickLine={false}
                          axisLine={{ stroke: chartColors.border }}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: chartColors.muted }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        {data.selectedRoutine.goal && (
                          <ReferenceLine
                            y={data.selectedRoutine.goal}
                            stroke={chartColors.success}
                            strokeDasharray="5 5"
                            label={{
                              value: `Objectif: ${data.selectedRoutine.goal}`,
                              position: "right",
                              fontSize: 10,
                              fill: chartColors.success,
                            }}
                          />
                        )}
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.card,
                            border: `1px solid ${chartColors.border}`,
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                          labelStyle={{ color: chartColors.foreground, fontWeight: 600 }}
                          formatter={(value: any) => [
                            value !== null && value !== undefined ? value : "—",
                            "Valeur",
                          ]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="numericValue"
                          stroke={chartColors.accent}
                          strokeWidth={2}
                          dot={{ fill: chartColors.accent, strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: chartColors.accent }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    /* Boolean routine: Bar chart with colored cells */
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={routineChartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                        <XAxis
                          dataKey="dateShort"
                          tick={{ fontSize: 10, fill: chartColors.muted }}
                          tickLine={false}
                          axisLine={{ stroke: chartColors.border }}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fill: chartColors.muted }}
                          tickLine={false}
                          axisLine={false}
                          domain={[0, 1]}
                          ticks={[0, 1]}
                          tickFormatter={(v) => (v === 1 ? "Oui" : "Non")}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: chartColors.card,
                            border: `1px solid ${chartColors.border}`,
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                          labelStyle={{ color: chartColors.foreground, fontWeight: 600 }}
                          formatter={(value: any) => [
                            value === 1 ? "✓ Fait" : value === 0 ? "✗ Non fait" : "—",
                            "Status",
                          ]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Bar dataKey="booleanValue" radius={[6, 6, 0, 0]} maxBarSize={40}>
                          {routineChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.completed === true
                                  ? chartColors.success
                                  : entry.completed === false
                                    ? chartColors.danger
                                    : chartColors.muted
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

      </div>
      {/* Pagination dots */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => {
              setActiveSlide(i);
              carouselRef.current?.scrollTo({
          left: carouselRef.current.offsetWidth * i,
          behavior: 'smooth',
              });
            }}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${activeSlide === i ? 'bg-accent' : 'bg-muted/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
