import { gql } from "@apollo/client";
import { PICTURE, SVG, TAG, VIDEO } from "./Fragments";

export const ArticleContentByIdQuery = (variables: { contentId: string }) => {
  return {
    query: gql`
      query ArticleContentByIdQuery($contentId: String!) {
        content {
          content(id: $contentId) {
            id
            type
            ... on CMArticle {
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
      ${PICTURE}
      ${VIDEO}
      ${SVG}
      ${TAG}
    `,
    variables,
  };
};
