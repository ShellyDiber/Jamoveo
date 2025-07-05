import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSong } from '../context/songContext';
import { backendServerURL } from '../config';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const { setUser } = useSong();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${backendServerURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      // localStorage.setItem('token', data.access_token);
      // localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in localStorage
      
      // Update user context
      setUser({
    ...data.user,
     token: data.access_token
    });

      // Decode token to extract the role
      //const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      //const role = payload.role;

      navigate('/main');
      
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Login</button>
        <a href="/signup">Don't have an account? Sign up</a>
      </form>
    </div>
  );
};

export default Login;


