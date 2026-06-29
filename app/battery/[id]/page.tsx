import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function BatteryPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const { data: battery, error } = await supabase
    .from('parts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !battery) {
    return <div>Battery not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {battery.part_name}
        </h1>
        <div className="flex items-center gap-2 mb-8">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
            {battery.part_type}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Specifications</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
            <div>
              <dt className="text-sm font-medium text-gray-500">Brand</dt>
              <dd className="text-lg text-gray-900">{battery.brand || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
