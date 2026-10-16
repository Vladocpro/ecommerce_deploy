// `npm run dev`: starts Next.js and forwards Stripe webhooks to it, in one terminal.
//
// Uses the Stripe CLI with STRIPE_SECRET_KEY from .env (no `stripe login` needed) and hands the
// CLI's webhook signing secret to Next.js, so STRIPE_WEBHOOK_KEY always matches locally.
// Without the Stripe CLI, or with a live key, only Next.js is started.

import {execFileSync} from "node:child_process";
import concurrently from "concurrently";

try {
   process.loadEnvFile(".env");
} catch {
   // Next.js reports missing variables itself
}

const PORT = process.env.PORT ?? "3000";
const EVENTS = "checkout.session.completed,charge.refunded";
const apiKey = process.env.STRIPE_SECRET_KEY ?? "";

function stripeWebhookSecret() {
   if (!apiKey.startsWith("sk_test_")) {
      console.warn("[dev] STRIPE_SECRET_KEY is not a test key: not forwarding Stripe webhooks.");
      return null;
   }
   try {
      // The CLI reads the key from STRIPE_API_KEY, which keeps it out of the process list
      return execFileSync("stripe", ["listen", "--print-secret"], {
         env: {...process.env, STRIPE_API_KEY: apiKey},
         encoding: "utf8",
         stdio: ["ignore", "pipe", "pipe"],
      }).trim();
   } catch (error) {
      if (error.code === "ENOENT") {
         console.warn("[dev] Stripe CLI not found, starting Next.js only. Webhooks (orders after payment) need it:");
         console.warn("      install it with `winget install Stripe.StripeCli` (Windows) or see https://docs.stripe.com/stripe-cli");
      } else {
         console.warn(`[dev] Stripe CLI failed, starting Next.js only: ${String(error.stderr ?? error.message).trim()}`);
      }
      return null;
   }
}

const webhookSecret = stripeWebhookSecret();

const commands = [{
   name: "next",
   command: `next dev -p ${PORT}`,
   prefixColor: "blue",
   // Overrides the .env value, which may belong to a dashboard webhook endpoint instead of the CLI
   env: webhookSecret ? {STRIPE_WEBHOOK_KEY: webhookSecret} : {},
}];

if (webhookSecret) {
   commands.push({
      name: "stripe",
      command: `stripe listen --events ${EVENTS} --forward-to localhost:${PORT}/api/stripe/webhook`,
      prefixColor: "magenta",
      env: {STRIPE_API_KEY: apiKey},
   });
}

// If Stripe stops, Next.js keeps running; Ctrl+C stops both
const {result} = concurrently(commands, {prefix: "name"});
result.catch(() => process.exit(1));
