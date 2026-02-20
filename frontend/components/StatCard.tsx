interface StatCardProps { title: string; value: string; icon: React.ReactNode; trend: string; }

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-50 text-green-600">{trend}</span>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}