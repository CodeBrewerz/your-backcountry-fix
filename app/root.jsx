import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useActionData,
  useLoaderData,
} from "remix";
import { NhostClient } from "@nhost/nhost-js";
import { NhostAuthProvider } from "@nhost/react-auth";
import styles from "./styles/app.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getSession } from "~/utils/session.server";
import { useEffect } from "react";
import axios from "axios";
export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
export function meta() {
  return { title: "Your BackCountry Fix" };
}

export async function action({ request }) {
  let formData = await request.formData();
  let session = await getSession(request);
  const cart = await session.getCart();
  if (formData.get("checkout")) {
    const glitchServerUrl =
      "https://shard-lofty-primula.glitch.me/checkout-session";

    const { data } = await axios.post(glitchServerUrl, cart);
    return data;
  } else if (formData.get("shopping_bag")) {
    return redirect("/shopping-bag");
  }
}

export async function loader({ request, params }) {
  let session = await getSession(request, params);
  const cart = await session.getCart();
  return cart;
}

export default function App() {
  const data = useLoaderData();
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.url) window.location.href = actionData.url;
  }, [actionData]);

  return (
    <html className="h-full bg-white" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <NhostAuthProvider
          nhost={
            new NhostClient({
              backendUrl: "https://ilomfyseqqwhpqpspjrv.nhost.run",
            })
          }
        >
          <div className="bg-white">
            <Header products={Object.values(data)} />
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            {process.env.NODE_ENV === "development" && <LiveReload />}
            <Footer />
          </div>
        </NhostAuthProvider>
      </body>
    </html>
  );
}
