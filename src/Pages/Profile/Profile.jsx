import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';  // تأكد من المسار
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
  updatePassword
} from 'firebase/auth';

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

import { db } from '../../firebase';
import './Profile.css';

function Profile() {
  const { user } = useAuth();

  // بيانات المستخدم الأساسية
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newCity, setNewCity] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // الحجوزات
  const [normalBookings, setNormalBookings] = useState([]);
  const [customBookings, setCustomBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // لتعديل عدد المقاعد في الحجوزات العادية
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [newSeats, setNewSeats] = useState(1);

  // جلب المدن من Firestore
 
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


  // لجلب بيانات المستخدم من Firestore مع cityId
useEffect(() => {
  const fetchUserData = async () => {
    if (!user || cityOptions.length === 0) return; // ← تأكد أن المدن جاهزة

    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUserData(data);
      setNewCity(data.cityId || '');
    }
  };

  fetchUserData();
}, [user, cityOptions]); // ← مهم جداً



  // جلب الحجوزات العادية والمخصصة
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('userIds', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);

        const normal = [];
        const custom = [];

        for (const docSnap of querySnapshot.docs) {
          const booking = { id: docSnap.id, ...docSnap.data() };
          if (booking.customTrip) {
            if (booking.userIds?.includes(user.uid)) custom.push(booking);
          } else {
            const tripDoc = await getDoc(doc(db, 'trips', booking.tripId));
            booking.tripDetails = tripDoc.exists() ? tripDoc.data() : null;
            normal.push(booking);
          }
        }

        setCustomBookings(custom);
        setNormalBookings(normal);
      } catch (err) {
        console.error("فشل تحميل الحجوزات:", err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user]);

  // تابع حفظ التعديلات مع إعادة التوثيق
const handleSave = async () => {
  setMessage('');
  setError('');

  try {
    if (!user) {
      setError('المستخدم غير مسجل الدخول.');
      return;
    }

    const needsReauth = (newEmail !== email || newPassword);

    // التحقق من كلمة المرور الحالية فقط عند الحاجة لإعادة التوثيق
    if (needsReauth) {
      if (!currentPassword) {
        setError('يرجى إدخال كلمة المرور الحالية لتحديث البريد أو كلمة المرور.');
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
    }

    // تحديث الاسم
    if (newName !== name) {
      await updateProfile(user, { displayName: newName });
      setName(newName);
    }

    // تحديث البريد
    if (newEmail !== email) {
      await updateEmail(user, newEmail);
      setEmail(newEmail);
    }

    // تحديث كلمة المرور
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('كلمتا المرور غير متطابقتين.');
        return;
      }
      await updatePassword(user, newPassword);
    }

    // تحديث المدينة في قاعدة البيانات
    if (newCity && newCity !== userData?.cityId) {
      await updateDoc(doc(db, 'users', user.uid), {
        cityId: newCity,
      });
    }

    // إعادة تعيين الحقول والنجاح
    setMessage('✅ تم تحديث بيانات الحساب بنجاح.');
    setError('');
    setIsEditing(false);
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setUserData(prev => ({ ...prev, cityId: newCity }));

  } catch (err) {
    console.error('خطأ في التحديث:', err);
    if (err.code === 'auth/invalid-credential') {
      setError('❌ كلمة المرور الحالية غير صحيحة. يرجى المحاولة مجددًا.');
    } else if (err.code === 'auth/requires-recent-login') {
      setError('❌ انتهت صلاحية تسجيل الدخول. يرجى تسجيل الخروج ثم الدخول مجددًا.');
    } else if (err.code === 'auth/email-already-in-use') {
      setError('❌ هذا البريد مستخدم مسبقًا من قبل حساب آخر.');
    } else {
      setError('❌ فشل التحديث. حدث خطأ غير متوقع.');
    }
  }
};



  // إلغاء حجز
  const handleCancelBooking = async (id) => {
    if (!window.confirm('هل أنت متأكد من إلغاء الحجز؟')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setCustomBookings(prev => prev.filter(b => b.id !== id));
      setNormalBookings(prev => prev.filter(b => b.id !== id));
      setMessage('تم إلغاء الحجز بنجاح.');
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إلغاء الحجز.');
    }
  };

  // تعديل عدد المقاعد في الحجوزات العادية
  const handleUpdateSeats = async (booking) => {
    setMessage('');
    setError('');
    try {
      const tripRef = doc(db, 'trips', booking.tripId);
      const bookingRef = doc(db, 'bookings', booking.id);
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists()) {
        setError('الرحلة غير موجودة.');
        return;
      }
      const tripData = tripSnap.data();
      const seatDiff = newSeats - (booking.seats || 1);

      if (tripData.availableSeats < seatDiff) {
        setError("لا توجد مقاعد كافية.");
        return;
      }

      await updateDoc(bookingRef, { seats: newSeats });
      await updateDoc(tripRef, { availableSeats: tripData.availableSeats - seatDiff });

      setNormalBookings(prev =>
        prev.map(b => (b.id === booking.id ? { ...b, seats: newSeats } : b))
      );

      setEditingBookingId(null);
      setMessage('تم التعديل بنجاح');
    } catch (err) {
      console.error(err);
      setError('فشل تعديل الحجز.');
    }
       
  };

