import React, { useState } from 'react';
import './Register.css';
import { useAuth } from '../../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// استيراد دوال Firestore
import { db } from '../../firebase'; 
import { doc, setDoc } from 'firebase/firestore';

function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirm) {
      setErrorMsg('كلمتا المرور غير متطابقتين.');
      return;
    }

    try {
      // تسجيل المستخدم في Firebase Auth
      const userCredential = await signup(email, password);
      const user = userCredential.user;

      // حفظ بيانات المستخدم الأساسية في Firestore في مجموعة users
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        // أضف أي بيانات إضافية تريد تخزينها هنا، مثل الاسم، الهاتف، إلخ
      });

      navigate('/');
    } catch (error) {
      setErrorMsg('فشل إنشاء الحساب. تأكد من صحة البيانات.');
      console.error('Register error:', error);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>إنشاء حساب جديد</h2>

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
