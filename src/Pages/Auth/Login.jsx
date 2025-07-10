import React, { useState } from 'react';
import './Login.css';
import { useAuth } from '../../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await login(email, password);
      navigate('/');
    }catch (error) {
  console.error("Login error:", error); // ✅ للكونسول
  setErrorMsg(error.message);           // ✅ تعرض الخطأ الحقيقي للمستخدم
}

  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>تسجيل الدخول</h2>

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

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <button type="submit">دخول</button>

        <p className="register-link">
          ليس لديك حساب؟{' '}
          <Link to="/register">إنشاء حساب جديد</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
