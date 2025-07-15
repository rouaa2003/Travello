import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./TripDetails.css";
import { useAuth } from "../../AuthContext";

function TripDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [trip, setTrip] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [seatsToBook, setSeatsToBook] = useState(1);

  const [hotels, setHotels] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [places, setPlaces] = useState([]);

  const fetchItemsByIds = async (collectionName, ids) => {
    if (!ids || ids.length === 0) return [];
    const q = query(
      collection(db, collectionName),
      where("__name__", "in", ids)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  };

  useEffect(() => {
    const fetchTripAndRelated = async () => {
      const ref = doc(db, "trips", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = { id: snap.id, ...snap.data() };
      setTrip(data);

      const [hData, hosData, rData, pData] = await Promise.all([
        fetchItemsByIds("hotels", data.selectedHotelIds),
        fetchItemsByIds("hospitals", data.selectedHospitalIds),
        fetchItemsByIds("restaurants", data.selectedRestaurantIds),
        fetchItemsByIds("places", data.selectedPlaceIds),
      ]);
      setHotels(hData);
      setHospitals(hosData);
      setRestaurants(rData);
      setPlaces(pData);
    };
    fetchTripAndRelated();
  }, [id]);

  const handleBooking = async () => {
    if (!user || !trip) {
      alert("يرجى تسجيل الدخول للحجز.");
      return;
    }
    const available =
      trip.availableSeats ?? trip.maxSeats - (trip.seatsBooked || 0);
    if (available <= 0) {
      alert("لا توجد مقاعد متاحة للحجز.");
      return;
    }
    if (seatsToBook > available) {
      alert(
        `عدد المقاعد المطلوبة (${seatsToBook}) أكبر من المقاعد المتاحة (${available}).`
      );
      return;
    }

    setIsBooking(true);
    try {
      await addDoc(collection(db, "bookings"), {
        userIds: [user.uid],
        tripId: trip.id,
        seatsBooked: seatsToBook,
        createdAt: new Date(),
        customTrip: false,
      });
      const tripRef = doc(db, "trips", trip.id);
      await updateDoc(tripRef, {
        seatsBooked: (trip.seatsBooked || 0) + seatsToBook,
      });
      const updated = await getDoc(tripRef);
      setTrip({ id: updated.id, ...updated.data() });
      setBookingSuccess(true);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحجز. حاول مرة أخرى.");
    }
    setIsBooking(false);
  };

  const formatDate = (d) =>
    d?.toDate ? d.toDate().toLocaleDateString("ar-EG") : "غير متوفر";
  const formatDuration = (dur) =>
    dur ? `${dur} ${Number(dur) === 1 ? "يوم" : "أيام"}` : "غير متوفر";

  if (!trip)
    return <p className="tripUnique-loading">جاري تحميل تفاصيل الرحلة...</p>;

  const availableSeats =
    trip.availableSeats ?? trip.maxSeats - (trip.seatsBooked || 0);

  const destination = trip.selectedCityIds?.length
    ? trip.selectedCityIds.join("، ")
    : "الوجهة غير معروفة";

  return (
    <div className="tripUnique-container">
      <h2 className="tripUnique-title">تفاصيل الرحلة إلى {destination}</h2>
      <div className="tripUnique-info">
        <p>
          <strong>📅 التاريخ:</strong> {formatDate(trip.tripDate)}
        </p>
        <p>
          <strong>⏳ المدة:</strong> {formatDuration(trip.tripDuration)}
        </p>
        <p>
          <strong>🎟 المقاعد المتاحة:</strong> {availableSeats} /{" "}
          {trip.maxSeats || "غير معروف"}
        </p>
      </div>

      <hr className="tripUnique-divider" />

      {hotels.length > 0 && (
        <section className="tripUnique-relatedSection">
          <h3 className="tripUnique-relatedTitle">الفنادق</h3>
          <div className="tripUnique-relatedItems">
            {hotels.map((h) => (
              <div key={h.id} className="tripUnique-relatedCard">
                <img src={h.imgUrl || "/default-hotel.jpg"} alt={h.name} />
                <p>{h.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {hospitals.length > 0 && (
        <section className="tripUnique-relatedSection">
          <h3 className="tripUnique-relatedTitle">المستشفيات</h3>
          <div className="tripUnique-relatedItems">
            {hospitals.map((h) => (
              <div key={h.id} className="tripUnique-relatedCard">
                <img src={h.imgUrl || "/default-hospital.jpg"} alt={h.name} />
                <p>{h.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {restaurants.length > 0 && (
        <section className="tripUnique-relatedSection">
          <h3 className="tripUnique-relatedTitle">المطاعم</h3>
          <div className="tripUnique-relatedItems">
            {restaurants.map((r) => (
              <div key={r.id} className="tripUnique-relatedCard">
                <img src={r.imgUrl || "/default-restaurant.jpg"} alt={r.name} />
                <p>{r.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {places.length > 0 && (
        <section className="tripUnique-relatedSection">
          <h3 className="tripUnique-relatedTitle">الأماكن السياحية</h3>
          <div className="tripUnique-relatedItems">
            {places.map((p) => (
              <div key={p.id} className="tripUnique-relatedCard">
                <img src={p.imgUrl || "/default-place.jpg"} alt={p.name} />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="tripUnique-bookingForm">
        <label>عدد المقاعد المطلوبة:</label>
        <select
          value={seatsToBook}
          onChange={(e) => setSeatsToBook(+e.target.value)}
          className="tripUnique-select"
        >
          {Array.from({ length: Math.min(availableSeats, 10) }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} {i === 0 ? "مقعد" : "مقاعد"}
            </option>
          ))}
        </select>
        <button
          onClick={handleBooking}
          disabled={availableSeats <= 0 || isBooking}
          className="tripUnique-bookBtn"
        >
          {isBooking ? "جاري الحجز..." : "تأكيد الحجز"}
        </button>
        {bookingSuccess && (
          <p className="tripUnique-successMsg">✅ تم الحجز بنجاح!</p>
        )}
      </div>
    </div>
  );
}

export default TripDetails;
