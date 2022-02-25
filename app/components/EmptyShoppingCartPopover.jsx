const EmptyShopCartPopover = () => {
  return (
    <div className="text-center px-5 pt-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>

      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No Products Added
      </h3>
      <p className="mt-5 text-sm text-gray-500">
        Get started by adding some products to your cart.
      </p>
    </div>
  );
};

export default EmptyShopCartPopover;
