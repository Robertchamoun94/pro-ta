// components/CreditsBadge.tsx
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

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
        // layout
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full ring-1',
        // storlek responsivt: kompakt på mobil
        'px-2 py-0.5 text-[11px] leading-4 sm:px-2.5 sm:text-xs',
        // färger
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
