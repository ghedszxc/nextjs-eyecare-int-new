import { gql } from "@apollo/client";
import { PAGE } from "./Fragments";

export const PageQuery = (variables: any) => {
  return {
    query: gql`
      query PageQuery($path: String!) {
        content {
          pageByPath(path: $path) {
            settings(
              paths: ["PlacementPadding", "PlacementsAutoFocus"]
            )
            ...PAGE
          }
        }
      }
      ${PAGE}
    `,
    variables,
  };
};
