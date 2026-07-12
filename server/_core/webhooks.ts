import type { Express, Request, Response } from "express";
import { setEntitlement } from "../db";
import { ENV } from "./env";

// Hotmart product IDs — set these once both products are approved.
// Read from env so you never have to touch code to update them.
const BASE_PRODUCT_ID = process.env.HOTMART_BASE_PRODUCT_ID ?? "";
const PREMIUM_PRODUCT_ID = process.env.HOTMART_PREMIUM_PRODUCT_ID ?? "";

type HotmartWebhookPayload = {
  event?: string;
  data?: {
    buyer?: { email?: string };
    purchase?: {
      transaction?: string;
      status?: string;
    };
    product?: { id?: number | string };
  };
};

export function registerWebhookRoutes(app: Express) {
  app.post("/api/webhooks/hotmart", async (req: Request, res: Response) => {
    // hottok is Hotmart's shared-secret token, sent as a query param on the
    // webhook URL you configure in their dashboard — not a signature over the
    // body, so this check is a simple string compare, not HMAC verification.
    const hottok = req.query.hottok;
    if (!ENV.hotmartHottok || hottok !== ENV.hotmartHottok) {
      res.status(403).json({ error: "invalid hottok" });
      return;
    }

    const payload = req.body as HotmartWebhookPayload;
    const email = payload?.data?.buyer?.email;
    const status = payload?.data?.purchase?.status;
    const productId = String(payload?.data?.product?.id ?? "");
    const transaction = payload?.data?.purchase?.transaction;

    if (!email) {
      res.status(400).json({ error: "missing buyer email" });
      return;
    }

    // Only "compra aprobada" (APPROVED) grants access. Everything else
    // (cancelled, refunded, chargeback, expired) is acknowledged but ignored
    // here — handle revocation as a separate, explicit path once you need it.
    if (status === "APPROVED") {
      if (productId === PREMIUM_PRODUCT_ID) {
        await setEntitlement(email, { hasPremium: true, hotmartTransactionId: transaction });
      } else if (productId === BASE_PRODUCT_ID) {
        await setEntitlement(email, { hasBaseAccess: true, hotmartTransactionId: transaction });
      } else {
        console.warn(`[Hotmart webhook] Unknown product id: ${productId}`);
      }
    }

    // Hotmart just needs a 2xx to consider the webhook delivered.
    res.status(200).json({ received: true });
  });
}
