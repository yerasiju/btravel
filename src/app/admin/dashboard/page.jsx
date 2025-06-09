"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "admin@btravel.com") {
        router.push("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch hotels
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hotels"));
      const hotelsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsData);
    } catch (error) {
      setError("Failed to fetch hotels");
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await deleteDoc(doc(db, "hotels", hotelId));
        await fetchHotels();
      } catch (error) {
        setError("Failed to delete hotel");
        console.error("Error deleting hotel:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="button -md -red-1 bg-red-1 text-white"
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-actions">
        <button
          onClick={() => router.push("/admin/hotels/add")}
          className="button -md -blue-1 bg-blue-1 text-white"
        >
          Add New Hotel
        </button>
      </div>

      <div className="hotels-list">
        <h2>Hotels</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.title}</td>
                <td>{hotel.location}</td>
                <td>${hotel.price}</td>
                <td>{hotel.ratings}</td>
                <td>
                  <button
                    onClick={() =>
                      router.push(`/admin/hotels/edit/${hotel.id}`)
                    }
                    className="button -sm -blue-1 bg-blue-1 text-white mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHotel(hotel.id)}
                    className="button -sm -red-1 bg-red-1 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
