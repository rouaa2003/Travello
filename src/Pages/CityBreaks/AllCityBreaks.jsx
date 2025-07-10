import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './AllCityBreaks.css';
import { useNavigate } from 'react-router-dom';

function AllCityBreaks() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      try {
        const tripsSnapshot = await getDocs(collection(db, 'trips'));
        const tripsList = tripsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTrips(tripsList);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      }
      setIsLoading(false);
    };
    fetchTrips();
  }, []);

  return (
    <div className="all-city-breaks">
      <h2 className="section-title">الرحلات المتوفرة</h2>

      {isLoading ? (
        <p>...جارٍ تحميل الرحلات</p>
      ) : trips.length === 0 ? (
        <p>لا توجد رحلات متاحة حالياً</p>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <div className="trip-card" key={trip.id}>
              <h3>{trip.province}</h3>
              <p>📅 {trip.date}</p>
              <p>💸 السعر: {trip.price} ل.س</p>
              <p>🎟 المقاعد المتاحة: {trip.availableSeats ?? '-'} / {trip.maxSeats ?? '-'}</p>
              <button className="book-btn" onClick={() => navigate(`/trip/${trip.id}`)}>
                احجز الآن
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllCityBreaks;
