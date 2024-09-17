import Google from "@auth/core/providers/google";
import { defineConfig } from "auth-astro";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET, AUTH_TRUST_HOST } from "astro:env/server";

export const Google_ID_func = () => {
  const client = GOOGLE_CLIENT_ID;
  return client;
};

export const Google_Secret_func = () => {
  const client = GOOGLE_CLIENT_SECRET;
  return client;
};

export const Auth_Secret_func = () => {
  const client = AUTH_SECRET;
  return client;
};

export const Auth_TrustHost_func = () => {
  const client = AUTH_TRUST_HOST;
  return client;
};

const Google_ID = Google_ID_func();
const Google_Secret = Google_Secret_func();
const Auth_Secret = Auth_Secret_func();
const Auth_TrustHost = Auth_TrustHost_func();

export default defineConfig({
  providers: [
    Google({
      clientId: Google_ID,
      clientSecret: Google_Secret,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If the user is signing in and the URL is the base URL (successful login)
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}`;
      }
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: Auth_Secret,
  trustHost: Auth_TrustHost,
});
