import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Force Supabase to NEVER cache requests in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
  }
});

export default async function WatchDetailPage({ params }: { params: any }) {
 
  // Await the params object to fix the Next.js 15 "NaN" URL bug
  const resolvedParams = await params;
  const watchId = Number(resolvedParams.id);

  const { data: watch, error } = await supabase
    .from('Watch Batteries')
    .select('*')
    .eq('id', watchId)
    .single();

  if (error || !watch) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Watch Not Found</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 max-w-md text-center text-sm font-mono break-words shadow-sm">
          {error ? `Supabase Error: ${error.message} (Code: ${error.code})` : `No watch found with ID: ${watchId} in the database.`}
        </div>
        <Link href="/" className="text-indigo-600 hover:underline">← Back to Search</Link>
      </div>
    );
  }

  const watchName = watch.watch_query;
  const batteryModel = watch['Model Number'];
  const requiresBattery = watch.requires_battery;
  const rawYoutubeId = watch.youtube_video_id;
  const voltage = watch.Voltage;
  const pictureUrl = watch['Picture url'];

  // SAFEGUARD: Extract 11-character video ID in case AI saves full URL
  let cleanYoutubeId = rawYoutubeId;
  if (rawYoutubeId && rawYoutubeId !== 'NULL') {
    const urlMatch = rawYoutubeId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (urlMatch && urlMatch[1]) {
      cleanYoutubeId = urlMatch[1];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-indigo-200 hover:text-white mb-4 inline-block text-sm font-medium transition-colors">&larr; Back to Search</Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{watchName}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
       
        {/* LEFT COLUMN: Watch Picture & YouTube Video */}
        <div className="space-y-6">
         
          {/* Watch Picture from Supabase */}
          {pictureUrl && pictureUrl !== 'NULL' && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-center items-center bg-gray-50">
              {/* Using a standard img tag so external Supabase URLs work easily */}
              <img src={pictureUrl} alt={watchName} className="max-h-72 object-contain rounded-lg drop-shadow-md" />
            </div>
          )}

          {/* YouTube Video */}
          {cleanYoutubeId && cleanYoutubeId !== 'NULL' ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">How to Open: {watchName}</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe src={`https://www.youtube.com/embed/${cleanYoutubeId}`} className="w-full h-full" allowFullScreen></iframe>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-64">
               <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
               <p className="text-gray-500 font-medium">No tutorial video available yet.</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Specs, Battery Matches & Tools */}
        <div className="space-y-6">
         
          {/* Main Info Box */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Required Battery Match</h2>
            <div className="text-3xl font-black text-gray-900 mb-4">{requiresBattery ? batteryModel : 'Mechanical / Solar'}</div>
            {requiresBattery ? (
              <p className="text-sm text-gray-600">This watch requires a <span className="font-bold">{batteryModel}</span> battery. We recommend silver oxide for longevity.</p>
            ) : (
              <p className="text-sm text-gray-600">This watch is powered by movement or light and <span className="font-bold">does not require</span> a standard disposable battery.</p>
            )}
          </div>

          {/* Specifications Box (Restored) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Specifications</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <dt className="text-gray-500">Requires Battery</dt>
                <dd className="font-medium text-gray-900">{requiresBattery ? 'Yes' : 'No'}</dd>
              </div>
              {requiresBattery && voltage && (
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="text-gray-500">Voltage</dt>
                  <dd className="font-medium text-gray-900">{voltage}V</dd>
                </div>
              )}
            </dl>
          </div>

          {/* ACTION BUTTONS & PRODUCT IMAGES */}
          {requiresBattery ? (
            /* IF WATCH NEEDS A BATTERY: Show Grid with Battery AND Tool Kit */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             
              {/* Battery Product Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full mb-3 flex items-center justify-center text-4xl shadow-inner border border-gray-100">
                  {/* You can replace this emoji with a real Amazon image link later */}
                  🔋
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">Replacement Battery</h4>
                <a href={`https://www.amazon.com/s?k=${batteryModel}+watch+battery`} target="_blank" rel="noopener noreferrer" className="w-full block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-3 rounded-lg text-sm shadow transition-colors">
                  Buy on Amazon
                </a>
              </div>

              {/* Tool Kit Product Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-between text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full mb-3 flex items-center justify-center text-4xl shadow-inner border border-gray-100">
                  {/* You can replace this emoji with a real Amazon image link later */}
                  🛠️
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-3">Watch Repair Kit</h4>
                <a href="https://www.amazon.com/s?k=watch+repair+kit" target="_blank" rel="noopener noreferrer" className="w-full block bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-3 rounded-lg text-sm shadow transition-colors">
                  Get Tool Kit
                </a>
              </div>
            </div>
          ) : (
            /* IF MECHANICAL/SOLAR: Show ONLY the Tool Kit, but make it wide! */
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex-shrink-0 flex items-center justify-center text-5xl shadow-inner border border-gray-100">
                {/* You can replace this emoji with a real Amazon image link later */}
                🛠️
              </div>
              <div className="flex flex-col flex-grow text-center sm:text-left">
                <h4 className="font-bold text-gray-900 mb-2">Maintain Your Watch</h4>
                <p className="text-sm text-gray-600 mb-4">Even mechanical watches need care. A standard tool kit is perfect for adjusting metal bracelets, swapping straps, and safely opening case backs.</p>
                <a href="https://www.amazon.com/s?k=watch+repair+kit" target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-bold py-2.5 px-6 rounded-lg text-sm shadow transition-colors text-center">
                  Get Watch Repair Tool Kit
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
