export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import SignInClient from './SignInClient';

export default function Page() {
  return (
    <Suspense>
      <SignInClient />
    </Suspense>
  );
}
