import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './ExploreCitiesSection.css';
import { Link } from 'react-router-dom';

function ExploreCitiesSection() {
  const [cities, setCities] = useState([]);

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

  return (
    <div className="cities-section">
      <h2 className="section-title">استكشف المدن السورية</h2>
      <div className="cities-grid">
        {cities.map(city => (
          <Link to={`/city/${city.id}`} className="city-card">
  <img src={city.imageUrl} alt={city.name} className="city-image" />
  <h3>{city.name}</h3>
</Link>

        ))}
      </div>
    </div>
  );
}

export default ExploreCitiesSection;
