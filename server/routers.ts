import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createSessionToken, hashPassword, verifyPassword } from "./_core/auth";
import { createUser, getUserByEmail, touchLastSignedIn, markUpsellSeen } from "./db";
import { TRPCError } from "@trpc/server";

const emailSchema = z.string().trim().toLowerCase().email();
// Minimum bar, not maximum: length only, no arbitrary character-class rules that
// just push people toward weaker, more "compliant"-looking passwords.
const passwordSchema = z.string().min(8, "La contraseña debe tener al menos 8 caracteres");

async function setSessionCookie(ctx: { req: any; res: any }, userId: number) {
  const token = await createSessionToken(userId);
  const cookieOptions = getSessionCookieOptions(ctx.req);
  ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
}

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    register: publicProcedure
      .input(z.object({ email: emailSchema, password: passwordSchema, name: z.string().trim().min(1).max(255).optional() }))
      .mutation(async ({ ctx, input }) => {
        const existing = await getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Ya existe una cuenta con ese email." });
        }
        const passwordHash = await hashPassword(input.password);
        const userId = await createUser({ email: input.email, name: input.name ?? null, passwordHash });
        await setSessionCookie(ctx, userId);
        return { success: true } as const;
      }),

    login: publicProcedure
      .input(z.object({ email: emailSchema, password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        // Same error for "no such user" and "wrong password" — don't leak which one it was.
        const invalidCredentials = () =>
          new TRPCError({ code: "UNAUTHORIZED", message: "Email o contraseña incorrectos." });

        if (!user || !user.passwordHash) throw invalidCredentials();
        const valid = await verifyPassword(input.password, user.passwordHash);
        if (!valid) throw invalidCredentials();

        await setSessionCookie(ctx, user.id);
        await touchLastSignedIn(user.id);
        return { success: true } as const;
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    markUpsellSeen: protectedProcedure.mutation(async ({ ctx }) => {
      await markUpsellSeen(ctx.user.id);
      return { success: true } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
