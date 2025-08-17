'use client';

import { useRouter } from 'next/navigation';

type Props = {
  isLoggedIn: boolean;
  className?: string; // behåll exakt samma klasser som din nuvarande knapp
  disabled?: boolean; // behåll din nuvarande disabled-logik (gäller inloggad)
};

export default function GenerateAnalysisCta({ isLoggedIn, className = '', disabled }: Props) {
  const router = useRouter();

  if (!isLoggedIn) {
    // Utloggad: klickbar → till sign-in, sedan tillbaka
    return (
      <button
        type="button"
        className={className}
        onClick={() => {
          const back =
            typeof window !== 'undefined'
              ? window.location.pathname + window.location.search
              : '/';
          router.push(`/auth/sign-in?redirect=${encodeURIComponent(back)}`);
        }}
      >
        Generate Analysis
      </button>
    );
  }

  // Inloggad: exakt som idag (submit + din disabled-logik)
  return (
    <button type="submit" className={className} disabled={disabled}>
      Generate Analysis
    </button>
  );
}
