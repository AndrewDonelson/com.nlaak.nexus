/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as adminCheck from "../adminCheck.js";
import type * as auth from "../auth.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as otp_ResendOTP from "../otp/ResendOTP.js";
import type * as otp_TwilioOTP from "../otp/TwilioOTP.js";
import type * as otp_TwilioSDK from "../otp/TwilioSDK.js";
import type * as otp_TwilioVerify from "../otp/TwilioVerify.js";
import type * as otp_VerificationCodeEmail from "../otp/VerificationCodeEmail.js";
import type * as passwordReset_PasswordResetEmail from "../passwordReset/PasswordResetEmail.js";
import type * as passwordReset_ResendOTPPasswordReset from "../passwordReset/ResendOTPPasswordReset.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  adminCheck: typeof adminCheck;
  auth: typeof auth;
  helpers: typeof helpers;
  http: typeof http;
  "otp/ResendOTP": typeof otp_ResendOTP;
  "otp/TwilioOTP": typeof otp_TwilioOTP;
  "otp/TwilioSDK": typeof otp_TwilioSDK;
  "otp/TwilioVerify": typeof otp_TwilioVerify;
  "otp/VerificationCodeEmail": typeof otp_VerificationCodeEmail;
  "passwordReset/PasswordResetEmail": typeof passwordReset_PasswordResetEmail;
  "passwordReset/ResendOTPPasswordReset": typeof passwordReset_ResendOTPPasswordReset;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */