import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaUserPlus, FaSignInAlt, FaSyncAlt } from 'react-icons/fa';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const Login = () => {
  const [mode, setMode] = useState('login');
  return (
    <div className="login-bg-pro flex items-center justify-center min-h-screen relative overflow-hidden">
      <BackgroundSVG />
      <div className="login-card relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md animate-fadeIn z-10">
        <div className="flex flex-col items-center mb-8">
          <LogoSVG />
          <h2 className="text-2xl font-bold text-navy mb-2 animate-fadeIn">{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
          <p className="text-gray-500 mb-2 animate-fadeIn">{mode === 'login' ? 'Login to continue to GrandVista Hotel' : 'Sign up to get started with GrandVista Hotel'}</p>
        </div>
        {mode === 'login' ? <LoginForm /> : <SignupForm />}
        <div className="mt-6 text-center animate-fadeIn">
          {mode === 'login' ? (
            <span className="text-gray-600">Don&apos;t have an account?{' '}
              <button className="text-gold font-semibold hover:underline" onClick={() => setMode('signup')}>Sign Up</button>
            </span>
          ) : (
            <span className="text-gray-600">Already have an account?{' '}
              <button className="text-gold font-semibold hover:underline" onClick={() => setMode('login')}>Login</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

function BackgroundSVG() {
  return (
    <svg className="absolute top-0 left-0 w-full h-full z-0" style={{ pointerEvents: 'none' }} viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="1200" cy="100" rx="400" ry="200" fill="#d4af37" fillOpacity="0.08" />
      <ellipse cx="200" cy="800" rx="300" ry="120" fill="#0a1f44" fillOpacity="0.07" />
      <ellipse cx="800" cy="500" rx="500" ry="200" fill="#f5e199" fillOpacity="0.10" />
    </svg>
  );
}

function LogoSVG() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mb-4 animate-popIn">
      <circle cx="28" cy="28" r="28" fill="#d4af37" fillOpacity="0.18" />
      <path d="M28 40c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12-5.373 12-12 12zm0-20a8 8 0 100 16 8 8 0 000-16z" fill="#0a1f44" />
    </svg>
  );
}

function LoginForm() {
  const [show, setShow] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Login attempt:', { email: e.target[0].value, role, captchaInput, captcha });
    
    if (captchaInput !== captcha) {
      setError('Captcha does not match.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }
    setError('');
    // Call backend login endpoint
    try {
      const loginData = { email: e.target[0].value, password: e.target[1].value, role };
      console.log('Sending login request:', loginData);
      const res = await axios.post(`${API}/auth/login`, loginData);
      console.log('Login successful:', res.data);
      login(res.data);
      if (role === 'customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed.');
    }
  }
  return (
    <form className="space-y-6 animate-fadeIn" onSubmit={handleSubmit} autoComplete="off">
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input type="email" placeholder="Email" required className="input" />
      </div>
      <div className="input-group">
        <FaLock className="input-icon" />
        <input type={show ? 'text' : 'password'} placeholder="Password" required className="input" />
        <button type="button" className="eye-btn" onClick={() => setShow(s => !s)} aria-label="Show/Hide Password">
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <div className="input-group">
        <select className="input" value={role} onChange={e => setRole(e.target.value)} style={{paddingLeft: '2.5rem'}} required>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <FaUser className="input-icon" />
      </div>
      <Captcha captcha={captcha} value={captchaInput} onChange={setCaptchaInput} onRefresh={() => { setCaptcha(generateCaptcha()); setCaptchaInput(''); }} />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button className="btn btn-primary w-full mt-2" type="submit">Login</button>
    </form>
  );
}

function SignupForm() {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [strength, setStrength] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  function handlePassword(e) {
    const val = e.target.value;
    setPassword(val);
    setStrength(getStrength(val));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    console.log('Signup attempt:', { name: e.target[0].value, email: e.target[1].value, role, captchaInput, captcha });
    
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (captchaInput !== captcha) {
      setError('Captcha does not match.');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }
    setError('');
    // Call backend signup endpoint
    try {
      const signupData = {
        name: e.target[0].value,
        email: e.target[1].value,
        password,
        role
      };
      console.log('Sending signup request:', signupData);
      await axios.post(`${API}/auth/signup`, signupData);
      console.log('Signup successful, attempting auto-login');
      // Auto-login after signup
      const loginRes = await axios.post(`${API}/auth/login`, {
        email: e.target[1].value,
        password,
        role
      });
      console.log('Auto-login successful:', loginRes.data);
      login(loginRes.data);
      if (role === 'customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Signup failed.');
    }
  }
  return (
    <form className="space-y-6 animate-fadeIn" onSubmit={handleSubmit} autoComplete="off">
      <div className="input-group">
        <FaUser className="input-icon" />
        <input type="text" placeholder="Full Name" required className="input" />
      </div>
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input type="email" placeholder="Email" required className="input" />
      </div>
      <div className="input-group">
        <FaLock className="input-icon" />
        <input type={show ? 'text' : 'password'} placeholder="Password" required className="input" value={password} onChange={handlePassword} />
        <button type="button" className="eye-btn" onClick={() => setShow(s => !s)} aria-label="Show/Hide Password">
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <PasswordStrengthBar strength={strength} />
      <div className="input-group">
        <FaLock className="input-icon" />
        <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" required className="input" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <button type="button" className="eye-btn" onClick={() => setShowConfirm(s => !s)} aria-label="Show/Hide Password">
          {showConfirm ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <div className="input-group">
        <select className="input" value={role} onChange={e => setRole(e.target.value)} style={{paddingLeft: '2.5rem'}} required>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
        <FaUser className="input-icon" />
      </div>
      <Captcha captcha={captcha} value={captchaInput} onChange={setCaptchaInput} onRefresh={() => { setCaptcha(generateCaptcha()); setCaptchaInput(''); }} />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button className="btn btn-primary w-full mt-2" type="submit">Sign Up</button>
    </form>
  );
}

function PasswordStrengthBar({ strength }) {
  let percent = 0, color = '#e5e7eb';
  if (strength === 'Weak') { percent = 33; color = '#dc2626'; }
  else if (strength === 'Medium') { percent = 66; color = '#ea580c'; }
  else if (strength === 'Strong') { percent = 100; color = '#16a34a'; }
  return (
    <div className="w-full mb-2">
      <div style={{ height: 8, background: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, background: color, height: 8, transition: 'width 0.3s' }} />
      </div>
      {strength && <span className="text-xs font-semibold ml-1" style={{ color }}>{strength} Password</span>}
    </div>
  );
}

function Captcha({ captcha, value, onChange, onRefresh }) {
  return (
    <div className="flex items-center gap-2 mb-2 animate-popIn">
      <span className="captcha-box font-mono text-lg bg-gray-100 px-3 py-1 rounded select-none tracking-widest border border-gold shadow-sm flex items-center">
        <svg width="20" height="20" fill="#d4af37" className="mr-1" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#f5e199" /><text x="50%" y="55%" textAnchor="middle" fontSize="12" fill="#0a1f44" fontWeight="bold">C</text></svg>
        {captcha}
      </span>
      <input type="text" className="input flex-1" placeholder="Enter Captcha" value={value} onChange={e => onChange(e.target.value)} required maxLength={captcha.length} />
      <button type="button" className="refresh-captcha-btn" onClick={onRefresh} aria-label="Refresh Captcha">
        <FaSyncAlt />
      </button>
    </div>
  );
}

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let str = '';
  for (let i = 0; i < 6; i++) str += chars[Math.floor(Math.random() * chars.length)];
  return str;
}

function getStrength(pw) {
  if (!pw) return '';
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score >= 4) return 'Strong';
  if (score === 3) return 'Medium';
  return 'Weak';
}

export default Login; 