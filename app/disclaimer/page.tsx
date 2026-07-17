import Link from 'next/link';

export const metadata = {
  title: 'Legal & Disclaimer | Watch Battery Lookup',
  description: 'Important legal information, liability disclaimers, and affiliate disclosures.',
};

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/" className="inline-block mb-6 text-indigo-200 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase">
            &larr; Back to Database
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Legal & Disclaimer</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 py-12 relative z-10 flex-grow w-full text-gray-800 space-y-8 bg-white mt-8 rounded-xl shadow-sm border border-gray-200">
        
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. Educational Purposes Only</h2>
          <p className="leading-relaxed text-gray-600">
            The information provided on Watch Battery Lookup, including but not limited to battery types, solar capacitor models, and linked repair videos, is strictly for educational and informational purposes. While we strive to ensure the accuracy of our database, manufacturer specifications can change without notice. Always verify your specific watch model and required battery before attempting any repairs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">2. Assumption of Risk & Liability</h2>
          <p className="leading-relaxed text-gray-600 mb-4">
            <strong>Opening a watch case carries inherent risks.</strong> By using this website and attempting a DIY battery replacement or repair, you assume full responsibility for any outcomes. 
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>Water Resistance:</strong> Opening a water-resistant or dive watch compromises the factory pressure seals. We highly recommend having dive watches pressure-tested by a certified horologist after a battery change.</li>
            <li><strong>Warranty Voidance:</strong> Opening your watch may immediately void the manufacturer's warranty.</li>
            <li><strong>Component Damage:</strong> We are not liable for scratched cases, damaged internal movements, short-circuited quartz modules, or ruined gaskets resulting from DIY repair attempts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">3. Affiliate Disclosure</h2>
          <p className="leading-relaxed text-gray-600">
            Watch Battery Lookup is an independent database and is not affiliated with, endorsed by, or sponsored by any watch manufacturer (e.g., Seiko, Casio, Citizen, Rolex, etc.). All trademarks and registered trademarks are the property of their respective owners.
            <br /><br />
            <strong>Amazon Associates Program:</strong> We participate in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated sites. When you click on product links on our site and make a purchase, we may earn a commission at no additional cost to you.
          </p>
        </section>

      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Watch Battery Lookup. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
