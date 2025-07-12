import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './ExploreCitiesSection.css';
import { Link } from 'react-router-dom';

function ExploreCitiesSection() {
  const [cities, setCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cities'));
        const citiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCities(citiesData);
      } catch (error) {
        console.error('فشل تحميل المدن:', error);
      }
    };

    fetchCities();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
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

        {visibleCount < cities.length && (
          <div
            className="load-more-card"
            onClick={handleLoadMore}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') handleLoadMore(); }}
            title="عرض المزيد"
          >
            <span className="load-more-arrow">›</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreCitiesSection;
