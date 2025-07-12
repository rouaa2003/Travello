import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import {
  updateEmail, updateProfile, updatePassword,
} from 'firebase/auth';
import {
  collection, query, where, getDocs, doc,
  deleteDoc, getDoc, updateDoc
} from 'firebase/firestore';

import { db } from '../../firebase';
import './Profile.css';

function Profile() {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newCity, setNewCity] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [newSeats, setNewSeats] = useState(1);

  // جلب بيانات المستخدم
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setNewCity(data.city || '');
        }
      } catch (err) {
        console.error("فشل جلب بيانات المستخدم:", err);
      }
    };

    fetchUserData();
  }, [user]);

  // جلب المدن من قاعدة البيانات
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cities'));
        const cities = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setCityOptions(cities);
      } catch (err) {
        console.error("فشل تحميل المدن:", err);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    setName(user?.displayName || '');
    setEmail(user?.email || '');
    setNewName(user?.displayName || '');
    setNewEmail(user?.email || '');
  }, [user]);

  // جلب الحجوزات
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('userIds', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        const bookingsData = [];

        for (const docSnap of querySnapshot.docs) {
          const booking = { id: docSnap.id, ...docSnap.data() };

          const tripDoc = await getDoc(doc(db, 'trips', booking.tripId));
          booking.tripDetails = tripDoc.exists() ? tripDoc.data() : null;

          bookingsData.push(booking);
        }

        setBookings(bookingsData);
      } catch (error) {
        setError('فشل تحميل الحجوزات.');
        console.error(error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('هل أنت متأكد من إلغاء الحجز؟')) return;

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(bookings.filter(b => b.id !== bookingId));
    } catch (err) {
      setError('فشل إلغاء الحجز.');
    }
  };

  const handleUpdateSeats = async (booking) => {
    try {
      const tripRef = doc(db, 'trips', booking.tripId);
      const bookingRef = doc(db, 'bookings', booking.id);

      const tripSnap = await getDoc(tripRef);
      const tripData = tripSnap.data();

      const oldSeats = booking.seats || 1;
      const seatDiff = newSeats - oldSeats;

      if (tripData.availableSeats < seatDiff) {
        setError('لا توجد مقاعد كافية متاحة.');
        return;
      }

      await updateDoc(bookingRef, {
        seats: newSeats
      });

      await updateDoc(tripRef, {
        availableSeats: tripData.availableSeats - seatDiff
      });

      setBookings(prev =>
        prev.map(b => b.id === booking.id ? { ...b, seats: newSeats } : b)
      );

      setEditingBookingId(null);
      setMessage('تم تحديث الحجز بنجاح.');
    } catch (err) {
      console.error(err);
      setError('فشل تحديث الحجز.');
    }
  };

  const handleSave = async () => {
    setMessage('');
    setError('');
    try {
      if (newName !== name) {
        await updateProfile(user, { displayName: newName });
        setName(newName);
      }
      if (newEmail !== email) {
        await updateEmail(user, newEmail);
        setEmail(newEmail);
      }

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError('كلمتا المرور غير متطابقتين.');
          return;
        }
        await updatePassword(user, newPassword);
      }

      // تحديث المدينة في Firestore
      if (newCity && user) {
        await updateDoc(doc(db, 'users', user.uid), {
          city: newCity
        });
      }

      setMessage('تم تحديث بيانات الحساب بنجاح.');
      setIsEditing(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('حدث خطأ أثناء تحديث البيانات. قد تحتاج إلى تسجيل الدخول مجددًا.');
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
      <h2>حسابي</h2>

      {!isEditing ? (
        <div className="profile-view">
          <p><strong>الاسم:</strong> {name || '-'}</p>
          <p><strong>البريد الإلكتروني:</strong> {email || '-'}</p>
          <p><strong>المدينة:</strong> {userData?.city || '-'}</p>
          <button onClick={() => setIsEditing(true)}>تعديل</button>
        </div>
      ) : (
        <div className="profile-edit">
          <label>الاسم</label>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} />

          <label>البريد الإلكتروني</label>
          <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />

          <label>المدينة</label>
          <select value={newCity} onChange={e => setNewCity(e.target.value)}>
            <option value="">اختر المدينة</option>
            {cityOptions.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <label>كلمة المرور الجديدة</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="اتركها فارغة إذا لا تريد التغيير" />

          <label>تأكيد كلمة المرور الجديدة</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

          <div className="buttons">
            <button onClick={handleSave}>حفظ</button>
            <button onClick={() => setIsEditing(false)}>إلغاء</button>
          </div>
        </div>
      )}

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}

      <hr />

      <h3>حجوزاتي</h3>
      {loadingBookings ? (
        <p>جاري تحميل الحجوزات...</p>
      ) : bookings.length === 0 ? (
        <p>لا توجد حجوزات حالياً.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h4>{booking.tripDetails?.province || 'رحلة غير معروفة'} - {booking.tripDetails?.title}</h4>
              <p>📅 التاريخ: {booking.tripDetails?.date || 'غير متوفر'}</p>
              <p>💸 السعر: {booking.tripDetails?.price || 'غير متوفر'} ل.س</p>
              <p>👥 عدد المقاعد المحجوزة: {booking.seats || 1}</p>

              {editingBookingId === booking.id ? (
                <div className="edit-booking-form">
                  <label>عدد المقاعد الجديد:</label>
                  <input
                    type="number"
                    value={newSeats}
                    min={1}
                    max={booking.tripDetails?.availableSeats + (booking.seats || 1)}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                  />
                  <button onClick={() => handleUpdateSeats(booking)}>حفظ التعديل</button>
                  <button onClick={() => setEditingBookingId(null)}>إلغاء</button>
                </div>
              ) : (
                <>
                  <button onClick={() => handleCancelBooking(booking.id)}>إلغاء الحجز</button>
                  <button onClick={() => {
                    setEditingBookingId(booking.id);
                    setNewSeats(booking.seats || 1);
                  }}>تعديل الحجز</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
