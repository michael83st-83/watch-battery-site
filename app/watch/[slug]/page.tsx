import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { generateStructuredContent, parseWatchDetails } from '../../../lib/watchContentEngine';

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 86400;

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

  const content = generateStructuredContent(watch);
  const parsed = parseWatchDetails(watch.watch_query, watch.power_type);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faq.map((item: any) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  const isAutomatic = watch.power_type === 'automatic' || watch.power_type === 'mechanical';
  const isSmartwatch = watch.power_type === 'smartwatch';
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
  const brand = watch.watch_query.split(' ')[0];
  
  const { data: relatedWatches } = await supabase
    .from('Watch Batteries')
    .select('watch_query, slug, power_type')
    .ilike('watch_query', `${brand}%`)
    .neq('slug', actualSlug)
    .limit(4);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-indigo-700 text-white py-8 md:py-12 px-4 shadow-md">
        <div className="max-w-4xl mx-auto">
          <Link href={`/brands/${brand.toLowerCase()}`} prefetch={false} className="inline-block mb-6 text-indigo-200 hover:text-white transition-colors text-sm font-bold tracking-wider">&larr; Back to {brand}</Link>
          
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
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <nav className="flex text-[11px] md:text-xs text-gray-500 mb-6 font-medium overflow-x-auto whitespace-nowrap pb-2" aria-label="Breadcrumb">
          <Link href="/" prefetch={false} className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/brands" prefetch={false} className="hover:text-indigo-600">Brands</Link>
          <span className="mx-2">›</span>
          <Link href={`/brands/${brand.toLowerCase()}`} prefetch={false} className="hover:text-indigo-600">{brand}</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900 truncate">{watch.watch_query}</span>
        </nav>

        <div className="bg-white border-l-4 border-indigo-600 p-5 mb-8 rounded-xl shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Quick Answer</h2>
          <p className="text-base md:text-lg text-gray-800 leading-relaxed font-medium">{content.quickAnswer}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="order-2 md:order-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            {videoId && videoId !== 'NULL' && videoId !== 'NOT_FOUND' ? (
              <div className="flex-grow flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 mb-2 border-b pb-2">{content.headingHowTo}</h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{content.sectionHowTo}</p>
                
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-gray-100 mb-3 border border-gray-200 mt-auto">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`Video guide for ${watch.watch_query}`}
                    className="absolute top-0 left-0 w-full h-full"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <p className="text-[11px] text-gray-500 leading-tight p-2 bg-gray-50 rounded border border-gray-100 mt-3">
                  <strong className="text-gray-700">Disclaimer:</strong> The video above is for example and general guidelines only. It may not be entirely specific to your exact model, and quality/accuracy depends on third-party availability. If in doubt, please refer to your specific watch handbook or consult a professional.
                </p>
              </div>
            ) : (
              <div className="flex-grow flex flex-col justify-center text-center bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">{isSmartwatch ? '🔋' : isSolar ? '☀️' : isAutomatic ? '🔄' : '🧰'}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{isSmartwatch ? 'Premium Charging Docks' : isSolar ? 'Solar Watch Accessories' : isAutomatic ? 'Protect Your Timepiece' : 'Watch Maintenance & Tools'}</h3>
                <p className="text-sm text-gray-500 mb-6">{isSmartwatch ? 'Organize your nightstand and keep your smartwatch powered with a sleek charging station.' : isSolar ? 'Keep your solar watch charged with specialized solar watch lamps and chargers.' : isAutomatic ? 'Keep your luxury automatic watch running perfectly with a premium watch winder.' : 'Open watch backs safely and replace batteries at home with precision tool kits.'}</p>
                <a href={isSmartwatch ? 'https://www.amazon.com/s?k=smartwatch+charging+stand' : isSolar ? 'https://www.amazon.com/s?k=solar+watch+charger+lamp' : isAutomatic ? 'https://www.amazon.com/s?k=automatic+watch+winder' : 'https://www.amazon.com/s?k=watch+repair+kit'} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-900 text-white font-bold py-3 px-6 rounded-lg hover:bg-black transition-colors">
                  {isSmartwatch ? 'View Charging Stations' : isSolar ? 'View Solar Accessories' : isAutomatic ? 'View Recommended Winders' : 'View Repair Tool Kits'}
                </a>
              </div>
            )}
          </div>

          <div className="order-1 md:order-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Required Power Source</h2>
              {isAutomatic ? (<div><div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">Mechanical</div><p className="text-sm md:text-base text-gray-600">This watch uses an automatic or hand-wound mechanical movement. It does not require a battery.</p></div>) : isSmartwatch ? (<div><div className="text-3xl md:text-4xl font-black text-indigo-600 mb-2 tracking-tight">Smartwatch</div><p className="text-sm md:text-base text-gray-600">This smartwatch requires a magnetic charging dock or cable.</p></div>) : isSolar ? (<div><div className="text-3xl md:text-4xl font-black text-green-600 mb-2 tracking-tight">{displayModelTitle}</div><p className="text-sm md:text-base text-gray-600">This is a solar-powered watch. It requires a specialized rechargeable capacitor{hasValidPowerModel ? '.' : ', not a standard battery.'}</p></div>) : (<div><div className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">{displayModelTitle}</div><p className="text-sm md:text-base text-gray-600">{hasValidPowerModel ? 'This watch requires a standard battery. Grab a replacement below.' : 'We are verifying the exact battery for this model. Try searching for your specific watch below.'}</p></div>)}
            </div>
            
            {/* CTA Buttons - Prefetch False Applied */}
            {!isAutomatic && !isSmartwatch && (
              <a href={`https://www.amazon.com/s?k=${encodeURIComponent(amazonSearchTerm)}`} target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 flex items-center justify-between group">
                <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-xs">Power</div><div><div className="text-sm font-bold text-orange-100 mb-1">Buy Replacement {isSolar ? 'Capacitor' : 'Battery'}</div><div className="text-lg md:text-xl font-bold">Amazon: {hasValidPowerModel ? rawModel : 'Search Matches'}</div></div></div>
              </a>
            )}
            
            <a href={isAutomatic ? "https://www.amazon.com/s?k=automatic+watch+winder" : "https://www.amazon.com/s?k=watch+repair+kit"} target="_blank" rel="noopener noreferrer" className="bg-gray-900 hover:bg-black text-white rounded-2xl p-6 shadow-sm transition-transform hover:-translate-y-1 flex items-center justify-between group">
              <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-black text-[10px] text-center leading-tight">{isAutomatic ? 'Winder' : 'Tool Kit'}</div><div><div className="text-sm font-bold text-gray-400 mb-1">Buy Recommended Accessory</div><div className="text-lg md:text-xl font-bold">Amazon: {isAutomatic ? 'Watch Winder' : 'Repair Kit'}</div></div></div>
            </a>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Watch Specifications</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr><td className="py-3 px-4 font-medium text-gray-500 bg-gray-50/50 w-1/3 md:w-1/4">Brand</td><td className="py-3 px-4 font-semibold text-gray-900">{parsed.brand}</td></tr>
                <tr><td className="py-3 px-4 font-medium text-gray-500 bg-gray-50/50">Model Info</td><td className="py-3 px-4 text-gray-900 capitalize">{parsed.size !== 'standard size' ? parsed.size : ''} {parsed.material} • {parsed.dial}</td></tr>
                <tr><td className="py-3 px-4 font-medium text-gray-500 bg-gray-50/50">Movement / Power</td><td className="py-3 px-4 text-gray-900 capitalize">{watch.power_type}</td></tr>
                <tr><td className="py-3 px-4 font-medium text-gray-500 bg-gray-50/50">Battery Code</td><td className="py-3 px-4 font-mono font-bold text-indigo-700">{watch["Model Number"] || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {content.faq.map((item: any, idx: number) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <h3 className="font-semibold text-base text-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {relatedWatches && relatedWatches.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Explore Other {brand} Watches</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedWatches.map((rw) => (
                <Link key={rw.slug} href={`/watch/${rw.slug}`} prefetch={false} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-500 hover:shadow-md transition-all group flex flex-col h-full">
                  <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors"><span className="text-sm">⌚</span></div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 leading-tight flex-grow">{rw.watch_query}</h4>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-2">{rw.power_type}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href={`/brands/${brand.toLowerCase()}`} prefetch={false} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                View all {brand} models &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
