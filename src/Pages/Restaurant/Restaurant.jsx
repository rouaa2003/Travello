import React from 'react';
import './Restaurant.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import EuropeDestinationsSection from '../../Components/DestinationsSection/EuropeDestinationsSection';
import AsiaDestinationsSection from '../../Components/DestinationsSection/AsiaDestinationsSection';
import AfricaDestinationsSection from '../../Components/DestinationsSection/AfricaDestinationsSection';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';

function Restaurant() {
  return (
    <div className='destinations-page'>
      <SecondHeroSection secondHeroTitle='Delicious Meals' />
      <EuropeDestinationsSection />
      <AsiaDestinationsSection />

      <AfricaDestinationsSection />
      <div className='mt-4 mt-sm-5'>
        <RecommendedSection itemRecommendedTitle='Your dream holiday' />
      </div>
    </div>
  )
}

export default Restaurant;