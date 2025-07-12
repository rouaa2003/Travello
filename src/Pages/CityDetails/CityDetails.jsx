import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import './CityDetails.css';

function CityDetails() {
  const { id } = useParams(); // ID المدينة من الرابط
  const [city, setCity] = useState(null);
  const [places, setPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityDoc = await getDoc(doc(db, 'cities', id));
        setCity(cityDoc.data());

        const fetchByType = async (collectionName, setter, isArray = false) => {
          const q = query(
            collection(db, collectionName),
            isArray ? where('cityIds', 'array-contains', id) : where('cityId', '==', id)
          );
          const snapshot = await getDocs(q);
          setter(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        await fetchByType('places', setPlaces);
        await fetchByType('restaurants', setRestaurants);
        await fetchByType('hospitals', setHospitals);
        await fetchByType('trips', setTrips,true);

      } catch (error) {
        console.error('فشل تحميل تفاصيل المدينة:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!city) return <p>جاري تحميل بيانات المدينة...</p>;

  return (
    <div className="city-details">
      <h2>{city.name}</h2>
      <img src={city.imgUrl} alt={city.name} className="city-banner" />

      <section>
        <h3>📍 أماكن سياحية</h3>
        {places.length === 0 ? <p>لا توجد أماكن سياحية.</p> :
          <div className="cards">{places.map(place => (
            <div className="card" key={place.id}>
              <img src={place.imgUrl} alt={place.name} />
              <h4>{place.name}</h4>
            </div>
          ))}</div>}
      </section>

      <section>
        <h3>🍽 مطاعم</h3>
        {restaurants.length === 0 ? <p>لا توجد مطاعم.</p> :
          <div className="cards">{restaurants.map(rest => (
            <div className="card" key={rest.id}>
              <img src={rest.imgUrl} alt={rest.name} />
              <h4>{rest.name}</h4>
            </div>
          ))}</div>}
      </section>

      <section>
        <h3>🏥 مشافي</h3>
        {hospitals.length === 0 ? <p>لا توجد مشافي.</p> :
          <div className="cards">{hospitals.map(hosp => (
            <div className="card" key={hosp.id}>
              <img src={hosp.imgUrl} alt={hosp.name} />
              <h4>{hosp.name}</h4>
            </div>
          ))}</div>}
      </section>

      <section>
        <h3>🚌 الرحلات المرتبطة</h3>
        {trips.length === 0 ? <p>لا توجد رحلات حالياً.</p> :
          <div className="cards">{trips.map(trip => (
            <div className="card" key={trip.id}>
              
              <h4>{trip.title}</h4>
              <p>📅 {trip.date}</p>
              <p>💸 {trip.price} ل.س</p>
              <a href={`/trip/${trip.id}`} className="btn">عرض التفاصيل</a>
            </div>
          ))}</div>}
      </section>
    </div>
  );
}

export default CityDetails;
