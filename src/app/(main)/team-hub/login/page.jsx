"use client"
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/login', form);
    localStorage.setItem('token', res.data.token);
    onLogin(res.data.user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="border p-2 w-full mb-4" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2 w-full">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;