const cityIdTrimmed = userData?.cityId?.trim();
const selectedCity = cityOptions.find(city => city.id === cityIdTrimmed)?.name;
console.log(selectedCity)
console.log('cityId raw value:', JSON.stringify(userData?.cityId));

  return (
    
    <div className="profile-container">
      <h2>الملف الشخصي</h2>

      {!isEditing ? (
        <div className="profile-view">
          
          <p><strong>الاسم:</strong> {name || '-'}</p>
          <p><strong>البريد:</strong> {email || '-'}</p>
       
       <p><strong>المدينة:</strong> {
  cityOptions.length > 0 && userData?.cityId
    ? cityOptions.find(city => city.id === userData.cityId?.trim())?.name || '-'
    : '...'
}</p>



          <button className='p-btn' onClick={() => setIsEditing(true)}>تعديل</button>
        </div>
      ) : (
        <div className="profile-edit">
          {message && <p className="success-msg">{message}</p>}
{error && <p className="error-msg">{error}</p>}

          <label>الاسم</label>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />

          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />

          <label>المدينة</label>
          <select value={newCity} onChange={e => setNewCity(e.target.value)}>
            <option value="">اختر المدينة</option>
            {cityOptions.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <label>كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="أدخل كلمة المرور الحالية لإجراء التعديلات"
          />

          <label>كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            placeholder="اتركها فارغة إذا لا تريد التغيير"
            onChange={e => setNewPassword(e.target.value)}
          />

          <label>تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <div className="buttons">
            <button className='p-btn' onClick={handleSave}>حفظ</button>
            <button className='p-btn' onClick={() => setIsEditing(false)}>إلغاء</button>
          </div>
        </div>
      )}

      <hr />

      {loadingBookings ? (
        <p>جاري تحميل الحجوزات...</p>
      ) : (
        <div className="booking-columns">

          {/* الحجوزات المخصصة */}
          <div className="booking-section">
            <h3>✳️ الرحلات المخصصة</h3>
            {customBookings.length === 0 ? (
              <p>لا توجد حجوزات مخصصة.</p>
            ) : (
              customBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <h4>رحلة مخصصة</h4>
                  <p>📅 التاريخ: {booking.tripDate?.toDate().toLocaleDateString() || '-'}</p>
                  <p>⏳ المدة: {booking.tripDuration || '-'} أيام</p>
                  <p>🏙 المدن: {booking.selectedCityIds?.length || 0}</p>
                  <p>🗺 أماكن: {booking.selectedPlaceIds?.length || 0}</p>
                  <p>🍽 مطاعم: {booking.selectedRestaurantIds?.length || 0}</p>
                  <p>🏥 مشافي: {booking.selectedHospitalIds?.length || 0}</p>
                  <button className='p-btn' onClick={() => handleCancelBooking(booking.id)}>إلغاء الحجز</button>
                </div>
              ))
            )}
          </div>

          {/* الحجوزات العادية */}
          <div className="booking-section">
            <h3>🚌 الرحلات العادية</h3>
            {normalBookings.length === 0 ? (
              <p>لا توجد حجوزات حالياً.</p>
            ) : (
              normalBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <h4>{booking.tripDetails?.province || '-'} - {booking.tripDetails?.title || '-'}</h4>
                  <p>📅 التاريخ: {booking.tripDetails?.date || '-'}</p>
                  <p>💸 السعر: {booking.tripDetails?.price || '-'} ل.س</p>
                  <p>👥 المقاعد: {booking.seats || 1}</p>

                  {editingBookingId === booking.id ? (
                    <div className="edit-booking-form">
                      <input
                        type="number"
                        value={newSeats}
                        min={1}
                        max={(booking.tripDetails?.availableSeats || 0) + (booking.seats || 1)}
                        onChange={e => setNewSeats(Number(e.target.value))}
                      />
                      <button className='p-btn' onClick={() => handleUpdateSeats(booking)}>حفظ</button>
                      <button className='p-btn' onClick={() => setEditingBookingId(null)}>إلغاء</button>
                    </div>
                  ) : (
                    <>
                      <button className='p-btn' onClick={() => handleCancelBooking(booking.id)}>إلغاء</button>
                      <button className='p-btn' onClick={() => {
                        setEditingBookingId(booking.id);
                        setNewSeats(booking.seats || 1);
                      }}>تعديل</button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
