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
