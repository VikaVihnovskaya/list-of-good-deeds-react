'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';

export function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Good Deeds
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-500 text-sm">Hi, {user.name}</span>
            <Link href="/friends" className="text-sm text-gray-700 hover:text-blue-600">
              Friends
            </Link>
            <Link href="/profile" className="text-sm text-gray-700 hover:text-blue-600">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
