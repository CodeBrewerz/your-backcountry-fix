import { useLoaderData } from "remix";
import { batchRequests } from "graphql-request";
import HeroSection from "../components/HeroSection";
import { CategorySection } from "../components/CategorySection";
import CTASection from "../components/CTASection";
import FavoriteSection from "../components/FavoriteSection";
import FeatureSection from "../components/FeatureSection";
import {
  Catogory_Images_Query,
  Favourite_Products_Images_Query,
} from "~/graphql/query";

export async function loader({ request }) {
  const endpoint = "https://ilomfyseqqwhpqpspjrv.nhost.run/v1/graphql";

  const favoriteProductInfoMapper = (res) => ({
    image_url: res.product_categories[0].Product.product_images[0].url,
    price: res.product_categories[0].Product.Price,
    name: res.product_categories[0].Product.Name,
  });

  const categoryInfoMapper = (res) => ({
    category_name: res.name,
    image_url: res.url,
  });

  const [categoryInfoData, favouriteProductInfoData] = await batchRequests(
    endpoint,
    [
      { document: Catogory_Images_Query },
      { document: Favourite_Products_Images_Query },
    ]
  );

  return {
    categoryInfo: categoryInfoData.data.categoryInfo.map(categoryInfoMapper),
    favouriteProductInfo:
      favouriteProductInfoData.data.favouriteProductInfo.map(
        favoriteProductInfoMapper
      ),
  };
}

export default function Index() {
  const loaderData = useLoaderData(loader);
  const categorySectionInfo = loaderData.categoryInfo;
  const favoriteProductInfo = loaderData.favouriteProductInfo;
  return (
    <div className="bg-white">
      <HeroSection />
      <main>
        <CategorySection
          category_one={categorySectionInfo[0]}
          category_two={categorySectionInfo[1]}
          category_three={categorySectionInfo[2]}
        />
        {/* <FeatureSection /> */}
        <FavoriteSection favoriteProductInfo={favoriteProductInfo} />
        <CTASection />
      </main>
    </div>
  );
}
