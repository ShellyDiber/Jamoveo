import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { backendServerURL } from '../config';

const instruments = ['drums', 'guitars', 'bass', 'saxophone', 'keyboards', 'vocals'];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', instrument: '' , role: 'player'});

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
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="instrument" value={form.instrument} onChange={handleChange} required>
          <option value="">Select Instrument</option>
          {instruments.map((i) => (
            <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>
          ))}
        </select>
        <button type="submit">Register</button>
        <a href="/login">Already have an account? Login</a>
      </form>
    </div>
  );
};

export default Signup;

