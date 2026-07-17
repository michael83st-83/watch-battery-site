import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watch Battery Lookup | Exact Replacements & Repair Guides',
  description: 'The web\'s most comprehensive database for watch battery sizes, solar capacitors, and repair guides.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
