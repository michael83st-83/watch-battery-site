'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('parts')
        .select('*');
      
      if (!error && data) {
        setParts(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredParts = parts.filter(part => 
    part.part_name?.toLowerCase().includes(search.toLowerCase()) ||
    part.part_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header Banner */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-6 shadow-md text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Watch Battery Lookup</h1>
        <p className="mt-2 text-blue-100 max-w-xl mx-auto text-sm">
          Quickly find exact replacement parts, battery types, and compatibility details.
        </p>
      </header>

      {/* Main Container */}
      <section className="max-w-6xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by battery name or type (e.g., CR2032)..."
            className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading inventory pipeline...</div>
        ) : filteredParts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No matching parts found in the database.</div>
        ) : (
          /* Inventory Table Grid */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                    <th className="p-4 font-semibold">Part Name</th>
                    <th className="p-4 font-semibold">Part Type</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-900">{part.part_name || 'Unnamed Part'}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
                          {part.part_type || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                          View Details &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
