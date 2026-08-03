import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CHUNK_SIZE = 25000;

// 1. This tells Next.js how many chunks to generate
export async function generateSitemaps() {
  const { count } = await supabase
    .from('Watch Batteries')
    .select('slug', { count: 'exact', head: true })
    .not('slug', 'is', null)
    .neq('slug', '');

  const total = count || 0;
  const sitemapCount = Math.max(1, Math.ceil(total / CHUNK_SIZE));
  
  return Array.from({ length: sitemapCount }, (_, id) => ({ id }));
}

// 2. This populates each specific chunk with the correct URLs
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const start = id * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const { data: watches } = await supabase
    .from('Watch Batteries')
    .select('slug, created_at')
    .not('slug', 'is', null)
    .neq('slug', '')
    .range(start, end);

  const baseUrl = 'https://watchbatterylookup.com';
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add the homepage only to the very first chunk
  if (id === 0) {
    sitemapEntries.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // Add the database entries
  if (watches) {
    watches.forEach((watch) => {
      sitemapEntries.push({
        url: `${baseUrl}/watch/${watch.slug}`,
        lastModified: watch.created_at ? new Date(watch.created_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  }

  return sitemapEntries;
}
