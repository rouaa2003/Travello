import React from 'react';
import './Home.css';
import HeroSection from '../../Components/HeroSection/HeroSection';
import LastHolidaysSection from '../../Components/LastHolidaysSection/LastHolidaysSection';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';
import RecentHolidays from '../../Components/RecentHolidays/RecentHolidays';
import NeedInspirationSection from '../../Components/NeedInspiration/NeedInspirationSection';
import HomePlacesSection from '../../Components/HomePlacesSection/HomePlacesSection';
import HomeRestaurantsSection from '../../Components/HomeRestaurantsSection/HomeRestaurantsSection';
import HomeHospitalsSection from '../../Components/HomeHospitalsSection/HomeHospitalsSection';


function Home() {
    return (
        <div className='home-page'>
            <HeroSection />

            <HomePlacesSection />
            <HomeRestaurantsSection />
            <HomeHospitalsSection />

            

            <div className="my-4 my-sm-5">
                <RecommendedSection itemRecommendedTitle='Recommended for you' />
            </div>

            <RecentHolidays />
            <NeedInspirationSection />
        </div>
    )
}

export default Home;
