import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // عدّل المسار حسب موقعك
import { collection, getDocs } from 'firebase/firestore';
import './PlacesPage.css';

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // عدد الأماكن المرئية حاليا
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesCol = collection(db, 'places');
        const placesSnapshot = await getDocs(placesCol);
        const placesList = placesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlaces(placesList);
        setLoading(false);
      } catch (error) {
        console.error('خطأ في جلب الأماكن:', error);
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>جاري التحميل...</p>;

  return (
    <div className="places-page">
      <h2 className="page-title">الأماكن المشهورة</h2>
      <div className="places-grid">
        {places.slice(0, visibleCount).map(place => (
          <div key={place.id} className="place-card">
            {place.imgUrl ? (
              <img src={place.imgUrl} alt={place.name} className="place-image" />
            ) : (
              <div className="place-image placeholder">لا توجد صورة</div>
            )}
            <div className="place-content">
              <h3 className="place-name">{place.name}</h3>
              <p className="place-description">{place.description}</p>
              {place.isPopular && <span className="popular-badge">شائع</span>}
              <p className="place-city">المحافظة: {place.cityId}</p>
            </div>
          </div>
        ))}
      </div>

      {/* زر تحميل المزيد يظهر فقط إذا لم تُعرض كل الأماكن */}
      {visibleCount < places.length && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={handleLoadMore} className="load-more-button">
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  );
}

export default PlacesPage;
