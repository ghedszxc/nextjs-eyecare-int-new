import { toIsoTimestamp } from "@/lib/utilities";

describe("toIsoTimestamp test", () => {
  it("toIsoTimestamp strips the bracketed zone suffix CoreMedia appends", () => {
    expect(toIsoTimestamp("2026-08-04T01:20:53Z[GMT]")).toBe(
      "2026-08-04T01:20:53Z",
    );
  });

  it("toIsoTimestamp keeps an already valid UTC timestamp valid", () => {
    // This shape used to become "2023-04-27T19:00:00Z+00:00", which crawlers discard
    expect(toIsoTimestamp("2023-04-27T19:00:00Z")).toBe(
      "2023-04-27T19:00:00Z",
    );
  });

  it("toIsoTimestamp expands minute-precision timestamps to seconds", () => {
    expect(toIsoTimestamp("2026-07-30T01:26Z[GMT]")).toBe(
      "2026-07-30T01:26:00Z",
    );
  });

  it("toIsoTimestamp returns null for missing or unparseable values", () => {
    expect(toIsoTimestamp("")).toBeNull();
    expect(toIsoTimestamp(undefined)).toBeNull();
    expect(toIsoTimestamp("not-a-date")).toBeNull();
  });
});
