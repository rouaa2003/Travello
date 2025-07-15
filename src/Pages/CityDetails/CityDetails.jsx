import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./CityDetails.css";

function CityDetails() {
  const { id } = useParams(); // معرف المدينة من الرابط

  // الحالات
  const [city, setCity] = useState(null);
  const [places, setPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [citiesData, setCitiesData] = useState({}); // لجلب أسماء المدن للعرض

  // جلب أسماء المدن (id => name)
  const fetchCitiesMap = async () => {
    const citiesSnap = await getDocs(collection(db, "cities"));
    const map = {};
    citiesSnap.docs.forEach((doc) => {
      map[doc.id] = doc.data().name;
    });
    setCitiesData(map);
  };

  // دالة مساعدة لجلب بيانات حسب نوعها (with cityId أو cityIds)
  const fetchByType = async (collectionName, setter, isArray = false) => {
    const q = query(
      collection(db, collectionName),
      isArray
        ? where("cityIds", "array-contains", id)
        : where("cityId", "==", id)
    );
    const snap = await getDocs(q);
    setter(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المدينة
        const cityDoc = await getDoc(doc(db, "cities", id));
        if (cityDoc.exists()) setCity(cityDoc.data());

        // جلب أسماء المدن
        await fetchCitiesMap();

        // جلب الأماكن، المطاعم، المشافي، الفنادق
        await fetchByType("places", setPlaces);
        await fetchByType("restaurants", setRestaurants);
        await fetchByType("hospitals", setHospitals);
        await fetchByType("hotels", setHotels);

        // جلب الرحلات التي تشمل المدينة
        const tripsSnap = await getDocs(
          query(
            collection(db, "trips"),
            where("selectedCityIds", "array-contains", id)
          )
        );
        const tripsData = tripsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrips(tripsData);

        // جلب الحجوزات المرتبطة

        // 1. الحجوزات المخصصة التي تحتوي المدينة في selectedCityIds
        const customQuery = query(
          collection(db, "bookings"),
          where("customTrip", "==", true),
          where("selectedCityIds", "array-contains", id)
        );
        const customSnap = await getDocs(customQuery);
        const customBookings = customSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2. الحجوزات العادية المرتبطة برحلات المدينة (tripId in tripsData ids)
        const tripIds = tripsData.map((trip) => trip.id);
        let normalBookings = [];
        if (tripIds.length > 0) {
          const normalQuery = query(
            collection(db, "bookings"),
            where("customTrip", "==", false),
            where("tripId", "in", tripIds)
          );
          const normalSnap = await getDocs(normalQuery);
          normalBookings = normalSnap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              tripDetails: tripsData.find((t) => t.id === data.tripId) || null,
            };
          });
        }

        // دمج الحجوزات كلها
        setBookings([...customBookings, ...normalBookings]);
      } catch (error) {
        console.error("فشل تحميل بيانات المدينة:", error);
      }
    };

    fetchData();
  }, [id]);

  // زيادة عرض المزيد
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  // دالة لترجمة قائمة الـ cityIds لأسماء المدن
  const getCityNames = (cityIds) => {
    if (!cityIds || cityIds.length === 0) return ["غير معروف"];
    return cityIds.map((cid) => citiesData[cid] || cid);
  };

  // دالة لتنسيق التاريخ
  const formatDate = (date) => {
    if (!date) return "-";
    if (date.toDate) return date.toDate().toLocaleDateString("ar-EG");
    return new Date(date).toLocaleDateString("ar-EG");
  };

  if (!city) return <p>جاري تحميل بيانات المدينة...</p>;

  return (
    <div className="city-details">
      <h2>{city.name}</h2>
      <img src={city.imgUrl} alt={city.name} className="city-banner" />

      {/* الأماكن السياحية */}
      <section>
        <h3>📍 أماكن سياحية</h3>
        {places.length === 0 ? (
          <p>لا توجد أماكن سياحية.</p>
        ) : (
          <div className="cards">
            {places.slice(0, visibleCount).map((place) => (
              <div className="card" key={place.id}>
                {place.imgUrl ? (
                  <img src={place.imgUrl} alt={place.name} />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}
                <h4>{place.name}</h4>
                <p>{place.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* المطاعم */}
      <section>
        <h3>🍽 مطاعم</h3>
        {restaurants.length === 0 ? (
          <p>لا توجد مطاعم.</p>
        ) : (
          <div className="cards">
            {restaurants.slice(0, visibleCount).map((rest) => (
              <div className="card" key={rest.id}>
                {rest.imgUrl ? (
                  <img src={rest.imgUrl} alt={rest.name} />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}
                <h4>{rest.name}</h4>
                <p>{rest.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* الفنادق */}
      <section>
        <h3>🏨 فنادق</h3>
        {hotels.length === 0 ? (
          <p>لا توجد فنادق.</p>
        ) : (
          <div className="cards">
            {hotels.slice(0, visibleCount).map((hotel) => (
              <div className="card" key={hotel.id}>
                {hotel.imgUrl ? (
                  <img src={hotel.imgUrl} alt={hotel.name} />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}
                <h4>{hotel.name}</h4>
                <p>{hotel.description}</p>
                {hotel.isPopular && <span className="popular-badge">شائع</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* المشافي */}
      <section>
        <h3>🏥 مشافي</h3>
        {hospitals.length === 0 ? (
          <p>لا توجد مشافي.</p>
        ) : (
          <div className="cards">
            {hospitals.slice(0, visibleCount).map((hosp) => (
              <div className="card" key={hosp.id}>
                {hosp.imgUrl ? (
                  <img src={hosp.imgUrl} alt={hosp.name} />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}
                <h4>{hosp.name}</h4>
                <p>{hosp.description}</p>
                {hosp.isPopular && <span className="popular-badge">شائع</span>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* الحجوزات المرتبطة بالمدينة */}
      <section>
        <h3>📅 الحجوزات المرتبطة بالمدينة</h3>
        {bookings.length === 0 ? (
          <p>لا توجد حجوزات مرتبطة بهذه المدينة.</p>
        ) : (
          <div className="cards">
            {bookings.slice(0, visibleCount).map((booking) => {
              if (booking.customTrip) {
                // رحلة مخصصة
                return (
                  <div key={booking.id} className="card">
                    <h4>رحلة مخصصة</h4>
                    <p>
                      المدن:{" "}
                      {getCityNames(booking.selectedCityIds || []).join("، ")}
                    </p>
                    <p>التاريخ: {formatDate(booking.tripDate)}</p>
                    <p>مدة الرحلة: {booking.tripDuration} أيام</p>
                    <p>عدد المسافرين: {booking.userIds?.length || 0}</p>
                  </div>
                );
              } else {
                // رحلة جاهزة (عادية)
                const trip = booking.tripDetails;
                return (
                  <div key={booking.id} className="card">
                    <h4>رحلة جاهزة</h4>
                    <p>
                      المدن:{" "}
                      {trip
                        ? getCityNames(trip.selectedCityIds || []).join("، ")
                        : "-"}
                    </p>
                    <p>التاريخ: {formatDate(trip?.tripDate)}</p>
                    <p>مدة الرحلة: {trip?.tripDuration} أيام</p>
                    <p>المقاعد المحجوزة: {booking.seatsBooked || 0}</p>
                  </div>
                );
              }
            })}
          </div>
        )}
        {bookings.length > visibleCount && (
          <div
            className="load-more-circle"
            onClick={handleLoadMore}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLoadMore();
            }}
          >
            +
          </div>
        )}
      </section>
    </div>
  );
}

export default CityDetails;
