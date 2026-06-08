'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateMe, deleteMe } from '@/store/authSlice';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [name, setName] = useState(user?.name ?? '');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: { name?: string; password?: string } = {};
    if (name && name !== user?.name) data.name = name;
    if (password) data.password = password;
    if (!Object.keys(data).length) return;
    const result = await dispatch(updateMe(data));
    if (updateMe.fulfilled.match(result)) {
      setPassword('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return;
    await dispatch(deleteMe());
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <p className="text-sm text-gray-400">{user?.email}</p>
          <p className="text-sm text-blue-500 font-medium mb-4">
            @{user?.tag} <span className="text-gray-400 font-normal">— share this tag to let friends add you</span>
          </p>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="New password (leave blank to keep)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              minLength={6}
            />
            {success && <p className="text-green-500 text-sm">Saved!</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium py-2 rounded transition-colors"
            >
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
        <button
          onClick={handleDelete}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded transition-colors"
        >
          Delete account
        </button>
      </div>
    </main>
  );
}
