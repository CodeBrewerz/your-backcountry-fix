import {
  MenuIcon,
  PlusIcon,
  SearchIcon,
  ShoppingBagIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";
import { Link, Form } from "remix";
import { product } from "ramda";
import ShoppingCart from "./ShoppingCart";

const navigation = [
  { name: "Camping", href: "/categories/camping/products" },
  { name: "Backpacking", href: "/categories/backpacking/products" },
  { name: "Utility", href: "/categories/utility/products" },
  { name: "Clothing", href: "/categories/clothing/products" },
];

const Header = ({ products }) => {
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
                <img className="h-8 w-auto" src="" alt="" />
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
              <Link to="/sign-in" className="button text-sm font-medium pr-4">
                Sign In
              </Link>
              <Link
                to="/sign-in"
                className="button text-sm font-medium border-l-2 pl-4"
              >
                Sign Up
              </Link>
              {/* TODO Cart */}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
