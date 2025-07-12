// src/Components/HomePlacesSection/HomePlacesSection.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../HomeSection.css';

function HomePlacesSection() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const snapshot = await getDocs(collection(db, 'places'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlaces(list.slice(0, 4)); // أول 4 أماكن فقط
    };
    fetchPlaces();
  }, []);

  return (
    <section className="home-section">
      <h2 className="section-title">أماكن مشهورة</h2>
      <div className="card-grid">
        {places.map(item => (
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
        <div className="button-wrapper">
        <Link to="/places" className="show-more-button">عرض كل الأماكن</Link>
      </div>
      </div>
      
    </section>
  );
}

export default HomePlacesSection;
