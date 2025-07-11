import React, { useEffect, useState } from 'react';
import './RecommendedSection.css';

const suggestions = {
  morning: [
    {
      id: 1,
      name: 'فطور في مطعم أبو كمال',
      description: 'ابدأ صباحك بأطيب الفطور الدمشقي الأصيل.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Syrian_breakfast.jpg/320px-Syrian_breakfast.jpg'
    },
    {
      id: 2,
      name: 'جولة في سوق الحميدية',
      description: 'استكشف الأسواق الشعبية وتذوق الحلويات.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Hamidiyah_Souk_Damascus_Syria_2021.jpg/320px-Hamidiyah_Souk_Damascus_Syria_2021.jpg'
    },
    {
      id: 3,
      name: 'زيارة متحف دمشق الوطني',
      description: 'تعرف على التاريخ والثقافة الغنية لسوريا.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/National_Museum_of_Damascus_2012.JPG/320px-National_Museum_of_Damascus_2012.JPG'
    },
  ],
  afternoon: [
    {
      id: 4,
      name: 'نزهة في حديقة تشرين',
      description: 'استمتع بالهواء الطلق والمساحات الخضراء.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Tishreen_Park_Damascus_Syria_2016.jpg/320px-Tishreen_Park_Damascus_Syria_2016.jpg'
    },
    {
      id: 5,
      name: 'جولة على الأنهار في حلب',
      description: 'تجول على ضفاف نهر بردى وتمتع بالمناظر الطبيعية.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Barada_River_Damascus_2009.JPG/320px-Barada_River_Damascus_2009.JPG'
    },
    {
      id: 6,
      name: 'استراحة قهوة في مقاهي السوق',
      description: 'تمتع بقهوة عربية وسط أجواء الأسواق التقليدية.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Old_Coffee_House_-_Damascus.jpg/320px-Old_Coffee_House_-_Damascus.jpg'
    },
  ],
  evening: [
    {
      id: 7,
      name: 'عشاء في مطعم الحلبية',
      description: 'تذوق أشهى الأطباق الحلبيّة الأصيلة.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Aleppo_food.jpg/320px-Aleppo_food.jpg'
    },
    {
      id: 8,
      name: 'مشاهدة عرض مسرحي في دار الأوبرا',
      description: 'عيش أجواء الفن والثقافة السورية.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Damascus_Opera_House.jpg/320px-Damascus_Opera_House.jpg'
    },
    {
      id: 9,
      name: 'تجول ليلي في المدينة القديمة',
      description: 'استمتع بالسهر في الأزقة القديمة والتسوق.',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Damascus_Old_City_by_Night.jpg/320px-Damascus_Old_City_by_Night.jpg'
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
