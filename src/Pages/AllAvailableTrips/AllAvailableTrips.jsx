import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './AllAvailableTrips.css';
import { useNavigate } from 'react-router-dom';

function AllAvailableTrips() {
  const [trips, setTrips] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
   const fetchTrips = async () => {
  setIsLoading(true);
  try {
    const tripsSnapshot = await getDocs(collection(db, 'trips'));
    const tripsList = tripsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(trip => trip.customTrip !== true); // 🚫 لا تعرض الرحلات المخصصة
    console.log('Fetched trips:', tripsList);
    setTrips(tripsList);
  } catch (error) {
    console.error('Failed to fetch trips:', error);
  }
  setIsLoading(false);
};

    fetchTrips();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, trips.length));
  };

  return (
    <div className="all-city-breaks">
      <h2 className="section-title">الرحلات المتوفرة</h2>

      {isLoading ? (
        <p>...جارٍ تحميل الرحلات</p>
      ) : trips.length === 0 ? (
        <p>لا توجد رحلات متاحة حالياً</p>
      ) : (
        <div className="trips-grid">
          {trips.slice(0, visibleCount).map((trip) => (
            <div className="trip-card" key={trip.id}>
              <img src={trip.imgUrl} alt={trip.province} className="trip-img" />
              <h3>{trip.province}</h3>
              <p>📅 {trip.date}</p>
              <p>💸 السعر: {trip.price} ل.س</p>
              <p>🎟 المقاعد المتاحة: {trip.availableSeats ?? '-'} / {trip.maxSeats ?? '-'}</p>
              <button className="book-btn" onClick={() => navigate(`/trip/${trip.id}`)}>
                احجز الآن
              </button>
            </div>
          ))}

          {visibleCount < trips.length && (
            <div className="load-more-card" onClick={handleLoadMore}>
              <span className="load-more-arrow">›</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AllAvailableTrips;
