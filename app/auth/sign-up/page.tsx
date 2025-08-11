export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import SignUpClient from './SignUpClient';

export default function Page() {
  return (
    <Suspense>
      <SignUpClient />
    </Suspense>
  );
}
