import { useState } from "react";
import { Form, useLoaderData, useSubmit, useFetcher, redirect } from "remix";
import { GraphQLClient } from "graphql-request";
import {
  getAllFeatures,
  getAllFeatureValues,
  getAllProductCategories,
  insertProduct,
  insertProductHighlights,
  insertProductImages,
  insertProductCategories,
  insertProductFeatures,
  insertProductFeatureValues,
} from "../graphql/query";

// ONLY USED INTERNALLY FOR INSERTION OF PRODUCTS
export async function action({ request }) {
  const formData = await request.formData();

  console.log(formData, [...formData.entries()], "formData");
  const endpoint = "https://ilomfyseqqwhpqpspjrv.nhost.run/v1/graphql";
  const client = new GraphQLClient(endpoint);

  // Added Product
  const productAdded = await client.request(insertProduct, {
    Description: formData.get("Description"),
    Name: formData.get("Name"),
    Price: formData.get("Price"),
  });

  const formEntries = [...formData.entries()];
  const filterFormEntries = (str) =>
    formEntries.filter(([k, v]) => k === str).map(([k, v]) => v);

  const productId = Number(productAdded.insert_Product.returning[0].id);

  // Added Product Highlights
  const productHighlights = filterFormEntries("highlight[]");
  await client.request(insertProductHighlights, {
    objects: productHighlights.map((h) => ({ productId, Highlight: h })),
  });

  // Added Product Images
  const productImages = filterFormEntries("url[]");
  await client.request(insertProductImages, {
    objects: productImages.map((i) => ({ product_id: productId, url: i })),
  });

  // Added Product Categories
  const productCategories = filterFormEntries("category");
  await client.request(insertProductCategories, {
    objects: productCategories.map((c) => ({
      product_id: productId,
      category_id: Number(c),
    })),
  });

  // Added Product Features
  const productFeatures = filterFormEntries("feature[]");
  const features = await client.request(insertProductFeatures, {
    objects: productFeatures.map((f) => ({
      productId,
      featureId: Number(f),
    })),
  });

  // Added Product Feature Values
  const featureIds = new Map(
    features.insert_ProductFeature.returning.map((r) => [r.featureId, r.id])
  );
  const productFeatureValues = filterFormEntries("featureValue[]");
  await client.request(insertProductFeatureValues, {
    objects: productFeatureValues.map((v) => ({
      productFeatureId: featureIds.get(Number(v.split(",")[0])),
      productFeatureValueId: Number(v.split(",")[1]),
    })),
  });

  return redirect(request.url);
}

export async function loader() {
  const endpoint = "https://ilomfyseqqwhpqpspjrv.nhost.run/v1/graphql";
  const client = new GraphQLClient(endpoint);

  let categories = await client.request(getAllProductCategories);
  let features = await client.request(getAllFeatures);
  let featureValues = await client.request(getAllFeatureValues);

  return {
    categories: categories.Category,
    features: features.Feature,
    featureValues: featureValues.FeatureValue,
  };
}

export default function AddProducts() {
  const [numberOfImageUrls, setNumberOfImageUrls] = useState(1);
  const [numberOfHighlights, setNumberOfHighlights] = useState(1);
  const [numberOfFeatures, setNumberOfFeatures] = useState(1);
  const submit = useSubmit();

  const { categories, features, featureValues } = useLoaderData();

  return (
    <Form
      method="post"
      replace
      className="max-w-7xl mx-auto sm:pt-16 sm:px-6 lg:px-8 space-y-8 divide-y divide-gray-200"
    >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Add Products
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Add new product information
            </p>
          </div>
          {/* Name */}
          <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="Name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Name
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="Name"
                    id="Name"
                    autoComplete="username"
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>
            {/* Price */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="Price"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Price
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="max-w-lg flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    CAD
                  </span>
                  <input
                    type="text"
                    name="Price"
                    id="Price"
                    autoComplete="Price"
                    className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                  />
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="Description"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Description
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <textarea
                  id="Description"
                  name="Description"
                  rows={3}
                  className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                  defaultValue={""}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Write a few sentences about your product.
                </p>
              </div>
            </div>
            {/* ImageUrls */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="ImageUrls"
                className="block text-sm font-medium text-gray-700"
              >
                ImageUrls
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {Array(numberOfImageUrls)
                  .fill(1)
                  .map((x, index) => (
                    <div className="flex items-center mt-5">
                      <input
                        key={index}
                        type="text"
                        name="url[]" //{`url-${index}`}
                        id={`url-${index}`}
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() => setNumberOfImageUrls(numberOfImageUrls + 1)}
                  className="mt-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Another Image
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="ImageUrls"
                className="block text-sm font-medium text-gray-700"
              >
                Highlights
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {Array(numberOfHighlights)
                  .fill(1)
                  .map((x, index) => (
                    <div className="flex items-center mt-5">
                      <input
                        key={index}
                        type="text"
                        name="highlight[]"
                        id={`Highlight-${index}`}
                        className="flex-1 block w-full focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
                      />
                    </div>
                  ))}
                <button
                  type="button"
                  onClick={() => setNumberOfHighlights(numberOfHighlights + 1)}
                  className="mt-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Another Highlight
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Product Category
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                <div className="flex items-center mt-5">
                  <select
                    multiple
                    id="category"
                    name="category"
                    className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    {categories.map((category, index) => (
                      <option value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Feature List
              </label>
              <div className="mt-1 sm:mt-0 sm:col-span-2">
                {Array(numberOfFeatures)
                  .fill(1)
                  .map((x, index) => (
                    <>
                      <div className="flex mt-1 sm:mt-0 sm:col-span-2 gap-5">
                        <div className="flex gap-2 items-center mt-5">
                          <label
                            htmlFor="cover-photo"
                            className="center mb-4 text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Name
                          </label>
                          <select
                            id={`feature-${index}`}
                            name="feature[]"
                            className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                          >
                            {features.map((feature, index) => (
                              <option value={feature.id}>{feature.Name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2 items-center mt-5">
                          <label
                            htmlFor="value"
                            className="center ml-5 mb-4 text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                          >
                            Value
                          </label>
                          <select
                            multiple
                            id={`featureValue-${index}`}
                            name="featureValue[]"
                            className="max-w-lg block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                          >
                            {featureValues.map((featureValue, index) => (
                              <option
                                value={`${featureValue.featureId},${featureValue.id}`}
                              >
                                {featureValue.value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  ))}

                <button
                  type="button"
                  onClick={() => setNumberOfFeatures(numberOfFeatures + 1)}
                  className="mt-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Another Feature
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </Form>
  );
}
