"use client";
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export interface DashboardStats {
  total: number;
  avg: number;
  cost: number;
  leaderboard: { region: string; avg: number }[];
}

export default function CarbonChart({
  regionFilter,
  onStatsUpdate,
  timeRange,
}: {
  regionFilter: string;
  onStatsUpdate: (s: DashboardStats) => void;
  timeRange: string;
}) {
  const [data, setData] = useState<any[]>([]);
  const [left, setLeft] = useState<string | number>("dataMin");
  const [right, setRight] = useState<string | number>("dataMax");
  const [refAreaLeft, setRefAreaLeft] = useState<string | number>("");
  const [refAreaRight, setRefAreaRight] = useState<string | number>("");

  const fetchData = useCallback(async () => {
    // 1. Fetch data, but ensure we order by newest first to get the most recent 30 days
    let baseQuery = supabase
      .from("carbon_logs")
      .select("*")
      .order("created_at", { ascending: false }); // Change to descending to get newest records first

    if (timeRange !== "All") {
      const now = new Date();
      if (timeRange === "Day") now.setHours(now.getHours() - 24);
      if (timeRange === "Week") now.setDate(now.getDate() - 7);
      if (timeRange === "Month") now.setDate(now.getDate() - 30); // Use 30 days for Month
      baseQuery = baseQuery.gte("created_at", now.toISOString());
    }

    const { data: allLogs } = await baseQuery;

    if (allLogs && allLogs.length > 0) {
      // Leaderboard remains global
      const regionsMap: Record<string, { total: number; count: number }> = {};
      allLogs.forEach((log) => {
        if (!regionsMap[log.region])
          regionsMap[log.region] = { total: 0, count: 0 };
        regionsMap[log.region].total += log.carbon_output;
        regionsMap[log.region].count += 1;
      });

      const globalLeaderboard = Object.keys(regionsMap)
        .map((name) => ({
          region: name,
          avg: Math.round(regionsMap[name].total / regionsMap[name].count),
        }))
        .sort((a, b) => a.avg - b.avg);

      const chartLogs =
        regionFilter === "All"
          ? allLogs
          : allLogs.filter((l) => l.region === regionFilter);

      // IMPORTANT: Reverse the logs back to chronological order (Oldest -> Newest) for the chart
      const chronologicalLogs = [...chartLogs].reverse();

      const rawFormatted = chronologicalLogs.map((l) => {
        const d = new Date(l.created_at);
        return {
          // Create a more precise date key to avoid overlap
          dateKey: d.toLocaleDateString([], { month: "short", day: "numeric" }),
          timeKey: d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          carbon: l.carbon_output,
          timestamp: d.getTime(), // used for final sorting
        };
      });

      let finalChartData;
      if (timeRange === "Month" || timeRange === "Week") {
        const grouped: Record<string, { total: number; count: number }> = {};
        rawFormatted.forEach((d) => {
          if (!grouped[d.dateKey]) grouped[d.dateKey] = { total: 0, count: 0 };
          grouped[d.dateKey].total += d.carbon;
          grouped[d.dateKey].count += 1;
        });

        // Ensure the grouped dates are sorted correctly
        finalChartData = Object.keys(grouped).map((date) => ({
          time: date,
          carbon: Math.round(grouped[date].total / grouped[date].count),
        }));
      } else {
        finalChartData = rawFormatted.map((d) => ({
          time: d.timeKey,
          carbon: d.carbon,
        }));
      }

      setData(finalChartData);

      onStatsUpdate({
        total: chartLogs.reduce((sum, item) => sum + item.carbon_output, 0),
        avg: Math.round(
          chartLogs.reduce((sum, item) => sum + item.carbon_output, 0) /
            chartLogs.length,
        ),
        cost:
          (chartLogs.reduce((sum, item) => sum + item.carbon_output, 0) /
            1000) *
          0.05,
        leaderboard: globalLeaderboard,
      });
    }
  }, [regionFilter, onStatsUpdate, timeRange]);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel("chart-sync")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "carbon_logs" },
        () => fetchData(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  return (
    <div className="w-full h-[400px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} minTickGap={30} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="carbon"
            stroke="#10b981"
            dot={timeRange === "Month"}
            strokeWidth={2}
            fillOpacity={0.1}
            fill="#10b981"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
