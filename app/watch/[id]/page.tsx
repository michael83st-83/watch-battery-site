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
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-indigo-200 text-sm hover:text-white mb-2 inline-block font-medium">&larr; Back to Search</Link>
          <h1 className="text-3xl font-extrabold mt-1">{watch.brands?.name || 'Generic'} {watch.model_name !== 'N/A' ? watch.model_name : ''}</h1>
          <p className="text-indigo-100 text-lg">Model: {watch.model_number}</p>
        </div>
      </header>

      {/* Main Layout: 2-Column Grid on Desktop, Stacked on Mobile */}
      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Visuals */}
        <div className="flex gap-4 h-48 md:h-64">
           {/* Watch Image */}
           <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm">
             {watch.image_path ? (
                <img src={watch.image_path} alt="Watch" className="max-h-full object-contain" />
             ) : (
                <span className="text-xs font-medium text-gray-400 text-center">Watch Image<br/>Pending</span>
             )}
           </div>
           
           {/* Tool Kit / Battery Image Slot */}
           <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm relative">
             {compatiblePart?.image_path ? (
                <img src={compatiblePart.image_path} alt="Battery" className="max-h-full object-contain" />
             ) : (
                <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span className="text-[10px] font-medium text-gray-400 text-center uppercase tracking-wide">Required<br/>Tool Kit</span>
                </div>
             )}
           </div>
        </div>

        {/* RIGHT COLUMN: Buttons and Details (Above the fold) */}
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
        </div>

      </div>
    </main>
  );
}
