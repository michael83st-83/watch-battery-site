import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
});

export default async function WatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
          {error ? `Supabase Error: ${error.message}` : `No watch found with ID: ${watchId}.`}
        </div>
        <Link href="/" className="text-indigo-600 hover:underline">← Back to Search</Link>
      </div>
    );
  }

  const watchName = watch.watch_query;
  const batteryModel = watch['Model Number'];
  const requiresBattery = watch.requires_battery;
  const voltage = watch.Voltage;
  const watchPic = watch['Picture url'];
  const rawYoutubeId = watch.youtube_video_id;

  let cleanYoutubeId = null;
  if (rawYoutubeId && rawYoutubeId !== 'NULL') {
    const urlMatch = rawYoutubeId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (urlMatch && urlMatch[1]) {
      cleanYoutubeId = urlMatch[1];
    } else if (rawYoutubeId.length === 11) {
      cleanYoutubeId = rawYoutubeId; 
    }
  }

  const affiliateTag = "YOUR_AFFILIATE_TAG_HERE";
  const amazonBatteryUrl = `https://www.amazon.com/s?k=${encodeURIComponent(batteryModel + ' watch battery')}&tag=${affiliateTag}`;
  const amazonToolKitUrl = `https://www.amazon.com/s?k=watch+repair+kit+back+remover&tag=${affiliateTag}`;

  const batteryPicUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23FF9900'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='white' font-weight='bold' dominant-baseline='middle' text-anchor='middle'%3EBattery%3C/text%3E%3C/svg%3E";
  const toolKitPicUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23111827'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='white' font-weight='bold' dominant-baseline='middle' text-anchor='middle'%3ETool Kit%3C/text%3E%3C/svg%3E";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to open and replace battery for ${watchName}`,
    "description": requiresBattery ? `Step-by-step guide to replacing the ${batteryModel} battery in a ${watchName}.` : `Maintenance and opening guide for the mechanical/solar ${watchName}.`,
    "tool": requiresBattery ? [{ "@type": "HowToTool", "name": "Watch Repair Kit" }, { "@type": "HowToTool", "name": `${batteryModel} Battery` }] : [{ "@type": "HowToTool", "name": "Watch Repair Kit" }]
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="bg-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          {watchPic && watchPic !== 'NULL' ? (
            <img src={watchPic} alt={watchName} className="w-24 h-24 object-cover rounded-lg shadow-sm bg-white" />
          ) : (
            <div className="w-24 h-24 bg-indigo-800 rounded-lg flex flex-col items-center justify-center text-xs text-center border border-indigo-600 text-indigo-200">
              <span className="text-2xl mb-1">⌚</span>
              No Image
            </div>
          )}
          <div>
            <Link href="/" className="text-indigo-200 hover:text-white mb-2 inline-block text-sm font-medium transition-colors">&larr; Back to Search</Link>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{watchName}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 flex flex-col md:grid md:grid-cols-2 gap-6">
        
        <div className="order-1 md:order-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Required Battery Match</h2>
            <div className="text-3xl font-black text-gray-900 mb-4">{requiresBattery ? batteryModel : 'Mechanical / Solar'}</div>
            
            {requiresBattery && voltage && (
              <div className="mb-4 inline-block bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                Voltage: {voltage}V
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              {requiresBattery 
                ? `This watch requires a ${batteryModel} battery. Grab a replacement below.` 
                : `This watch is powered by movement or light. While it doesn't need a battery, a repair kit is recommended for maintenance.`}
            </p>
          </div>

          <div className="space-y-4">
            {requiresBattery ? (
              <a href={amazonBatteryUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-[#FF9900] hover:bg-[#e38800] transition-colors p-4 rounded-xl shadow-md text-gray-900 font-bold group">
                <img src={batteryPicUrl} alt="Battery Placeholder" className="w-16 h-16 object-cover rounded bg-white shadow-inner" />
                <div>
                  <span className="block text-sm font-medium opacity-80">Buy Replacement Battery</span>
                  Amazon: {batteryModel} Battery
                </div>
              </a>
            ) : (
              <a href={amazonToolKitUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gray-900 hover:bg-black transition-colors p-4 rounded-xl shadow-md text-white group">
                <img src={toolKitPicUrl} alt="Tool Kit Placeholder" className="w-16 h-16 object-cover rounded bg-gray-800 shadow-inner" />
                <div>
                  <span className="block text-sm font-medium opacity-80">Buy Recommended Tool</span>
                  Amazon: Watch Repair Kit
                </div>
              </a>
            )}
          </div>
        </div>

        <div className="order-2 md:order-1 space-y-6">
          {cleanYoutubeId ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">How to Open: {watchName}</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe src={`https://www.youtube.com/embed/${cleanYoutubeId}`} className="w-full h-full" allowFullScreen></iframe>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-64">
               <p className="text-gray-500 font-medium">No tutorial video available yet.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
