import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function WatchPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Fetch the watch, its brand, and the compatible battery parts
  const { data: watch, error } = await supabase
    .from('watches')
    .select(`
      *,
      brands(name),
      compatibility(
        parts(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !watch) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Watch not found.</h1>
      </div>
    );
  }

  // Extract the compatible battery
  const compatiblePart = watch.compatibility?.[0]?.parts;
  
  // Affiliate Links
  const batterySearchTerm = compatiblePart ? compatiblePart.part_name : 'watch battery';
  const batteryAmazonLink = compatiblePart?.amazon_affiliate_link || `https://www.amazon.com/s?k=${encodeURIComponent(batterySearchTerm)}+watch+battery&tag=YOUR_TAG_HERE-20`;
  const toolKitAmazonLink = `https://www.amazon.com/s?k=watch+battery+replacement+tool+kit&tag=YOUR_TAG_HERE-20`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Header Section */}
          <div className="bg-indigo-700 p-8 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              {watch.brands?.name || 'Generic'} {watch.model_name !== 'N/A' ? watch.model_name : ''}
            </h1>
            <p className="text-indigo-100 text-lg font-medium">
              Model: {watch.model_number !== 'N/A' ? watch.model_number : 'Unknown'}
            </p>
          </div>
          
          {/* Content Section */}
          <div className="p-8">
            
            {/* NEW: Watch Image Section */}
            {watch.image_path && (
              <div className="mb-10 flex justify-center">
                <div className="relative w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={watch.image_path} 
                    alt={`${watch.brands?.name || 'Watch'} ${watch.model_name || ''}`}
                    className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Required Battery</h2>
            
            {compatiblePart ? (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col sm:flex-row items-center gap-6 mb-8">
                {compatiblePart.image_path && (
                  <div className="w-24 h-24 bg-white rounded-lg p-2 shadow-sm flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={compatiblePart.image_path} alt={compatiblePart.part_name} className="object-contain w-full h-full" />
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{compatiblePart.part_name}</h3>
                  <p className="text-gray-600 mt-1">Type: {compatiblePart.part_type || 'N/A'}</p>
                  <div className="mt-3 flex gap-4">
                    <span className="text-sm font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
                      {compatiblePart.voltage || 'N/A'}
                    </span>
                    <Link href={`/battery/${compatiblePart.id}`} className="text-sm font-semibold text-blue-600 hover:underline flex items-center">
                      View Full Battery Specs &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mb-8">No specific battery data found for this model yet.</p>
            )}

            {/* Affiliate CTA Section - Battery & Tool Kit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Battery CTA */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Buy Replacement Battery</h3>
                  <p className="text-gray-600 mt-2 text-sm">Get the exact battery you need with fast shipping.</p>
                </div>
                <a 
                  href={batteryAmazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full px-6 py-3 bg-[#FF9900] hover:bg-[#E48A00] text-gray-900 font-bold rounded-xl shadow-sm transition-all text-center"
                >
                  Buy Battery on Amazon
                </a>
              </div>

              {/* Tool Kit CTA */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Watch Repair Tool Kit</h3>
                  <p className="text-gray-600 mt-2 text-sm">Don't scratch your watch backing. Open it safely with a proper kit.</p>
                </div>
                <a 
                  href={toolKitAmazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 w-full px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow-sm transition-all text-center"
                >
                  Get Tool Kit on Amazon
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
