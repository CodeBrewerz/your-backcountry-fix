import { useState } from "react";
import { useLoaderData, redirect } from "remix";
import {
  GetProductFiltersByCategory,
  GetProductsByFeatureIncludingFilters,
  Products_By_Category_Name,
} from "../../graphql/query";
import { GraphQLClient } from "graphql-request";
import { toTitleCase } from "../../utils/helper-functions";
import MobileFilterDialog from "../../components/MobileFilterDialog";
import ProductGrid from "../../components/ProductGrid";
import ActiveFilterSection from "../../components/ActiveFilterSection";
import FilterMenuSection from "../../components/FilterMenuSection";
const R = require("ramda");

// TODO: both filters are being removed sometimes, by removing a filter
export const action = async ({ request, params }) => {
  let formData = await request.formData();
  let { _action } = Object.fromEntries(formData);
  if (_action === "remove_filter") {
    let activeFilters = formData.get("activeFilters");
    let activeFilterToRemove = formData.get("activeFilterToRemove");

    let redirectURL = new URL(request.url);
    JSON.parse(activeFilters).forEach((af) => {
      if (af.value != activeFilterToRemove)
        redirectURL.searchParams.set(af.name, af.value);
    });
    return redirect(redirectURL);
  } else return null;
};

export const loader = async ({ params, request }) => {
  const endpoint = "https://ilomfyseqqwhpqpspjrv.nhost.run/v1/graphql";
  const client = new GraphQLClient(endpoint);
  const categoryName = toTitleCase(params.categoryName);

  let searchParams = [...new URL(request.url).searchParams.entries()];

  let productFilters = await client.request(GetProductFiltersByCategory.q, {
    categoryName: categoryName,
  });

  if (searchParams.length > 0) {
    let searchParamReducer = (acc, curr) => {
      if (acc.get(curr.key)) {
        return R.includes(acc.get(curr.key), curr.value)
          ? acc
          : acc.set(curr.key, R.union([curr.value], acc.get(curr.key)));
      } else {
        return acc.set(curr.key, [curr.value]);
      }
    };
    let searchParamsMapper = ([k, v]) => ({ key: k, value: v });

    let hashMapOfSearchParams = searchParams
      .map(searchParamsMapper)
      .reduce(searchParamReducer, new Map());

    let filters = GetProductFiltersByCategory.getFilters(
      productFilters.Product,
      hashMapOfSearchParams
    );

    let document = GetProductsByFeatureIncludingFilters(
      [...hashMapOfSearchParams],
      categoryName
    );

    const results = await client.request(document.q);

    return {
      products: results.Product.map((v, idx) => document.mapper(v, idx)),
      filters,
      categoryName,
    };
  } else {
    var results = await client.request(Products_By_Category_Name.q, {
      categoryName,
    });

    let filters = GetProductFiltersByCategory.getFilters(
      productFilters.Product,
      new Map()
    );
    console.log("filters", JSON.stringify(filters));

    return {
      products: results.Product.map((value, idx) =>
        Products_By_Category_Name.mapper(value, idx)
      ),
      filters,
      categoryName,
    };
  }
};

export default function CategoryNameRoute() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { products, filters, categoryName } = useLoaderData();

  const activeFilterer = (filters) => {
    return filters.reduce((acc, curr) => {
      if (curr.options.some((o) => o.checked)) {
        let checkedOptions = curr.options.filter((o) => o.checked);
        checkedOptions.forEach((co) =>
          acc.push({
            value: co.value,
            label: co.label,
            name: curr.name,
          })
        );
        return acc;
      } else {
        return acc;
      }
    }, []);
  };

  const activeFilters = activeFilterer(filters);

  return (
    <div className="bg-gray-50">
      <div>
        {/* Mobile filter dialog */}
        <MobileFilterDialog
          filters={filters}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
        <main>
          <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {categoryName} Gear
              </h1>
              <p className="mt-4 max-w-xl text-sm text-gray-700">
                Our thoughtfully designed list of products will make sure you
                have everything that you would need to go into the wilderness.
              </p>
            </div>
          </div>
          <section aria-labelledby="filter-heading">
            <h2 id="filter-heading" className="sr-only">
              Filters
            </h2>

            <FilterMenuSection
              filters={filters}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
            <ActiveFilterSection activeFilters={activeFilters} />
          </section>
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
