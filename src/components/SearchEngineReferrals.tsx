import React from 'react';

const SearchEngineReferrals = () => {
  const searchEngines = [
    {
      name: 'Google',
      url: 'www.google.com',
      logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      percentage: '50%'
    },
    {
      name: 'Yahoo',
      url: 'www.yahoo.com',
      logo: 'https://s.yimg.com/rz/p/yahoo_frontpage_en-US_s_f_p_205x58_frontpage.png',
      percentage: '15%'
    },
    {
      name: 'Bing',
      url: 'www.bing.com',
      logo: 'https://th.bing.com/th/id/OIP.OM6Yw1gQkf6JK7UZXcW6yQHaCG?pid=ImgDet&rs=1',
      percentage: '10%'
    },
    {
      name: 'Duck Duck Go',
      url: 'www.duckduckgo.com',
      logo: 'https://duckduckgo.com/assets/logo_homepage.normal.v108.svg',
      percentage: '5%'
    },
    {
      name: 'Edge',
      url: 'www.edge.com',
      logo: 'https://th.bing.com/th/id/OIP.Xq_oZkpkCkZQ8iFkq1wZVwHaHa?pid=ImgDet&rs=1',
      percentage: '20%'
    }
  ];

  return (
    <div className="space-y-4">
      {searchEngines.map((engine, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 mr-3 flex-shrink-0">
              <img 
                src={engine.logo} 
                alt={`${engine.name} logo`} 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-medium">{engine.name}</p>
              <p className="text-xs text-gray-500">{engine.url}</p>
            </div>
          </div>
          <div className="font-medium">{engine.percentage}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchEngineReferrals;