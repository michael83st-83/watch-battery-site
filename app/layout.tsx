import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Watch Battery Lookup | Exact Replacements & Repair Guides',
  description: 'The web\'s most comprehensive database for watch battery types, solar capacitors, and repair guides.',
  icons: {
    icon: '/brand-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen bg-gray-50">
        <div className="flex-grow w-full">
          {children}
        </div>
        
        {/* GLOBAL FOOTER - Appears on every page automatically */}
        <footer className="w-full bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-500 mb-4">
              <strong>Affiliate Disclosure:</strong> As an Amazon Associate, we earn from qualifying purchases. 
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4">
              <Link href="/disclaimer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider">
                Disclaimer
              </Link>
              <Link href="/privacy" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider">
                Privacy & GDPR
              </Link>
              <Link href="/contact" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider">
                Contact
              </Link>
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Watch Battery Lookup. All rights reserved.
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}
