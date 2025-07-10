import React from 'react';
import './CityBreaks.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import AllCityBreaks from '../CityBreaks/AllCityBreaks';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';
import NeedInspirationSection from '../../Components/NeedInspiration/NeedInspirationSection';

function CityBreaks() {
  return (
    <div className='city-breaks-page'>
      <SecondHeroSection secondHeroTitle='City break for you' />
      <AllCityBreaks />
      <div className='my-4 my-sm-5'>
        <RecommendedSection itemRecommendedTitle='Your dream holiday' />
      </div>
      <NeedInspirationSection />
    </div>
  );
}

export default CityBreaks;
