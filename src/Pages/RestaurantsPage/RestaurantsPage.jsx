import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import SecondHeroSection from "../../Components/SecondHeroSection/SecondHeroSection";
import "./RestaurantsPage.css";

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [cities, setCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const colRef = collection(db, "restaurants");
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRestaurants(data);
      } catch (error) {
        console.error("خطأ في جلب المطاعم:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cities"));
        const cityList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCities(cityList);
      } catch (err) {
        console.error("فشل تحميل المدن:", err);
      }
    };

    fetchRestaurants();
    fetchCities();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = !filterCity || r.cityId === filterCity;
    return matchesSearch && matchesCity;
  });

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>جاري التحميل...</p>
    );

  return (
    <div className="destinations-page">
      <SecondHeroSection secondHeroTitle="Delicious Meals" />

      {/* ✅ البحث والفلترة */}
      <div
        className="filters"
        style={{ textAlign: "center", margin: "20px auto" }}
      >
        <input
          type="text"
          placeholder="ابحث عن مطعم..."
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

      <div className="restaurants-grid">
        {filteredRestaurants.slice(0, visibleCount).map((r) => (
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
        {visibleCount < filteredRestaurants.length && (
          <div className="load-more-circle" onClick={handleLoadMore}>
            ›
          </div>
        )}
      </div>
    </div>
  );
}

export default RestaurantsPage;
