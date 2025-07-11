import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import './TripDetails.css';
import { useAuth } from '../../AuthContext';

function TripDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1); // ← جديد

  useEffect(() => {
    const fetchTrip = async () => {
      const docRef = doc(db, 'trips', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchTrip();
  }, [id]);

  const handleBooking = async () => {
    if (!user || !trip) {
      alert('يرجى تسجيل الدخول للحجز.');
      return;
    }

    if (trip.availableSeats < seatsToBook) {
      alert('عدد المقاعد المطلوبة غير متاح.');
      return;
    }

    setIsBooking(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        userIds: [user.uid],
        tripId: trip.id,
        seats: seatsToBook,
        createdAt: new Date().toISOString(),
      });

      const tripRef = doc(db, 'trips', trip.id);
      await updateDoc(tripRef, {
        availableSeats: trip.availableSeats - seatsToBook,
      });

      setBookingSuccess(true);
      const updatedTrip = await getDoc(tripRef);
      setTrip({ id: updatedTrip.id, ...updatedTrip.data() });
    } catch (error) {
      alert('حدث خطأ أثناء الحجز. حاول مرة أخرى.');
      console.error(error);
    }
    setIsBooking(false);
  };

  if (!trip) return <p>جاري تحميل تفاصيل الرحلة...</p>;

  return (
    <div className="trip-details">
      <h2>تفاصيل الرحلة إلى {trip.province}</h2>
      <p><strong>📅 التاريخ:</strong> {trip.date}</p>
      <p><strong>💸 السعر:</strong> {trip.price} ل.س</p>
      <p><strong>🎟 المقاعد المتاحة:</strong> {trip.availableSeats} / {trip.maxSeats}</p>

      <div className="booking-form">
        <label>عدد المقاعد المطلوبة:</label>
        <select
          value={seatsToBook}
          onChange={(e) => setSeatsToBook(Number(e.target.value))}
        >
          {Array.from({ length: Math.min(trip.availableSeats, 10) }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'مقعد' : 'مقاعد'}
            </option>
          ))}
        </select>

        <button 
          onClick={handleBooking} 
          disabled={trip.availableSeats <= 0 || isBooking}
        >
          {isBooking ? 'جاري الحجز...' : 'تأكيد الحجز'}
        </button>

        {bookingSuccess && <p className="success-msg">✅ تم الحجز بنجاح!</p>}
      </div>
    </div>
  );
}

export default TripDetails;
