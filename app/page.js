'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [parts, setParts] = useState([]);
  const [watches, setWatches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Added your new junk terms to the arrays
      const junkNumbers = ['Pending', 'Unknown', 'Not Listed', 'Not listed', 'Not Available', 'None', 'Watch', 'N/A', 'Generic/Compatible', 'Not specified', 'General'];
      const junkNames = ['Pending', 'Unknown', 'Not Listed', 'Not listed', 'Not Available', 'None', 'Not specified', 'Generic/Compatible', 'N/A', 'General'];

      const [partsResponse, watchesResponse] = await Promise.all([
        supabase.from('parts').select('*, brands(name)'),
        supabase
          .from('watches')
          .select('*, brands(name)')
          .not('model_number', 'is', null)
          .not('model_number', 'in', `(${junkNumbers.join(',')})`) 
          .not('model_name', 'in', `(${junkNames.join(',')})`)
      ]);
      
      const cleanWatches = (watchesResponse.data || []).filter(w => 
        !junkNames.includes(w.model_name) && !junkNumbers.includes(w.model_number)
      );

      if (partsResponse.data) setParts(partsResponse.data);
      setWatches(cleanWatches);
      setLoading(false);
    }
    fetchData();
  }, []);

  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normalizedSearch = normalize(search);

  const filteredParts = parts.filter(part => {
    if (!normalizedSearch) return true; 
    return normalize(part.part_name).includes(normalizedSearch) || normalize(part.part_type).includes(normalizedSearch);
  });

  const filteredWatches = watches.filter(watch => {
    if (!normalizedSearch) return true; 
    return normalize(watch.model_name).includes(normalizedSearch) || normalize(watch.model_number).includes(normalizedSearch) || normalize(watch.brands?.name).includes(normalizedSearch);
  });

  // Hides the mobile keyboard when the user presses Enter
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
            placeholder="Search by watch model or battery type (e.g., Casio F-91W, CR2032)..." 
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
            
            {/* WATCHES TABLE */}
            {(filteredWatches.length > 0 || normalizedSearch) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Watch Models</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                        <th className="p-4 font-semibold">Brand & Model</th>
                        <th className="p-4 font-semibold hidden sm:table-cell">Model Number</th>
                        <th className="p-4 font-semibold text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredWatches.map((watch) => (
                        <tr key={watch.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">
                              {watch.brands?.name || 'Generic'}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">
                              {watch.model_name !== 'N/A' ? watch.model_name : 'Unknown'}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-700 hidden sm:table-cell">{watch.model_number !== 'N/A' ? watch.model_number : 'Unknown'}</td>
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

            {/* BATTERIES TABLE */}
            {(filteredParts.length > 0 || normalizedSearch) && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Battery Types</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                        <th className="p-4 font-semibold">Part Name</th>
                        <th className="p-4 font-semibold hidden sm:table-cell">Part Type</th>
                        <th className="p-4 font-semibold text-right pr-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredParts.map((part) => (
                        <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-bold text-gray-900">{part.part_name || 'Unnamed Part'}</td>
                          <td className="p-4 hidden sm:table-cell">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100">
                              {part.part_type || 'Unknown'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Link href={`/battery/${part.id}`} className="inline-block bg-blue-600 text-white text-center py-2 px-6 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors">
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

          </div>
        )}
      </section>
    </main>
  );
}
