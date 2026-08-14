import { removeCMTextHyphen } from "@/lib/utilities";

describe("removeCMTextHyphen test", () => {
  it("Div only", () => {
    const result = removeCMTextHyphen("<div>-</div>");
    expect(result).toEqual("");
  });

  it("With p tag", () => {
    const result = removeCMTextHyphen("<div><p>-</p></div>");
    expect(result).toEqual("");
  });

  it("Hyphen only", () => {
    const result = removeCMTextHyphen("-");
    expect(result).toEqual("");
  });
});
