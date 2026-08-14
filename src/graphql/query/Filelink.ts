import { gql } from "@apollo/client";

export const FileLinkQuery = (variables: { id: string }) => {
  return {
    query: gql`
      query FileLinkQuery($id: String!) {
        content {
          content(id: $id) {
            id
            type
            ... on CMCollection {
              id
              name
              collectionTitle
              collectionSubTitle
              segment
              viewtype
              detailText
              {text}
              teaserText
              {text}
            }
            ... on CMDownload {
              filename
              data {
                contentType
                uri
                size
              }
            }
            ... on CMChannel {
              navigationPath {
                segment
              }
            }
            ... on CMPictureImpl {
              data {
                uri
              }
            }
          }
        }
      }
    `,
    variables,
  };
};
