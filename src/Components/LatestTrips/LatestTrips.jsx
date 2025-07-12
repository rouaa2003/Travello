import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './LatestTrips.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function LatestTrips() {
  const [trips, setTrips] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        const tripsRef = collection(db, 'trips');
        const q = query(tripsRef, orderBy('date', 'desc')); // نجلب جميع الرحلات
        const querySnapshot = await getDocs(q);

        const tripsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTrips(tripsList);
        setLoading(false);
      } catch (error) {
        console.error('خطأ في جلب الرحلات:', error);
        setLoading(false);
      }
    };

    fetchRecentTrips();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 4, trips.length));
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>جاري التحميل...</p>;
  if (trips.length === 0) return <p style={{ textAlign: 'center', marginTop: 50 }}>لا توجد رحلات جديدة حالياً.</p>;

  return (
    <section className="recent-holidays">
      <h2>أحدث الرحلات</h2>
      <div className="trips-grid">
        {trips.slice(0, visibleCount).map(trip => (
          <div key={trip.id} className="trip-card">
            <div className="trip-info">
              <h3>{trip.title}</h3>
              <p>{trip.description}</p>
              <p><strong>المحافظة:</strong> {trip.cityIds?.join(', ') || 'غير محددة'}</p>
              <p><strong>التاريخ:</strong> {trip.date}</p>
              <p><strong>المقاعد المتاحة:</strong> {trip.availableSeats} من {trip.maxSeats}</p>
              <p><strong>السعر:</strong> {trip.price} ليرة</p>
              <button className="book-btn" onClick={() => navigate(`/trip/${trip.id}`)}>
                احجز الآن
              </button>
            </div>
          </div>
        ))}
        <div className="button-wrapper ">
        <Link to="/trips" className="show-more-button">عرض كل الرحلات</Link>
      </div>
      </div>

     
    </section>
  );
}

export default LatestTrips;
