import React, { useEffect, useState } from "react";
import { getAds } from "../../services/adService";
import { useAuth } from "../../context/AuthContext";
import AdList from "./AdList";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsData = await getAds(token);
        if (adsData.statusCode === 200) {
          setAds(adsData.data);
        } else {
          setAds([]);
        }
      } catch (error) {
        console.error("Error fetching ads", error);
      }
    };
    fetchAds();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Admin Dashboard</h2>
        <AdList ads={ads} />
      </div>
    </div>
  );
};

export default AdminDashboard;
