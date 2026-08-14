import { gql } from "@apollo/client";

export const NavigationQuery = (variables: any) => {
  return {
    query: gql`
      query PageQuery($path: String!) {
        content {
          pageByPath(path: $path) {
            ...NavPlacement
          }
        }
      }

      fragment NavPlacement on CMChannelImpl {
        grid {
          placements {
            viewtype
            name
            items {
              type
              name
              ...NavTeaser
              ...NavCollection
              ...NavExternalLink
              ...NavPlaceholder
            }
          }
        }
      }

      fragment NavTeaser on CMTeaserImpl {
        viewtype
        teaserTitle
        teaserTarget {
          navigationPath {
            segment
          }
        }
        teaserTargets {
        callToActionHash
        callToActionText
          target {
            type
            navigationPath {
              segment
            }
            ... on CMExternalLink {
              url
            }
          }
        }
        pictures {
          ...NavPicture
          ...NavSVG
        }
        media {
          ...NavPicture
          ...NavSVG
        }
        teaserOverlaySettings {
          style
        }
      }

      fragment NavExternalLink on CMExternalLinkImpl {
        teaserTitle
        url
        pictures {
          ...NavPicture
          ...NavSVG
        }
      }

      fragment NavCollection on CMCollectionImpl {
        viewtype
        collectionTitle
        collectionText
        items {
          ...NavTeaser
          ...NavExternalLink
          ...NavInnerCollection
          ...NavPlaceholder
        }
      }

      fragment NavPlaceholder on CMPlaceholderImpl {
        viewtype
        title
        detailText {
          text
        }
      }

      fragment NavInnerCollection on CMCollectionImpl {
        collectionTitle
        collectionText
        items {
          ...NavTeaser
          ...NavExternalLink
        }
      }

      fragment NavPicture on CMPictureImpl {
        type
        viewtype
        uriTemplate
        alt
        data {
          uri
          size
          contentType
        }
      }

      fragment NavSVG on CMSVGImpl {
        type
        viewtype
        uriTemplate
        alt
        data {
          uri
          contentType
        }
      }
    `,
    variables,
  };
};
