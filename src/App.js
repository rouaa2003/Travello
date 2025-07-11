import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Restaurant from './Pages/Restaurant/Restaurant';
import Hospital from './Pages/Hospital/Hospital';
import Holidays from './Pages/Holidays/Holidays';
import CityBreaks from './Pages/CityBreaks/CityBreaks';
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
            <Route path="/city-breaks" element={<CityBreaks />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            
            <Route path="/admin-add" element={<AdminAddData />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/holidays" element={<Holidays />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/hospital" element={<Hospital />} />
          </>
        )}
      </Routes>

      {/* ✅ عرض التذييل فقط إذا كان المستخدم مسجلاً */}
      {user && <Footer />}
    </div>
  );
}

export default App;
