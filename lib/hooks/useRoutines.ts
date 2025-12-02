"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRoutines() {
  const { data, error, isLoading, mutate } = useSWR("/api/routines", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute de cache
  });

  return {
    routines: Array.isArray(data) ? data : [],
    isLoading,
    error: error || data?.error,
    mutate,
  };
}

export function useProgress(date: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    date ? `/api/progress?date=${date}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 secondes de cache
    }
  );

  // Convert array to map for easier lookup
  const progressMap: Record<string, any> = {};
  if (Array.isArray(data)) {
    for (const p of data) {
      if (p?.routineId) progressMap[p.routineId] = p;
    }
  }

  return {
    progress: progressMap,
    progressList: Array.isArray(data) ? data : [],
    isLoading,
    error: error || data?.error,
    mutate,
  };
}
