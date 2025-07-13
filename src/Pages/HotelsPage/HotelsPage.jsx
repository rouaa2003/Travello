import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import './HotelsPage.css';

function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const colRef = collection(db, 'hotels');
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHotels(data);
      } catch (error) {
        console.error('خطأ في جلب الفنادق:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>جاري التحميل...</p>;

  return (
    <div className='destinations-page'>
      <SecondHeroSection secondHeroTitle='Comfortable Hotels' />

      <div className="hotels-grid">
        {hotels.slice(0, visibleCount).map(hotel => (
          <div className="hotel-card" key={hotel.id}>
            {hotel.imgUrl ? (
              <img src={hotel.imgUrl} alt={hotel.name} className="hotel-img" />
            ) : (
              <div className="hotel-placeholder">لا توجد صورة</div>
            )}
            <div className="hotel-content">
              <h3>{hotel.name}</h3>
              <p className="description">{hotel.description}</p>
              <p className="city">المحافظة: {hotel.cityId}</p>
              {hotel.isPopular && <span className="popular-badge">شائع</span>}
            </div>
          </div>
        ))}
        {visibleCount < hotels.length && (
          <div className="load-more-circle" onClick={handleLoadMore}>›</div>
        )}
      </div>
    </div>
  );
}

export default HotelsPage;
