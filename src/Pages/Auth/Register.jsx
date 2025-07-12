import React, { useState, useEffect } from 'react';
import './Register.css';
import { useAuth } from '../../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

import { db } from '../../firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // جلب المدن من قاعدة البيانات
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'cities'));
        const cityList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCities(cityList);
      } catch (error) {
        console.error('فشل تحميل المدن:', error);
      }
    };
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirm) {
      setErrorMsg('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (!city) {
      setErrorMsg('يرجى اختيار المدينة.');
      return;
    }

    try {
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: username,
        cityId: city,
        isAdmin:false,
        createdAt: new Date().toISOString(),
      });

      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      setErrorMsg('فشل إنشاء الحساب. تأكد من صحة البيانات.');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>إنشاء حساب جديد</h2>
        <label htmlFor="username">اسم المستخدم</label>
        <input
          id="username"
          type="text"
          placeholder="user name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          id="email"
          type="email"
          placeholder="example@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">كلمة المرور</label>
        <input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirm">تأكيد كلمة المرور</label>
        <input
          id="confirm"
          type="password"
          placeholder="********"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <label htmlFor="city">اختر مدينتك</label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        >
          <option value="">-- اختر مدينة --</option>
          {cities.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <button type="submit">تسجيل</button>

        <p className="login-link">
          لديك حساب بالفعل؟{' '}
          <Link to="/login">تسجيل الدخول</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
