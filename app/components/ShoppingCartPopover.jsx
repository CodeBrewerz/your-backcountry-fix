import { Link, Form } from "remix";
import EmptyShopCartPopover from "./EmptyShoppingCartPopover";

const ShoppingCart = ({ products, close }) => {
  return (
    <>
      <h2 className="sr-only">Shopping Cart</h2>
      {products.length == 0 ? (
        <EmptyShopCartPopover />
      ) : (
        <Form method="post" className="max-w-2xl mx-auto px-4">
          <ul role="list" className="divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.id} className="py-6 flex items-center">
                <img
                  src={product.image.src}
                  alt={product.imageAlt}
                  className="flex-none w-16 h-16 rounded-md border border-gray-200"
                />
                <div className="ml-4 flex-auto">
                  <h3 className="font-medium text-gray-900">
                    <a href={product.href}>{product.name}</a>
                  </h3>
                  <p className="text-gray-500">{product.color}</p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="submit"
            name="checkout"
            value="checkout"
            onClick={() => close()}
            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
          >
            Checkout
          </button>
          <p className="mt-6 text-center">
            <button
              name="shopping_bag"
              value="shopping_bag"
              type="submit"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              onClick={() => close()}
            >
              View Shopping Bag
              
            </button>
          </p>
        </Form>
      )}
    </>
  );
};

export default ShoppingCart;
