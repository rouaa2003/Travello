import React, { useEffect, useState } from 'react';
import './RecommendedSection.css';

const suggestions = {
  morning: [
    {
      id: 1,
      name: 'فطور في مطعم أبو كمال',
      description: 'ابدأ صباحك بأطيب الفطور الدمشقي الأصيل.',
      imgUrl: '/images/OIP.webp',
    },
    {
      id: 2,
      name: 'جولة في سوق الحميدية',
      description: 'استكشف الأسواق الشعبية وتذوق الحلويات.',
      imgUrl: '/images/OIP1.webp',
    },
    {
      id: 3,
      name: 'زيارة متحف دمشق الوطني',
      description: 'تعرف على التاريخ والثقافة الغنية لسوريا.',
      imgUrl: '/images/OIP2.webp',
    },
  ],
  afternoon: [
    {
      id: 4,
      name: 'نزهة في حديقة تشرين',
      description: 'استمتع بالهواء الطلق والمساحات الخضراء.',
      imgUrl: '/images/OIP3.webp',
    },
    {
      id: 5,
      name: 'جولة على الأنهار في حلب',
      description: 'تجول على ضفاف نهر بردى وتمتع بالمناظر الطبيعية.',
      imgUrl: '/images/OIP4.webp',
    },
    {
      id: 6,
      name: 'استراحة قهوة في مقاهي السوق',
      description: 'تمتع بقهوة عربية وسط أجواء الأسواق التقليدية.',
      imgUrl: '/images/OIP5.webp',
    },
  ],
  evening: [
    {
      id: 7,
      name: 'عشاء في مطعم الحلبية',
      description: 'تذوق أشهى الأطباق الحلبيّة الأصيلة.',
      imgUrl: '/images/OIP6.webp',
    },
    {
      id: 8,
      name: 'مشاهدة عرض مسرحي في دار الأوبرا',
      description: 'عيش أجواء الفن والثقافة السورية.',
      imgUrl: '/images/OIP7.webp',
    },
    {
      id: 9,
      name: 'تجول ليلي في المدينة القديمة',
      description: 'استمتع بالسهر في الأزقة القديمة والتسوق.',
      imgUrl: '/images/OIP8.webp',
    },
  ]
};

function RecommendedSection({ itemRecommendedTitle }) {
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [currentSuggestions, setCurrentSuggestions] = useState([]);

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
  }, []);

  useEffect(() => {
    setCurrentSuggestions(suggestions[timeOfDay] || []);
  }, [timeOfDay]);

  return (
    <section className="recommended-section">
      <h2>{itemRecommendedTitle}</h2>
      <div className="recommended-grid">
        {currentSuggestions.map(item => (
          <div key={item.id} className="recommended-card">
            {item.imgUrl && (
              <img src={item.imgUrl} alt={item.name} className="recommended-image" />
            )}
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecommendedSection;
