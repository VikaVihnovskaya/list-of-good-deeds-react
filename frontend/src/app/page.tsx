'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDeeds } from '@/store/deedsSlice';
import { AddDeedForm } from '@/components/AddDeedForm';
import { DeedsList } from '@/components/DeedsList';

export default function Home() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.deeds);

  useEffect(() => {
    dispatch(fetchDeeds());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          List of Good Deeds
        </h1>
        <AddDeedForm />
        {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        <DeedsList />
      </div>
    </main>
  );
}
