import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BrandPage({ 
  params,
  searchParams, 
}: { 
  params: any,
  searchParams: any 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const rawBrand = resolvedParams?.brand || '';
  const decodedBrand = rawBrand.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  // 1. Pagination Logic (100 per page)
  const page = parseInt(resolvedSearchParams?.page || '1');
  const limit = 100;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 2. Search Logic
  const searchQuery = resolvedSearchParams?.q || '';

  // 3. Build the Supabase Query
  let query = supabase
    .from('Watch Batteries')
    .select('watch_query, slug, power_type', { count: 'exact' })
    .ilike('watch_query', `${decodedBrand}%`);

  if (searchQuery) {
    query = query.ilike('watch_query', `%${searchQuery}%`);
  }

  // 4. Fetch Data
  const { data: watches, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <main className="max-w-4xl mx-auto p-4 py-8 w-full">
      
      {/* BREADCRUMBS */}
      <nav className="flex text-sm text-gray-500 mb-8 font-medium" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-indigo-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/brands" className="hover:text-indigo-600">Brands</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{decodedBrand}</span>
      </nav>

      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">{decodedBrand} Watches</h1>
        <p className="text-gray-600 mb-6">Battery requirements, solar capacitors, and repair guides for {decodedBrand} models.</p>
        
        {/* BRAND-SPECIFIC SEARCH BAR */}
        <form className="flex gap-2 w-full max-w-md">
          <input 
            type="text" 
            name="q" 
            defaultValue={searchQuery}
            placeholder={`Search within ${decodedBrand}...`} 
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
            Search
          </button>
          {searchQuery && (
            <Link href={`/brands/${rawBrand}`} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center">
              Clear
            </Link>
          )}
        </form>
      </div>

      {/* WATCH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
          <p className="text-gray-500 col-span-2">No models found matching your search.</p>
        )}
      </div>

      {/* SEO PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center border-t pt-6">
          {page > 1 ? (
            <Link href={`/brands/${rawBrand}?page=${page - 1}${searchQuery ? `&q=${searchQuery}` : ''}`} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm">
              &larr; Previous
            </Link>
          ) : (
            <div className="text-gray-300 font-bold text-sm cursor-not-allowed">&larr; Previous</div>
          )}
          
          <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>

          {page < totalPages ? (
            <Link href={`/brands/${rawBrand}?page=${page + 1}${searchQuery ? `&q=${searchQuery}` : ''}`} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm">
              Next Page &rarr;
            </Link>
          ) : (
            <div className="text-gray-300 font-bold text-sm cursor-not-allowed">Next Page &rarr;</div>
          )}
        </div>
      )}
    </main>
  );
}
