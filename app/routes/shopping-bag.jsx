import { getSession } from "~/utils/session.server";
import { redirect, useActionData, useLoaderData, useSubmit } from "remix";
import { dissoc } from "ramda";
import { useMemo, useEffect } from "react";
const axios = require("axios");
import OrderSummary from "../components/OrderSummary";
import ShoppingCartInfo from "../components/ShoppingCartInfo";

export async function action({ request, params }) {
  let redirectURL = new URL(request.url);

  let formData = await request.formData();
  const action = formData.get("_action");
  const session = await getSession(request);

  const cart = await session.getCart();

  if (action === "delete") {
    const productId = formData.get("productId");
    delete cart[productId];
    await session.setCart(cart);

    return redirect(redirectURL, {
      headers: { "Set-Cookie": await session.commitSession() },
    });
  } else if (action === "updateQuantity") {
    const productToDelete = dissoc("_action", Object.fromEntries(formData));

    for (let productId in productToDelete) {
      const newQuantity = productToDelete[productId];
      cart[productId].quantity = newQuantity;
    }
    await session.setCart(cart);

    return redirect(redirectURL, {
      headers: { "Set-Cookie": await session.commitSession() },
    });
  } else if (action === "checkout") {
    return redirect("/checkout");
  } else if (action === "createCheckoutSession") {
    const glitchServerUrl =
      "https://shard-lofty-primula.glitch.me/checkout-session";

    const { data } = await axios.post(glitchServerUrl, cart);

    return data;
  }
  return redirect(redirectURL);
}

export async function loader({ request, params }) {
  const session = await getSession(request);
  const cart = await session.getCart();

  return Object.values(cart);
}

const SHIPPING_ESTIMATE = 5;

export default function ShoppingBag() {
  const products = useLoaderData();
  const actionData = useActionData();

  const subtotal = useMemo(
    () =>
      products.reduce((acc, curr) => {
        return acc + Number(curr.price.substring(1)) * Number(curr.quantity);
      }, 0),
    [products]
  );

  useEffect(() => {
    if (actionData?.url) window.location.href = actionData.url;
  }, [actionData]);

  const tax = useMemo(() => subtotal * 0.13, [subtotal]);

  const orderTotal = useMemo(
    () => subtotal + tax + SHIPPING_ESTIMATE,
    [subtotal, tax]
  );

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <ul
              role="list"
              className="border-t border-b border-gray-200 divide-y divide-gray-200"
            >
              {products.map((product, productIdx) => (
                <ShoppingCartInfo product={product} productIdx={productIdx} />
              ))}
            </ul>
          </section>
          {products.length > 0 && (
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              orderTotal={orderTotal}
            />
          )}
        </div>
        {products.length == 0 && (
          <div className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <div className=" text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Looks like it's empty!
            </div>
            <div className=" text-xl font-extrabold tracking-tight text-gray-900 sm:text-xl mt-12">
              Why not add some items to your cart?
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
