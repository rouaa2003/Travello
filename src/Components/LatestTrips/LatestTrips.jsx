import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import "./LatestTrips.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function LatestTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        const tripsRef = collection(db, "trips");
        const q = query(tripsRef, orderBy("tripDate", "desc"), limit(5));
        const querySnapshot = await getDocs(q);

        const tripsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          let formattedDate = "غير محدد";
          if (data.tripDate?.seconds) {
            formattedDate = new Date(
              data.tripDate.seconds * 1000
            ).toLocaleDateString("ar-EG");
          }
          const seatsBooked = data.seatsBooked || 0;
          const maxSeats = data.maxSeats || 0;
          const availableSeats = maxSeats - seatsBooked;

          const formatDuration = (dur) => {
            if (!dur) return "غير محددة";
            return dur === 1 ? "يوم واحد" : `${dur} أيام`;
          };

          return {
            id: doc.id,
            ...data,
            formattedDate,
            availableSeats,
            formattedDuration: formatDuration(data.tripDuration),
          };
        });

        setTrips(tripsList);
      } catch (error) {
        console.error("خطأ في جلب الرحلات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTrips();
  }, []);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>جاري التحميل...</p>
    );
  if (trips.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        لا توجد رحلات جديدة حالياً.
      </p>
    );

  return (
    <section className="home-section">
      <h2 className="section-title">أحدث الرحلات</h2>
      <div className="card-grid">
        {trips.map((trip) => (
          <div key={trip.id} className="card">
            <div className="card-content">
              <p>
                <strong>الوجهة:</strong>{" "}
                {trip.selectedCityIds?.join("، ") || "غير محددة"}
              </p>
              <p>
                <strong>تاريخ الرحلة:</strong> {trip.formattedDate}
              </p>
              <p>
                <strong>مدة الرحلة:</strong> {trip.formattedDuration}
              </p>
              <p>
                <strong>المقاعد المتاحة:</strong> {trip.availableSeats} من{" "}
                {trip.maxSeats || "غير معروف"}
              </p>
              {trip.price !== undefined && (
                <p>
                  <strong>السعر:</strong> {trip.price} ليرة
                </p>
              )}
              <button
                className="book-btn"
                onClick={() => navigate(`/trip/${trip.id}`)}
                disabled={trip.availableSeats <= 0}
                title={
                  trip.availableSeats <= 0 ? "لا توجد مقاعد متاحة" : "احجز الآن"
                }
              >
                {trip.availableSeats <= 0 ? "مقاعد غير متاحة" : "احجز الآن"}
              </button>
            </div>
          </div>
        ))}
        <Link to="/trips" className="show-all-l">
          عرض كل الرحلات
        </Link>
      </div>
      <div className="button-wrapper"></div>
    </section>
  );
}

export default LatestTrips;
