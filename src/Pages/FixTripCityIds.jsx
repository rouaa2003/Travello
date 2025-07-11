import React, { useEffect } from 'react';
import { db } from '../firebase'; // عدّل المسار حسب مشروعك
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const provinceToCityId = {
  دمشق: 'damascus',
  حلب: 'aleppo',
  حمص: 'homs',
  حماة: 'hama',
  إدلب: 'idleb',
  اللاذقية: 'latakia',
  طرطوس: 'tartus',
  درعا: 'daraa',
  الرقة: 'alRaqqah',
  الحسكة: 'alHasaka',
  السويداء: 'alSuwayda',
  'دير الزور': 'deirEzZoe',
  القنيطرة: 'qunetira',
};

function AutoFixCityIds() {
  useEffect(() => {
    const fixTrips = async () => {
      try {
        const tripsCol = collection(db, 'trips');
        const tripsSnapshot = await getDocs(tripsCol);
        let count = 0;

        for (const tripDoc of tripsSnapshot.docs) {
          const trip = tripDoc.data();
          const provinceName = trip.province;

          // إذا ما في cityIds أو فاضيين
          if (!trip.cityIds || trip.cityIds.length === 0) {
            const cityId = provinceToCityId[provinceName];
            if (cityId) {
              await updateDoc(doc(db, 'trips', tripDoc.id), {
                cityIds: [cityId],
              });
              count++;
              console.log(`تم تحديث الرحلة ${tripDoc.id} بإضافة cityIds: [${cityId}]`);
            } else {
              console.warn(`لا يوجد mapping لمحافظة "${provinceName}" في الرحلة ${tripDoc.id}`);
            }
          }
        }
        alert(`تم تحديث ${count} رحلة بإضافة cityIds.`);
      } catch (err) {
        console.error('خطأ أثناء تحديث الرحلات:', err);
      }
    };

    fixTrips();
  }, []);

  return (
    <div>
      <h2>جاري تحديث الرحلات...</h2>
      <p>افتح وحدة التحكم Console لتتبع التقدم.</p>
    </div>
  );
}

export default AutoFixCityIds;
