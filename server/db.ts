import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const normalized = email.trim().toLowerCase();
  const result = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/** Creates a new user. Throws if the email is already registered — check getUserByEmail first. */
export async function createUser(input: {
  email: string;
  name?: string | null;
  passwordHash: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const email = input.email.trim().toLowerCase();
  const role = email === ENV.ownerOpenId ? "admin" : "user";

  const [result] = await db.insert(users).values({
    email,
    name: input.name ?? null,
    passwordHash: input.passwordHash,
    role,
    lastSignedIn: new Date(),
  });

  // mysql2 insert result carries insertId; drizzle-orm/mysql2 exposes it on the result object.
  return (result as unknown as { insertId: number }).insertId;
}

export async function touchLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

/**
 * Grants (or revokes) entitlement flags for a purchase, matched by the buyer email
 * that Hotmart sends in the webhook payload. Called from the webhook handler —
 * never trust a client-side call to this.
 */
export async function setEntitlement(
  email: string,
  entitlement: { hasBaseAccess?: boolean; hasPremium?: boolean; hotmartTransactionId?: string }
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot set entitlement: database not available");
    return;
  }
  const normalized = email.trim().toLowerCase();
  const updateSet: Record<string, unknown> = {};
  if (entitlement.hasBaseAccess !== undefined) updateSet.hasBaseAccess = entitlement.hasBaseAccess ? 1 : 0;
  if (entitlement.hasPremium !== undefined) updateSet.hasPremium = entitlement.hasPremium ? 1 : 0;
  if (entitlement.hotmartTransactionId !== undefined) updateSet.hotmartTransactionId = entitlement.hotmartTransactionId;

  await db.update(users).set(updateSet).where(eq(users.email, normalized));
}

// TODO: add feature queries here as your schema grows.
