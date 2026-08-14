import { gql } from "@apollo/client";
import { FILEDOWNLOAD } from "./Fragments";

export const ArticleQuery = (variables: {
  sortFields: string;
  siteId: string;
  tags: string;
  offset: number;
  limit: number;
}) => {
  return {
    query: gql`
      query ArticleQuery(
        $tags: String!
        $siteId: String!
        $sortFields: [SortFieldWithOrder!]
        $offset: Int!
        $limit: Int!
      ) {
        content {
          search(
            query: $tags
            limit: $limit
            siteId: $siteId
            sortFields: $sortFields
            includeSubTypes: false
            docTypes: "CMArticle"
            offset: $offset
          ) {
            numFound
            result {
              id
              ... on CMArticle {
                settings(paths: ["AutherPublication"])
                title
                extDisplayedDate
                teaserText
                detailText
                pictures {
                  id
                  title
                  type
                  viewtype
                  uriTemplate
                  crops {
                    aspectRatio {
                      height
                      width
                    }
                    name
                    sizes {
                      height
                      width
                    }
                    minWidth
                  }
                  data {
                    uri
                    size
                    contentType
                  }
                }
                teaserTargets {
                  callToActionText
                  target {
                    title
                    navigationPath {
                      segment
                    }
                  }
                }
                subjectTaxonomy {
                  name
                  value
                  externalReference
                }
                related {
                  ...FileDownload
                  ... on CMExternalLink {
                    teaserTitle
                    url
                  }
                  ...Teaser
                }
                navigationPath {
                  segment
                }
                media {
                  type
                  ...Picture
                }
              }
            }
          }
        }
      }

      fragment Teaser on CMTeaserImpl {
        teaserTargets {
          callToActionEnabled
          callToActionText
          callToActionHash
          target {
            navigationPath {
              name
              segment
            }
          }
        }
      }
      ${FILEDOWNLOAD}
    `,
    variables,
  };
};
