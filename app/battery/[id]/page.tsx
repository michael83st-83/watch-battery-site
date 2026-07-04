import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BatteryPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // UPDATED: Added brands(name) to the select query to fetch the joined data
  const { data: battery, error } = await supabase
    .from('parts')
    .select('*, brands(name)')
    .eq('id', id)
    .single();

  if (error || !battery) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Battery not found.</h1>
      </div>
    );
  }

  // Fallback link generation: Ensures a working affiliate link even before n8n populates specific URLs
  const amazonLink = battery.amazon_affiliate_link || `https://www.amazon.com/s?k=${encodeURIComponent(battery.part_name)}+watch+battery&tag=YOUR_TAG_HERE-20`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Header Section */}
          <div className="bg-blue-600 p-8 text-white">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              {battery.part_name}
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <span className="px-4 py-1.5 bg-white/20 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                {battery.part_type || 'Unknown Type'}
              </span>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Specifications</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Brand</dt>
                  {/* UPDATED: Changed from battery.brand to battery.brands?.name */}
                  <dd className="mt-1 text-lg font-medium text-gray-900">{battery.brands?.name || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Voltage</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">{battery.voltage || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Diameter</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">{battery.diameter || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Thickness</dt>
                  <dd className="mt-1 text-lg font-medium text-gray-900">{battery.thickness || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            {/* Affiliate CTA Section */}
            <div className="bg-gray-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 mt-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Need a replacement?</h3>
                <p className="text-gray-600 mt-1">Get fast shipping and the best price.</p>
              </div>
              <a 
                href={amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-[#FF9900] hover:bg-[#E48A00] text-gray-900 text-lg font-bold rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                Buy on Amazon
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
