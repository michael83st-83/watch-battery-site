import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy & GDPR | Watch Battery Lookup',
};

export default function Privacy() {
  return (
    <div className="w-full">
      <header className="bg-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/" className="inline-block mb-6 text-indigo-200 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase">
            &larr; Back to Database
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 py-12 text-gray-800 space-y-8 bg-white mt-8 mb-12 rounded-xl shadow-sm border border-gray-200">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">1. Data Collection & GDPR</h2>
          <p className="leading-relaxed text-gray-600">
            We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR). We do not require you to create an account to use Watch Battery Lookup. We may collect basic, anonymized analytics data (such as IP addresses, browser types, and pages visited) to improve website performance and user experience.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">2. Cookies</h2>
          <p className="leading-relaxed text-gray-600">
            This website utilizes standard cookies to ensure the site functions properly and to track basic analytics. Additionally, third-party affiliate partners (such as Amazon) may use cookies to track referral clicks to process commissions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">3. External Links</h2>
          <p className="leading-relaxed text-gray-600">
            Our database contains links to external websites and embedded YouTube videos. We do not control the privacy practices of these third parties. Please review their respective privacy policies when visiting their platforms.
          </p>
        </section>
      </main>
    </div>
  );
}
