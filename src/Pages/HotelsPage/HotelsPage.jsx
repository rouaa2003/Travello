import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import SecondHeroSection from "../../Components/SecondHeroSection/SecondHeroSection";
import "./HotelsPage.css";

function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const colRef = collection(db, "hotels");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHotels(data);
      } catch (error) {
        console.error("خطأ في جلب الفنادق:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const colRef = collection(db, "cities");
        const snapshot = await getDocs(colRef);
        const cityData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCities(cityData);
      } catch (error) {
        console.error("خطأ في جلب المدن:", error);
      }
    };

    fetchHotels();
    fetchCities();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === "" || hotel.cityId === filterCity;
    return matchesSearch && matchesCity;
  });

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>جاري التحميل...</p>
    );

  return (
    <div className="destinations-page">
      <SecondHeroSection secondHeroTitle="Comfortable Hotels" />

      {/* ✅ حقول البحث والفلترة */}
      <div
        className="filters"
        style={{ textAlign: "center", margin: "20px auto" }}
      >
        <input
          type="text"
          placeholder="ابحث عن فندق ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <select
          className="f-select"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          style={{ padding: "8px", width: "200px" }}
        >
          <option value="">كل المحافظات</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hotels-grid">
        {filteredHotels.slice(0, visibleCount).map((hotel) => (
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
        {visibleCount < filteredHotels.length && (
          <div className="load-more-circle" onClick={handleLoadMore}>
            ›
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelsPage;
