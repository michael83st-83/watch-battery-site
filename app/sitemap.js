import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function sitemap() {
  // Fetch all watches and parts for dynamic routing
  const { data: watches } = await supabase.from('watches').select('id');
  const { data: parts } = await supabase.from('parts').select('id');

  const baseUrl = 'https://watchbatterylookup.com';

  // Map watches to sitemap format
  const watchUrls = (watches || []).map((watch) => ({
    url: `${baseUrl}/watch/${watch.id}`,
    lastModified: new Date(),
  }));

  // Map parts to sitemap format
  const partUrls = (parts || []).map((part) => ({
    url: `${baseUrl}/battery/${part.id}`,
    lastModified: new Date(),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    ...watchUrls,
    ...partUrls,
  ];
}
