import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BrandPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const rawBrand = resolvedParams?.brand || '';
  const decodedBrand = rawBrand.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  // Fetch watches where the query starts with the brand name
  const { data: watches } = await supabase
    .from('Watch Batteries')
    .select('watch_query, slug, power_type')
    .ilike('watch_query', `${decodedBrand}%`)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <main className="max-w-4xl mx-auto p-4 py-8 w-full">
      <nav className="flex text-sm text-gray-500 mb-8 font-medium" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/brands" className="hover:text-indigo-600">Brands</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{decodedBrand}</span>
      </nav>

      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">{decodedBrand} Watches</h1>
        <p className="text-gray-600">Battery requirements, solar capacitors, and repair guides for {decodedBrand} models.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {watches && watches.length > 0 ? (
          watches.map((watch) => (
            <Link key={watch.slug} href={`/watch/${watch.slug}`} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500 hover:shadow-sm transition-all group">
              <div className="truncate pr-4">
                <h2 className="font-bold text-gray-900 text-sm truncate">{watch.watch_query}</h2>
                <span className="text-[10px] uppercase font-bold text-gray-400">{watch.power_type}</span>
              </div>
              <div className="text-indigo-200 group-hover:text-indigo-600 transition-colors">&rarr;</div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-2">No models found for this brand yet. Check back soon!</p>
        )}
      </div>
    </main>
  );
}
