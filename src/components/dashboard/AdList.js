import React from "react";

const AdList = ({ ads }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ads.length === 0 ? (
        <p className="text-gray-700">No advertisements found.</p>
      ) : (
        ads.map((ad) => (
          <div
            key={ad.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            {ad.imageUrl && (
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}${ad.imageUrl}`}
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{ad.title}</h3>
              <p className="text-gray-700">{ad.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdList;
