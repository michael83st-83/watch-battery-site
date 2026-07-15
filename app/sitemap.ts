import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // IMPORTANT: Replace this with your actual live domain once you have it
  const baseUrl = 'https://www.watchbattery.ai'; 

  // Fetches the first 50,000 to keep within Google's single-file sitemap limit.
  const { data: watches } = await supabase
    .from('Watch Batteries')
    .select('id, created_at')
    .limit(50000);

  const watchUrls = watches?.map((watch) => ({
    url: `${baseUrl}/watch/${watch.id}`,
    lastModified: new Date(watch.created_at).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  })) ?? [];

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...watchUrls,
  ];
}
