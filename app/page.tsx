'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [watches, setWatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWatches() {
      const { data, error } = await supabase
        .from('Watch Batteries')
        .select('*')
        .order('watch_query', { ascending: true });
      if (!error && data) setWatches(data);
      setLoading(false);
    }
    fetchWatches();
  }, []);

  const filteredWatches = watches.filter(watch => 
    watch.watch_query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (watch['Model Number'] && watch['Model Number'].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Magic function to hide the mobile keyboard on "Enter" or "Search"
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-indigo-700 text-white py-16 px-4 shadow-md">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Watch Battery Lookup</h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">Quickly find exact replacement parts, battery types, and compatibility details.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 relative z-10">
        <div className="bg-white rounded-xl shadow-md p-2 mb-8 border border-gray-200">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <input
              type="search"
              placeholder="Search by watch model or battery type (e.g., Seiko Prospex, SR927W)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-lg p-4 outline-none rounded-lg text-gray-900"
            />
          </form>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 px-2">Watch Database</h2>
        <div className="min-h-[60vh] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-semibold">Watch Model</th>
                  <th className="p-4 font-semibold hidden sm:table-cell">Power Type</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">Loading database...</td></tr>
                ) : filteredWatches.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">No watches found matching &quot;{searchTerm}&quot;</td></tr>
                ) : (
                  filteredWatches.map((watch) => (
                    <tr key={watch.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4"><div className="text-sm font-bold text-gray-900">{watch.watch_query}</div></td>
                      <td className="p-4 text-sm hidden sm:table-cell">
                        {watch.power_type === 'mechanical' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Mechanical</span>
                        ) : watch.power_type === 'solar' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Solar</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {watch['Model Number'] && watch['Model Number'] !== 'N/A' && watch['Model Number'] !== 'NULL' ? watch['Model Number'] : 'Battery'}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/watch/${watch.id}`} className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm">View Details &rarr;</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
