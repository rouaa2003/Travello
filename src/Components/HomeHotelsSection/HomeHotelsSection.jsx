import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "../HomeSection.css";

function HomeHotelsSection() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      const snapshot = await getDocs(collection(db, "hotels"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHotels(list.slice(0, 4));
    };
    fetchHotels();
  }, []);

  return (
    <section className="home-section">
      <h2 className="section-title">فنادق مختارة</h2>
      <div className="card-grid">
        {hotels.map((item) => (
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
          <Link to="/hotels" className="show-more-button">
            عرض كل الفنادق
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomeHotelsSection;
