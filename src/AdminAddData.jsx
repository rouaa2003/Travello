
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import './AdminAddData.css';

const cities = [
  'damascus', 'aleppo', 'homs', 'hama', 'latakia', 'tartus',
  'idleb', 'daraa', 'alSuwayda', 'deirEzZoe', 'alHasaka', 'alRaqqah', 'qunetira'
];

const AdminAddData = () => {
  const [activeTab, setActiveTab] = useState('places');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imgUrl: '',
    cityId: 'damascus',
    isPopular: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAdd = async () => {
    try {
      await addDoc(collection(db, activeTab), formData);
      alert(`✅ تمت إضافة عنصر جديد إلى ${activeTab}`);
      setFormData({
        name: '',
        description: '',
        imgUrl: '',
        cityId: 'damascus',
        isPopular: false,
      });
    } catch (error) {
      console.error('❌ خطأ في الإضافة:', error);
      alert('❌ فشل في الإضافة، تحقق من الاتصال أو البيانات.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '20px auto', fontFamily: 'sans-serif' }}>
      <h2>إضافة بيانات تجريبية</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: 20 }}>
        {['places', 'restaurants', 'hospitals'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: 10,
              background: activeTab === tab ? '#4CAF50' : '#ddd',
              color: activeTab === tab ? '#fff' : '#000',
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
          >
            {tab === 'places' ? 'أماكن مشهورة' : tab === 'restaurants' ? 'مطاعم' : 'مشافي'}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="admin-form-group">
      <label>الاسم:</label>
      <input name="name" value={formData.name} onChange={handleChange} />
        </div>
      <div className="admin-form-group">  
      <label>الوصف:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} />
</div>
      <label>رابط الصورة:</label>
      <input name="imgUrl" value={formData.imgUrl} onChange={handleChange} />
<div className="admin-form-group">
      <label>المحافظة:</label>
      <select name="cityId" value={formData.cityId} onChange={handleChange}>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
</div>
<div className="admin-form-group">
      <label>
        <input
          type="checkbox"
          name="isPopular"
          checked={formData.isPopular}
          onChange={handleChange}
        />
        شهير؟
      </label>
</div>
<div className="admin-form-group">
      <button onClick={handleAdd} style={{ marginTop: 15, padding: 10, background: '#2196F3', color: '#fff', border: 'none' }}>
        ➕ إضافة إلى {activeTab}
      </button>
      </div>
    </div>
  );
};

export default AdminAddData;
