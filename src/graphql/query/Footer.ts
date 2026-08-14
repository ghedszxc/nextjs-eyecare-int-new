import { gql } from "@apollo/client";

export const FooterQuery = (variables: any) => {
  return {
    query: gql`
      query PageQuery($path: String!, $names: [String]) {
        content {
          pageByPath(path: $path) {
            ...FooterPlacement
          }
        }
      }

      fragment Logos on CMTeaserImpl {
        id
        name
        pictures {
          data {
            uri
          }
          alt
        }
        teaserTitle
        teaserText {
          text
        }
        teaserTargets {
          target {
            type
            ... on CMExternalLink {
              url
            }
          }
        }
      }

      fragment Disclaimer on CMArticleImpl {
        detailText {
          text
        }
        title
      }

      fragment MainLinks on CMChannelImpl {
        teaserTitle
        teaserTarget {
          navigationPath {
            segment
          }
        }
      }

      fragment MainExternalLinks on CMExternalLinkImpl {
        teaserTitle
        url
        pictures {
          data {
            uri
          }
          alt
        }
      }

      fragment FooterPlacement on CMChannelImpl {
        grid {
          placements(names: $names) {
            viewtype
            name
            items {
              type
              ...Logos
              ...Disclaimer
              ...MainLinks
              ...MainExternalLinks
            }
          }
        }
      }
    `,
    variables,
  };
};
