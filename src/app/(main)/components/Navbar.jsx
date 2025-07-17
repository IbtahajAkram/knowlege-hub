// components/Navbar.jsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserRole } from '../../../utils/axiosInstance';

export default function Navbar() {
  const role = getUserRole();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between">
      <div className="space-x-4">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/courses">Courses</Link>
        {role === 'admin' && <Link href="/users">Users</Link>}
      </div>
      <button onClick={handleLogout} className="bg-red-500 px-4 py-1 rounded">
        Logout
      </button>
    </nav>
  );
}
