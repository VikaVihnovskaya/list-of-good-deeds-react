'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { restoreAuth } from '@/store/authSlice';

function AuthRestorer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(restoreAuth());
  }, []);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthRestorer>{children}</AuthRestorer>
    </Provider>
  );
}
