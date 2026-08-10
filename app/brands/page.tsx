import Link from 'next/link';

export const metadata = {
  title: 'Browse Watch Brands | Watch Battery Lookup',
  description: 'Find battery replacements, solar capacitors, and repair guides by watch brand.',
};

const POPULAR_BRANDS = [
  'Rolex', 'Omega', 'Breitling', 'Seiko', 'Casio', 'Citizen', 
  'Apple', 'Longines', 'Patek Philippe', 'TAG Heuer', 'Garmin', 
  'Tissot', 'Hamilton', 'Panerai', 'Cartier', 'Bulova'
];

export default function BrandsIndex() {
  return (
    <main className="max-w-4xl mx-auto p-4 py-12 w-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Browse by Brand</h1>
        <p className="text-gray-600 text-lg">Select a watch manufacturer below to find exact power specifications and repair guides for their models.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {POPULAR_BRANDS.map((brand) => (
          <Link 
            key={brand} 
            href={`/brands/${brand.toLowerCase().replace(' ', '-')}`}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <h2 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{brand}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
