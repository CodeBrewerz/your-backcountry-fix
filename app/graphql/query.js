import { gql } from "graphql-request";

export const Catogory_Images_Query = gql`
  {
    categoryInfo: Category(
      limit: 3
      where: { name: { _in: ["Camping", "Cooking", "Utility"] } }
    ) {
      name
      url
    }
  }
`;

export const Favourite_Products_Images_Query = gql`
  {
    favouriteProductInfo: Category(
      limit: 3
      where: { name: { _in: ["Camping", "Cooking", "Utility"] } }
    ) {
      product_categories(limit: 1) {
        Product {
          product_images(limit: 1) {
            url
          }
          Name
          Price
        }
      }
    }
  }
`;

export const Categories_Query = gql`
  {
    categories: Category {
      name
      url
    }
  }
`;

export const GetProductFiltersByCategory = {
  q: gql`
    query ProductFiltersByCategory($categoryName: String) {
      Product(
        where: {
          product_categories_one_to_many: {
            Category: { name: { _eq: $categoryName } }
          }
        }
      ) {
        ProductFeatures {
          Feature {
            Name
          }
          ProductFeatureValues {
            FeatureValue {
              value
            }
          }
        }
      }
    }
  `,
  getFilters: (products, checkedFiltersMap) => {
    var features = R.compose(
      R.flatten,
      R.map((product) =>
        product.ProductFeatures.map((pf) => ({
          key: pf.Feature.Name,
          value: pf.ProductFeatureValues.map((pfv) => pfv.FeatureValue.value),
        }))
      )
    )(products);

    var filterGroups = [
      ...features.reduce((acc, curr) => {
        if (acc.get(curr.key)) {
          return acc.set(curr.key, R.union(curr.value, acc.get(curr.key)));
        } else {
          return acc.set(curr.key, curr.value);
        }
      }, new Map()),
    ];

    var results = filterGroups.map(([key, values]) => ({
      id: key,
      name: key,
      options: R.compose(
        R.map((v) => ({
          value: v,
          label: v,
          checked: checkedFiltersMap.get(key)?.includes(v) ? true : false,
        }))
      )(values),
    }));

    return results;
  },
};

export const GetProductsByFeatureIncludingFilters = (
  filterKeyAndValueList,
  categoryName
) => {
  const whereClauses = filterKeyAndValueList.map(([key, values]) =>
    getWhereClause(key, values)
  );

  const wheres = [whereClauses.map((c) => `_and :{${c}}`)].join(",");

  return {
    q: gql`
      query GetProductsByFeature {
        Product(
          where: {
            product_categories_one_to_many: {
            Category: { name: { _eq: ${categoryName}} }
          }
            ${wheres}
          }
        ) {
          id
          Name
          Price
          product_images(limit: 1) {
            url
          }
        }
      }
    `,
    mapper: (product, idx) => ({
      id: idx,
      name: product?.Name,
      href: "products/" + intercalate(product?.Name),
      price: product?.Price,
      imageSrc: product?.product_images[0]?.url,
    }),
  };
};

export const Products_By_Category_Name = {
  q: gql`
    query Products_By_Category_Name($categoryName: String!) {
      Product(
        where: {
          product_categories_one_to_many: {
            Category: { name: { _eq: $categoryName } }
          }
        }
      ) {
        Price
        Name
        product_images(limit: 1) {
          url
        }
        ProductFeatures {
          Feature {
            Name
          }
          ProductFeatureValues {
            FeatureValue {
              value
            }
          }
        }
      }
    }
  `,
  mapper: (product, idx) => ({
    id: idx,
    name: product?.Name,
    href: "products/" + intercalate(product?.Name),
    price: product?.Price,
    imageSrc: product?.product_images[0]?.url,
  }),
};
