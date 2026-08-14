import { gql } from "@apollo/client";
import { PICTURE, SVG, TAG, VIDEO } from "./Fragments";

export const ARTICLE_LIST_QUERY = gql`
  query ArticleList($path: String!, $limit: Int, $offset: Int) {
    content {
      pageByPath(path: $path) {
        ... on CMChannel {
          title
          htmlDescription
          subjectTaxonomy {
            value
          }
          settings(paths: ["PlacementPadding", "PlacementsAutoFocus"])
          grid {
            rows {
              placements {
                name
                viewtype
                items {
                  ... on LXTeaserImpl {
                    id
                    type
                    viewtype
                    teaserPreTitle
                    teaserTitle1
                    teaserText1
                    teaserIconSvg {
                      ...SVG
                    }
                    media {
                      ...Picture
                      ...Video
                      ...SVG
                    }
                    settings(paths: ["other_properties"])
                  }
                  ... on CMPlaceholder {
                    id
                    type
                    viewtype
                    title
                  }
                  ... on CMQueryList {
                    id
                    type
                    name
                    viewtype
                    itemsPaged(limit: $limit, offset: $offset) {
                      totalCount
                      result {
                        ... on CMArticle {
                          id
                          title
                          extDisplayedDate
                          teaserTitle
                          teaserText {
                            text
                          }
                          navigationPath {
                            segment
                          }
                          media {
                            ...Picture
                            ...Video
                            ...SVG
                          }
                          subjectTaxonomy {
                            ...Tag
                          }
                        }
                      }
                    }
                  }
                }
              }
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

export const ArticleListQuery = (variables: {
  path: string;
  limit?: number;
  offset?: number;
}) => ({
  query: ARTICLE_LIST_QUERY,
  variables,
});
