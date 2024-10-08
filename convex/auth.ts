import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Apple from "@auth/core/providers/apple";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./otp/ResendOTP";
import { TwilioOTP } from "./otp/TwilioOTP";
import { TwilioVerify } from "./otp/TwilioVerify";
import { ResendOTPPasswordReset } from "./passwordReset/ResendOTPPasswordReset";
import { Email } from "@convex-dev/auth/providers/Email";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub,
    Google,
    Apple({
      clientSecret: process.env.AUTH_APPLE_SECRET!,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      profile: undefined,
    }),
    Email({
      id: "resend",
      apiKey: process.env.AUTH_RESEND_KEY!,
      async sendVerificationRequest({ identifier: email, provider, token, expires }) {
        const { Resend } = await import("resend");
        const resend = new Resend(provider.apiKey);
        await resend.emails.send({
          from: process.env.AUTH_EMAIL ?? "Nlaak Studios <noreply@nlaak.com>",
          to: email,
          subject: "Sign in to FV2E",
          html: `<p>Click <a href="${token}">here</a> to sign in to Nlaak Studios.</p>`,
        });
      },
    }),
    ResendOTP,
    TwilioVerify,
    TwilioOTP,
    Password,
    Password({ id: "password-with-reset", reset: ResendOTPPasswordReset }),
    Password({
      id: "password-code",
      reset: ResendOTPPasswordReset,
      verify: ResendOTP,
    }),
    // This one only makes sense with routing, ignore for now:
    // Password({ id: "password-link", verify: Resend }),
    Anonymous,
  ],
});