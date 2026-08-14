import { gql } from "@apollo/client";
import {
  EXTLINK,
  FILEDOWNLOAD,
  PAGE_BASIC,
  PICTURE,
  SVG,
  TAG,
  VIDEO,
} from "./Fragments";

export const GLOBAL_SEARCH_QUERY = gql`
  query GlobalSearch(
    $siteId: String!
    $search: String!
    $limit: Int
    $offset: Int
  ) {
    content {
      search(
        siteId: $siteId
        query: $search
        docTypes: ["CMChannel", "CMExternalLink", "CMDownload", "CMArticle"]
        includeSubTypes: false
        sortFields: TITLE_ASC
        limit: $limit
        offset: $offset
      ) {
        numFound
        result {
          type
          ...PageBasic
          ... on CMDownload {
            ...FileDownload
            subjectTaxonomy {
              ...Tag
            }
            creationDate
          }
          ... on CMArticle {
            id
            title
            teaserTitle
            htmlTitle
            htmlDescription
            keywords
            extDisplayedDate
            creationDate
            teaserText {
              text
            }
            detailText {
              text
            }
            navigationPath {
              segment
            }
            subjectTaxonomy {
              ...Tag
              parent {
                ...Tag
              }
            }
            media {
              type
              ...Picture
              ...Video
              ...SVG
            }
          }
          ... on CMExternalLink {
            ...ExtLink
            subjectTaxonomy {
              ...Tag
              parent {
                ...Tag
              }
            }
          }
          ... on CMPictureImpl {
            navigationPath {
              segment
            }
          }
          ... on CMPictureImpl {
            name
            ...Picture
          }

          ... on CMCollectionImpl {
            type
            title
            name
            navigationPath {
              segment
            }
            collectionTitle
            collectionSubTitle
            collectionTitle
            collectionText
          }

          ... on CMTeaser {
            type
            title
            name
            navigationPath {
              segment
            }
          }

          ... on CMChannel {
            viewtype
          }
        }
      }
    }
  }
  ${PICTURE}
  ${VIDEO}
  ${SVG}
  ${TAG}
  ${EXTLINK}
  ${PAGE_BASIC}
  ${FILEDOWNLOAD}
`;

export const GlobalSearchQuery = (variables: {
  siteId: string;
  search: string;
  limit?: number;
  offset?: number;
}) => ({
  query: GLOBAL_SEARCH_QUERY,
  variables,
});
