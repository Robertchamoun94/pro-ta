// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const PRICES = {
  ONE_TIME: process.env.STRIPE_PRICE_ONE_TIME!, // $5
  MONTHLY: process.env.STRIPE_PRICE_MONTHLY!,   // $14
  YEARLY: process.env.STRIPE_PRICE_YEARLY!,     // $140
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";