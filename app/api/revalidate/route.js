{/* Check if the watch requires a standard battery */}
{watch.requires_battery ? (
  
  // Show standard Battery Affiliate Link
  <a 
    href={`https://www.amazon.com/s?k=${watch.Model_Number}+watch+battery&tag=YOUR_AFFILIATE_TAG`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    Buy {watch.Model_Number} Battery
  </a>

) : (
  
  // Show Watch Toolkit Affiliate Link for Mechanical/Solar watches
  <a 
    href={`https://www.amazon.com/s?k=watch+repair+toolkit+case+opener&tag=YOUR_AFFILIATE_TAG`} 
    target="_blank" 
    rel="noopener noreferrer"
    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
  >
    Buy Watch Repair Toolkit
  </a>

)}
