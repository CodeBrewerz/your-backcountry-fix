import { ShoppingBagIcon } from "@heroicons/react/outline";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "remix";
import ShoppingCart from "./ShoppingCartPopover";
import { useNhostAuth } from "@nhost/react-auth";

const navigation = [
  { name: "Camping", href: "/categories/camping/products" },
  { name: "Backpacking", href: "/categories/backpacking/products" },
  { name: "Utility", href: "/categories/utility/products" },
  { name: "Clothing", href: "/categories/clothing/products" },
];

const Header = ({ products }) => {
  const res = useNhostAuth();
  console.log(res, "user");

  return (
    <header className="relative bg-white">
      <nav aria-label="Top" className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="relative  px-4 pb-14 sm:static sm:px-0 sm:pb-0">
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex-1 flex ">
              <Link to="/" className="button text-sm font-medium pr-4">
                <span className="sr-only">Your Backcountry Fix</span>
                {/* TODO: Add Logo */}
                <img
                  className="h-20 w-auto"
                  src="https://i.fbcd.co/products/original/69c327e8ed39e3818046ca61118aa0941cf4979861d4cc8ffec33a1fb2eda19c.jpg"
                  alt=""
                />
              </Link>
            </div>

            <div className="absolute bottom-0 inset-x-0 border-t overflow-x-auto sm:static sm:border-t-0">
              <div className="h-14 flex items-center px-4 space-x-8 sm:h-auto justify-evenly">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-end">
              <Link
                to="/sign-in"
                className="button text-gray-700 text-sm font-medium pr-4"
              >
                Login
              </Link>

              <Popover className="ml-4 flow-root text-sm lg:relative lg:ml-8">
                <Popover.Button className="group -m-2 p-2 flex items-center">
                  <ShoppingBagIcon
                    className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {products?.length}
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Panel className="z-10 absolute top-16 inset-x-0 mt-px pb-6 bg-white shadow-lg sm:px-2 lg:top-full lg:left-auto lg:right-0 lg:mt-3 lg:-mr-1.5 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5">
                    {({ close }) => (
                      <ShoppingCart products={products} close={close} />
                    )}
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
