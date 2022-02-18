import { StarIcon } from "@heroicons/react/solid";
import { classNames } from "../utils/helper-functions";

const ProductInfoSection = ({ product }) => {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
        {product.name}
      </h1>

      <div className="mt-3">
        <h2 className="sr-only">Product information</h2>
        <p className="text-3xl text-gray-900">{product.price}</p>
      </div>

      {/* Reviews */}
      <div className="mt-3">
        <h3 className="sr-only">Reviews</h3>
        <div className="flex items-center">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <StarIcon
                key={rating}
                className={classNames(
                  product.rating > rating ? "text-indigo-500" : "text-gray-300",
                  "h-5 w-5 flex-shrink-0"
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="sr-only">{product.rating} out of 5 stars</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="sr-only">Description</h3>

        <div className="text-base text-gray-700 space-y-6">
          {product.description}
        </div>
      </div>
    </>
  );
};

export default ProductInfoSection;
