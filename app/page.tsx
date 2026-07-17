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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchWatches() {
      setLoading(true);
      const { data, error } = await supabase.rpc('search_watches', { 
        search_term: debouncedSearch 
      });
      if (!error && data) {
        setWatches(data);
      } else if (error) {
        console.error("Search error:", error);
      }
      setLoading(false);
    }
    fetchWatches();
  }, [debouncedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-indigo-700 text-white py-16 px-4 shadow-md">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          
          {/* Updated Typography Brand Logo */}
          <h1 className="flex items-center justify-center space-x-3 mb-6 select-none">
            <div className="bg-white text-indigo-700 font-black text-3xl md:text-4xl px-3 py-1 rounded-lg shadow-lg tracking-tighter transform -rotate-2 border-b-4 border-indigo-200">
              WBL
            </div>
            <div className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Watch <span className="text-indigo-300">Battery</span> Lookup
            </div>
          </h1>

          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto font-medium">The web's most comprehensive database for watch battery sizes, solar capacitors, and repair guides.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 relative z-10 flex-grow w-full">
        <div className="bg-white rounded-xl shadow-md p-2 mb-8 border border-gray-200">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <input
              type="search"
              spellCheck="false" 
              placeholder="Search by watch model or battery type (e.g., Seiko Prospex, SR927W)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-lg p-4 outline-none rounded-lg text-gray-900"
            />
          </form>
        </div>
        
        <div className="flex justify-between items-end mb-4 px-2">
          <h2 className="text-2xl font-bold text-gray-900">Watch Database</h2>
          {debouncedSearch && watches.length === 50 && (
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Showing top 50 results
            </span>
          )}
        </div>

        <div className="min-h-[50vh] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500 font-medium">Searching database...</td></tr>
                ) : watches.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-gray-500">No watches found matching &quot;{debouncedSearch}&quot;</td></tr>
                ) : (
                  watches.map((watch) => (
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

      <footer className="w-full bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. 
          </p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Watch Battery Lookup. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
