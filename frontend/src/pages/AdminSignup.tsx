import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendServerURL } from '../config';
import '../styles/Auth.css';

const AdminSignup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', instrument: '', role: 'admin' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${backendServerURL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      navigate('/login');
    } else {
      alert('Signup failed');
    }
  };

  return (
    <div className="auth-page">
    <div className="auth-container">
      <h1>Jamoveo</h1>
      <h2>Admin Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Register</button>
        <a href="/login">Already have an account? Login</a>
      </form>
    </div>
    </div>
  );
};



export default AdminSignup;
