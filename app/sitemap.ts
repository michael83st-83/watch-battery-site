import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fixed the base URL to match your live domain
  const baseUrl = 'https://watchbatterylookup.com';

  // 2. Fetch all watches from your database using the slug
  const { data: watches, error } = await supabase
    .from('Watch Batteries')
    .select('slug, created_at');

  if (error || !watches) {
    console.error('Error fetching sitemap data:', error);
    // Fallback to just the homepage if database fetch fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }

  // 3. Map the database rows to the proper URL structure using the slug
  const watchUrls = watches.map((watch) => ({
    url: `${baseUrl}/watch/${watch.slug}`,
    lastModified: new Date(watch.created_at || new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 4. Return the homepage plus all dynamic watch URLs
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
