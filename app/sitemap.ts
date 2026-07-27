import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://watchbatterylookup.com';

  // 1. Fetch only watches that have a successfully generated slug
  const { data: watches, error } = await supabase
    .from('Watch Batteries')
    .select('slug, created_at')
    .not('slug', 'is', null); // <-- This prevents the 'null' URL error!

  if (error || !watches) {
    console.error('Error fetching sitemap data:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }

  // 2. Map the valid database rows
  const watchUrls = watches
    .filter(watch => watch.slug && watch.slug.trim() !== '') // Double-check safety net
    .map((watch) => ({
      url: `${baseUrl}/watch/${watch.slug}`,
      lastModified: new Date(watch.created_at || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  // 3. Return the clean sitemap list
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...watchUrls,
  ];
}
