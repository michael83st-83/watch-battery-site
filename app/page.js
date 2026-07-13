'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [watches, setWatches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Querying your new flat table directly
      const { data, error } = await supabase
        .from('Watch Batteries')
        .select('*')
        .order('watch_query', { ascending: true });

      if (data) {
        setWatches(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedSearch = normalize(search);

  // Filter against the new column names
  const filteredWatches = watches.filter(watch => {
    if (!normalizedSearch) return true; 
    return normalize(watch.watch_query).includes(normalizedSearch) || 
           normalize(watch['Model Number']).includes(normalizedSearch);
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-6 shadow-md text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Watch Battery Lookup</h1>
        <p className="mt-2 text-blue-100 max-w-xl mx-auto text-sm">Quickly find exact replacement parts, battery types, and compatibility details.</p>
      </header>

      <section className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <input 
            type="text" 
            placeholder="Search by watch model or battery type (e.g., Seiko Prospex, SR927W)..." 
            className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={handleKeyDown} 
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading inventory pipeline...</div>
        ) : (
          <div className="space-y-12">
            
            {/* UNIFIED DATABASE TABLE */}
            {(filteredWatches.length > 0 || normalizedSearch) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Watch Database</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                        <th className="p-4 font-semibold">Watch Model</th>
                        <th className="p-4 font-semibold hidden sm:table-cell">Battery Required</th>
                        <th className="p-4 font-semibold text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredWatches.map((watch) => (
                        <tr key={watch.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="text-sm font-bold text-gray-900">
                              {watch.watch_query || 'Unknown Watch'}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-700 hidden sm:table-cell">
                            {watch.requires_battery !== false ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
                                {watch['Model Number'] || 'Unknown'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-800 border border-orange-100">
                                None (Mechanical/Solar)
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <Link href={`/watch/${watch.id}`} className="inline-block bg-indigo-600 text-white text-center py-2 px-6 rounded-lg font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors">
                              View Details &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {filteredWatches.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">No matches found in the database.</div>
            )}

          </div>
        )}
      </section>
    </main>
  );
}
