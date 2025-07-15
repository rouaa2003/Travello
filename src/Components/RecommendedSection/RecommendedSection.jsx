import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import "../HomeSection.css";
import { Link } from "react-router-dom";

function RecommendedSection({ user }) {
  const [places, setPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCityId, setUserCityId] = useState("");

  useEffect(() => {
    const fetchUserCityIdAndData = async () => {
      try {
        if (!user?.uid) return;

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const cityId = userData.cityId;
          setUserCityId(cityId);

          const [placesSnapshot, restaurantsSnapshot] = await Promise.all([
            getDocs(collection(db, "places")),
            getDocs(collection(db, "restaurants")),
          ]);

          const placesData = placesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const restaurantsData = restaurantsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPlaces(placesData.filter((p) => p.cityId === cityId));
          setRestaurants(restaurantsData.filter((r) => r.cityId === cityId));
        }

        setLoading(false);
      } catch (error) {
        console.error("خطأ في تحميل التوصيات:", error);
        setLoading(false);
      }
    };

    fetchUserCityIdAndData();
  }, [user]);

  if (loading) return <p>جارٍ تحميل التوصيات...</p>;

  return (
    <div className="home-section">
      <h3 className="section-title">مقترحات لأجلك</h3>

      <div className="card-grid">
        {places.map((place) => (
          <div key={place.id} className="card">
            <img src={place.imgUrl} alt={place.name} className="card-image" />
            <div className="card-content">
              <h3>{place.name}</h3>
              <p>{place.description}</p>
            </div>
          </div>
        ))}

        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="card">
            <img
              src={restaurant.imgUrl}
              alt={restaurant.name}
              className="card-image"
            />
            <div className="card-content">
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
            </div>
          </div>
        ))}
        {userCityId && (
          <div className="button-wrapper">
            <Link to={`/city/${userCityId}`} className="show-all">
              عرض كل الأماكن في مدينتك
            </Link>
          </div>
        )}
      </div>

      {/* ✅ زر "عرض الكل" */}
    </div>
  );
}

export default RecommendedSection;
