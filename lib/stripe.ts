// lib/stripe.ts – minimalist tills vi kopplar Stripe på riktigt
import Stripe from 'stripe';

// Skapa klienten utan explicit apiVersion för att undvika TS-konflikt i build.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
