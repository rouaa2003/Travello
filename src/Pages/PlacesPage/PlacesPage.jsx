import React, { useEffect, useState } from 'react';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './PlacesPage.css';

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesCol = collection(db, 'places');
        const placesSnapshot = await getDocs(placesCol);
        const placesList = placesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPlaces(placesList);
      } catch (error) {
        console.error('خطأ في جلب الأماكن:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const handleLoadMore = () => {
      const nextCount = visibleCount + 5;
  setVisibleCount(Math.min(nextCount, places.length));
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>جارٍ تحميل الأماكن...</p>;
  }

  return (
    <div className="places-page">
      <SecondHeroSection secondHeroTitle="Popular Places" />
      
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

      {visibleCount < places.length && (
      <div className="load-more-circle" onClick={handleLoadMore}>
       ›
      </div>
        )}
      </div>
        
      

    </div>
  );
}

export default PlacesPage;
