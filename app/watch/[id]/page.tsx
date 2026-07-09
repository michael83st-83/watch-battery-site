'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WatchPage() {
  const params = useParams();
  const [watch, setWatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!params?.id) return;
      const { data, error } = await supabase
        .from('watches')
        .select('*, brands(name), compatibility(parts(*))')
        .eq('id', params.id)
        .single();
      if (data) setWatch(data);
      setLoading(false);
    }
    fetchData();
  }, [params]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!watch) return <div className="p-12 text-center">Watch not found.</div>;

  const compatiblePart = watch.compatibility?.[0]?.parts;
  const batteryAmazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(compatiblePart?.part_name || 'watch battery')}+replacement`;
  const toolKitAmazonLink = `https://www.amazon.com/s?k=watch+back+removal+tool+kit`;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-indigo-700 text-white p-6 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-indigo-200 text-sm hover:text-white">&larr; Back to Search</Link>
          <h1 className="text-3xl font-bold mt-2">{watch.brands?.name} {watch.model_name}</h1>
          <p className="text-indigo-100">Model: {watch.model_number}</p>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* COMPACT VISUALS: Side-by-side to save vertical space */}
        <div className="flex gap-4">
          <div className="flex-1 aspect-square bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex items-center justify-center">
            {watch.image_path ? <img src={watch.image_path} className="object-contain max-h-full" /> : <span className="text-xs text-gray-400">Watch Image</span>}
          </div>
          <div className="flex-1 aspect-square bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex items-center justify-center">
            {compatiblePart?.image_path ? <img src={compatiblePart.image_path} className="object-contain max-h-full" /> : <span className="text-xs text-gray-400">Battery Image</span>}
          </div>
        </div>

        {/* BUTTONS: Always visible above the fold */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href={batteryAmazonLink} target="_blank" className="bg-[#FF9900] text-center font-bold py-4 rounded-xl shadow-md">Buy Battery on Amazon</a>
          <a href={toolKitAmazonLink} target="_blank" className="bg-gray-900 text-white text-center font-bold py-4 rounded-xl shadow-md">Get Repair Tool Kit</a>
        </div>

        {/* Details Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-xl mb-4">Required Battery: {compatiblePart?.part_name || 'Pending'}</h2>
          <p className="text-gray-600 text-sm">Type: {compatiblePart?.part_type || 'N/A'}</p>
        </div>
      </div>
    </main>
  );
}
