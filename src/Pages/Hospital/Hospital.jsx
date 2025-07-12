import React, { useEffect, useState } from 'react';
import './Hospital.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

function Hospital() {
  const [hospitals, setHospitals] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'hospitals'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHospitals(data);
        setLoading(false);
      } catch (error) {
        console.error('خطأ في جلب المشافي:', error);
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className='hospital-page'>
      <SecondHeroSection secondHeroTitle='Find The Right Hospital' />

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 40 }}>جاري التحميل...</p>
      ) : (
        <>
          <div className="hospitals-list">
            {hospitals.slice(0, visibleCount).map(h => (
              <div className="hospital-card" key={h.id}>
                {h.imgUrl ? (
                  <img src={h.imgUrl} alt={h.name} className="hospital-image" />
                ) : (
                  <div className="no-image">لا توجد صورة</div>
                )}
                <div className="hospital-content">
                  <h3>{h.name}</h3>
                  <p className="desc">{h.description}</p>
                  <p className="city">المحافظة: {h.cityId}</p>
                  {h.isPopular && <span className="popular-badge">شائع</span>}
                </div>
              </div>
            ))}

            {visibleCount < hospitals.length && (
            <div className="load-more-circle" onClick={handleLoadMore} role="button" tabIndex={0}
                 onKeyDown={e => { if (e.key === 'Enter') handleLoadMore(); }}
                 title="تحميل المزيد">
              &rsaquo;
            </div>
          )}
          </div>

          
        </>
      )}
    </div>
  );
}

export default Hospital;
