import { gql } from "@apollo/client";
import { PICTURE, SVG, TAG, VIDEO } from "./Fragments";

export const ARTICLE_SEARCH_QUERY = gql`
  query ArticleSearch(
    $siteId: String!
    $search: String!
    $limit: Int
    $offset: Int
  ) {
    content {
      search(
        siteId: $siteId
        query: $search
        docTypes: ["CMArticle"]
        includeSubTypes: false
        sortFields: EXTERNALLY_DISPLAYED_DATE_DESC
        limit: $limit
        offset: $offset
      ) {
        numFound
        result {
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
            }
            media {
              type
              ...Picture
              ...Video
              ...SVG
            }
          }
        }
      }
    }
  }
  ${PICTURE}
  ${VIDEO}
  ${SVG}
  ${TAG}
`;

export const ArticleSearchQuery = (variables: {
  siteId: string;
  search: string;
  limit?: number;
  offset?: number;
}) => ({
  query: ARTICLE_SEARCH_QUERY,
  variables,
});
