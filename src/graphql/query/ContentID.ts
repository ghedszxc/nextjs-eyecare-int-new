import { gql } from "@apollo/client";

export const ContentByIdQuery = (variables: { id: string }) => {
  return {
    query: gql`
      query PageQuery($id: String!) {
        content {
          page(id: $id) {
            grid {
              rows {
                placements {
                  name
                  viewtype
                  items {
                    ...dynamicContent
                  }
                }
              }
            }
          }
          content(id: $id) {
            id
            name
            type
            ...Teaser
            ...CTA
            ...Tag
            ...Article
          }
        }
      }
      fragment Article on CMArticle {
        teaserTitle
        detailText {
          text
        }
      }
      fragment CTA on CMChannel {
        id
        title
        name
        type
        authors {
          id
          name
        }
        related {
          id
          name
          creationDate
        }
        segment
        navigationPath {
          segment
        }
      }
      fragment Teaser on CMTeaserImpl {
        id
        type
        name
        title
        teaserTitle
        teaserText {
          text
        }
        pictures {
          id
          name
          title
          data {
            uri
            contentType
          }
        }
        teaserOverlaySettings {
          enabled
          style
        }
        teaserTargets {
          callToActionEnabled
          callToActionText
          target {
            id
            name
            type
            title
            navigationPath {
              name
              segment
            }
          }
        }
      }
      fragment dynamicContent on LXDynamicContent {
        id
        creationDate
        dynamicRules {
          target {
            id
            name
            teaserText {
              text
            }
            navigationPath {
              name
              segment
            }
          }
        }
      }

      fragment Tag on CMTaxonomyImpl {
        id
        name
        value
      }
    `,
    variables,
  };
};
