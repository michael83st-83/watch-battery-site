export const dynamic = 'force-dynamic';

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Grab the secret from the URL provided by n8n
    const secret = request.nextUrl.searchParams.get('secret');

    // Verify the secret matches your environment variable
    if (secret !== process.env.MY_SECRET_TOKEN) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Purge the cache for the homepage
    revalidatePath('/');
    
    return NextResponse.json({ revalidated: true, now: Date.now() }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
