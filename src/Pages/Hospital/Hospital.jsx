import React, { useEffect, useState } from 'react';
import './Hospital.css';
import SecondHeroSection from '../../Components/SecondHeroSection/SecondHeroSection';
import EuropeDestinationsSection from '../../Components/DestinationsSection/EuropeDestinationsSection';
import HolidayPlanSection from '../../Components/HolidayPlanSection/HolidayPlanSection';
import AsiaDestinationsSection from '../../Components/DestinationsSection/AsiaDestinationsSection';
import NeedInspirationsSection from '../../Components/NeedInspiration/NeedInspirationSection';
import AfricaDestinationsSection from '../../Components/DestinationsSection/AfricaDestinationsSection';
import RecommendedSection from '../../Components/RecommendedSection/RecommendedSection';

import { db } from '../../firebase'; // عدّل المسار حسب مشروعك
import { collection, getDocs } from 'firebase/firestore';

function Hospital() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const hospitalsCol = collection(db, 'hospitals');
        const snapshot = await getDocs(hospitalsCol);
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

  return (
    <div className='hospital-page'>
      <SecondHeroSection secondHeroTitle='Find The Right Hospital' />

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: 40 }}>جاري التحميل...</p>
      ) : (
        <div className="hospitals-list" style={{ maxWidth: 1100, margin: '20px auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {hospitals.map(h => (
            <div key={h.id} style={{ border: '1px solid #ccc', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {h.imgUrl ? (
                <img src={h.imgUrl} alt={h.name} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 180, backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999' }}>
                  لا توجد صورة
                </div>
              )}
              <div style={{ padding: 15 }}>
                <h3 style={{ marginBottom: 10 }}>{h.name}</h3>
                <p style={{ fontSize: 14, color: '#555', marginBottom: 10 }}>{h.description}</p>
                <p style={{ fontSize: 13, color: '#888' }}>المحافظة: {h.cityId}</p>
                {h.isPopular && (
                  <span style={{ display: 'inline-block', marginTop: 10, padding: '4px 10px', backgroundColor: '#ff5722', color: '#fff', borderRadius: 15, fontSize: 12 }}>
                    شائع
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    
    </div>
  );
}

export default Hospital;
