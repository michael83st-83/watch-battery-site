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

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">Loading watch details...</div>;
  if (!watch) return <div className="p-12 text-center text-gray-500 font-medium">Watch not found in database.</div>;

  const compatiblePart = watch.compatibility?.[0]?.parts;
  const batteryAmazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(compatiblePart?.part_name || 'watch battery')}+replacement`;
  const toolKitAmazonLink = `https://www.amazon.com/s?k=watch+back+removal+tool+kit`;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-indigo-200 text-sm hover:text-white mb-2 inline-block font-medium">&larr; Back to Search</Link>
          <h1 className="text-3xl font-extrabold mt-1">{watch.brands?.name || 'Generic'} {watch.model_name !== 'N/A' ? watch.model_name : ''}</h1>
          <p className="text-indigo-100 text-lg">Model: {watch.model_number}</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Visuals & Video Gap */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 h-48 md:h-64">
             {/* Watch Image */}
             <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm">
               {watch.image_path ? (
                  <img src={watch.image_path} alt="Watch" className="max-h-full object-contain" />
               ) : (
                  <span className="text-xs font-medium text-gray-400 text-center">Watch Image<br/>Pending</span>
               )}
             </div>
             
             {/* Battery Image */}
             <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm">
               {compatiblePart?.image_path ? (
                  <img src={compatiblePart.image_path} alt="Battery" className="max-h-full object-contain" />
               ) : (
                  <span className="text-xs font-medium text-gray-400 text-center">Battery Image<br/>Pending</span>
               )}
             </div>
          </div>

          {/* YouTube Video Placeholder (Fills the gap perfectly) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hidden lg:block">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">How to Open a {watch.brands?.name || 'Watch'} Backing</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
               <span className="text-gray-400 font-medium">YouTube Video Embed Space</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Buttons and Details */}
        <div className="flex flex-col gap-4">
          <a href={batteryAmazonLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#FF9900] hover:bg-[#E48A00] text-gray-900 text-center font-bold py-4 rounded-xl shadow-sm transition-colors text-lg">
            Buy Battery on Amazon
          </a>
          <a href={toolKitAmazonLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-gray-900 hover:bg-black text-white text-center font-bold py-4 rounded-xl shadow-sm transition-colors text-lg">
            Get Watch Repair Tool Kit
          </a>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-2">
            <h2 className="text-sm uppercase tracking-wider font-bold text-gray-500 mb-1">Required Battery Match</h2>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {compatiblePart?.part_name || 'Pending'}
            </div>
            <p className="text-gray-600 font-medium">Type: {compatiblePart?.part_type || 'N/A'}</p>
          </div>

          {/* Tech Specs */}
          {compatiblePart && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-2">
              <h3 className="font-bold text-gray-900 mb-4">Battery Specifications</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium">{compatiblePart.brands?.name || 'Generic'}</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Diameter</span>
                  <span className="font-medium">{compatiblePart.diameter || 'N/A'}</span>
                </li>
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Thickness</span>
                  <span className="font-medium">{compatiblePart.thickness || 'N/A'}</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
