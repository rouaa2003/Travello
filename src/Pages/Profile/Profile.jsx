import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
  updatePassword,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();

  // بيانات المستخدم
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newCity, setNewCity] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // الحجوزات العادية والمخصصة
  const [normalBookings, setNormalBookings] = useState([]);
  const [customBookings, setCustomBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // تعديل مقاعد الحجز العادي
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [newSeats, setNewSeats] = useState(1);

  // مودال التفاصيل
  const [showModal, setShowModal] = useState(false);
  const [modalBooking, setModalBooking] = useState(null);
  const [modalDetails, setModalDetails] = useState({
    places: [],
    restaurants: [],
    hospitals: [],
    hotels: [],
    cities: [],
  });
  const [modalLoading, setModalLoading] = useState(false);

  // جلب قائمة المدن من قاعدة البيانات
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cities"));
        const cities = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCityOptions(cities);
      } catch (err) {
        console.error("فشل تحميل المدن:", err);
      }
    };
    fetchCities();
  }, []);

  // جلب بيانات المستخدم (ضمن جدول users)
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setNewCity(data.cityId || "");
        }
      } catch (err) {
        console.error("خطأ في تحميل بيانات المستخدم:", err);
      }
    };
    fetchUserData();
  }, [user]);

  // جلب كل الرحلات (trips) لكي نطابقها مع الحجوزات العادية
  const [allTrips, setAllTrips] = useState([]);
  useEffect(() => {
    const fetchAllTrips = async () => {
      try {
        const snapshot = await getDocs(collection(db, "trips"));
        const tripsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllTrips(tripsData);
      } catch (error) {
        console.error("خطأ في جلب الرحلات:", error);
      }
    };
    fetchAllTrips();
  }, []);

  // جلب الحجوزات (normal و custom)
  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"),
          where("userIds", "array-contains", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const normal = [];
        const custom = [];

        for (const docSnap of querySnapshot.docs) {
          const booking = { id: docSnap.id, ...docSnap.data() };
          if (booking.customTrip) {
            if (booking.userIds?.includes(user.uid)) custom.push(booking);
          } else {
            const tripDetails =
              allTrips.find((trip) => trip.id === booking.tripId) || null;
            booking.tripDetails = tripDetails;
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
  }, [user, allTrips]);

  // دالة لجلب أسماء المدن حسب ids
  const getCityNames = (cityIds) => {
    if (!cityIds || cityIds.length === 0) return ["غير معروف"];
    return cityIds.map((cityId) => {
      const city = cityOptions.find(
        (c) => c.id.toLowerCase() === cityId.toLowerCase()
      );
      return city ? city.name : "غير معروف";
    });
  };

  // دالة مساعدة لجلب بيانات أسماء من جدول معين حسب IDs
  const fetchDataByIds = async (collectionName, ids) => {
    if (!ids || ids.length === 0) return [];
    try {
      // Firestore لا يسمح بأكثر من 10 شرط "in" في استعلام واحد، لذلك نقسم إذا لزم
      const chunkSize = 10;
      let results = [];

      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const q = query(
          collection(db, collectionName),
          where("__name__", "in", chunk)
        );
        const snap = await getDocs(q);
        results.push(
          ...snap.docs.map(
            (d) => d.data().name || d.data().title || "غير معروف"
          )
        );
      }

      return results;
    } catch (err) {
      console.error(`خطأ في جلب بيانات ${collectionName}:`, err);
      return [];
    }
  };

  // تنسيق التاريخ للعرض
  const formatDate = (date) => {
    if (!date) return "-";
    if (date.toDate) return date.toDate().toLocaleDateString("ar-EG");
    return new Date(date).toLocaleDateString("ar-EG");
  };

  // تحميل تفاصيل الرحلة لمودال التفاصيل
  const loadModalDetails = async (booking) => {
    setModalLoading(true);
    setModalDetails({
      places: [],
      restaurants: [],
      hospitals: [],
      hotels: [],
      cities: [],
    });

    try {
      // جلب أسماء المدن المرتبطة بالرحلة (حسب الحقل selectedCityIds)
      let cityNames = [];
      if (booking.customTrip) {
        cityNames = getCityNames(booking.selectedCityIds || []);
      } else {
        cityNames = booking.tripDetails
          ? getCityNames(booking.tripDetails.selectedCityIds || [])
          : [];
      }

      let places = [];
      let restaurants = [];
      let hospitals = [];
      let hotels = [];

      if (booking.customTrip) {
        // الحجوزات المخصصة: المعرفات موجودة داخل الحجز نفسه
        places = await fetchDataByIds("places", booking.selectedPlaceIds || []);
        restaurants = await fetchDataByIds(
          "restaurants",
          booking.selectedRestaurantIds || []
        );
        hospitals = await fetchDataByIds(
          "hospitals",
          booking.selectedHospitalIds || []
        );
        hotels = await fetchDataByIds("hotels", booking.selectedHotelIds || []);
      } else {
        // الحجوزات العادية: المعرفات موجودة في جدول الرحلات (tripDetails)
        if (booking.tripDetails) {
          places = await fetchDataByIds(
            "places",
            booking.tripDetails.selectedPlaceIds || []
          );
          restaurants = await fetchDataByIds(
            "restaurants",
            booking.tripDetails.selectedRestaurantIds || []
          );
          hospitals = await fetchDataByIds(
            "hospitals",
            booking.tripDetails.selectedHospitalIds || []
          );
          hotels = await fetchDataByIds(
            "hotels",
            booking.tripDetails.selectedHotelIds || []
          );
        }
      }

      setModalDetails({
        places,
        restaurants,
        hospitals,
        hotels,
        cities: cityNames,
      });
    } catch (error) {
      console.error("خطأ في تحميل تفاصيل الرحلة:", error);
    }

    setModalLoading(false);
  };

  // فتح مودال التفاصيل مع تحميلها
  const openModal = async (booking) => {
    setModalBooking(booking);
    await loadModalDetails(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalBooking(null);
    setModalDetails({
      places: [],
      restaurants: [],
      hospitals: [],
      hotels: [],
      cities: [],
    });
  };

  // تعديل عدد المقاعد في الحجز العادي
  const handleUpdateSeats = async (booking) => {
    setMessage("");
    setError("");
    try {
      const tripRef = doc(db, "trips", booking.tripId);
      const bookingRef = doc(db, "bookings", booking.id);
      const tripSnap = await getDoc(tripRef);
      if (!tripSnap.exists()) {
        setError("الرحلة غير موجودة.");
        return;
      }
      const tripData = tripSnap.data();

      const seatDiff = newSeats - (booking.seatsBooked || 1);
      const availableSeats = tripData.maxSeats - (tripData.seatsBooked || 0);

      if (availableSeats < seatDiff) {
        setError("لا توجد مقاعد كافية.");
        return;
      }

      await updateDoc(bookingRef, { seatsBooked: newSeats });
      // تحديث seatsBooked في رحلة (يمكن تعديل حسب المنطق لديك)
      await updateDoc(tripRef, {
        seatsBooked: (tripData.seatsBooked || 0) + seatDiff,
      });

      // تحديث حالة الواجهة
      setNormalBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, seatsBooked: newSeats } : b
        )
      );

      setEditingBookingId(null);
      setMessage("تم تعديل عدد المقاعد بنجاح.");
    } catch (err) {
      console.error(err);
      setError("فشل تعديل عدد المقاعد.");
    }
  };

  // إلغاء حجز
  const handleCancelBooking = async (id) => {
    if (!window.confirm("هل أنت متأكد من إلغاء الحجز؟")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
      setCustomBookings((prev) => prev.filter((b) => b.id !== id));
      setNormalBookings((prev) => prev.filter((b) => b.id !== id));
      setMessage("تم إلغاء الحجز بنجاح.");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء إلغاء الحجز.");
    }
  };

  // حفظ بيانات المستخدم
  const handleSave = async () => {
    setMessage("");
    setError("");

    try {
      if (!user) {
        setError("المستخدم غير مسجل الدخول.");
        return;
      }

      const needsReauth = newEmail !== email || newPassword;

      if (needsReauth) {
        if (!currentPassword) {
          setError(
            "يرجى إدخال كلمة المرور الحالية لتحديث البريد أو كلمة المرور."
          );
          return;
        }

        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
      }

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
          setError("كلمتا المرور غير متطابقتين.");
          return;
        }
        await updatePassword(user, newPassword);
      }

      if (newCity && newCity !== userData?.cityId) {
        await updateDoc(doc(db, "users", user.uid), {
          cityId: newCity,
        });
      }

      setMessage("✅ تم تحديث بيانات الحساب بنجاح.");
      setError("");
      setIsEditing(false);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setUserData((prev) => ({ ...prev, cityId: newCity }));
    } catch (err) {
      console.error("خطأ في التحديث:", err);
      if (err.code === "auth/invalid-credential") {
        setError("❌ كلمة المرور الحالية غير صحيحة. يرجى المحاولة مجددًا.");
      } else if (err.code === "auth/requires-recent-login") {
        setError(
          "❌ انتهت صلاحية تسجيل الدخول. يرجى تسجيل الخروج ثم الدخول مجددًا."
        );
      } else if (err.code === "auth/email-already-in-use") {
        setError("❌ هذا البريد مستخدم مسبقًا من قبل حساب آخر.");
      } else {
        setError("❌ فشل التحديث. حدث خطأ غير متوقع.");
      }
    }
  };

  return (
    <div className="profile-container">
      <h2>الملف الشخصي</h2>

      {!isEditing ? (
        <div className="profile-view">
          <p>
            <strong>الاسم:</strong> {name || "-"}
          </p>
          <p style={{ direction: "rtl" }}>
            <strong>البريد الإلكتروني :</strong> {email || "-"}
          </p>
          <p>
            <strong>المدينة:</strong>{" "}
            {cityOptions.length > 0 && userData?.cityId
              ? cityOptions.find(
                  (city) =>
                    city.id.toLowerCase() === userData.cityId?.toLowerCase()
                )?.name || "-"
              : "..."}
          </p>

          <button className="p-btn" onClick={() => setIsEditing(true)}>
            تعديل
          </button>
        </div>
      ) : (
        <div className="profile-edit">
          {message && <p className="success-msg">{message}</p>}
          {error && <p className="error-msg">{error}</p>}

          <label>الاسم</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <label>المدينة</label>
          <select value={newCity} onChange={(e) => setNewCity(e.target.value)}>
            <option value="">اختر المدينة</option>
            {cityOptions.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <label>كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="أدخل كلمة المرور الحالية لإجراء التعديلات"
          />

          <label>كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            placeholder="اتركها فارغة إذا لا تريد التغيير"
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="buttons">
            <button className="p-btn" onClick={handleSave}>
              حفظ
            </button>
            <button className="p-btn" onClick={() => setIsEditing(false)}>
              إلغاء
            </button>
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
              customBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <h4>
                    المدن:{" "}
                    {getCityNames(booking.selectedCityIds || []).join("، ")}
                  </h4>
                  <p>📅 التاريخ: {formatDate(booking.tripDate)}</p>
                  <p>⏳ المدة: {booking.tripDuration || "-"} أيام</p>
                  <p>
                    🗺 أماكن مختارة:{" "}
                    {(booking.selectedPlaceIds?.length || 0) +
                      (booking.selectedRestaurantIds?.length || 0) +
                      (booking.selectedHospitalIds?.length || 0) +
                      (booking.selectedHotelIds?.length || 0)}
                  </p>

                  <button
                    className="p-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    إلغاء الحجز
                  </button>
                  <button className="p-btn" onClick={() => openModal(booking)}>
                    عرض التفاصيل
                  </button>
                </div>
              ))
            )}
          </div>

          {/* الحجوزات العادية */}
          <div className="booking-section">
            <h3>🚌 الرحلات العادية</h3>
            {normalBookings.length === 0 ? (
              <p>لا توجد حجوزات عادية.</p>
            ) : (
              normalBookings.map((booking) => {
                const trip = booking.tripDetails;
                const maxSeats = trip?.maxSeats || "-";
                const bookedSeats = booking.seatsBooked || 0;
                const availableSeats =
                  typeof maxSeats === "number" ? maxSeats - bookedSeats : "-";

                return (
                  <div key={booking.id} className="booking-card">
                    <h4>
                      المدن:{" "}
                      {trip
                        ? getCityNames(trip.selectedCityIds || []).join("، ")
                        : "-"}
                    </h4>
                    <p>📅 التاريخ: {formatDate(trip?.tripDate)}</p>
                    <p>⏳ المدة: {trip?.tripDuration || "-"} أيام</p>
                    <p>
                      🎟 المقاعد: المحجوزة {bookedSeats} من أصل {maxSeats}{" "}
                      (المتاحة {availableSeats})
                    </p>

                    {editingBookingId === booking.id ? (
                      <>
                        <input
                          type="number"
                          min={1}
                          max={maxSeats}
                          value={newSeats}
                          onChange={(e) => setNewSeats(Number(e.target.value))}
                        />
                        <button
                          className="p-btn"
                          onClick={() => handleUpdateSeats(booking)}
                        >
                          حفظ
                        </button>
                        <button
                          className="p-btn"
                          onClick={() => setEditingBookingId(null)}
                        >
                          إلغاء
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="p-btn"
                          onClick={() => {
                            setEditingBookingId(booking.id);
                            setNewSeats(booking.seatsBooked || 1);
                          }}
                        >
                          تعديل المقاعد
                        </button>
                        <button
                          className="p-btn"
                          onClick={() => openModal(booking)}
                        >
                          عرض التفاصيل
                        </button>
                        <button
                          className="p-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          إلغاء الحجز
                        </button>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* مودال التفاصيل */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>تفاصيل الرحلة</h3>
            {modalLoading ? (
              <p>جاري تحميل التفاصيل...</p>
            ) : (
              <>
                <h4>🏙 المدن</h4>
                {modalDetails.cities.length === 0 ? (
                  <p>لا توجد مدن.</p>
                ) : (
                  <ul>
                    {modalDetails.cities.map((city, i) => (
                      <li key={`city-${i}`}>{city}</li>
                    ))}
                  </ul>
                )}

                <h4>🏞 الأماكن</h4>
                {modalDetails.places.length === 0 ? (
                  <p>لا توجد أماكن.</p>
                ) : (
                  <ul>
                    {modalDetails.places.map((item, i) => (
                      <li key={`place-${i}`}>{item}</li>
                    ))}
                  </ul>
                )}

                <h4>🍽 المطاعم</h4>
                {modalDetails.restaurants.length === 0 ? (
                  <p>لا توجد مطاعم.</p>
                ) : (
                  <ul>
                    {modalDetails.restaurants.map((item, i) => (
                      <li key={`rest-${i}`}>{item}</li>
                    ))}
                  </ul>
                )}

                <h4>🏥 المستشفيات</h4>
                {modalDetails.hospitals.length === 0 ? (
                  <p>لا توجد مستشفيات.</p>
                ) : (
                  <ul>
                    {modalDetails.hospitals.map((item, i) => (
                      <li key={`hosp-${i}`}>{item}</li>
                    ))}
                  </ul>
                )}

                <h4>🏨 الفنادق</h4>
                {modalDetails.hotels.length === 0 ? (
                  <p>لا توجد فنادق.</p>
                ) : (
                  <ul>
                    {modalDetails.hotels.map((item, i) => (
                      <li key={`hotel-${i}`}>{item}</li>
                    ))}
                  </ul>
                )}

                <button className="p-btn" onClick={closeModal}>
                  إغلاق
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
