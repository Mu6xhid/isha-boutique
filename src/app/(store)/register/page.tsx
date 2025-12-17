import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <RegisterClient />
    </Suspense>
  );
}
