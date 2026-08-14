import { gql } from "@apollo/client";

const TeaserTitle1 = gql`
  fragment TeaserTitle1 on CMTeaserImpl {
    id
    type
    name
    title
    teaserTitle
    teaserText {
      text
    }
    media {
      ...Picture
      ...Video
      ...SVG
    }
    teaserTargets {
      callToActionText
      callToActionEnabled
      target {
        id
        name
        type
        title
        segment
        navigationPath {
          name
          segment
        }
        ...TeaserLevel2
      }
    }
  }
`;

const TeaserLevel2 = gql`
  fragment TeaserLevel2 on CMTeaserImpl {
    id
    type
    name
    title
    teaserTitle
    teaserText {
      text
    }
    media {
      ...Picture
      ...Video
      ...SVG
    }
    teaserTargets {
      callToActionText
      callToActionEnabled
      target {
        id
        name
        type
        title
      }
    }
  }
`;

export const FILEDOWNLOAD = gql`
  fragment FileDownload on CMDownload {
    type
    filename
    title
    teaserText {
      text
    }
    detailText {
      text
    }
    id
    data {
      contentType
      uri
      size
    }
    pictures {
      ...Picture
      ...SVG
    }
    creationDate
    validFrom
    validTo
    localSettings: settings(paths: ["other_properties"])
  }
`;

const IMAGE = gql`
  fragment image on CMImageMap {
    teaserTitle
    teaserText {
      text
    }
    teaserTargets {
      target {
        id
        name
      }
    }
    media {
      ...Picture
      ...Video
      ...SVG
    }
  }
`;

export const TAG = gql`
  fragment Tag on CMTaxonomyImpl {
    id
    name
    externalReference
    value
    parent {
      id
      name
      value
      externalReference
    }
  }
`;

export const HTML = gql`
  fragment html on CMHTMLImpl {
    teaserTitle
    teaserText {
      text
    }
    detailTextAsTree
    detailTextReferencedContent {
      name
    }
    localizedVariants {
      name
    }
    htmlTitle
    html
  }
`;

export const PICTURE = gql`
  fragment Picture on CMPictureImpl {
    id
    title
    type
    viewtype
    uriTemplate
    detailText {
      text
    }
    alt
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
    subjectTaxonomy {
      ...Tag
    }
  }
`;

export const SVG = gql`
  fragment SVG on CMSVGImpl {
    id
    title
    type
    viewtype
    uriTemplate
    detailText {
      text
    }
    data {
      uri
      contentType
    }
    alt
    inlineCode
  }
`;

export const VIDEO = gql`
  fragment Video on CMVideoImpl {
    id
    title
    detailText {
      text
    }
    type
    dataUrl
    data {
      contentType
      uri
    }
    picture {
      ...Picture
    }
    autoplay
    loop
    mute
    hideControl
    playOnHover
    hideVolumeControl
  }
`;

export const PLACEHOLDER = gql`
  fragment Placeholder on CMPlaceholderImpl {
    segment
    viewtype
    name
    type
    title
    detailText {
      text
    }
    settings(paths: ["Topics", "List", "consent"])
    pictures {
      ...Picture
    }
  }
`;

export const PERSON = gql`
  fragment CMPerson on CMPerson {
    displayName
    jobTitle
    teaserText {
      text
    }
    pictures {
      ...Picture
      data {
        uri
      }
    }
  }
`;

export const ARTICLE = gql`
  fragment Article on CMArticleImpl {
    id
    teaserTitle
    title
    articleTitleAlign
    teaserOverlaySettings {
      style
    }
    detailText {
      text
    }
    teaserText {
      text
    }
    htmlTitle
    keywords
    htmlDescription
    extDisplayedDate
    validTo
    teaserTargets {
      callToActionText
    }
    settings(paths: ["bgcolor"])
    articleColorSettings: settings(
      paths: ["title", "other_properties", "teaserOverlay"]
    )
    pictures {
      ...Picture
    }
    videos {
      data {
        uri
      }
      dataUrl
    }
    subjectTaxonomy {
      ...Tag
    }
    related {
      id
      name
      type
      viewtype
      ...FileDownload
      ...TeaserTitle1
      video {
        ...Video
      }
      teaserTargets {
        target {
          ...FileDownload
          ... on CMExternalLink {
            url
            teaserTitle
          }
        }
        callToActionText
        callToActionHash
      }
    }
    navigationPath {
      segment
    }
    media {
      type
      ...Picture
    }
  }
`;

export const PAGEMIN = gql`
  fragment Pagemin on CMChannelImpl {
    id
    title
    name
    type
    segment
    teaserTitle
    navigationPath {
      segment
    }
    teaserTargets {
      target {
        title
        navigationPath {
          name
          segment
        }
      }
    }
  }
`;

