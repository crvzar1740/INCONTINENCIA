import type { Express, Request, Response } from "express";
import { createUser, getUserByEmail, setEntitlement } from "../db";
import { ENV } from "./env";
import { generateTempPassword, hashPassword } from "./auth";
import { sendCredentialsEmail, sendPremiumUnlockedEmail } from "./email";

const BASE_PRODUCT_ID = process.env.HOTMART_BASE_PRODUCT_ID ?? "";
const PREMIUM_PRODUCT_ID = process.env.HOTMART_PREMIUM_PRODUCT_ID ?? "";

type HotmartWebhookPayload = {
  event?: string;
  data?: {
    buyer?: { email?: string };
    purchase?: { transaction?: string; status?: string };
    product?: { id?: number | string };
  };
};

export function registerWebhookRoutes(app: Express) {
  app.post("/api/webhooks/hotmart", async (req: Request, res: Response) => {
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

    if (status === "APPROVED") {
      if (productId !== PREMIUM_PRODUCT_ID && productId !== BASE_PRODUCT_ID) {
        console.warn(`[Hotmart webhook] Unknown product id: ${productId}`);
      } else {
        const existing = await getUserByEmail(email);
        if (!existing) {
          const tempPassword = generateTempPassword();
          const passwordHash = await hashPassword(tempPassword);
          await createUser({ email, passwordHash });
          await sendCredentialsEmail(email, tempPassword);
        }

        if (productId === PREMIUM_PRODUCT_ID) {
          await setEntitlement(email, { hasPremium: true, hotmartTransactionId: transaction });
          if (existing) {
            await sendPremiumUnlockedEmail(email);
          }
        } else {
          await setEntitlement(email, { hasBaseAccess: true, hotmartTransactionId: transaction });
        }
      }
    }

    res.status(200).json({ received: true });
  });
}
