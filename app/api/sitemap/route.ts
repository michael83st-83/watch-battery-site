import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force Vercel to NEVER statically cache this API route
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CHUNK_SIZE = 25000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idParam = url.searchParams.get('id');

  if (!idParam) {
    const { count } = await supabase
      .from('Watch Batteries')
      .select('slug', { count: 'exact', head: true })
      .not('slug', 'is', null)
      .neq('slug', '');

    const total = count || 0;
    const sitemapCount = Math.max(1, Math.ceil(total / CHUNK_SIZE));
    const baseUrl = 'https://watchbatterylookup.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (let i = 0; i < sitemapCount; i++) {
      xml += `  <sitemap>\n`;
      xml += `    <loc>${baseUrl}/sitemap.xml?id=${i}</loc>\n`;
      xml += `  </sitemap>\n`;
    }

    xml += `</sitemapindex>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }

  const id = parseInt(idParam, 10);
  const start = id * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const { data: watches } = await supabase
    .from('Watch Batteries')
    .select('slug, created_at')
    .not('slug', 'is', null)
    .neq('slug', '')
    .range(start, end);

  const baseUrl = 'https://watchbatterylookup.com';

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  if (id === 0) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}</loc>\n`;
    xml += `    <changefreq>daily</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;
  }

  if (watches) {
    for (const watch of watches) {
      const lastMod = watch.created_at ? new Date(watch.created_at).toISOString() : new Date().toISOString();
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/watch/${watch.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