export const EXTLINK = gql`
  fragment ExtLink on CMExternalLinkImpl {
    id
    name
    type
    url
    localSettings: settings(paths: ["other_properties"])
    openInNewTab
    title
    teaserTitle
    teaserText {
      text
    }
    teaserOverlaySettings {
      style
    }
    pictures {
      ...Picture
      ...SVG
    }
    validFrom
    validTo
    navigationPath {
      segment
    }
  }
`;

const LXTEASER = gql`
  fragment LXTeaser on LXTeaserImpl {
    id
    name
    type
    title
    viewtype
    subjectTaxonomy {
      ...Tag
    }
    segment
    teaserTitle
    teaserText {
      text
    }
    teaserTitle1
    teaserTitle2
    teaserPreTitle
    teaserLabelText
    teaserLabelStyle
    teaserLabelPosition
    teaserLabelVisible
    teaserText1
    teaserText2
    teaserOverlay1Settings
    teaserLXCallToActionSettings {
      style
      callToActionText
      callToActionHash
      target {
        type
        id
        segment
        navigationPath {
          id
          segment
        }
        title
        ... on CMExternalLink {
          ...ExtLink
        }
      }
    }
    video {
      ...Video
    }
    teaserOverlayVideo {
      id
      name
      data {
        uri
      }
      related {
        id
        name
        title
        video {
          ...Video
        }
      }
    }
    media {
      ...Picture
      ...Video
      ...SVG
    }
    teaserIconSvg {
      ...SVG
    }
    teaserTargets {
      target {
        id
        ...ExtLink
        ...Article
        ...Pagemin
      }
      callToActionText
      callToActionHash
      callToActionEnabled
    }
    teaserOverlaySettings {
      style
      enabled
      positionX
      positionY
      width
    }
    validFrom
    settings(
      paths: [
        "other_properties"
        "collectionTextOverlay"
        "teaserOverlay"
        "collectionTextOverlayStyle"
      ]
    )
  }
`;

export const TEASER = gql`
  fragment Teaser on CMTeaserImpl {
    id
    type
    name
    title
    teaserTitle
    teaserText {
      text
    }
    viewtype
    settings(
      paths: [
        "other_properties"
        "collectionTextOverlay"
        "teaserOverlay"
        "collectionTextOverlayStyle"
      ]
    )
    subjectTaxonomy {
      ...Tag
    }
    teaserOverlaySettings {
      enabled
      style
    }
    teaserTargets {
      callToActionEnabled
      callToActionText
      callToActionHash
      target {
        ...Article
        id
        name
        type
        title
        ...Picture
        navigationPath {
          name
          segment
        }
        ...Pagemin
        ...ExtLink
        ...FileDownload
        ...Video
        subjectTaxonomy {
          ...Tag
        }
      }
    }
    creationDate
    extDisplayedDate
    validFrom
    validTo
    media {
      creationDate
      ...Picture
      ...Video
      ...SVG
    }
  }
`;

export const INNERCOLLECTIONLVL4 = gql`
  fragment innerCollectionLevel4 on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    subjectTaxonomy {
      ...Tag
    }
    items {
      ...Teaser
      ...Pagemin
      ...ExtLink
      ...LXTeaser
    }
  }
`;

export const INNERCOLLECTIONLVL3 = gql`
  fragment innerCollectionLevel3 on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    subjectTaxonomy {
      ...Tag
    }
    items {
      ...Teaser
      ...Pagemin
      ...ExtLink
      ...innerCollectionLevel4
    }
  }
`;

export const INNERCOLLECTIONLVL2 = gql`
  fragment innerCollectionLevel2 on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    subjectTaxonomy {
      ...Tag
    }
    items {
      ...Teaser
      ...Pagemin
      ...ExtLink
      ...innerCollectionLevel3
    }
  }
`;

export const INNERCOLLECTION = gql`
  fragment innerCollection on CMCollectionImpl {
    viewtype
    id
    name
    title
    collectionTitle
    collectionSubTitle
    collectionText
    subjectTaxonomy {
      ...Tag
    }
    picture {
      data {
        uri
      }
    }
    videos {
      data {
        uri
      }
      dataUrl
    }
    teaserLXCallToActionSettings {
      style
      callToActionEnabled
      callToActionText
      target {
        id
        segment
        navigationPath {
          id
          segment
        }
        ...Teaser
      }
    }
    items {
      ...Teaser
      ...Pagemin
      ...ExtLink
      ...innerCollectionLevel2
      ...FileDownload
      ...LXTeaser
    }
  }
`;

