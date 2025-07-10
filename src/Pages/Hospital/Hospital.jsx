import React from 'react';
import './Hospital.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import EuropeDestinationsSection from '../../Components/DestinationsSection/EuropeDestinationsSection';
import HolidayPlanSection from '../../Components/HolidayPlanSection/HolidayPlanSection';
import AsiaDestinationsSection from '../../Components/DestinationsSection/AsiaDestinationsSection';
import NeedInspirationsSection from '../../Components/NeedInspiration/NeedInspirationSection';
import AfricaDestinationsSection from '../../Components/DestinationsSection/AfricaDestinationsSection';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';

function hospital() {
  return (
    <div className='hospital-page'>
      <SecondHeroSection secondHeroTitle='Find The Right Hospital' />
      <EuropeDestinationsSection />
      <HolidayPlanSection itemHolidayPlanTitle='Find your perfect summer holiday' />
      <AsiaDestinationsSection />
      <NeedInspirationsSection />
      <AfricaDestinationsSection />
      <div className='mt-4 mt-sm-5'>
        <RecommendedSection itemRecommendedTitle='Your dream holiday' />
      </div>
    </div>
  )
}

export default hospital;