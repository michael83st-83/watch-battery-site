import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | Watch Battery Lookup',
};

export default function Contact() {
  return (
    <div className="w-full">
      <header className="bg-indigo-700 text-white py-12 px-4 shadow-md">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/" className="inline-block mb-6 text-indigo-200 hover:text-white transition-colors text-sm font-bold tracking-wider uppercase">
            &larr; Back to Database
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contact Us</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 py-12 text-center text-gray-800 bg-white mt-8 mb-12 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Notice a missing battery type?</h2>
        <p className="leading-relaxed text-gray-600 mb-8 max-w-lg mx-auto">
          We are constantly updating our database of over 500,000 watch models. If you have found an error, a missing model, or just have a general inquiry, we would love to hear from you.
        </p>
        
        <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-lg p-6">
          <p className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Email Us At</p>
          <a href="mailto:hello@watchbatterylookup.com" className="text-xl font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            hello@watchbatterylookup.com
          </a>
        </div>
      </main>
    </div>
  );
}