export const COLLECTION = gql`
  fragment Collection on CMCollectionImpl {
    id
    name
    viewtype
    collectionTitle
    collectionSubTitle
    collectionMaxElementNumber
    collectionText
    captionText
    collectionSettings: settings(
      paths: [
        "collectionText"
        "collectionSubTitle"
        "other_properties"
        "collectionTextOverlay"
      ]
    )
    teaserOverlaySettings {
      style
    }
    collectionTextOverlayStyle
    teaserIconSvg {
      ...SVG
    }
    teaserLXCallToActionSettings {
      callToActionEnabled
      callToActionText
      callToActionHash
      style
      target {
        type
        ...ExtLink
        ...Teaser
        ... on CMChannel {
          ...Pagemin
        }
      }
    }
    media {
      type
      ...Picture
      ...Video
    }
    teasableItems {
      type
      ... on CMTeaser {
        ...Teaser
      }
      ...Teaser
      ...Article
      ...LXTeaser
      ...innerCollection
      ...ExtLink
      ...Picture
      ...Video
      ...CMPerson
    }
  }
`;

const DYNAMIC_CONTENT = gql`
  fragment DynamicContent on LXDynamicContent {
    dynamicRules {
      target {
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
`;

export const QUERY_LIST = gql`
  fragment QueryList on CMQueryListImpl {
    id
    type
    name
    teaserTitle
    collectionMaxElementNumber
    collectionText
    teaserLXCallToActionSettings {
      callToActionEnabled
      callToActionText
      style
      target {
        type
      }
    }
    media {
      type
      ...Picture
      ...Video
    }
    itemsPaged(limit: 0, offset: 0) {
      totalCount
      result {
        ...Article
        ...PageBasic
      }
    }
    teasableItems {
      ...Article
    }
  }
`;

export const PAGE_BASIC = gql`
  fragment PageBasic on CMChannelImpl {
    id
    type
    title
    name
    navigationPath {
      segment
    }
    analyticsTaxonomy {
      analytics {
        pageSection1
        pageSection2
      }
    }
    teaserTitle
    teaserText {
      text
    }
    grid {
      cssClassName
      placements(names: "main_placement_2") {
        items {
          id
          type
          extDisplayedDate
          navigationPath {
            segment
          }
          ... on CMArticle {
            id
            picture {
              ...Picture
            }
            pictures {
              ...Picture
            }
            subjectTaxonomy {
              id
              name
              type
            }
            teaserTitle
            teaserText {
              text
              textAsTree
            }
            context {
              ... on CMChannel {
                htmlTitle
                htmlDescription
                teaserTitle
                teaserText {
                  text
                }
                media {
                  fullyQualifiedUrl
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PAGE = gql`
  fragment PAGE on CMChannelImpl {
    id
    title
    htmlDescription
    segment
    navigationPath {
      title
      segment
    }
    subjectTaxonomy {
      ...Tag
    }
    children {
      id
      type
      ... on CMChannel {
        title
        navigationPath {
          segment
        }
      }
      ... on CMPerson {
        navigationPath {
          segment
        }
      }
      ... on CMQueryList {
        id
        type
        itemsPaged {
          totalCount
          result {
            ... on CMChannel {
              id
              type
              title
              htmlTitle
              htmlDescription
              navigationPath {
                segment
              }
            }
          }
        }
      }
    }
    name
    htmlTitle
    teaserOverlaySettings {
      style
    }
    grid {
      rows {
        placements {
          name
          viewtype
          placementAnimation
          backgroundColor
          marginVertical
          items {
            id
            name
            type
            title
            viewtype
            ...Picture
            ...Collection
            ...Tag
            ...Placeholder
            ...Teaser
            ...Pagemin
            ...Article
            ...html
            ...image
            ...FileDownload
            ...ExtLink
            ...DynamicContent
            ...LXTeaser
            ...QueryList
          }
        }
      }
    }
  }
  ${TeaserTitle1}
  ${TeaserLevel2}
  ${FILEDOWNLOAD}
  ${PICTURE}
  ${SVG}
  ${VIDEO}
  ${COLLECTION}
  ${TAG}
  ${PLACEHOLDER}
  ${TEASER}
  ${PAGEMIN}
  ${ARTICLE}
  ${HTML}
  ${EXTLINK}
  ${INNERCOLLECTION}
  ${INNERCOLLECTIONLVL2}
  ${INNERCOLLECTIONLVL3}
  ${INNERCOLLECTIONLVL4}
  ${PERSON}
  ${IMAGE}
  ${DYNAMIC_CONTENT}
  ${LXTEASER}
  ${QUERY_LIST}
  ${PAGE_BASIC}
`;
