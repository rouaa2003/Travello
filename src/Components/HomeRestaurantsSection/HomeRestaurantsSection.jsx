// src/Components/HomeRestaurantsSection/HomeRestaurantsSection.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../HomeSection.css';

function HomeRestaurantsSection() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const snapshot = await getDocs(collection(db, 'restaurants'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRestaurants(list.slice(0, 4));
    };
    fetchRestaurants();
  }, []);

  return (
    <section className="home-section">
      <h2 className="section-title">مطاعم مميزة</h2>
      <div className="card-grid">
        {restaurants.map(item => (
          <div key={item.id} className="card">
            {item.imgUrl ? (
              <img src={item.imgUrl} alt={item.name} className="card-image" />
            ) : (
              <div className="card-image placeholder">لا صورة</div>
            )}
            <div className="card-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="button-wrapper">
        <Link to="/restaurants" className="show-more-button">عرض كل المطاعم</Link>
      </div>
    </section>
  );
}

export default HomeRestaurantsSection;
