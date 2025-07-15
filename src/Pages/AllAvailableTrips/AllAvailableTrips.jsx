import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./AllAvailableTrips.css";

function AllAvailableTrips() {
  const [trips, setTrips] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "trips"));
        const tripsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
      setLoading(false);
    };
    fetchTrips();
  }, []);

  const formatDate = (date) => {
    if (!date) return "غير متوفر";
    if (date.toDate) return date.toDate().toLocaleDateString("ar-EG");
    return new Date(date).toLocaleDateString("ar-EG");
  };

  const formatDuration = (duration) => {
    if (!duration) return "غير متوفر";
    return duration; // عرض النص كما هو لأنك قلت مخزنة مثل "5 أيام"
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        جارٍ تحميل الرحلات...
      </p>
    );

  if (trips.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        لا توجد رحلات متاحة حالياً
      </p>
    );

  return (
    <div className="all-city-breaks">
      <h2 className="section-title">الرحلات المتوفرة</h2>

      <div className="trips-grid">
        {trips.slice(0, visibleCount).map((trip) => (
          <div key={trip.id} className="trip-card">
            <h3>
              {trip.selectedCityIds?.length > 0
                ? trip.selectedCityIds.join("، ")
                : trip.province || "غير معروف"}
            </h3>
            <p>📅 {formatDate(trip.tripDate)}</p>
            <p>⏳ {formatDuration(trip.tripDuration)}</p>
            <p>
              🎟 المقاعد المتاحة:{" "}
              {typeof trip.maxSeats === "number"
                ? trip.maxSeats - (trip.seatsBooked || 0)
                : "غير معروف"}{" "}
              / {trip.maxSeats || "غير معروف"}
            </p>

            <button
              className="book-btn"
              onClick={() => navigate(`/trip/${trip.id}`)}
            >
              احجز الآن
            </button>
          </div>
        ))}
      </div>

      {/* زر تحميل المزيد */}
      {visibleCount < trips.length && (
        <div
          className="load-more-circle"
          onClick={handleLoadMore}
          style={{
            cursor: "pointer",
            textAlign: "center",
            marginTop: 20,
            fontSize: 30,
            userSelect: "none",
          }}
        >
          ›
        </div>
      )}
    </div>
  );
}

export default AllAvailableTrips;
