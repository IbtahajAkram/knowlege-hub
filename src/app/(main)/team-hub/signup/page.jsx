import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/register', form);
    alert('Registration successful. You can now login.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input className="border p-2 w-full mb-2" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 w-full mb-2" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="border p-2 w-full mb-4" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="bg-green-500 text-white px-4 py-2 w-full">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;