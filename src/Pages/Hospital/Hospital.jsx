import React, { useEffect, useState } from "react";
import "./Hospital.css";
import SecondHeroSection from "../../Components/SecondHeroSection/SecondHeroSection";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

function Hospital() {
  const [hospitals, setHospitals] = useState([]);
  const [cities, setCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hospitals"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHospitals(data);
        setLoading(false);
      } catch (error) {
        console.error("خطأ في جلب المشافي:", error);
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cities"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCities(data);
      } catch (err) {
        console.error("خطأ في جلب المدن:", err);
      }
    };

    fetchHospitals();
    fetchCities();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const filteredHospitals = hospitals
    .filter((h) => h.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((h) => !selectedCity || h.cityId === selectedCity);

  return (
    <div className="hospital-page">
      <SecondHeroSection secondHeroTitle="Find The Right Hospital" />

      <div className="filters">
        <input
          type="text"
          placeholder="ابحث عن مشفى..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="f-select"
        >
          <option value="">كل المحافظات</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: 40 }}>جاري التحميل...</p>
      ) : (
        <>
          <div className="hospitals-list">
            {filteredHospitals.slice(0, visibleCount).map((h) => (
              <div className="hospital-card" key={h.id}>
                {h.imgUrl ? (
                  <img src={h.imgUrl} alt={h.name} className="hospital-image" />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}
                <div className="hospital-content">
                  <h3>{h.name}</h3>
                  <p className="desc">{h.description}</p>
                  <p className="city">المحافظة: {h.cityId}</p>
                  {h.isPopular && <span className="popular-badge">شائع</span>}
                </div>
              </div>
            ))}

            {visibleCount < filteredHospitals.length && (
              <div
                className="load-more-circle"
                onClick={handleLoadMore}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLoadMore();
                }}
                title="تحميل المزيد"
              >
                &rsaquo;
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Hospital;
