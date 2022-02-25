import { CheckIcon, ClockIcon, XIcon } from "@heroicons/react/solid";
import { Form, useSubmit } from "remix";

const ShoppingCartInfo = ({ product, productIdx }) => {
  const submit = useSubmit();
  return (
    <li key={product.id} className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <img
          src={product.image.src}
          className="w-24 h-24 rounded-md object-center object-cover sm:w-48 sm:h-48"
        />
      </div>
      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <div className="font-medium text-gray-700 hover:text-gray-800">
                  {product.name}
                </div>
              </h3>
            </div>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {product.price}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <Form
              method="post"
              onChange={(e) => {
                submit(e.currentTarget);
              }}
            >
              <input type="hidden" name="_action" value="updateQuantity" />
              <label htmlFor={`quantity-${productIdx}`} className="sr-only">
                Quantity, {product.name}
              </label>
              <select
                id={`quantitySelect`}
                name={`${product.id}`}
                className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {new Array(8).fill(1).map((item, i) => (
                  <option
                    key={i}
                    value={i + 1}
                    selected={Number(product.quantity) === i + 1}
                  >
                    {i + 1}
                  </option>
                ))}
              </select>
            </Form>

            <div className="absolute top-0 right-0">
              <Form method="post" replace>
                <input type="hidden" name="_action" value="delete" />
                <input type="hidden" name="productId" value={product.id} />
                <button
                  type="submit"
                  className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Remove</span>
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </Form>
            </div>
          </div>
        </div>

        <p className="mt-4 flex text-sm text-gray-700 space-x-2">
          <CheckIcon
            className="flex-shrink-0 h-5 w-5 text-green-500"
            aria-hidden="true"
          />
        </p>
      </div>
    </li>
  );
};

export default ShoppingCartInfo;
