import {
  buildArticleBreadcrumbSchema,
  buildNewsArticleSchema,
  buildSiteSchema,
  SITE_NAME,
} from "@/lib/structured-data";

const ORIGIN = "https://www.luxotticaeyecare.luxottica.com";
const ARTICLE_URL = `${ORIGIN}/newsroom/news/feature/od-feature-1949064/`;

describe("buildSiteSchema test", () => {
  it("buildSiteSchema emits an Organization and a WebSite sharing the site origin", () => {
    const schema = buildSiteSchema(ORIGIN) as any;
    const types = schema["@graph"].map((node: any) => node["@type"]);

    expect(types).toEqual(["Organization", "WebSite"]);
    expect(schema["@graph"][0].name).toBe(SITE_NAME);
    expect(schema["@graph"][0].logo.url).toBe(
      `${ORIGIN}/images/logo-luxottica-2022-png-data.png`,
    );
    expect(schema["@graph"][1].publisher["@id"]).toBe(
      schema["@graph"][0]["@id"],
    );
  });

  it("buildSiteSchema points the SearchAction at the real search route", () => {
    const schema = buildSiteSchema(ORIGIN) as any;

    expect(schema["@graph"][1].potentialAction.target.urlTemplate).toBe(
      `${ORIGIN}/search/?q={search_term_string}`,
    );
  });
});

describe("buildNewsArticleSchema test", () => {
  const article = {
    title: "OD Spotlight Feature",
    htmlDescription: "",
    teaserText: { text: "<p>In her own words, Dr. Beltran reflects.</p>" },
    extDisplayedDate: "2026-06-16T03:28:00Z[GMT]",
  };

  it("buildNewsArticleSchema maps the CMS article onto NewsArticle", () => {
    const schema = buildNewsArticleSchema({
      origin: ORIGIN,
      url: ARTICLE_URL,
      article,
      imageUrl: "https://media.example.com/image.jpg",
    }) as any;

    expect(schema["@type"]).toBe("NewsArticle");
    expect(schema.headline).toBe("OD Spotlight Feature");
    expect(schema.url).toBe(ARTICLE_URL);
    expect(schema.description).toBe("In her own words, Dr. Beltran reflects.");
    expect(schema.image).toEqual(["https://media.example.com/image.jpg"]);
    // Normalised from the CMS `Z[GMT]` shape
    expect(schema.datePublished).toBe("2026-06-16T03:28:00Z");
    expect(schema.publisher.name).toBe(SITE_NAME);
  });

  it("buildNewsArticleSchema omits fields the CMS did not provide", () => {
    const schema = buildNewsArticleSchema({
      origin: ORIGIN,
      url: ARTICLE_URL,
      article: { title: "Title only" },
    }) as any;

    expect(schema).not.toHaveProperty("image");
    expect(schema).not.toHaveProperty("datePublished");
    expect(schema).not.toHaveProperty("description");
    // Never guessed from datePublished
    expect(schema).not.toHaveProperty("dateModified");
  });

  it("buildNewsArticleSchema returns null without a headline", () => {
    expect(
      buildNewsArticleSchema({ origin: ORIGIN, url: ARTICLE_URL, article: {} }),
    ).toBeNull();
  });
});

describe("buildArticleBreadcrumbSchema test", () => {
  it("buildArticleBreadcrumbSchema skips the tag level, which is not a page", () => {
    const schema = buildArticleBreadcrumbSchema({
      origin: ORIGIN,
      url: ARTICLE_URL,
      name: "OD Spotlight Feature",
    }) as any;

    expect(schema.itemListElement.map((item: any) => item.item)).toEqual([
      `${ORIGIN}/`,
      `${ORIGIN}/newsroom/news/`,
      ARTICLE_URL,
    ]);
  });
});
