import { gql } from "@apollo/client";
import { PAGEMIN } from "./Fragments";

export const PathsQuery = (variables: any) => {
  return {
    query: gql`
      query SiteQuery($id: String!) {
        content {
          site(siteId: $id) {
            name
            id
            root {
              ...Navigation
            }
          }
        }
      }

      fragment NavigationEntry on CMLinkable {
        segment
        modificationDate
      }

      fragment Navigation on CMNavigation {
        ...NavigationEntry
        hiddenInSitemap
        ... on CMNavigation {
          hiddenInSitemap
          children {
            ...NavigationEntry
            ...Pagemin
            ... on CMNavigation {
              hiddenInSitemap
              children {
                ...NavigationEntry
                ... on CMNavigation {
                  hiddenInSitemap
                  children {
                    ...NavigationEntry
                    ... on CMNavigation {
                      hiddenInSitemap
                      children {
                        ...NavigationEntry
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ${PAGEMIN}
    `,
    variables,
  };
};
