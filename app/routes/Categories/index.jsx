import { GraphQLClient } from "graphql-request";
import { Categories_Query } from "~/graphql/query";
import { useLoaderData } from "remix";

export async function loader({ request }) {
  // const config = {
  //   headers: {
  //     Authorization: "Bearer ".concat(getAccessToken()),
  //   },
  // };
  // const query = gql`
  //   {
  //     Season {
  //       name
  //     }

  //     package_image {
  //       package_id
  //       url
  //     }
  //     product_image {
  //       url
  //       product_id
  //     }
  //   }
  // `;
  const endpoint = "https://ilomfyseqqwhpqpspjrv.nhost.run/v1/graphql";

  const categoryMapper = (category, index) => ({
    id: index,
    name: category.name,
    href: `/categories/${category.name.toLowerCase()}/products`,
    imageSrc: category.url,
    imageAlt: category.name,
  });

  const client = new GraphQLClient(endpoint);
  var { categories } = await client.request(Categories_Query);
  return categories.map(categoryMapper);
}

export default function CategoryIndexRoute() {
  const categories = useLoaderData(loader);

  return (
    <div className="bg-white">
      <main>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 mb-20">
          <div className="py-24 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              All the essentials you would ever need.
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-base text-gray-500">
              We make sure that you are ready and fully prepped for your next
              expedition. From the best quality of products to the best service,
              we are here to help you in every way possible.
            </p>
          </div>

          {/* Product grid */}
          <section aria-labelledby="products-heading" className="mt-8">
            <h2 id="products-heading" className="sr-only">
              Categories
            </h2>

            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
              {categories.map((product) => (
                <a key={product.id} href={product.href} className="group">
                  <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                    <img
                      src={product.imageSrc}
                      alt={product.imageAlt}
                      className="w-full h-full object-center object-cover group-hover:opacity-75"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                    <h3>{product.name}</h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
