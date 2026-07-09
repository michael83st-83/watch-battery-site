'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Home() {
  const [parts, setParts] = useState([]);
  const [watches, setWatches] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [partsResponse, watchesResponse] = await Promise.all([
        supabase.from('parts').select('*, brands(name)'),
        supabase.from('watches').select('*, brands(name)')
          .not('model_number', 'in', '("Pending", "Unknown", "Not Listed", "Watch", "N/A", "Generic/Compatible", "Not specified", "General")')
          .not('model_name', 'in', '("Pending", "Unknown", "Not Listed", "Not specified", "Generic/Compatible", "N/A", "General")')
      ]);
      if (partsResponse.data) setParts(partsResponse.data);
      if (watchesResponse.data) setWatches(watchesResponse.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // ... (Keep your existing normalize and filter functions here)

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <input className="w-full p-4 border rounded-xl mb-8" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {/* ... (Watches Table) */}
      <Link href={`/watch/${watch.id}`} className="block bg-indigo-600 text-white text-center py-2 px-4 rounded-lg font-bold text-sm">
        View Details &rarr;
      </Link>
    </main>
  );
}
