mport { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// Force Supabase to NEVER cache requests in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function WatchDetailPage({ params }: { params: any }) {
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
  const youtubeId = watch.youtube_video_id;
  const voltage = watch.Voltage;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-indigo-200 hover:text-white mb-4 inline-block text-sm font-medium transition-colors">&larr; Back to Search</Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{watchName}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {youtubeId && youtubeId !== 'NULL' ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">How to Open: {watchName}</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe src={`https://www.youtube.com/embed/${youtubeId}`} className="w-full h-full" allowFullScreen></iframe>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-64">
               <p className="text-gray-500 font-medium">No tutorial video available yet.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Required Battery Match</h2>
            <div className="text-3xl font-black text-gray-900 mb-4">{requiresBattery ? batteryModel : 'Mechanical / Solar'}</div>
            {requiresBattery ? (
              <p className="text-sm text-gray-600">This watch requires a <span className="font-bold">{batteryModel}</span> battery.</p>
            ) : (
              <p className="text-sm text-gray-600">This watch is powered by movement or light and <span className="font-bold">does not require</span> a standard disposable battery.</p>
            )}
          </div>

          {requiresBattery && (
            <div className="space-y-3">
              <a href={`https://www.amazon.com/s?k=${batteryModel}+watch+battery`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors">Buy Battery on Amazon</a>
              <a href="https://www.amazon.com/s?k=watch+repair+kit" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl shadow transition-colors">Get Watch Repair Tool Kit</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
