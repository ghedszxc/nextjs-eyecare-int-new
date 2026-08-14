import { localeSegmentRemoval } from "@/lib/utilities";

describe("localeSegmentRemoval test", () => {
  it("localeSegmentRemoval returns staring without the CM extra character ex. OS-, EL-, EM-", () => {
    const segment = localeSegmentRemoval("/em-en/our-solution/");

    expect(!segment.includes(process.env.NEXT_PUBLIC_CM_SEGMENT as string)).toBeTruthy();
  });
});
