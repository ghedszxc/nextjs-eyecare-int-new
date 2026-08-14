import { gql } from "@apollo/client";

export const PathsIdQuery = () => {
  return {
    query: gql`
      {
        content {
          sites {
            id
            name
            locale
            root {
              ...Reference
            }
            derivedSites {
              id
              name
            }
          }
        }
      }

      fragment ContentInfo on Content_ {
        name
        creationDate
      }

      fragment Reference on CMLinkable {
        ...ContentInfo
        title
        segment
        link {
          id
          type
        }
      }
    `,
  };
};
