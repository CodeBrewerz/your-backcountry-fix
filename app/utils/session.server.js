import { createCookieSessionStorage } from "remix";
import "dotenv/config";
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

let cartSessionKey = "cart";
let accessTokenSessionKey = "accessToken";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "Outdoor_fix_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function getSession(input) {
  let cookieHeader =
    !input || typeof input === "string" ? input : input.headers.get("Cookie");
  let session = await sessionStorage.getSession(cookieHeader);

  return {
    commitSession() {
      return sessionStorage.commitSession(session);
    },
    async getCart() {
      let data = session.get(cartSessionKey);
      let cart = data == undefined ? {} : JSON.parse(data);
      return cart;
    },

    async setCart(cart) {
      session.set(cartSessionKey, JSON.stringify(cart));
    },
    getAccessToken() {
      const accessToken = session.get(accessTokenSessionKey);
      if (!accessToken || typeof accessToken !== "string") return null;
      return accessToken;
    },
    setAccessToken(token) {
      session.set(accessTokenSessionKey, token);
    },
  };
}
