import Stripe from "stripe";

// One client for the whole server instead of a new one per request. No apiVersion:
// the SDK uses the version it was built for, so its TypeScript types always match the API.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
