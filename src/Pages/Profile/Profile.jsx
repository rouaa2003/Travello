import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';

import { 
  updateEmail, updateProfile, updatePassword,
  reauthenticateWithCredential, EmailAuthProvider
} from 'firebase/auth';
import {
  collection, query, where, getDocs, doc, deleteDoc, getDoc
} from 'firebase/firestore';

import { db } from '../../firebase';

import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    setName(user?.displayName || '');
    setEmail(user?.email || '');
    setNewName(user?.displayName || '');
    setNewEmail(user?.email || '');
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('userIds', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        const bookingsData = [];

        for (const docSnap of querySnapshot.docs) {
          const booking = { id: docSnap.id, ...docSnap.data() };

          // جلب بيانات الرحلة المرتبطة بالحجز
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

  // ...باقي الكود كما هو


  // تحديث البيانات الشخصية (الاسم، البريد)
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
      // تغيير كلمة المرور (اختياري)
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError('كلمتا المرور غير متطابقتين.');
          return;
        }
        // هنا ممكن نضيف إعادة مصادقة لو طلب firebase ذلك
        await updatePassword(user, newPassword);
      }
      setMessage('تم تحديث بيانات الحساب بنجاح.');
      setIsEditing(false);
      setCurrentPassword('');
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
          <button onClick={() => setIsEditing(true)}>تعديل</button>
        </div>
      ) : (
        <div className="profile-edit">
          <label>الاسم</label>
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} />

          <label>البريد الإلكتروني</label>
          <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />

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
              <h4>{booking.tripDetails?.province || 'رحلة غير معروفة'}</h4>
              <p>📅 التاريخ: {booking.tripDetails?.date || 'غير متوفر'}</p>
              <p>💸 السعر: {booking.tripDetails?.price || 'غير متوفر'} ل.س</p>
              <button onClick={() => handleCancelBooking(booking.id)}>إلغاء الحجز</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
