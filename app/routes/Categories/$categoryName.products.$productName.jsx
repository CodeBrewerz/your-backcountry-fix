import { Form, redirect, useLoaderData, useLocation } from "remix";
import { Product_By_Product_Name, Related_Products } from "../../graphql/query";
import { batchRequests } from "graphql-request";
import { deintercalate } from "../../utils/helper-functions";
import { getSession } from "~/utils/session.server";
import ProductAdditionalDetailSection from "../../components/ProductAdditionalDetailSection";
import ProductImageGallery from "../../components/ProductImageGallery";
import ProductReviewsSection from "../../components/ProductReviewsSection";
import RelatedPurchaseSection from "../../components/RelatedPurchaseSection";
import ProductInfoSection from "../../components/ProductInfoSection";

export const action = async ({ request }) => {
  let formData = await request.formData();
  let { _action } = Object.fromEntries(formData);
  if (_action === "add-cart-item") {
    let redirectTo = formData.get("redirectTo");
    let product = JSON.parse(formData.get("product"));

    let session = await getSession(request);
    let cart = await session.getCart();

    cart[product.id] = product;
    await session.setCart(cart);
    return redirect(redirectTo, {
      headers: { "Set-Cookie": await session.commitSession() },
    });
  }
};

export const loader = async ({ params }) => {
  const productName = deintercalate(params.productName);

  const endpoint = "https://ilomfyseqqwhpqpspjrv.nhost.run/v1/graphql";

  return batchRequests(endpoint, [
    {
      document: Product_By_Product_Name,
      variables: { productName: productName },
    },
    {
      document: Related_Products.q,
      variables: {
        categoryName: "Camping",
        productNameToExclude: productName,
      },
    },
  ]);
};

const getAvgRating = (ratings) => {
  const total = ratings.reduce((acc, curr) => acc + curr, 0);
  return total / ratings.length;
};

const shippingDetails = {
  name: "Shipping",
  items: [
    "Free shipping on orders over $100",
    "Expedited shipping options",
    "Signature required upon delivery",
  ],
};

const returnDetails = {
  name: "Returns",
  items: [
    "Easy return requests",
    "10% restocking fee for returns",
    "60 day return window",
  ],
};

export default function Product() {
  const location = useLocation();
  const [productInfo, relatedProductsInfo] = useLoaderData();

  const product = productInfo.data.Product.map((p) => ({
    id: p.id,
    name: p.Name,
    stripePrice: p.StripePrice,
    price: p.Price,
    rating: getAvgRating(p.Reviews.map((r) => r.rating)),
    images: p.product_images.map((i, idx) => ({
      id: idx,
      src: i.url,
      alt: p.Name,
    })),
    description: p.Description,
    details: [
      {
        name: "Features",
        items: p.ProductHighlights.map((h) => h.Highlight),
      },
      shippingDetails,
      returnDetails,
    ],
    reviews: p.Reviews.map((r, index) => ({
      id: index,
      title: r.title,
      rating: r.rating,
      content: r.content,
      author: r.user.displayName,
      date: r.updated_at.substring(0, 10),
    })),
  }))[0];

  const relatedProducts = relatedProductsInfo.data.RelatedProducts.map(
    Related_Products.mapper
  );

  return (
    <div className="bg-white">
      <main className="max-w-7xl mx-auto sm:pt-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <ProductImageGallery images={product.images} />
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <ProductInfoSection product={product} />
              <Form method="post" replace className="mt-6">
                <input type="hidden" name="_action" value="add-cart-item" />
                <input
                  type="hidden"
                  name="redirectTo"
                  value={location.pathname.concat(location.search)}
                />
                <input
                  type="hidden"
                  name="product"
                  value={JSON.stringify({
                    id: product.id,
                    stripePrice: product.stripePrice,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                    quantity: 1,
                  })}
                />
                <div className="mt-10 flex sm:flex-col1">
                  <button
                    type="submit"
                    className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                  >
                    Add to bag
                  </button>
                </div>
              </Form>
              <ProductAdditionalDetailSection details={product.details} />
            </div>
          </div>
          <ProductReviewsSection reviews={product.reviews} />
          <RelatedPurchaseSection relatedProducts={relatedProducts} />
        </div>
      </main>
    </div>
  );
}
