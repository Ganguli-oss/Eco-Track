import { Leaf, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between max-w-7xl mx-auto mb-10">
      <div className="flex items-center gap-2">
        <div className="bg-green-600 p-2 rounded-xl">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">EcoTrack <span className="text-green-600">v1.0</span></h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Documentation</button>
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </header>
  );
}