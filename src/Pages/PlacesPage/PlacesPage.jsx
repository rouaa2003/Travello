import React, { useEffect, useState } from "react";
import SecondHeroSection from "../../Components/SecondHeroSection/SecondHeroSection";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./PlacesPage.css";

function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [cities, setCities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesCol = collection(db, "places");
        const placesSnapshot = await getDocs(placesCol);
        const placesList = placesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlaces(placesList);
      } catch (error) {
        console.error("خطأ في جلب الأماكن:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCities = async () => {
      try {
        const cityCol = collection(db, "cities");
        const snapshot = await getDocs(cityCol);
        const cityList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCities(cityList);
      } catch (error) {
        console.error("فشل تحميل المدن:", error);
      }
    };

    fetchPlaces();
    fetchCities();
  }, []);

  const handleLoadMore = () => {
    const nextCount = visibleCount + 6;
    setVisibleCount(Math.min(nextCount, filteredPlaces.length));
  };

  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity = !filterCity || place.cityId === filterCity;
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        جارٍ تحميل الأماكن...
      </p>
    );
  }

  return (
    <div className="places-page">
      <SecondHeroSection secondHeroTitle="Popular Places" />

      {/* ✅ الفلترة والبحث */}
      <div
        className="filters"
        style={{ textAlign: "center", margin: "20px auto" }}
      >
        <input
          type="text"
          placeholder="ابحث عن مكان..."
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

      <div className="places-grid">
        {filteredPlaces.slice(0, visibleCount).map((place) => (
          <div key={place.id} className="place-card">
            {place.imgUrl ? (
              <img
                src={place.imgUrl}
                alt={place.name}
                className="place-image"
              />
            ) : (
              <div className="place-image placeholder">لا توجد صورة</div>
            )}
            <div className="place-content">
              <h3 className="place-name">{place.name}</h3>
              <p className="place-description">{place.description}</p>
              {place.isPopular && <span className="popular-badge">شائع</span>}
              <p className="place-city">المحافظة: {place.cityId}</p>
            </div>
          </div>
        ))}

        {visibleCount < filteredPlaces.length && (
          <div className="load-more-circle" onClick={handleLoadMore}>
            ›
          </div>
        )}
      </div>
    </div>
  );
}

export default PlacesPage;
