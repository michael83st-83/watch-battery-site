import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const CHUNK_SIZE = 25000;

// Helper to prevent top-level module crashes during build time
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables missing during sitemap generation.');
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function generateSitemaps() {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    return [{ id: 0 }];
  }

  try {
    const { count, error } = await supabase
      .from('Watch Batteries')
      .select('slug', { count: 'exact', head: true })
      .not('slug', 'is', null)
      .neq('slug', '');

    if (error) {
      console.error('Sitemap count error:', error);
      return [{ id: 0 }];
    }

    const total = count || 0;
    const sitemapCount = Math.max(1, Math.ceil(total / CHUNK_SIZE));

    return Array.from({ length: sitemapCount }).map((_, id) => ({
      id,
    }));
  } catch (err) {
    console.error('Unexpected error in generateSitemaps:', err);
    return [{ id: 0 }];
  }
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://watchbatterylookup.com';
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }

  try {
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

    const watchUrls = (watches || []).map((watch) => {
      let lastMod = new Date();
      if (watch.created_at) {
        const parsed = new Date(watch.created_at);
        if (!isNaN(parsed.getTime())) {
          lastMod = parsed;
        }
      }

      return {
        url: `${baseUrl}/watch/${watch.slug}`,
        lastModified: lastMod,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      };
    });

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
  } catch (err) {
    console.error(`Unexpected error generating sitemap chunk ${id}:`, err);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
