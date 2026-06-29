import { createClient } from '@/utils/supabase/server';

export default async function BatteryPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: battery, error } = await supabase
    .from('parts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !battery) {
    return <div>Battery not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{battery.part_name}</h1>
      <p className="text-xl">Type: {battery.part_type}</p>
    </div>
  );
}
