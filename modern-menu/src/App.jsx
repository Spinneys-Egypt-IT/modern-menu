import { useState, useEffect } from 'react';
import menuData from './data/Spinneys.json';

const MenuItem = ({ item }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const cleanDescription = item.Description.replace('- SPINNEYS -', '')
    .replace('-  -', '')
    .trim();

  // Vite's built-in method for resolving dynamic local asset paths in the src folder
  const imageUrl = new URL(`./data/${item.No_}.jpg`, import.meta.url).href;

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow'>
      {/* Image Section */}
      <div className='h-48 w-full flex items-center justify-center relative bg-gray-50 border-b border-gray-100'>
        {!imgFailed ? (
          <img
            src={imageUrl}
            alt={cleanDescription}
            className='w-full h-full object-cover'
            onError={() => setImgFailed(true)} // Triggers fallback if image is missing
          />
        ) : (
          // Fallback UI if image doesn't exist
          <div className='p-4 text-center w-full h-full flex items-center justify-center'>
            <span className='text-gray-600 font-semibold text-lg'>
              {cleanDescription}
            </span>
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className='p-4 flex flex-col flex-grow justify-between'>
        <div>
          <h3 className='font-bold text-gray-800 text-sm md:text-base mb-1'>
            {cleanDescription}
          </h3>
          <div className='text-xs text-gray-500 font-mono bg-gray-100 inline-block px-2 py-1 rounded'>
            Code: {item.No_}
          </div>
        </div>

        <div className='mt-4 flex justify-between items-end'>
          <div className='text-xs text-gray-500 flex flex-col'>
            <span className='font-semibold text-gray-700'>Available at:</span>
            <span>{item.Locations.join(', ')}</span>
          </div>
          <div className='text-right ml-2'>
            <span className='font-bold text-red-600 block text-lg'>
              {Number(item.RSP)} EGP
            </span>
            <span className='text-xs text-gray-400'>
              /{item['Unit of Measure Code']}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [categories, setCategories] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    // 1. Group duplicate items to combine their Location Codes
    const groupedData = menuData.Spinneys.reduce((acc, item) => {
      const loc = item['Location Code'].trim();
      if (!acc[item.No_]) {
        acc[item.No_] = { ...item, Locations: [loc] };
      } else {
        if (!acc[item.No_].Locations.includes(loc)) {
          acc[item.No_].Locations.push(loc);
        }
      }
      return acc;
    }, {});

    const uniqueItems = Object.values(groupedData);

    // 2. Auto-categorize based on Description keywords
    const categorized = uniqueItems.reduce((acc, item) => {
      let category = 'Main Dishes';
      const desc = item.Description.toLowerCase();

      if (desc.includes('pizza') || desc.includes('manakish'))
        category = 'Pizzas & Pastries';
      else if (desc.includes('sandwich') || desc.includes('roll'))
        category = 'Sandwiches & Rolls';
      else if (desc.includes('salad')) category = 'Salads';
      else if (
        desc.includes('chicken') ||
        desc.includes('pane') ||
        desc.includes('tawook')
      )
        category = 'Chicken';
      else if (
        desc.includes('liver') ||
        desc.includes('beef') ||
        desc.includes('kofta') ||
        desc.includes('meat')
      )
        category = 'Beef & Liver';
      else if (
        desc.includes('rice') ||
        desc.includes('pasta') ||
        desc.includes('macaroni')
      )
        category = 'Rice & Pasta';
      else if (desc.includes('meal')) category = 'Meals';

      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    setCategories(categorized);
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8 font-sans'>
      <header className='mb-6 sticky top-0 bg-gray-50 pt-4 pb-2 z-10 border-b border-gray-200'>
        <h1 className='text-3xl font-bold text-red-600 mb-4 tracking-tight'>
          Spinneys Hot Food
        </h1>
        <input
          type='text'
          placeholder='Search items or codes...'
          className='w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500'
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
      </header>

      <main>
        {Object.entries(categories).map(([category, items]) => {
          const filtered = items.filter(
            (item) =>
              item.Description.toLowerCase().includes(search) ||
              item.No_.includes(search),
          );
          if (filtered.length === 0) return null;

          return (
            <div key={category} className='mb-8'>
              <h2 className='text-xl font-bold text-gray-800 mb-4 uppercase tracking-wider'>
                {category}
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filtered.map((item) => (
                  <MenuItem key={item.No_} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}

export default App;
