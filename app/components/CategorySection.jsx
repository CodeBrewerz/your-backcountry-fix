import { Link } from "remix";

const CategoryCardDetail = ({ category_name }) => (
  <div>
    <h3 className="font-semibold text-white">
      <Link
        to={`/categories/${category_name.toLowerCase()}/products`}
        className="button"
      >
        <span className="absolute inset-0" />
        {category_name}
      </Link>
    </h3>

    <p aria-hidden="true" className="mt-1 text-sm text-white">
      Shop now
    </p>
  </div>
);

export const CategorySection = ({
  category_one,
  category_two,
  category_three,
}) => (
  <section aria-labelledby="category-heading" className="bg-gray-50">
    <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <h2
          id="category-heading"
          className="text-2xl font-extrabold tracking-tight text-gray-900"
        >
          Shop by Category
        </h2>
        <Link
          to="/categories"
          className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block"
        >
          Browse all categories<span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
        <div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
          <img
            src={category_one.image_url}
            alt="6 person white coloured tent"
            className="object-center object-cover group-hover:opacity-75"
          />
          <div
            aria-hidden="true"
            className="bg-gradient-to-b from-transparent to-black opacity-50"
          />
          <div className="p-6 flex items-end">
            <CategoryCardDetail category_name={category_one.category_name} />
          </div>
        </div>
        <div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full">
          <img
            src={category_two.image_url}
            alt="sleeping bags"
            className="object-center object-cover group-hover:opacity-75 sm:absolute sm:inset-0 sm:w-full sm:h-full"
          />
          <div
            aria-hidden="true"
            className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
          />
          <div className="p-6 flex items-end sm:absolute sm:inset-0">
            <CategoryCardDetail category_name={category_two.category_name} />
          </div>
        </div>
        <div className="group aspect-w-2 aspect-h-1 rounded-lg overflow-hidden sm:relative sm:aspect-none sm:h-full">
          <img
            src={category_three.image_url}
            alt="Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk."
            className="object-center object-cover group-hover:opacity-75 sm:absolute sm:inset-0 sm:w-full sm:h-full"
          />
          <div
            aria-hidden="true"
            className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
          />
          <div className="p-6 flex items-end sm:absolute sm:inset-0">
            <CategoryCardDetail category_name={category_three.category_name} />
          </div>
        </div>
      </div>

      <div className="mt-6 sm:hidden">
        <a
          href="#"
          className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Browse all categories<span aria-hidden="true"> &rarr;</span>
        </a>
      </div>
    </div>
  </section>
);
