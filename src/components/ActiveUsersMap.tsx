import React from 'react';

const ActiveUsersMap = () => {
  return (
    <div className="relative h-48">
      <img 
        src="https://images.unsplash.com/photo-1589519160732-57fc6fdf5a4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
        alt="World map with user activity" 
        className="w-full h-full object-cover rounded-md"
      />
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs flex items-center">
        <div className="flex items-center mr-3">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span>Active User</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
          <span>Inactive User</span>
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersMap;