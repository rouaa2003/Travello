import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // عدّل حسب مسار ملف firebase.js عندك
import { collection, getDocs } from 'firebase/firestore';

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const colRef = collection(db, 'restaurants');
        const snapshot = await getDocs(colRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error('خطأ في جلب المطاعم:', error);
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 50 }}>جاري التحميل...</p>;

  return (
    <div>
      

      {/* قائمة المطاعم */}
      <div style={{ maxWidth: 1000, margin: '20px auto', padding: '0 15px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {restaurants.map(r => (
          <div key={r.id} style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            {r.imgUrl ? (
              <img
                src={r.imgUrl}
                alt={r.name}
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: '100%', height: 180, backgroundColor: '#eee', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999' }}>
                لا توجد صورة
              </div>
            )}
            <div style={{ padding: 15 }}>
              <h3 style={{ margin: '0 0 10px' }}>{r.name}</h3>
              <p style={{ margin: '0 0 10px', color: '#555', fontSize: 14 }}>{r.description}</p>
              <p style={{ fontSize: 13, color: '#888' }}>المحافظة: {r.cityId}</p>
              {r.isPopular && <span style={{ display: 'inline-block', marginTop: 10, padding: '4px 10px', backgroundColor: '#ff5722', color: 'white', borderRadius: 15, fontSize: 12 }}>شائع</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantsPage;
