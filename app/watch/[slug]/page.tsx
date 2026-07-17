import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function WatchPage({ params }: { params: any }) {
  
  // THE FIX: Newer Next.js versions require params to be awaited!
  const resolvedParams = await params;
  const actualSlug = resolvedParams?.slug || resolvedParams?.id;

  const { data, error } = await supabase
    .from('Watch Batteries')
    .select('*')
    .eq('slug', actualSlug)
    .limit(1);

  const watch = data?.[0];

  // DIAGNOSTIC SCREEN: If it fails, it prints exactly what Next.js is doing
  if (error || !watch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full border-t-4 border-red-500 font-mono text-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Database Fetch Failed</h1>
          <div className="space-y-4 text-gray-700">
            <p><strong className="text-indigo-600">Raw Next.js Params:</strong> {JSON.stringify(resolvedParams)}</p>
            <p><strong className="text-indigo-600">Resolved Slug:</strong> {actualSlug || 'UNDEFINED'}</p>
            <p><strong className="text-red-600">Supabase Error:</strong> {JSON.stringify(error || 'None')}</p>
            <p><strong className="text-amber-600">Data Array Returned:</strong> {JSON.stringify(data)}</p>
          </div>
          <Link href="/" className="mt-8 inline-block bg-gray-900 text-white px-6 py-2 rounded-lg font-bold">Go Back</Link>
        </div>
      </div>
    );
  }

  // --- NORMAL UI CODE ---
  const isMechanical = watch.power_type === 'mechanical';
  const isSolar = watch.power_type === 'solar';
  const hasBattery = !isMechanical && !isSolar && watch['Model Number'] && watch['Model Number'] !== 'N/A' && watch['Model Number'] !== 'NULL';

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-indigo-800 rounded-xl flex items-center justify-center shadow-inner border border-indigo-600 flex-shrink-0">
             <span className="text-4xl">⌚</span>
          </div>
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block mb-2 text-indigo-200 hover:text-white transition-colors text-sm font-bold tracking-wider">&larr; Back to Search</Link>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{watch.watch_query}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 w-full flex-grow relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">How to Open: {watch.watch_query}</h2>
            {watch.youtube_embed ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-gray-100 flex-grow">
                <iframe
                  src={watch.youtube_embed}
                  title={`How to replace battery in ${watch.watch_query}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 flex-grow">
                <p className="text-gray-500 font-medium">Repair video coming soon.</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Required Power Source</h2>
              
              {isMechanical ? (
                 <div>
                   <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Mechanical</div>
                   <p className="text-gray-600">This watch uses an automatic or hand-wound mechanical movement. It does not require a battery.</p>
                 </div>
              ) : isSolar ? (
                 <div>
                   <div className="text-4xl font-black text-green-600 mb-2 tracking-tight">Solar Capacitor</div>
                   <p className="text-gray-600">This is a solar-powered watch. It requires a specialized rechargeable capacitor, not a standard battery.</p>
                 </div>
              ) : hasBattery ? (
                 <div>
                   <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{watch['Model Number']}</div>
                   <p className="text-gray-600">This watch requires a standard battery. Grab a replacement below.</p>
                 </div>
              ) : (
                 <div>
                   <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Unknown</div>
                   <p className="text-gray-600">We are currently verifying the exact battery type for this model.</p>
                 </div>
              )}
            </div>

            {hasBattery && (
              <a href={`https://www.amazon.com/s?k=watch+battery+${watch['Model Number']}`} target="_blank" rel="noopener noreferrer" 
                 className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-xs">Power</div>
                  <div>
                    <div className="text-sm font-bold text-orange-100 mb-1">Buy Replacement Battery</div>
                    <div className="text-xl font-bold">Amazon: {watch['Model Number']}</div>
                  </div>
                </div>
              </a>
            )}

            {!isMechanical && (
              <a href="https://www.amazon.com/s?k=watch+repair+kit" target="_blank" rel="noopener noreferrer" 
                 className="bg-gray-900 hover:bg-black text-white rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-[10px] text-center leading-tight">Tool<br/>Kit</div>
                  <div>
                    <div className="text-sm font-bold text-gray-400 mb-1">Buy Recommended Tool</div>
                    <div className="text-xl font-bold">Amazon: Watch Repair Kit</div>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
