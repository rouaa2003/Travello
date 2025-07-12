// src/Components/HomeHospitalsSection/HomeHospitalsSection.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import '../HomeSection.css';

function HomeHospitalsSection() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      const snapshot = await getDocs(collection(db, 'hospitals'));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHospitals(list.slice(0, 4));
    };
    fetchHospitals();
  }, []);

  return (
    <section className="home-section">
      <h2 className="section-title">المشافي</h2>
      <div className="card-grid">
        {hospitals.map(item => (
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
        <div className="button-wrapper ">
        <Link to="/hospitals" className="show-more-button">عرض كل المشافي</Link>
      </div>
      </div>
      
    </section>
  );
}

export default HomeHospitalsSection;
