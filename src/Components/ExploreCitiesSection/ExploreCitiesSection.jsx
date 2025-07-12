import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './ExploreCitiesSection.css';
import { Link } from 'react-router-dom';

function ExploreCitiesSection() {
  const [cities, setCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6); // عدد المدن المعروضة حالياً

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cities'));
        const citiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })
      );
      console.log('مدينة:', citiesData);
        setCities(citiesData);
      } catch (error) {
        console.error('فشل تحميل المدن:', error);
      }
    };

    fetchCities();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="cities-section">
      <h2 className="section-title">استكشف المدن السورية</h2>
      <div className="cities-grid">
        {cities.slice(0, visibleCount).map(city => (
          <Link to={`/city/${city.id}`} className="city-card" key={city.id}>
            <img src={city.imgUrl} alt={city.name} className="city-image" />
            <h3>{city.name}</h3>
          </Link>
        ))}
      </div>

      {/* زر تحميل المزيد يظهر فقط إذا لم تُعرض كل المدن */}
      {visibleCount < cities.length && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            onClick={handleLoadMore}
            className="load-more-button"
          >
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  );
}

export default ExploreCitiesSection;
