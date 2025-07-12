import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import './RestaurantsPage.css'; // تأكدي من إنشاء هذا الملف وإضافة التنسيقات فيه

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const colRef = collection(db, 'restaurants');
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRestaurants(data);
      } catch (error) {
        console.error('خطأ في جلب المطاعم:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>جاري التحميل...</p>;

  return (
    <div className='destinations-page'>
      <SecondHeroSection secondHeroTitle='Delicious Meals' />

      <div className="restaurants-grid">
        {restaurants.slice(0, visibleCount).map(r => (
          <div className="restaurant-card" key={r.id}>
            {r.imgUrl ? (
              <img src={r.imgUrl} alt={r.name} className="restaurant-img" />
            ) : (
              <div className="restaurant-placeholder">لا توجد صورة</div>
            )}
            <div className="restaurant-content">
              <h3>{r.name}</h3>
              <p className="description">{r.description}</p>
              <p className="city">المحافظة: {r.cityId}</p>
              {r.isPopular && <span className="popular-badge">شائع</span>}
            </div>
          </div>
        ))}
        {visibleCount < restaurants.length && (
      <div className="load-more-circle" onClick={handleLoadMore}>
       ›
      </div>
        )}
      </div>

      
    </div>
  );
}

export default RestaurantsPage;
