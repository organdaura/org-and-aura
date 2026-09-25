import crypto from "crypto";

export interface GoogleTokens {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
}

export function getGoogleOAuthRedirectUri(): string {
  if (process.env.NEXTAUTH_URL) {
    return `${process.env.NEXTAUTH_URL.replace(/\/$/, "")}/api/auth/google/callback`;
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/api/auth/google/callback`;
  }
  // Default to localhost
  return "http://localhost:3000/api/auth/google/callback";
}

/**
 * Builds the Google OAuth2 authorization URL
 */
export function createGoogleAuthUrl(state: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const redirectUri = getGoogleOAuthRedirectUri();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchanges the authorization code for Google access token
 */
export async function exchangeGoogleCodeForTokens(code: string): Promise<GoogleTokens> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleOAuthRedirectUri();

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials are missing from environment");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Google token exchange error:", data);
    throw new Error(data.error_description || data.error || "Failed to exchange Google OAuth code");
  }

  return data as GoogleTokens;
}

/**
 * Fetches the verified profile and email for the user
 */
export async function getGoogleUserProfile(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Google userinfo fetch error:", data);
    throw new Error("Failed to retrieve Google user profile");
  }

  return data as GoogleUserInfo;
}

/**
 * Generates a random CSRF state token
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}
