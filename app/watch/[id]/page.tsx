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
      
      // Pointing to your new flat table
      const { data, error } = await supabase
        .from('Watch Batteries')
        .select('*')
        .eq('id', params.id)
        .single();
        
      if (data) setWatch(data);
      setLoading(false);
    }
    fetchData();
  }, [params]);

  if (loading) return <div className="p-12 text-center text-gray-500 font-medium">Loading watch details...</div>;
  if (!watch) return <div className="p-12 text-center text-gray-500 font-medium">Watch not found in database.</div>;

  // Mapping from your new table structure
  const batteryModel = watch['Model Number'];
  const watchName = watch.watch_query || 'Unknown Watch';
  
  const batteryAmazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(batteryModel || 'watch battery')}+replacement`;
  const toolKitAmazonLink = `https://www.amazon.com/s?k=watch+back+removal+tool+kit`;
  const youtubeSearchQuery = encodeURIComponent(`${watchName} watch battery replacement`);
  const youtubeEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${youtubeSearchQuery}`;

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 shadow-md">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-indigo-200 text-sm hover:text-white mb-2 inline-block font-medium">&larr; Back to Search</Link>
          <h1 className="text-3xl font-extrabold mt-1">{watchName}</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 md:p-6 mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 h-48 md:h-64">
             <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center shadow-sm">
               {watch['Picture url'] ? (
                  <img src={watch['Picture url']} alt="Watch" className="max-h-full object-contain" />
               ) : (
                  <span className="text-xs font-medium text-gray-400 text-center">Watch Image<br/>Pending</span>
               )}
             </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hidden lg:block">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">How to Open: {watchName}</h3>
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
               <iframe width="100%" height="100%" src={youtubeEmbedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {watch.requires_battery !== false ? (
            <>
              <a href={batteryAmazonLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#FF9900] hover:bg-[#E48A00] text-gray-900 text-center font-bold py-4 rounded-xl shadow-sm transition-colors text-lg">
                Buy Battery on Amazon
              </a>
              <a href={toolKitAmazonLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-gray-900 hover:bg-black text-white text-center font-bold py-4 rounded-xl shadow-sm transition-colors text-lg">
                Get Watch Repair Tool Kit
              </a>
            </>
          ) : (
            <a href={toolKitAmazonLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-[#FF9900] hover:bg-[#E48A00] text-gray-900 text-center font-bold py-4 rounded-xl shadow-sm transition-colors text-lg">
              Buy Watch Repair Toolkit (No Battery Required)
            </a>
          )}
          
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-2">
            <h2 className="text-sm uppercase tracking-wider font-bold text-gray-500 mb-1">Required Battery Match</h2>
            <div className="text-3xl font-black text-gray-900 mb-1">
              {watch.requires_battery !== false ? (batteryModel || 'Pending') : 'N/A (Mechanical/Solar)'}
            </div>
          </div>

          {watch.requires_battery !== false && (
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-2">
              <h3 className="font-bold text-gray-900 mb-4">Battery Specifications</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Voltage</span>
                  <span className="font-medium">{watch.Voltage ? `${watch.Voltage}V` : 'N/A'}</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
