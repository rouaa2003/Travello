import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../AuthContext';
import './Bookings.css';

function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الحجوزات الخاصة بالمستخدم المسجل
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        // استعلام الحجوزات حسب userIds (مصفوفة) تحتوي على uid
        const q = query(collection(db, 'bookings'), where('userIds', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);

        const bookingsData = [];
        for (const docSnap of querySnapshot.docs) {
          const booking = { id: docSnap.id, ...docSnap.data() };
          // جلب بيانات الرحلة المرتبطة بالحجز (مستند واحد)
          const tripDoc = await getDoc(doc(db, 'trips', booking.tripId));
          booking.tripDetails = tripDoc.exists() ? tripDoc.data() : null;

          bookingsData.push(booking);
        }

        setBookings(bookingsData);
      } catch (err) {
        setError('حدث خطأ أثناء جلب الحجوزات.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // دالة لحذف الحجز
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('هل أنت متأكد من إلغاء الحجز؟')) return;

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      alert('فشل إلغاء الحجز. حاول مرة أخرى.');
      console.error(err);
    }
  };

  if (loading) return <p>جاري تحميل الحجوزات...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (bookings.length === 0) return <p>لا توجد حجوزات حالياً.</p>;

  return (
    <div className="bookings-page">
      <h2>حجوزاتي</h2>
      <div className="bookings-list">
        {bookings.map(booking => (
          <div key={booking.id} className="booking-card">
            <h3>{booking.tripDetails?.province || 'رحلة غير معروفة'}</h3>
            <p>📅 التاريخ: {booking.tripDetails?.date || 'غير متوفر'}</p>
            <p>💸 السعر: {booking.tripDetails?.price || 'غير متوفر'} ل.س</p>
            <p>🎟 المقاعد المحجوزة: 1</p>
            <button
              className="cancel-btn"
              onClick={() => handleCancelBooking(booking.id)}
            >
              إلغاء الحجز
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;
