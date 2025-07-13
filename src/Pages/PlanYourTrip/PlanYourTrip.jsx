import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import MultiSelectDropdown from "./MultiSelectDropdown";
import "./PlanYourTrip.css";

const Card = ({ data, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`custom-card ${selected ? "selected" : ""}`}
  >
    <img
      src={data.imgUrl || "https://via.placeholder.com/300x180"}
      alt={data.name}
    />
    <div className="card-info">
      <h4>{data.name}</h4>
      <p>{data.cityId}</p>
    </div>
    {selected && <div className="checkmark">✔</div>}
  </div>
);

const Chip = ({ label, onRemove }) => (
  <div className="chip" onClick={onRemove}>
    {label}
    <span className="close-btn">×</span>
  </div>
);

const PlanYourTrip = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUserId = currentUser?.uid;

  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState(new Set());

  const [selectedPlaces, setSelectedPlaces] = useState(new Set());
  const [selectedRestaurants, setSelectedRestaurants] = useState(new Set());
  const [selectedHospitals, setSelectedHospitals] = useState(new Set());

  const [tripDate, setTripDate] = useState("");
  const [tripDuration, setTripDuration] = useState(1);
  const [step, setStep] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { label: "المدن" },
    { label: "الخيارات السياحية" },
    { label: "التاريخ والمدة" },
    { label: "المراجعة" },
  ];

  useEffect(() => {
    const fetchCities = async () => {
      const snapshot = await getDocs(collection(db, "cities"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCities(data);
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCities.length === 0) {
      setPlaces([]);
      setRestaurants([]);
      setHospitals([]);
      return;
    }

    const fetchData = async (collectionName, setData) => {
      let results = [];
      for (const cityId of selectedCities) {
        const q = query(
          collection(db, collectionName),
          where("cityId", "==", cityId)
        );
        const snap = await getDocs(q);
        results = [
          ...results,
          ...snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        ];
      }
      setData(results);
    };

    fetchData("places", setPlaces);
    fetchData("restaurants", setRestaurants);
    fetchData("hospitals", setHospitals);
    fetchData("hotels", setHotels);
  }, [selectedCities]);

  const toggleSelection = (id, selectedSet, setSelectedSet) => {
    const newSet = new Set(selectedSet);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelectedSet(newSet);
  };

  const removeSelectedItem = (id, selectedSet, setSelectedSet) => {
    const newSet = new Set(selectedSet);
    newSet.delete(id);
    setSelectedSet(newSet);
  };

  const handleSave = async () => {
    if (!currentUserId) return alert("يجب تسجيل الدخول أولاً.");
    if (selectedCities.length === 0)
      return alert("اختر مدينة واحدة على الأقل.");
    if (!tripDate) return alert("اختر تاريخ الرحلة.");
    if (tripDuration < 1) return alert("أدخل مدة صالحة.");
    const today = new Date();
    today.setHours(0, 0, 0, 0); // حتى يقارن بدون وقت

    const selectedDate = new Date(tripDate);
    if (selectedDate < today) {
      return alert("⚠️ لا يمكن تحديد تاريخ في الماضي.");
    }

    const data = {
      userIds: [currentUserId],
      selectedCityIds: selectedCities,
      selectedPlaceIds: Array.from(selectedPlaces),
      selectedRestaurantIds: Array.from(selectedRestaurants),
      selectedHospitalIds: Array.from(selectedHospitals),
      selectedHotelIds: Array.from(selectedHotels),
      tripDate: Timestamp.fromDate(new Date(tripDate)),
      tripDuration,
      createdAt: Timestamp.now(),
      customTrip: true,
    };

    try {
      await addDoc(collection(db, "bookings"), data);
      alert("تم حفظ الرحلة بنجاح!");
      setSelectedCities([]);
      setSelectedPlaces(new Set());
      setSelectedRestaurants(new Set());
      setSelectedHospitals(new Set());
      setSelectedHotels(new Set());
      setTripDate("");
      setTripDuration(1);
      setStep(1);
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ.");
    }
  };

  return (
    <div className="plan-trip-container">
      <h2 className="title">✈️ صمّم رحلتك الخاصة</h2>
      {/* شريط التقدم */}
      <div className="my-progress-bar">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${currentStep === index + 1 ? "active" : ""} ${
              currentStep > index + 1 ? "completed" : ""
            }`}
          >
            <div className="circle">{index + 1}</div>
            <div className="label">{step.label}</div>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <label>اختر مدينة أو أكثر:</label>
          <MultiSelectDropdown
            options={cities}
            selectedOptions={selectedCities}
            onChange={setSelectedCities}
          />
          {selectedCities.length > 0 && (
            <div className="selected-chips">
              {selectedCities.map((id) => {
                const city = cities.find((c) => c.id === id);
                return (
                  <Chip
                    key={id}
                    label={city?.name}
                    onRemove={() =>
                      setSelectedCities(
                        selectedCities.filter((cId) => cId !== id)
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          {places.length > 0 && <h3>🗺️ الأماكن السياحية</h3>}
          <div className="cards-container">
            {places.map((place) => (
              <Card
                key={place.id}
                data={place}
                selected={selectedPlaces.has(place.id)}
                onClick={() =>
                  toggleSelection(place.id, selectedPlaces, setSelectedPlaces)
                }
              />
            ))}
          </div>
          <div className="selected-chips">
            {Array.from(selectedPlaces).map((id) => {
              const item = places.find((p) => p.id === id);
              return (
                <Chip
                  key={id}
                  label={item?.name}
                  onRemove={() =>
                    removeSelectedItem(id, selectedPlaces, setSelectedPlaces)
                  }
                />
              );
            })}
          </div>

          {restaurants.length > 0 && <h3>🍽️ المطاعم</h3>}
          <div className="cards-container">
            {restaurants.map((rest) => (
              <Card
                key={rest.id}
                data={rest}
                selected={selectedRestaurants.has(rest.id)}
                onClick={() =>
                  toggleSelection(
                    rest.id,
                    selectedRestaurants,
                    setSelectedRestaurants
                  )
                }
              />
            ))}
          </div>
          <div className="selected-chips">
            {Array.from(selectedRestaurants).map((id) => {
              const item = restaurants.find((r) => r.id === id);
              return (
                <Chip
                  key={id}
                  label={item?.name}
                  onRemove={() =>
                    removeSelectedItem(
                      id,
                      selectedRestaurants,
                      setSelectedRestaurants
                    )
                  }
                />
              );
            })}
          </div>

          {hospitals.length > 0 && <h3>🏥 المشافي</h3>}
          <div className="cards-container">
            {hospitals.map((hos) => (
              <Card
                key={hos.id}
                data={hos}
                selected={selectedHospitals.has(hos.id)}
                onClick={() =>
                  toggleSelection(
                    hos.id,
                    selectedHospitals,
                    setSelectedHospitals
                  )
                }
              />
            ))}
          </div>
          <div className="selected-chips">
            {Array.from(selectedHospitals).map((id) => {
              const item = hospitals.find((h) => h.id === id);
              return (
                <Chip
                  key={id}
                  label={item?.name}
                  onRemove={() =>
                    removeSelectedItem(
                      id,
                      selectedHospitals,
                      setSelectedHospitals
                    )
                  }
                />
              );
            })}
          </div>
          {hotels.length > 0 && <h3>🏨 الفنادق</h3>}
          <div className="cards-container">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                data={hotel}
                selected={selectedHotels.has(hotel.id)}
                onClick={() =>
                  toggleSelection(hotel.id, selectedHotels, setSelectedHotels)
                }
              />
            ))}
          </div>
          <div className="selected-chips">
            {Array.from(selectedHotels).map((id) => {
              const item = hotels.find((h) => h.id === id);
              return (
                <Chip
                  key={id}
                  label={item?.name}
                  onRemove={() =>
                    removeSelectedItem(id, selectedHotels, setSelectedHotels)
                  }
                />
              );
            })}
          </div>
        </>
      )}

      {step === 3 && (
        <div className="trip-details">
          <label>📅 تاريخ الرحلة:</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
          />
          <label>⏳ المدة (بالأيام):</label>
          <input
            type="number"
            value={tripDuration}
            min="1"
            onChange={(e) => setTripDuration(parseInt(e.target.value))}
          />
        </div>
      )}

      {step === 4 && (
        <div>
          <h3>🧾 ملخص رحلتك</h3>
          <ul>
            <li>
              📍 المدن:{" "}
              {selectedCities
                .map((id) => cities.find((c) => c.id === id)?.name)
                .join(", ")}
            </li>
            <li>🏛️ الأماكن المختارة: {selectedPlaces.size}</li>
            <li>🍽️ المطاعم المختارة: {selectedRestaurants.size}</li>
            <li>🏥 المشافي المختارة: {selectedHospitals.size}</li>
            <li>🏨 الفنادق المختارة: {selectedHotels.size}</li>

            <li>📅 التاريخ: {tripDate}</li>
            <li>⏳ المدة: {tripDuration} يوم</li>
          </ul>
          <button className="save-button" onClick={handleSave}>
            ✅ احفظ رحلتك
          </button>
        </div>
      )}

      {/* أزرار التنقل بين الخطوات */}
      <div className="step-navigation">
        {step > 1 && (
          <button className="step-button" onClick={() => setStep(step - 1)}>
            السابق ➡️
          </button>
        )}
        {step < 4 && (
          <button className="step-button" onClick={() => setStep(step + 1)}>
            ⬅️ التالي
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanYourTrip;
