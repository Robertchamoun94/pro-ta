// components/CreditsBadge.tsx
// Server component som visar användarens kvarvarande engångskrediter.

import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic'; // visa alltid färskt saldo

export default async function CreditsBadge() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('user_id', session.user.id)
    .maybeSingle();

  const credits = data?.credits ?? 0;

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1',
        credits > 0
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-slate-100 text-slate-600 ring-slate-200',
      ].join(' ')}
      title="Your remaining single-analysis credits"
    >
      Credits: {credits}
    </span>
  );
}
