import { getAnalyticsId } from "@/lib/utilities";

describe("getAnalyticsId test", () => {
  it("getAnalyticsId returns formatted string", () => {
    const formattedStr = getAnalyticsId("widgetname", "X", "X", "X");
    expect(formattedStr).toEqual("X_X_widgetname_X_X_X");
  });
});
