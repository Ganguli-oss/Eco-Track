"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import CarbonChart, { DashboardStats } from "../components/CarbonChart";
import { Leaf, Zap, Landmark, Globe, AlertTriangle } from "lucide-react";

// Helper function to add visual flags to the leaderboard
const getFlag = (region: string) => {
  const flags: Record<string, string> = {
    "Sri Lanka": "🇱🇰", "USA": "🇺🇸", "France": "🇫🇷", "India": "🇮🇳", "China": "🇨🇳",
    "Germany": "🇩🇪", "Norway": "🇳🇴", "Australia": "🇦🇺", "Canada": "🇨🇦", "Japan": "🇯🇵",
    "Brazil": "🇧🇷", "Singapore": "🇸🇬", "South Africa": "🇿🇦", "Sweden": "🇸🇪", "Denmark": "🇩🇰",
    "South Korea": "🇰🇷", "Italy": "🇮🇹", "Mexico": "🇲🇽", "United Kingdom": "🇬🇧", "Netherlands": "🇳🇱",
    "Spain": "🇪🇸", "Russia": "🇷🇺", "Turkey": "🇹🇷", "Argentina": "🇦🇷", "Egypt": "🇪🇬",
    "Indonesia": "🇮🇩", "Saudi Arabia": "🇸🇦", "Poland": "🇵🇱"
  };
  return flags[region] || "🏳️";
};

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0, avg: 0, cost: 0, leaderboard: [],
  });
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [timeRange, setTimeRange] = useState<string>("Month");

  return (
    <main className="min-h-screen bg-gray-50 p-8 pb-20">
      <Header />
      <div className="max-w-7xl mx-auto mt-10 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Carbon" value={`${(stats.total / 1000).toFixed(2)} kg`} icon={<Leaf className="text-green-500" />} trend={timeRange} />
          <StatCard title="Avg Intensity" value={`${stats.avg} g/kWh`} icon={<Zap className="text-orange-500" />} trend="Global Avg" />
          <StatCard title="Carbon Cost" value={`$${stats.cost.toFixed(2)}`} icon={<Landmark className="text-blue-500" />} trend="USD" />
        </div>

        {/* Chart View */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {["Day", "Week", "Month"].map((r) => (
                <button key={r} onClick={() => setTimeRange(r)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === r ? "bg-white text-green-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                  {r}
                </button>
              ))}
            </div>
            <select className="text-xs font-bold text-green-700 bg-green-50 px-4 py-2 rounded-xl border-none outline-none" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              <option value="All">Global View 🌍</option>
              <option value="Sri Lanka">Sri Lanka 🇱🇰</option>
              <option value="USA">USA 🇺🇸</option>
              <option value="France">France 🇫🇷</option>
              <option value="India">India 🇮🇳</option>
              <option value="China">China 🇨🇳</option>
              <option value="Germany">Germany 🇩🇪</option>
              <option value="Norway">Norway 🇳🇴</option>
              <option value="Australia">Australia 🇦🇺</option>
              <option value="Canada">Canada 🇨🇦</option>
              <option value="Japan">Japan 🇯🇵</option>
              <option value="Brazil">Brazil 🇧🇷</option>
              <option value="Singapore">Singapore 🇸🇬</option>
              <option value="South Africa">South Africa 🇿🇦</option>
              <option value="Sweden">Sweden 🇸🇪</option>
              <option value="Denmark">Denmark 🇩🇰</option>
              <option value="South Korea">South Korea 🇰🇷</option>
              <option value="Italy">Italy 🇮🇹</option>
              <option value="Mexico">Mexico 🇲🇽</option>
              <option value="United Kingdom">UK 🇬🇧</option>
              <option value="Netherlands">Netherlands 🇳🇱</option>
              <option value="Spain">Spain 🇪🇸</option>
              <option value="Russia">Russia 🇷🇺</option>
              <option value="Turkey">Turkey 🇹🇷</option>
              <option value="Argentina">Argentina 🇦🇷</option>
              <option value="Egypt">Egypt 🇪🇬</option>
              <option value="Indonesia">Indonesia 🇮🇩</option>
              <option value="Saudi Arabia">Saudi Arabia 🇸🇦</option>
              <option value="Poland">Poland 🇵🇱</option>
            </select>
          </div>
          <CarbonChart regionFilter={selectedRegion} onStatsUpdate={setStats} timeRange={timeRange} />
        </div>

        {/* 🏆 THE LEADERBOARD TABLES WITH FLAGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-green-700 mb-4 flex items-center gap-2"><Leaf size={16} /> Top 5 Cleanest</h3>
            <div className="space-y-2">
              {stats.leaderboard.slice(0, 5).map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-3 bg-green-50 rounded-xl border border-green-100">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <span className="text-lg">{getFlag(item.region)}</span> {item.region}
                  </span>
                  <span className="font-bold text-green-600">{item.avg} g/kWh</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-red-700 mb-4 flex items-center gap-2"><AlertTriangle size={16} /> Heaviest Polluters</h3>
            <div className="space-y-2">
              {[...stats.leaderboard].reverse().slice(0, 5).map((item, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="font-medium text-slate-700 flex items-center gap-2">
                    <span className="text-lg">{getFlag(item.region)}</span> {item.region}
                  </span>
                  <span className="font-bold text-red-600">{item.avg} g/kWh</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}