import { toMetaDescription } from "@/lib/utilities";

describe("toMetaDescription test", () => {
  it("toMetaDescription strips markup and collapses whitespace", () => {
    expect(
      toMetaDescription("<p>Dr. Beltran   on\n<strong>eye care</strong></p>"),
    ).toBe("Dr. Beltran on eye care");
  });

  it("toMetaDescription decodes the entities CMS rich text carries", () => {
    expect(toMetaDescription("<p>Optometry&nbsp;&amp; you&#39;re set</p>")).toBe(
      "Optometry & you're set",
    );
  });

  it("toMetaDescription truncates on a word boundary", () => {
    const description = toMetaDescription("word ".repeat(60));

    expect(description?.endsWith("…")).toBe(true);
    expect(description!.length).toBeLessThanOrEqual(161);
    expect(description).not.toContain("wor…");
  });

  it("toMetaDescription returns undefined when there is no text", () => {
    expect(toMetaDescription("")).toBeUndefined();
    expect(toMetaDescription(undefined)).toBeUndefined();
    expect(toMetaDescription("<p> </p>")).toBeUndefined();
  });
});
