import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// This is the magic line. It forces Next.js to generate the sitemap on-demand 
// rather than crashing Vercel during the static build phase.
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CHUNK_SIZE = 25000; 

export async function generateSitemaps() {
  const { count, error } = await supabase
    .from('Watch Batteries')
    .select('slug', { count: 'exact', head: true })
    .not('slug', 'is', null)
    .neq('slug', ''); 

  if (error) {
    console.error('Sitemap count error:', error);
  }

  const total = count || 0;
  const sitemapCount = Math.max(1, Math.ceil(total / CHUNK_SIZE));

  return Array.from({ length: sitemapCount }).map((_, id) => ({
    id,
  }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const start = id * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const { data: watches, error } = await supabase
    .from('Watch Batteries')
    .select('slug, created_at')
    .not('slug', 'is', null)
    .neq('slug', '')
    .range(start, end);

  if (error) {
    console.error(`Sitemap fetch error for chunk ${id}:`, error);
  }

  const baseUrl = 'https://watchbatterylookup.com';

  const watchUrls = (watches || []).map((watch) => ({
    url: `${baseUrl}/watch/${watch.slug}`,
    lastModified: watch.created_at ? new Date(watch.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  if (id === 0) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      ...watchUrls,
    ];
  }

  return watchUrls;
}
