import React from "react";
import "./Home.css";
import HeroSection from "../../Components/HeroSection/HeroSection";
import LatestTrips from "../../Components/LatestTrips/LatestTrips";
import RecommendedSection from "../../Components/RecommendedSection/RecommendedSection";
import HomeHotelsSection from "../../Components/HomeHotelsSection/HomeHotelsSection";
import NeedInspirationSection from "../../Components/NeedInspiration/NeedInspirationSection";
import HomePlacesSection from "../../Components/HomePlacesSection/HomePlacesSection";
import HomeRestaurantsSection from "../../Components/HomeRestaurantsSection/HomeRestaurantsSection";
import HomeHospitalsSection from "../../Components/HomeHospitalsSection/HomeHospitalsSection";

function Home({ user }) {
  return (
    <div className="home-page">
      <HeroSection />

      <HomePlacesSection />
      <HomeRestaurantsSection />
      <HomeHospitalsSection />
      <HomeHotelsSection />

      <RecommendedSection user={user} />

      <LatestTrips />
      <NeedInspirationSection />
    </div>
  );
}

export default Home;
