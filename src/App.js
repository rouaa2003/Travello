import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import RestaurantsPage from './Pages/RestaurantsPage/RestaurantsPage';
import Hospital from './Pages/Hospital/Hospital';
import PlacesPage from './Pages/PlacesPage/PlacesPage';
import PlanYourTrip from './Pages/PlanYourTrip/PlanYourTrip'
import ExploreCitiesSection from './Components/ExploreCitiesSection/ExploreCitiesSection';
import CityDetails from './Pages/CityDetails/CityDetails';
import AllAvailableTrips from './Pages/AllAvailableTrips/AllAvailableTrips'

import FixTripCityIds from './Pages/FixTripCityIds';

import NavigationBar from './Components/NavigationBar/NavigationBar';
import Footer from './Components/Footer/Footer';
import TripDetails from './Pages/TripDetails/TripDetails';
import { useAuth } from './AuthContext';

import AdminAddData from './AdminAddData';

import Profile from './Pages/Profile/Profile';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      {/* ✅ عرض شريط التنقل فقط إذا كان المستخدم مسجلاً */}
      {user && <NavigationBar />}

      <Routes>
        {/* ✅ صفحات الدخول والتسجيل دائماً متاحة */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ إذا لم يكن المستخدم مسجلاً، إعادة توجيه لأي صفحة إلى login */}
        {!user ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            
             <Route path="/explore-cities" element={<ExploreCitiesSection />} />
             <Route path="/fix-city-ids" element={<FixTripCityIds />} />


            <Route path="/trip/:id" element={<TripDetails />} />
            
            <Route path="/admin-add" element={<AdminAddData />} />
            <Route path="/trips" element={<AllAvailableTrips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/hospital" element={<Hospital />} />
            <Route path="/city/:id" element={<CityDetails />} />
             <Route path="/plan-your-trip" element={<PlanYourTrip />} />
          </>
        )}
      </Routes>

      {/* ✅ عرض التذييل فقط إذا كان المستخدم مسجلاً */}
      {user && <Footer />}
    </div>
  );
}

export default App;
