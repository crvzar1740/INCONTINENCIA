import { Resend } from "resend";
import { ENV } from "./env";

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (!ENV.resendApiKey) return null;
  if (!_resend) _resend = new Resend(ENV.resendApiKey);
  return _resend;
}

const FROM = "Suelo Firme <hola@infosuelofirme.com>";
const LOGIN_URL = "https://incontinencia-production.up.railway.app/login";

export async function sendCredentialsEmail(email: string, password: string) {
  const resend = getResend();
  if (!resend) {
    console.warn(`[Email] RESEND_API_KEY not set — skipped sending credentials to ${email}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Tu acceso a Suelo Firme™ ya está listo",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #2B2420;">
          <h1 style="color: #3D6B66; font-size: 22px;">¡Bienvenido/a a Suelo Firme™!</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Gracias por tu compra. Ya podés entrar a tu programa con estos datos:
          </p>
          <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Usuario:</strong> ${email}</p>
            <p style="margin: 4px 0;"><strong>Contraseña temporal:</strong> ${password}</p>
          </div>
          <p style="font-size: 14px; color: #6B6259; line-height: 1.6;">
            Por seguridad, te recomendamos cambiarla la primera vez que entres.
          </p>
          <a href="${LOGIN_URL}" style="display: inline-block; background: #3D6B66; color: #fff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 12px;">
            Entrar a mi programa
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error(`[Email] Failed to send credentials to ${email}:`, error);
  }
}

export async function sendPremiumUnlockedEmail(email: string) {
  const resend = getResend();
  if (!resend) {
    console.warn(`[Email] RESEND_API_KEY not set — skipped premium-unlocked email to ${email}`);
    return;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Tu Pack Premium ya está desbloqueado 🎉",
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #2B2420;">
          <h1 style="color: #3D6B66; font-size: 22px;">¡Listo! Ya tenés Suelo Firme™ Premium</h1>
          <p style="font-size: 16px; line-height: 1.6;">
            Tu compra se confirmó y ya podés entrar con el mismo usuario y contraseña de siempre.
            Vas a ver las 6 herramientas premium desbloqueadas en tu programa.
          </p>
          <a href="${LOGIN_URL}" style="display: inline-block; background: #3D6B66; color: #fff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 600; margin-top: 12px;">
            Entrar a mi programa
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error(`[Email] Failed to send premium-unlocked email to ${email}:`, error);
  }
}
