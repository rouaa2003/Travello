import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './RecentHolidays.css';

function RecentHolidays() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTrips = async () => {
      try {
        const tripsRef = collection(db, 'trips');
        // ترتيب حسب الحقل date نزولياً (الأحدث أولاً)
        const q = query(tripsRef, orderBy('date', 'desc'), limit(4));
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

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>جاري التحميل...</p>;
  if (trips.length === 0) return <p style={{ textAlign: 'center', marginTop: 50 }}>لا توجد رحلات جديدة حالياً.</p>;

  return (
    <section className="recent-holidays">
      <h2>أحدث الرحلات</h2>
      <div className="trips-grid">
        {trips.map(trip => (
          <div key={trip.id} className="trip-card">
            
            <div className="trip-info">
              <h3>{trip.title}</h3>
              <p>{trip.description}</p>
              <p><strong>المحافظة:</strong> {trip.cityIds?.join(', ') || 'غير محددة'}</p>
              <p><strong>التاريخ:</strong> {trip.date}</p>
              <p><strong>المقاعد المتاحة:</strong> {trip.availableSeats} من {trip.maxSeats}</p>
              <p><strong>السعر:</strong> {trip.price} ليرة</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentHolidays;
