import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function WatchPage({ params }: { params: any }) {
  
  const resolvedParams = await params;
  const actualSlug = resolvedParams?.slug || resolvedParams?.id;

  const { data, error } = await supabase
    .from('Watch Batteries')
    .select('*')
    .eq('slug', actualSlug)
    .limit(1);

  const watch = data?.[0];

  if (error || !watch) {
    console.error("Fetch error or missing watch:", error);
    notFound();
  }

  const isMechanical = watch.power_type === 'mechanical';
  const isSolar = watch.power_type === 'solar';
  const rawModel = watch['Model Number'];
  
  const hasValidPowerModel = rawModel && rawModel !== 'N/A' && rawModel !== 'NULL' && rawModel.trim() !== '';

  const amazonSearchTerm = hasValidPowerModel 
    ? rawModel 
    : `${watch.watch_query} ${isSolar ? 'capacitor' : 'battery'}`;

  const displayModelTitle = hasValidPowerModel 
    ? rawModel 
    : (isSolar ? 'Solar Capacitor' : 'Battery');

  const videoId = watch.youtube_video_id || watch['youtube_video_id '] || null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-indigo-700 text-white py-8 md:py-12 px-4 shadow-md">
        {/* MOBILE FIX: Separated the back button from the flex layout so it stays top-left */}
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-block mb-6 text-indigo-200 hover:text-white transition-colors text-sm font-bold tracking-wider">&larr; Back to Search</Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-800 rounded-xl flex items-center justify-center shadow-inner border border-indigo-600 flex-shrink-0">
               <span className="text-3xl md:text-4xl">⌚</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mt-2 md:mt-0 leading-tight">{watch.watch_query}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 w-full flex-grow relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* MOBILE FIX: Added order-2 md:order-1. This puts the video on the bottom on mobile, but keeps it on the left on desktop. */}
          <div className="order-2 md:order-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">How to Open: {watch.watch_query}</h2>
            
            {videoId ? (
              <div className="flex-grow flex flex-col">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-gray-100 mb-3 border border-gray-200">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`How to replace battery in ${watch.watch_query}`}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight p-2 bg-gray-50 rounded border border-gray-100">
                  <strong className="text-gray-700">Disclaimer:</strong> The video above is for example and general guidelines only. It may not be entirely specific to your exact model, and quality/accuracy depends on third-party availability. If in doubt, please refer to your specific watch handbook or consult a professional.
                </p>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 flex-grow">
                <p className="text-gray-500 font-medium">Repair video coming soon.</p>
              </div>
            )}
          </div>

          {/* MOBILE FIX: Added order-1 md:order-2. This puts the Power Info & CTAs at the very top on mobile. */}
          <div className="order-1 md:order-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Required Power Source</h2>
              
              {isMechanical ? (
                 <div>
                   <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">Mechanical</div>
                   <p className="text-sm md:text-base text-gray-600">This watch uses an automatic or hand-wound mechanical movement. It does not require a battery.</p>
                 </div>
              ) : isSolar ? (
                 <div>
                   <div className="text-3xl md:text-4xl font-black text-green-600 mb-2 tracking-tight">{displayModelTitle}</div>
                   <p className="text-sm md:text-base text-gray-600">This is a solar-powered watch. It requires a specialized rechargeable capacitor{hasValidPowerModel ? '.' : ', not a standard battery.'}</p>
                 </div>
              ) : (
                 <div>
                   <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">{displayModelTitle}</div>
                   <p className="text-sm md:text-base text-gray-600">{hasValidPowerModel ? 'This watch requires a standard battery. Grab a replacement below.' : 'We are verifying the exact battery for this model. Try searching for your specific watch below.'}</p>
                 </div>
              )}
            </div>

            {!isMechanical && (
              <a href={`https://www.amazon.com/s?k=${encodeURIComponent(amazonSearchTerm)}`} target="_blank" rel="noopener noreferrer" 
                 className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-xs">Power</div>
                  <div>
                    <div className="text-sm font-bold text-orange-100 mb-1">
                      Buy Replacement {isSolar ? 'Capacitor' : 'Battery'}
                    </div>
                    <div className="text-lg md:text-xl font-bold">Amazon: {hasValidPowerModel ? rawModel : 'Search Matches'}</div>
                  </div>
                </div>
              </a>
            )}

            <a href="https://www.amazon.com/s?k=watch+repair+kit" target="_blank" rel="noopener noreferrer" 
               className="bg-gray-900 hover:bg-black text-white rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-[10px] text-center leading-tight">Tool<br/>Kit</div>
                <div>
                  <div className="text-sm font-bold text-gray-400 mb-1">Buy Recommended Tool</div>
                  <div className="text-lg md:text-xl font-bold">Amazon: Watch Repair Kit</div>
                </div>
              </div>
            </a>
            
          </div>
        </div>
      </main>
    </div>
  );
}
