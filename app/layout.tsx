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
        
        {/* GLOBAL HEADER - Navigation Menu */}
        <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-black text-indigo-700 text-xl tracking-tight flex items-center gap-2">
              <span className="text-2xl">⌚</span> WatchBatteryLookup
            </Link>
            <nav className="flex gap-4 md:gap-8 text-sm font-bold text-gray-600">
              <Link href="/brands" className="hover:text-indigo-600 transition-colors">Brands</Link>
            </nav>
          </div>
        </header>

        <div className="flex-grow w-full">
          {children}
        </div>
        
        {/* GLOBAL FOOTER */}
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
